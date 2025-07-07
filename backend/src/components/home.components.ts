import { convert_to_csv } from "../utils/xlsx_to_csv.ts";
import { __dirname } from "../utils/import_path.ts";

// TypeStructure for IRI
export interface IRI {
  id: string;
  measurements: number[];
  distance: number;
  iri: number[];
  error: object;
  average: number;
  max: number;
  min: number;
  total: number;
  [key: string]: any;
}

// Type struct for Slopes
export interface Slope {
  start: number;
  end: number;
  iri: number[];
}

// In progress
// Type struct for process's results
export interface Result {
  media: number;
}

// Auxiliar function, transforms excel files to csv
export function verify_xlsx(files: Express.Multer.File[]) {
  for (let i = 0; i < files.length; i++) {
    if (
      files[i].originalname.split(".").at(-1) == "xlsx" ||
      files[i].originalname.split(".").at(-1) == "xlsm"
    ) {
      convert_to_csv(files[i]);
    }
  }
}

// Auxiliar function: process data from csv to json IRI
export async function process_data(
  files: Express.Multer.File[] | { buffer: ArrayBuffer }[]
): Promise<IRI> {
  let iri: Promise<IRI>[];
  let final_iri: IRI;

  // Read files
  const multi_file = [];
  // const file_1 = fs.readFileSync(files[0].buffer, {encoding: "utf8"});
  const file_1: string = files[0].buffer.toString();
  multi_file.push(file_1);
  if (files.length > 1) {
    const file_2: string = files[1].buffer.toString();
    multi_file.push(file_2);
  }

  // Process each file concurrently and indexes into an array
  iri = await multi_file.map((file) => create_iri(file));

  // Joins the IRI by average when 2 files are sent, returns final IRI
  if (files.length > 1) {
    const iri_1 = await iri[0];
    const iri_2 = await iri[1];

    const new_iri = {
      ...(await iri[0]),
      iri: iri_1.iri.map((iri_value, idx) =>
        parseFloat(((iri_2[idx] + iri_value) / 2).toFixed(2))
      ),
      max: Math.max(iri_1.max, iri_2.max),
      min: Math.min(iri_1.min, iri_2.min),
    };

    // return new_iri
    final_iri = new_iri;
  } else {
    final_iri = await iri[0];
  }

  // Get average IRI O(n)
  final_iri.average =
    final_iri.iri.reduce((acum, curr) => curr + acum) / final_iri.iri.length;

  return final_iri;
}

// Reads file and appends each parameter to 'iri' object
// O(n)
async function create_iri(file: string): Promise<IRI> {
  const iri: IRI = {
    id: "",
    measurements: [],
    distance: 0,
    iri: [],
    average: 0,
    max: 0,
    min: 99999,
    total: 0,
    error: {},
  };

  const type = ["id", "measurements", "end", "iri"];
  let x = 0;
  let buffer = "";
  let end;

  for (let i = 0; i < file.length; i++) {
    // Basecase -> EOF
    if (!file[i]) {
      break;
    }
    // First complete parameter -> insert as id
    else if (file[i] == "," && iri.id == "") {
      iri.id = buffer;
      x = (x + 1) % 4;

      buffer = "";
      continue;
    }
    // Complete parameter in buffer, insert into dataset
    else if (file[i] == ",") {
      if (type[x] != "end") iri[type[x]].push(parseInt(buffer));
      else end = buffer;

      x = (x + 1) % 4;

      buffer = "";
      continue;
    }
    // Complete IRI
    else if (file[i] == "\n") {
      const curr_value = parseFloat(buffer);
      iri[type[x]].push(curr_value);

      if (iri[type[x]].at(-1) > iri.max) iri.max = iri[type[x]].at(-1);
      else if (iri[type[x]].at(-1) < iri.min) iri.min = iri[type[x]].at(-1);

      x = 1;
      i += iri.id.length + 1;

      buffer = "";
      continue;
    }

    // Create buffer with read character
    buffer += file[i];
  }

  // Get distance difference and add final measurement of data
  iri.distance = iri.measurements[2] - iri.measurements[1];

  return iri;
}

