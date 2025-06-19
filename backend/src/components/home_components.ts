import * as fs from "fs"
import {convert_to_csv} from "../utils/xlsx_to_csv"
import {__dirname} from "../utils/import_path"

// TypeStructure for IRI
export interface IRI {
	id: string,
	measurements: number[],
  distance: number,
	iri: number[],
	error: object,
}

// Auxiliar function, transforms excel files to csv
export function verify_xlsx(req) {
	for (let i = 0; i < req.files.length; i++) {
		if (req.files[i].filename.split(".")[1] == "xlsx") {
			const path = req.files[i].path
			req.files[i] = convert_to_csv(req.files[i])
			fs.rmSync(path)
		}
	}
}

// Auxiliar function: Deletes files after analizing 
export function delete_temp_files(req) {
	for (let i = 0; i < req.files.length; i++) {
		fs.rmSync(req.files[i].path)
	}
}

// Auxiliar function: process data from csv to json IRI
export function process_data(files){
	console.log("Process_data_start");

  const iri : IRI = {
		id: "",
		measurements: [],
    distance: 0,
		iri: [],
		error: {},
	}

  const file = fs.readFileSync(files[0].path, {encoding: "utf8"});
  
  create_iri(iri, file)

	return iri
}

// Reads file and appends each parameter to 'iri' object
// O(n)
function create_iri(iri, file) {
  const type = ["id", "measurements", "end", "iri"]
	let x = 0
  let buffer = ""
  let end

  for (let i = 0; i < file.length; i++) {
    if (!file[i]) {
      break
    }
    else if (file[i] == ',' && iri.id == "") {
      iri.id = buffer
      x = (x + 1) % 4
      
      buffer = ""
      continue
    }
    else if (file[i] == ',') {
      if (type[x] != "end") 
        iri[type[x]].push(buffer)
      else end = buffer

      x = (x + 1) % 4

      buffer = ""
      continue
    }
    else if (file[i] == '\n') {
      
      iri[type[x]].push(buffer)
      
      x = 1
      i += iri.id.length + 1
      
      buffer = ""
      continue
    }

    buffer += file[i]
  }

  iri.distance = iri.measurements[2] - iri.measurements[1]
  iri.measurements.push(end)
}