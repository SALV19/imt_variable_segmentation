import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from "fs";
import { ChildProcess } from "node:child_process";

export function create_chart(req: Request, res: Response) {
  const script_path = path.join(__dirname, "../python/generate_excel.py");
  const python_path = path.join(__dirname, "../python/venv/Scripts/python");

  const python_process = spawn(python_path, [script_path]);

  production(req, res, python_process);
}

function production(req: Request, res: Response, python_process: ChildProcess) {
  const dynamic_segmentation = req.session.generated_data;
  const static_segmentation = req.session.static_data;
  const hSegmentation = req.session.hSegmentation;
  const title = req.query.title;

  // Dynamic segmentation information
  python_process.stdin?.write(
    JSON.stringify(Object.values(dynamic_segmentation)) + "\n"
  );

  // Static segmentation information
  python_process.stdin?.write(
    JSON.stringify(Object.values(static_segmentation)) + "\n"
  );

  // Homogenous Segmentation
  python_process.stdin?.write(JSON.stringify(Object.values(hSegmentation)));

  python_process.stdin?.end();

  let result: Buffer[] = [];
  python_process.stdout?.on("data", (data_chunk: any) => {
    result.push(data_chunk);
  });

  python_process.stderr?.on("data", (data: any) => {
    console.error("Python error:", data.toString());
  });

  python_process.on("close", (code: number) => {
    console.log("Python finished with code", code);
    const buffer = Buffer.concat(result);
    if (code != 0) {
      res.status(500).send("Error");
      return;
    }

    res
      .status(200)
      .setHeader(
        "Content-Disposition",
        `attachment; filename="${title ?? "segmentation"}.xlsm"`
      )
      .setHeader("Content-Type", "application/octet-stream")
      .send(buffer);
  });
}
