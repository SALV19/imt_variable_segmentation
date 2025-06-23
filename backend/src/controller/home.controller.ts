import * as Aux from "../components/home.components.ts"
import { Request, Response } from "express";

// GET
export function get_home(req: Request, res: Response) {
	res.render("home");
}

// POST
export async function upload_file(req: Request, res: Response) {
// Ingestion layer
	// Convert files to .csv
	Aux.verify_xlsx(req);
	
	const file_paths: string[] = []
	Array.isArray(req.files) &&
		req.files.forEach(file => file_paths.push(file.path))
	console.log(file_paths)
	// Process csv files into json objects
	const measurements: Aux.IRI = await Aux.process_data(file_paths);

	Aux.delete_temp_files(req)

	console.log(measurements)

// Transformation layer
	res.status(200).json(measurements)
}