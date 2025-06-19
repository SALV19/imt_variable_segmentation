
import { process_data } from "../components/home_components"
import {path, __dirname} from "../utils/import_path"

const data = process_data([{path: path.join(__dirname, "/uploads/file-1750347001368-147064266.csv")}])
console.log(data)