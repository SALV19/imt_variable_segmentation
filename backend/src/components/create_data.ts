import { GeneralData, IRI, Slope } from "./types.ts";
import * as Aux from "./home.components.ts";
import type { Data_Map } from "./read_file_info.ts";

export async function create_data(data: GeneralData, file_data: Data_Map) {
  const join_segments = data.join_segments;
  const singular_points = data.singular_points;
  const percentile = data.percentile ?? null;

  if (file_data.error) {
    // res.status(400).send(file_data.error);
    return { generated_data: null, error: file_data.error };
  }

  const mov_avg = Math.round(data.moving_average / data.distance);

  // Filter / Smooth data
  let filter_measurements: number[] = await Aux.filter(file_data, mov_avg);

  // Get abnormal points
  const abnormal_points: Promise<{ x: number; y: number }[]> = Aux.get_uncommon(
    file_data,
    filter_measurements,
    singular_points
  );

  const normal_measurements_iri: number[] = file_data.values.map((val, idx) =>
    get_singular_points(val, idx, filter_measurements, singular_points)
  );

  const non_abnormal_values: Data_Map = {
    ...file_data,
    iri: normal_measurements_iri,
  };

  // Get slopes function
  const segmentation: number[] = Aux.cumsum(filter_measurements);

  // Segmentate data
  let slopes: Slope[] = Aux.slopeZ(
    non_abnormal_values,
    segmentation,
    percentile
  );

  // Join close segments and count total amount of segments in dataset
  close_segments(slopes, join_segments, file_data);

  const abnormalities = await abnormal_points;

  const generated_data = {
    file_data,
    filter_measurements,
    segmentation,
    slopes,
    abnormalities,
    method: percentile ? "Percentil" : "Media",
  };

  // Response
  return { generated_data, error: null };
}

function close_segments(
  slopes: Slope[],
  join_segments: number,
  measurements: Data_Map
) {
  for (let i = 0; i < slopes.length; i++) {
    if (i > 0 && Math.abs(slopes[i].iri - slopes[i - 1].iri) <= join_segments) {
      slopes[i - 1].end = slopes[i].end;
      slopes[i - 1].iri = Number(
        ((slopes[i].iri + slopes[i - 1].iri) / 2).toFixed(2)
      );
      slopes.splice(i, 1);

      i--;
    }
    measurements.total++;
  }
}

function get_singular_points(
  val: number,
  idx: number,
  filter_measurements: number[],
  singular_points: number
) {
  if (Math.abs(filter_measurements[idx] - val) > singular_points)
    return filter_measurements[idx];
  return val;
}
