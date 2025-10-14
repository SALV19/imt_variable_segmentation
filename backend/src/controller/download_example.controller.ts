import type { Request, Response } from "express";
import { path, __dirname } from "../utils/import_path.ts";

export function download_example(req: Request, res: Response) {
  const file = `${__dirname}/utils/ejemplo.xlsx`;
  res.download(file);
}
