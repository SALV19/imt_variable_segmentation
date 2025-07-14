import * as Aux from "../components/home.components.ts";
import { Request, Response } from "express";

// GET
export function get_home(req: Request, res: Response) {
  res.render("home");
}

// POST
export async function upload_file(req: Request, res: Response) {
  // Ingestion layer
  const join_segments = req.body.join_segments;
  const singular_points = req.body.singular_points;
  const percentile = req.body.percentil ?? null;

  const files = req.files as Express.Multer.File[];
  if (files.length === 0) {
    res.status(400).send({ error: "No data provided" });
    return;
  }
  // Convert files to .csv
  Aux.verify_xlsx(files);

  // Transformation layer
  // Process csv files into json objects
  const measurements: Aux.IRI = await Aux.process_data(files);

  const mov_avg = Math.round(req.body.moving_avg / req.body.distance);

  // Filter / Smooth data
  const filter_measurements: number[] = await Aux.filter(measurements, mov_avg);

  // Get abnormal points
  const abnormal_points: Promise<{ x: number; y: number }[]> = Aux.get_uncommon(
    measurements,
    filter_measurements,
    singular_points
  );

  // Get slopes function
  const segmentation: number[] = Aux.cumsum(filter_measurements);

  // Segmentate data
  let slopes: Aux.Slope[] = Aux.slopeZ(measurements, segmentation, percentile);

  // Join close segments and count total amount of segments in dataset
  slopes = slopes.map((curr, idx, arr) => {
    if (idx > 0) {
      if (Math.abs(curr.iri - arr[idx - 1].iri) <= join_segments) {
        arr[idx] = arr[idx - 1];
        return { ...curr, iri: arr[idx - 1].iri };
      }
    }
    measurements.total++;
    return { ...curr, iri: curr.iri };
  });

  const abnormalities = await abnormal_points;

  const generated_data = {
    measurements,
    filter_measurements,
    segmentation,
    slopes,
    abnormalities,
    method: percentile ? "Percentil" : "Media",
  };

  req.session!.generated_data = generated_data;

  // Response
  res.status(200).json(generated_data);
}
