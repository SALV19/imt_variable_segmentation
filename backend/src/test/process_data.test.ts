
import { process_data } from "../components/home_components"
import {path, __dirname} from "../utils/import_path"
import * as response from "./test_responses"
// import "jest"

// test("IRI object 1 file", () => {
//   expect(process_data([
//       {path: path.join(__dirname, "/test/file-1750347001368-147064266.csv")}, 
//       {path: path.join(__dirname, "/test/file-1750347001368-147064266.csv")}
//     ])).toBe(response.response_1)
// })

const data = process_data([
  {path: path.join(__dirname, "/test/test_file_1.csv")}, 
  {path: path.join(__dirname, "/test/test_file_2.csv")}
])

console.log(data)