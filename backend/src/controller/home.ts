import * as Aux from "../components/home_components"

// GET
export function get_home(req, res) {
	res.render("home");
}

// POST
export function upload_file(req, res) {
// Ingestion layer
	// Convert files to .csv
	Aux.verify_xlsx(req);
	
	// Process csv files into json objects
	const measurements: Aux.IRI = Aux.process_data(req.files);
	console.log(measurements)

	// Auxiliar.delete_temp_files(req)

// Transformation layer
	res.send("Success!")
}