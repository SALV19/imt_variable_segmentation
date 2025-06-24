import * as XLSX from "xlsx"
import * as fs from "fs"
import {path, __dirname} from "../utils/import_path.ts"

export function convert_to_csv(file: Express.Multer.File) {
  const workbook = XLSX.read(file.buffer, {type: "array"})
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const csvData = XLSX.utils.sheet_to_csv(worksheet);
  const bufferData = Buffer.from(csvData, 'utf8')
  file.buffer = bufferData
  
  return file
}