// Filter data with a moving average
// O(n + m)
export function filter(measurements: IRI, mov_avg: number): number[] {
  let acum = 0;
  const xf: number[] = [];

  // get first values for moving average
  for (let i = 0; i < mov_avg; i++) {
    acum += measurements.iri[i];
  }

  xf.push(formatNumber(acum / mov_avg));

  // Get values to a fixed window size
  const length = measurements.iri.length;
  for (let i = mov_avg; i < mov_avg * 2; i++) {
    acum += measurements.iri[i];
    xf.push(formatNumber(acum / i));
  }

  // Get values within window until the end of the array
  for (let i = mov_avg * 2; i < length; i++) {
    acum += measurements.iri[i] - measurements.iri[i - 2 * mov_avg];
    xf.push(formatNumber(acum / (mov_avg * 2 + 1)));
  }
  // Continiously decrease window size until reaching the last index
  for (let i = length - mov_avg; i < length; i++) {
    acum -= measurements.iri[i - mov_avg];
    let B = Number(mov_avg);
    xf.push(formatNumber(acum / (B * 2 + 1 - (i - length + B))));
  }

  return xf;
}

export async function get_uncommon(
  iri: IRI,
  filter: number[],
  singular_points: number
): Promise<{ x: number; y: number }[]> {
  const uncommon_points: { x: number; y: number }[] = [];
  for (let i = 0; i < iri.measurements.length; i++) {
    if (Math.abs(filter[i] - iri.iri[i]) > singular_points) {
      uncommon_points.push({ x: iri.measurements[i], y: iri.iri[i] });
      console.log("Abnormality at: ", uncommon_points.at(-1));
    }
  }

  return uncommon_points;
}

// O(n)
export function cumsum(iri: number[]): { zk: number[]; average: number } {
  const length = iri.length;
  const avg = iri.reduce((acum, curr) => curr + acum) / length;
  const zk: number[] = aux_cumsum(iri, length, avg);

  return { zk: zk, average: avg };
}

// Algorithm implementation
// O(n)
function aux_cumsum(iri: number[], length: number, avg: number): number[] {
  let acum = 0;
  const zk = [];
  for (let i = 0; i < length; i++) {
    acum += iri[i];
    zk.push(acum - i * avg);
  }
  return zk;
}

function formatNumber(value: number): number {
  return parseFloat(value.toFixed(2));
}

export function slopeZ(
  iri: IRI,
  segmentation: number[],
  join_segments: number
): Slope[] {
  let slpZ: Slope[] = [];
  const slope_zk: number[] = [];
  const length = iri.measurements.length;
  let acum = 0;
  let count = 0;

  let last_slope = false;

  const curr_slope: Slope = {
    start: 0,
    end: 0,
    iri: [],
  };

  curr_slope.start = iri.measurements[0];
  acum += iri.iri[0];

  for (let i = 1; i < length; i++) {
    const zk_val: number = aux_segmentation(segmentation, iri.measurements, i);
    acum += iri.iri[i];
    if ((slope_zk.at(-1) == 0 || i == length - 1) && last_slope) {
      const avg = formatNumber(acum / (i - count));

      curr_slope.end = iri.measurements[i];

      curr_slope.iri = new Array(i - count).fill(avg);
      count = i;
      acum = 0;

      slpZ.push(structuredClone(curr_slope));

      curr_slope.start = iri.measurements[i];

      last_slope = false;
    }

    if (slope_zk.at(-1) != 0 && !last_slope) {
      last_slope = true;
    }

    slope_zk.push(zk_val);
  }

  return slpZ;
}

function aux_segmentation(segmentation: number[], iri: number[], i: number) {
  return parseFloat(
    ((segmentation[i] - segmentation[i - 1]) / (iri[i] - iri[i - 1])).toFixed(2)
  );
}
