import { Data_Map } from "../types/types.ts";

export default function findPages(
  dataMap: Record<string, any>,
  fileData: Record<string, Data_Map>
): (string | undefined)[] {
  return Object.keys(dataMap)
    .map((key: string) => {
      if (fileData[key] == undefined) {
        return key;
      }
    })
    .filter((notExists) => notExists);
}