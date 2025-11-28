import { slopeZ } from "./segmentation/slope_segmentation.ts";
import {
  detect_outliers_IQR,
  detect_outliers_z_score,
  filter_outliers,
  mad_base_outliers,
} from "./get_uncommon_points.ts";
import { filter } from "./segmentation/filter_data.ts";
import { cumsum } from "./segmentation/cumsum.ts";
import { Data_Map, GeneralData, Slope } from "../types/types.ts";

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
  let filter_measurements: number[] = await filter(file_data, mov_avg);

  // Get abnormal points
  const abnormal_points: { x: number; y: number }[] =
    mad_base_outliers(file_data);
  // detect_outliers_IQR(file_data);

  const normal_measurements_iri: number[] = filter_outliers(
    file_data,
    abnormal_points,
    filter_measurements
  );

  const non_abnormal_values: Data_Map = {
    ...file_data,
    iri: normal_measurements_iri,
  };

  // Get slopes function
  const segmentation: number[] = cumsum(filter_measurements);

  // Segmentate data
  let slopes: Slope[] = slopeZ(
    non_abnormal_values,
    segmentation,
    percentile,
    file_data.max - file_data.min
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
    if (
      i > 0 &&
      Math.abs(slopes[i].value - slopes[i - 1].value) <= join_segments
    ) {
      slopes[i - 1].end = slopes[i].end;
      slopes[i - 1].value = Number(
        ((slopes[i].value + slopes[i - 1].value) / 2).toFixed(4)
      );
      slopes.splice(i, 1);

      i--;
    }
    measurements.total++;
  }
}
