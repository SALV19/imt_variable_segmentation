import { SegmentationData, Slope } from "../../types/types.ts";

export function homogenousSegmentation(
  generated_data: any
): { start: number; end: number }[] {
  const slopes: { [key: string]: Slope[] }[] = generated_data.map(
    (value: any) => {
      const key = Object.keys(value)[0];
      return { [key]: value[key].generated_data.slopes };
    }
  );

  const slopesData: { key: string; element: Slope }[] = [];

  Object.keys(slopes).forEach((key) => {
    // @ts-ignore
    console.log(slopes[key]);
  });

  console.log(slopesData);

  return [];
}
