import * as XLSX from "xlsx"
import * as fs from "fs"
import {path, __dirname} from "../utils/import_path.ts"

export function convert_to_csv(file: Express.Multer.File) {
  const fileBuffer = fs.readFileSync(file.path)
  const workbook = XLSX.read(fileBuffer, {type: "array"})
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const csvData = XLSX.utils.sheet_to_csv(worksheet);

  const new_name = file.filename.split(".")[0] + ".csv"
  const filename = path.join(__dirname, "/uploads/", new_name)

  fs.writeFileSync(filename, csvData)
  file = {...file, filename: new_name, path: filename}
  
  return file
}