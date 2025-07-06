import * as Aux from "../components/home.components.ts"
import { Request, Response } from "express";

// GET
export function get_home(req: Request, res: Response) {
	res.render("home");
}

// POST
export async function upload_file(req: Request, res: Response) {
// Ingestion layer
	const files = req.files as Express.Multer.File[]
	if (files.length === 0) {
		res.status(400).send({error: "No data provided"})
		return
	}
	// // Convert files to .csv
	Aux.verify_xlsx(files);

	// Process csv files into json objects
	const measurements: Aux.IRI = await Aux.process_data(files);

	const mov_avg = req.body.moving_avg / req.body.distance
	const filter_measurements: number[] = await Aux.filter(measurements, mov_avg);
	
	const segmentation: number[] = Aux.cumsum(filter_measurements)

	const slopes: Aux.Slope[] = Aux.slopeZ(
		measurements, segmentation, req.body.join_segments,req.body.singular_points
	)
	
	const slopes_values = slopes.flatMap(s => s.iri)

// Transformation layer
	res.status(200).json({
		measurements,
		filter_measurements,
		segmentation,
		slopes_values,
	})
}