import { Data_Map } from "../types/types.ts";
import { aux_percentile } from "./segmentation/slope_segmentation.ts";

export function mad_base_outliers(
  file_data: Data_Map
): { x: number; y: number }[] {
  const values = file_data.values.slice(0);
  const measurements = file_data.measurements;

  const sorted: number[] = values.sort((a, b) => a - b);
  const median = getMedian(sorted);

  const deviation: number[] = values.map((v) =>
    Number(Math.abs(v - median).toFixed(4))
  );

  const mad = getMedian(deviation.sort((a, b) => a - b));
  if (mad == 0) return [];

  const modifiedZScore = file_data.values
    .slice(0)
    .map((v) => (0.6745 * (v - median)) / mad);
  const absScores = modifiedZScore
    .map(Math.abs)
    .slice(0)
    .sort((a, b) => a - b);
  const percentile_idx = aux_percentile(95, absScores.length);
  const threshold = absScores[percentile_idx];

  const outliers: { x: number; y: number }[] = [];

  // Identify outliers
  modifiedZScore.forEach((z, i) => {
    if (Math.abs(z) > threshold) {
      outliers.push({ x: measurements[i-1], y: file_data.values[i] });
    }
  });

  return outliers;
}

/** Helper: Compute median */
function getMedian(arr: number[]): number {
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
}

export function detect_outliers_IQR(file_data: Data_Map): {
  x: number;
  y: number;
}[] {
  const measurements = file_data.measurements;
  const values = file_data.values;
  const length = values.length;

  const q1_percentile = aux_percentile(20, length);

  const copy_file_data = file_data.values.slice(0);
  const q1 = copy_file_data.sort((a, b) => a - b)[q1_percentile];

  const q3_percentile = aux_percentile(75, length);
  const q3 = copy_file_data.sort((a, b) => a - b)[q3_percentile];

  const iqr = q3 - q1;

  const lowerbound = q1 - 1.5 * iqr;
  const upperbound = q3 + 1.5 * iqr;

  const data = values.map((val, idx) => {
    return { x: measurements[idx], y: val };
  });

  const outliers = data.filter(
    (val) => val.y > upperbound || val.y < lowerbound
  );

  return outliers;
}

// Utiliza función Z-score para conseguir puntos singulares
// z-score = sqrt(sum((i-î)^2) / std)
// filter_data: Data_Map -> measurements: number[], values: number[]
// threashold: number? -> desviaciones estandar
// @return {x: number, y: number}[]
export function detect_outliers_z_score(
  file_data: Data_Map,
  threshold: number = 3
): { x: number; y: number }[] {
  const measurements = file_data.measurements;
  const values = file_data.values;

  // Get Average
  const mean: number =
    values.reduce((acum, curr) => {
      return acum + curr;
    }, 0) / values.length;

  // Part of standard deviation formula: E(i-î)^2
  const std_sum: number = values.reduce((acum, curr) => {
    return acum + Math.pow(curr - mean, 2);
  }, 0);

  // Get standard deviation
  const std: number = Math.sqrt(std_sum / values.length - 1);

  // Get Z-Score of each value in dataset
  const z_scores: { idx: number; z_score: number }[] = values.map((d, idx) => ({
    idx,
    z_score: d - mean / std,
  }));

  // Filter depending on threashold
  const outliers_idx: { idx: number; z_score: number }[] = z_scores.filter(
    (value, idx) => Math.abs(value.z_score) > threshold
  );

  // Construct array
  const outliers: { x: number; y: number }[] = outliers_idx.map(
    ({ idx, z_score }) => {
      return { x: measurements[idx], y: values[idx] };
    }
  );

  return outliers;
}

export function filter_outliers(
  file_data: Data_Map,
  outliers: { x: number; y: number }[],
  filtered_measurements: number[]
) {
  const out_idx = 0;
  const max_length = outliers.length;
  if (outliers.length <= 0) return file_data.values;

  const filtered_data = file_data.values.map((val, idx) => {
    if (out_idx >= max_length) return val;
    if (
      val == outliers[out_idx].y &&
      file_data.measurements[idx] == outliers[out_idx].y
    ) {
      return filtered_measurements[idx];
    }
    return val;
  });
  return filtered_data;
}
