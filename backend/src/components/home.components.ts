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
        if (req.files[i].filename.split(".")[1] == "xlsx" || req.files[i].filename.split(".")[1] == "xlsm") {
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
export async function process_data(files: string[]){
  let iri : Promise<IRI>[];

  // Read files
  const multi_file = []
  const file_1 = fs.readFileSync(files[0], {encoding: "utf8"});
  multi_file.push(file_1)
  if (files.length > 1) {
    let file_2 = fs.readFileSync(files[1], {encoding: "utf8"})
    multi_file.push(file_2)
  }

  // Process each file concurrently and indexes into an array
  iri = await multi_file.map(file => create_iri(file))

  // Joins the IRI by average when 2 files are sent, returns final IRI
  if (files.length > 1) {
    const iri_1 = (await iri[0]).iri
    const iri_2 = (await iri[1]).iri

    const new_iri = {
      ...(await iri[0]), 
      iri: iri_1.map(
        (iri_value, idx) => parseFloat((((iri_2[idx]) + iri_value) / 2).toFixed(2))
      )
    }

    return new_iri
  }
  else {
    return iri[0]
  }

}

// Reads file and appends each parameter to 'iri' object
// O(n)
async function create_iri(file: string) : Promise<IRI>{
  const iri: IRI = {
    id: "",
    measurements: [],
    distance: 0,
    iri: [],
    error: {}
  }

  const type = ["id", "measurements", "end", "iri"]
	let x = 0
  let buffer = ""
  let end

  for (let i = 0; i < file.length; i++) {
    // Basecase -> EOF
    if (!file[i]) {
      break
    }
    // First complete parameter -> insert as id
    else if (file[i] == ',' && iri.id == "") {
      iri.id = buffer
      x = (x + 1) % 4
      
      buffer = ""
      continue
    }
    // Complete parameter in buffer, insert into dataset
    else if (file[i] == ',') {
      if (type[x] != "end") 
        iri[type[x]].push(parseInt(buffer))
      else end = buffer

      x = (x + 1) % 4

      buffer = ""
      continue
    }
    // Complete IRI -> Insert value or average of two files
    else if (file[i] == '\n') {
      iri[type[x]].push(parseFloat(buffer))
      
      x = 1
      i += iri.id.length + 1
      
      buffer = ""
      continue
    }

    // Create buffer with read character
    buffer += file[i]
  }

  // Get distance difference and add final measurement of data
  iri.distance = iri.measurements[2] - iri.measurements[1]

  return iri
}