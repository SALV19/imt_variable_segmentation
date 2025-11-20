import { SegmentationData, Slope } from "../../types/types.ts";

export function homogenousSegmentation(generated_data: any): {
  parameters: Record<string, number>;
  values: Record<string, number>;
  start: number;
  end: number;
}[] {
  const slopes: Record<string, Slope[]>[] = generated_data.map((value: any) => {
    const key = Object.keys(value)[0];
    return { [key]: value[key].generated_data.slopes };
  });

  const slopesData: {
    idx: number;
    key: string;
    divider: number;
    value: number;
  }[] = getSlopesData(slopes);

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
  let start: number = 0;
  let end: number = 0;

  orderedSlopesData.forEach(({ idx, key, divider, value }) => {
    function addPoint() {
      parameters.set(key, idx);
      values.set(key, value);
      end = divider;
      hSegmentsData.push({
        parameters: new Map(parameters),
        values: new Map(values),
        start,
        end,
      });
      start = end;
    }

    const paramsChanged =
      parameters.get(key) != idx || values.get(key) != value;

    if (!parameters.has(key)) {
      parameters.set(key, idx);
      values.set(key, value);
      start = divider;
    } else if (
      (divider - start > 100 && paramsChanged) ||
      idx == orderedSlopesData.length - 1
    ) {
      addPoint();
    }
  });

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
