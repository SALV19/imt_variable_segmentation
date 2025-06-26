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

	const segmentation = Aux.cumsum(measurements)

// Transformation layer
	res.status(200).json({
		measurements,
		segmentation,
	})
}