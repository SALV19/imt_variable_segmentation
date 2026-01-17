// Filter data with a moving average

import { formatNumber } from "../../utils/format_number.ts";
import { Data_Map } from "../../types/types.ts";

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
    const filtered_value = formatNumber(acum / i);
    xf.push(filtered_value);
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
