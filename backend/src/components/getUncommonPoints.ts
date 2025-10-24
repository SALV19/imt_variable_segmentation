import { Data_Map } from "./types.ts";

// Utiliza función Z-score para conseguir puntos singulares
// z-score = sqrt(sum((i-î)^2) / std)
// filter_data: Data_Map -> measurements: number[], values: number[]
// threashold: number? -> punto de inflexión
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
