import XLSX from "xlsx";
import { file_types, Data_Map } from "../types/types.ts";

// Read different sheets of excel into different objects
export function read_file_info(
  file: Express.Multer.File
): Record<string, Data_Map> {
  const workbook = XLSX.read(file.buffer);

  const data: Record<string, Data_Map> = {};

  // Traverse each sheet and create an object by name
  workbook.SheetNames.forEach((name) => {
    const worksheet = workbook.Sheets[name];
    const json_data: Object[] = XLSX.utils.sheet_to_json(worksheet);
    let keys: string[];
    try {
      keys = Object.keys(json_data[0]);
    } catch {
      return;
    }

    name = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (!(name.toLowerCase() in file_types)) {
      const json_object: Data_Map = {
        id: "",
        measurements: [],
        values: [],
        distance: 0,
        average: 0,
        max: 0,
        min: 0,
        total: 0,
        error: `Nombre de la pestaña: ${name}, no valido. Las opciones válidas son: ${file_types}`,
      };

      data[name] = json_object;
    }
    // Reducer, create separate json object of file into a singular data
    // dictionary
    const json_object: Data_Map = json_data.reduce<Data_Map>(
      (acum: Data_Map, curr: any, idx) => json_2_datamap(acum, curr, idx, keys),
      {} as Data_Map
    );

    // Finish data dictionary with important information
    json_object.distance =
      json_object.measurements[2] - json_object.measurements[1];
    json_object.average = parseFloat(
      (json_object.average / json_object.values.length).toFixed(4)
    );
    json_object.total = json_data.values.length;
    json_object.error = null;

    data[name] = json_object;
  });

  return data;
}

function json_2_datamap(
  acum: Data_Map,
  curr: any,
  idx: number,
  keys: string[]
): Data_Map {
  if (idx == 0) {
    const id = curr[keys[0]];
    acum.id = id;
    acum.average = 0;
    acum.max = 0;
    acum.min = Infinity;
  }

  if (curr[keys[3]] == undefined) {
    curr[keys[3]] = acum.values.at(-1);
  }

  const measurements: number = curr[keys[1]];
  const values: number = parseFloat(curr[keys[3]].toFixed(4));

  acum.average += values;

  acum.max = Math.max(acum.max, values);
  acum.min = Math.min(acum.min, values);

  try {
    acum.measurements.push(measurements);
    acum.values.push(values);
  } catch {
    acum.measurements = [measurements];
    acum.values = [values];
  }

  return acum;
}
