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
export function verify_xlsx(files: Express.Multer.File[]) {
  for (let i = 0; i < files.length; i++) {
    if (files[i].originalname.split(".").at(-1) == "xlsx" || files[i].originalname.split(".").at(-1) == "xlsm") {      
      convert_to_csv(files[i])
    }
  }
}

// Auxiliar function: process data from csv to json IRI
export async function process_data(files: Express.Multer.File[] | {buffer: ArrayBuffer}[]){
  let iri : Promise<IRI>[];

  // Read files
  const multi_file = []
  // const file_1 = fs.readFileSync(files[0].buffer, {encoding: "utf8"});
  const file_1: string = files[0].buffer.toString()
  multi_file.push(file_1)
  if (files.length > 1) {
    const file_2: string = files[1].buffer.toString()
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

export function cumsum(iri: number[]): number[] {
  const length = iri.length
  const avg = iri.reduce((acum, curr) => (curr+acum)) / length
  const zk: number[] = aux_cumsum(iri, length, avg)
  
  return zk
}

// Algorithm implementation
function aux_cumsum(iri: number[], length: number, avg: number): number[] {
  let acum = 0
  const zk = []
  for (let i = 0; i < length; i++) {
    acum += iri[i]
    zk.push(acum - i * avg)
  }
  return zk
}

export function filter(measurements: IRI, mov_avg: number) {
  let acum = 0
  let idx = 0
  const xf: number[] = [];
  for (let i = 0; i < mov_avg; i++) {
    acum += measurements.iri[i]
  }
  for (let i = 0; i < mov_avg; i++) {
    xf.push(acum / mov_avg)
  }

  const length = measurements.iri.length

  for (let i = mov_avg; i < length; i++) {
    acum += measurements.iri[i] - measurements.iri[idx]
    idx++
    xf.push(acum / mov_avg)
  }
  return xf
}