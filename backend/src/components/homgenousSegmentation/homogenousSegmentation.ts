import { SegmentationData, Slope } from "../../types/types.ts";

export function homogenousSegmentation(generated_data: any): {
  parameters: Map<string, number>;
  start: number;
  end: number;
}[] {
  const slopes: Record<string, Slope[]>[] = generated_data.map((value: any) => {
    const key = Object.keys(value)[0];
    return { [key]: value[key].generated_data.slopes };
  });

  const slopesData: { idx: number; key: string; divider: number }[] =
    getSlopesData(slopes);

  const orderedSlopesData: { idx: number; key: string; divider: number }[] =
    slopesData.sort(
      ({ key: _key1, divider: first }, { key: _key2, divider: second }) =>
        sortFunction(first, second)
    );

  // console.log(orderedSlopesData);

  const hSegments: {
    parameters: Map<string, number>;
    start: number;
    end: number;
  }[] = [];

  const parameters: Map<string, number> = new Map();
  let start: number = 0;
  let end: number = 0;

  orderedSlopesData.forEach(({ idx, key, divider }) => {
    if (!parameters.has(key)) {
      parameters.set(key, idx);
      start = divider;
    } else {
      parameters.set(key, idx);
      end = divider;
      hSegments.push({
        parameters,
        start,
        end,
      });
      start = end;
    }
  });

  return hSegments;
}

function getSlopesData(slopes: Record<string, Slope[]>[]) {
  const slopesData: { idx: number; key: string; divider: number }[] = [];

  slopes.forEach((measurement) => {
    const key = Object.keys(measurement)[0];
    Object.values(measurement)[0].forEach((val, idx) => {
      if (idx == 0) {
        slopesData.push({ idx, key, divider: val.start });
      }
      slopesData.push({ idx, key, divider: val.end });
    });
  });

  return slopesData;
}

function sortFunction(first: number, second: number) {
  if (first < second) return -1;
  else return 1;
}
