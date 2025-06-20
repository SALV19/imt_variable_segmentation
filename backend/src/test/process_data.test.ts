
import { process_data } from "../components/home.components.ts"
import { path, __dirname } from "../utils/import_path.ts"
import * as response from "./test_responses.ts"

test("IRI object 1 file", () => {
  expect(process_data([
      path.join(__dirname, "/test/test_file_1.csv"), 
    ])).toEqual(response.response_1_file)
})

test("IRI object 2 files", () => {
  expect(process_data([
      path.join(__dirname, "/test/test_file_1.csv"), 
      path.join(__dirname, "/test/test_file_2.csv")
    ])).toEqual(response.response_2_files)
})

// const data = process_data([
//   path.join(__dirname, "/test_file_1.csv"), 
//   // path.join(__dirname, "/test_file_2.csv")
// ])

// console.log(data)