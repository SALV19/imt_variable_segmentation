import { SegmentationData, Slope } from "../../types/types.ts";

export function homogenousSegmentation(
  generatedData: any,
  staticData: any,
  minimum_segment: number
): {
  parameters: Record<string, number>;
  values: Record<string, number>;
  start: number;
  end: number;
}[] {
  const dynamicSlopes: Record<string, Slope[]>[] = generatedData.map(
    (value: any) => {
      const key = Object.keys(value)[0];
      return { [key]: value[key].generated_data.slopes };
    }
  );

  const staticSlopes: Record<string, Slope[]>[] = staticData.map(
    (value: any) => {
      const key = Object.keys(value)[0];
      return { [key]: value[key].slopes };
    }
  );

  const slopes = dynamicSlopes.concat(staticSlopes);

  // console.dir(slopes, { depth: null });

  const slopesData: {
    idx: number;
    key: string;
    divider: number;
    value: number;
  }[] = getSlopesData(slopes);

  // console.dir(slopes, { depth: null });

  const orderedSlopesData: {
    idx: number;
    key: string;
    divider: number;
    value: number;
  }[] = slopesData.sort(({ divider: first }, { divider: second }) =>
    sortFunction(first, second)
  );

  let hSegmentsData: {
    parameters: Map<string, number>;
    values: Map<string, number>;
    start: number;
    end: number;
  }[] = [];

  const parameters: Map<string, number> = new Map();
  const values: Map<string, number> = new Map();

  let start: number = orderedSlopesData[0]?.divider ?? 0;
  let lastDivider = start;

  orderedSlopesData.forEach(({ idx, key, divider, value }, i) => {
    const isNewKey = !values.has(key);
    const paramsChanged = values.get(key) !== value;

    if (
      !isNewKey &&
      paramsChanged &&
      divider - lastDivider >= minimum_segment
    ) {
      hSegmentsData.push({
        parameters: new Map(parameters),
        values: new Map(values),
        start,
        end: divider,
      });
      start = divider;
    }

    // Update the parameter for next intervals
    parameters.set(key, idx);
    values.set(key, value);

    lastDivider = divider;

    if (i === orderedSlopesData.length - 1) {
      hSegmentsData.push({
        parameters: new Map(parameters),
        values: new Map(values),
        start,
        end: divider,
      });
    }
  });

  // console.dir(orderedSlopesData, { depth: null });

  const hSegments = hSegmentsData.map((segment) => {
    return {
      ...segment,
      parameters: Object.fromEntries(segment.parameters),
      values: Object.fromEntries(segment.values),
    };
  });

  return hSegments;
}

function getSlopesData(slopes: Record<string, Slope[]>[]) {
  const slopesData: {
    idx: number;
    key: string;
    divider: number;
    value: number;
  }[] = [];

  slopes.forEach((measurement) => {
    const key = Object.keys(measurement)[0];
    Object.values(measurement)[0].forEach((val, idx) => {
      if (idx == 0) {
        slopesData.push({ idx, key, divider: val.start, value: val.value });
      }
      slopesData.push({ idx, key, divider: val.end, value: val.value });
    });
  });

  return slopesData;
}

function sortFunction(first: number, second: number) {
  if (first < second) return -1;
  else return 1;
}
