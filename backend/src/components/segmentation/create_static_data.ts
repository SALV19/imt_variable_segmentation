import { Data_Map, GeneralData, Slope } from "../../types/types.ts";
import get_slopes from "./get_slopes.ts";

function create_static_data(data: GeneralData, file_data: Data_Map) {
  const join_segments = data.join_segments;

  if (file_data.error) {
    return { generated_data: null, error: file_data.error };
  }

  const slopes: Slope[] = get_slopes(data, file_data);

  const generated_data = {
    file_data,
    slopes,
  };

  return generated_data;
}

export default create_static_data;
