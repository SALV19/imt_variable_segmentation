import * as fs from "fs"
import {convert_to_csv} from "../utils/xlsx_to_csv.ts"
import {path, __dirname} from "../utils/import_path.ts"
import { Request } from "express"

// TypeStructure for IRI
export interface IRI {
	id: string;
	measurements: number[];
  distance: number;
	iri: number[];
	error: object;
  [key: string]: any;
}

// Auxiliar function, transforms excel files to csv
export function verify_xlsx(req: Request) {
  if (Array.isArray(req.files)) {
    for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].filename.split(".")[1] == "xlsx") {
          const path = req.files[i].path
          req.files[i] = convert_to_csv(req.files[i])
          fs.rmSync(path)
      }
    }
	}
  else {
    throw "Error: Files could not be processed at:\n\t verify_xlsx()"
  }
}

// Auxiliar function: Deletes files after analizing 
export function delete_temp_files(req: Request) {
	if (Array.isArray(req.files)) {
    for (let i = 0; i < req.files.length; i++) {
      fs.rmSync(req.files[i].path)
    }
  }
  else {
    throw "Error: files could not be deleted at:\n\t delete_temp_files()"
  }
}

// Auxiliar function: process data from csv to json IRI
export function process_data(files: string[]){
  const iri : IRI = {
		id: "",
		measurements: [],
    distance: 0,
		iri: [],
		error: {},
	}

  const multi_file = []
  const file_1 = fs.readFileSync(files[0], {encoding: "utf8"});
  multi_file.push(file_1)
  if (files.length > 1) {
    let file_2 = fs.readFileSync(files[1], {encoding: "utf8"})
    multi_file.push(file_2)
  }

  create_iri(iri, multi_file)

	return iri
}

// Reads file and appends each parameter to 'iri' object
// O(n)
function create_iri(iri: IRI, multi_file: string[]) {
  const type = ["id", "measurements", "end", "iri"]
	let x = 0
  let buffer = ""
  let second_file_buffer = ""
  let end

  for (let i = 0; i < multi_file[0].length; i++) {
    // Basecase -> EOF
    if (!multi_file[0][i]) {
      break
    }
    // First complete parameter -> insert as id
    else if (multi_file[0][i] == ',' && iri.id == "") {
      iri.id = buffer
      x = (x + 1) % 4
      
      buffer = ""
      continue
    }
    // Complete parameter in buffer, insert into dataset
    else if (multi_file[0][i] == ',') {
      if (type[x] != "end") 
        iri[type[x]].push(parseInt(buffer))
      else end = buffer

      x = (x + 1) % 4

      buffer = ""
      continue
    }
    // Complete IRI -> Insert value or average of two files
    else if (multi_file[0][i] == '\n') {
      if (!second_file_buffer) 
        iri[type[x]].push(parseFloat(buffer))
      else {
        const average = parseFloat(((Number(buffer) + Number(second_file_buffer)) / 2).toFixed(2))
        if (isNaN(average)) throw ("Error with: " + buffer + " : " + second_file_buffer)
        iri[type[x]].push(average)
        second_file_buffer = ""
      }
      
      x = 1
      i += iri.id.length + 1
      
      buffer = ""
      continue
    }

    // Create buffer with read character
    buffer += multi_file[0][i]
    if (type[x] == "iri" && multi_file.length > 1) {
      second_file_buffer += multi_file[1][i]
    }
  }

  // Get distance difference and add final measurement of data
  iri.distance = iri.measurements[2] - iri.measurements[1]
  iri.measurements.push(Number(end))
}