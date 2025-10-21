import { __dirname } from "../utils/import_path.ts";
import { Data_Map } from "./read_file_info.ts";
import { IRI, Slope } from "./types.ts";

// Filter data with a moving average
// O(n + m)
export function filter(file_data: Data_Map, mov_avg: number): number[] {
  let acum = 0;
  const xf: number[] = [];

  // get first values for moving average
  for (let i = 0; i < mov_avg; i++) {
    acum += file_data.values[i];
  }

  xf.push(formatNumber(acum / mov_avg));

  // Get values to a fixed window size
  const length = file_data.values.length;
  for (let i = mov_avg; i < mov_avg * 2; i++) {
    acum += file_data.values[i];
    xf.push(formatNumber(acum / i));
  }

  // Get values within window until the end of the array
  for (let i = mov_avg * 2; i < length; i++) {
    acum += file_data.values[i] - file_data.values[i - 2 * mov_avg];
    xf.push(formatNumber(acum / (mov_avg * 2 + 1)));
  }
  // Continiously decrease window size until reaching the last index
  for (let i = length - mov_avg; i < length; i++) {
    acum -= file_data.values[i - mov_avg];
    let B = Number(mov_avg);
    xf.push(formatNumber(acum / (B * 2 + 1 - (i - length + B))));
  }

  return xf;
}

export async function get_uncommon(
  file_data: Data_Map,
  filter: number[],
  singular_points: number
): Promise<{ x: number; y: number }[]> {
  const uncommon_points: { x: number; y: number }[] = [];
  for (let i = 0; i < file_data.measurements.length; i++) {
    if (Math.abs(filter[i] - file_data.values[i]) > singular_points) {
      uncommon_points.push({
        x: file_data.measurements[i],
        y: file_data.values[i],
      });
    }
  }

  return uncommon_points;
}

// O(n)
export function cumsum(iri: number[]): number[] {
  const length = iri.length;
  const avg = iri.reduce((acum, curr) => curr + acum) / length;
  const zk: number[] = aux_cumsum(iri, length, avg);

  return zk;
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
  return parseFloat(value.toFixed(4));
}

function segmentationBoolFunc(slope_val: number, join: number) {
  if (join < 1) {
    return slope_val == 0;
  }
  return slope_val >= -0.005 && slope_val <= 0.005;
}

export function slopeZ(
  file_data: Data_Map,
  segmentation: number[],
  percentile: number | null,
  joinVal: number
): Slope[] {
  let slpZ: Slope[] = [];
  const slope_zk: number[] = [];

  const length = file_data.measurements.length;

  const percentile_99_idx = aux_percentile(99, length);
  const copy_file_data = file_data.values.slice(0);
  const percentile_99 = copy_file_data.sort((a, b) => a - b)[percentile_99_idx];

  let percentile_values: number[] = [];
  let acum = 0;
  let count = 0;

  let last_slope = false;

  const curr_slope: Slope = {
    start: 0,
    end: 0,
    iri: 0,
  };

  curr_slope.start = file_data.measurements[0];
  acum += file_data.values[0];

  for (let i = 1; i < length; i++) {
    const zk_val: number = aux_segmentation(
      segmentation,
      file_data.measurements,
      i
    );

    if (percentile)
      percentile_values.push(
        aux_99_percentile(percentile_99, file_data.values[i])
      );
    else acum += aux_99_percentile(percentile_99, file_data.values[i]);

    if (
      // @ts-ignore
      (segmentationBoolFunc(slope_zk.at(-1), joinVal) || i == length - 1) &&
      last_slope &&
      !(i - count < length * 0.05)
    ) {
      if (percentile) {
        const percentile_idx = aux_percentile(
          percentile,
          percentile_values.length
        );
        const percentile_iri = percentile_values.sort()[percentile_idx];
        curr_slope.iri = percentile_iri;
      } else {
        const avg = formatNumber(acum / (i - count));
        curr_slope.iri = avg;
      }

      curr_slope.end = file_data.measurements[i];

      count = i;
      acum = 0;
      percentile_values = [];

      slpZ.push(structuredClone(curr_slope));

      curr_slope.start = file_data.measurements[i];

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
    ((segmentation[i] - segmentation[i - 1]) / (iri[i] - iri[i - 1])).toFixed(4)
  );
}

function aux_percentile(p: number, length: number) {
  const index = Math.round((p / 100) * length);
  return index;
}

function aux_99_percentile(percentile_99: number, value: number) {
  return value < percentile_99 ? value : percentile_99;
}
