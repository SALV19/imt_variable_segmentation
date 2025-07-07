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

  // Get slopes function
  const { zk: segmentation, average } = Aux.cumsum(filter_measurements);

  // Segmentate data
  const slopes: Aux.Slope[] = Aux.slopeZ(
    measurements,
    segmentation,
    join_segments,
    req.body.singular_points
  );

  // Flatten array and join segments
  const slopes_values = slopes
    .flatMap((s) => s.iri)
    // Join close segments
    .map((curr, idx, arr) => {
      if (idx > 0) {
        if (Math.abs(curr - arr[idx - 1]) <= join_segments) {
          arr[idx] = arr[idx - 1];
          return arr[idx - 1];
        }
      }
      measurements.total += 1;
      return curr;
    });

  //
  res.status(200).json({
    measurements,
    filter_measurements,
    segmentation,
    slopes_values,
  });
}
