import { Request, Response } from "express";
import fs from "fs";

async function download_example(req: Request, res: Response) {
  const file = await fs.readFileSync("../backend/src/utils/ejemplo.xlsx");

  res
    .status(200)
    .setHeader("Content-Disposition", 'attachment; filename="Ejemplo.xlsx"')
    .setHeader("Content-Type", "application/octet-stream")
    .send(file);
}

export default download_example;
