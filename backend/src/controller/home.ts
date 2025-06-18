import * as fs from "fs"
import {convert_to_csv} from "../utils/xlsx_to_csv"
import {path, __dirname} from "../utils/import_path"

export function get_home(req, res) {
	res.render("home");
}

export function upload_file(req, res) {
	console.log("Success!");

	for (let i = 0; i < Array(req.files).length; i++) {
		if (req.files[i].filename.split(".")[1] == "xlsx") {
			const path = req.files[i].path
			req.files[i] = convert_to_csv(req.files[i])
			fs.rmSync(path)
		}
	}

	res.send("Success!")
}