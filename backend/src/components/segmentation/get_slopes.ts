import { Data_Map, GeneralData, Slope } from "../../types/types.ts";

function get_slopes(data: GeneralData, file_data: Data_Map): Slope[] {
  const slopes: Slope[] = [];

  for (let i = 0; i < file_data.measurements.length - 1; i++) {
    slopes.push({
      start: file_data.measurements[i],
      end: file_data.measurements[i + 1],
      value: file_data.values[i + 1],
    });
  }

  return slopes;
}

export default get_slopes;
