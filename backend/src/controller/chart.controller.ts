import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from "fs";
import { ChildProcess } from "node:child_process";

export function create_chart(res: Response, data: Object[]) {
  console.log("Data: ", data);

  const script_path = path.join(__dirname, "../python/generate_excel.py");
  const python_path = path.join(__dirname, "../python/myvenv/bin/python");

  const python_process = spawn(python_path, [
    script_path,
    JSON.stringify(Object.values(data)),
  ]);

  // testing(res, python_process);
  production(res, python_process);
}

function testing(res: Response, python_process: ChildProcess) {
  let result: string = "";
  python_process.stdout?.on("data", (data_chunk: any) => {
    result += data_chunk;
  });

  python_process.stderr?.on("data", (data: any) => {
    console.error("Python error:", data.toString());
  });

  python_process.on("close", (code: number) => {
    console.log("Python finished with code", code);
    console.log("Full result:", result);
    // const buffer = Buffer.concat(result);
    if (code != 0) {
      res.status(500).send("Error");
      return;
    }

    res.status(200).send(result);
  });
}

function production(res: Response, python_process: ChildProcess) {
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
        'attachment; filename="iri_segmentado.xlsx"'
      )
      .setHeader("Content-Type", "application/octet-stream")
      .send(buffer);
  });
}
