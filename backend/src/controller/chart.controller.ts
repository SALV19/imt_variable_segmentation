import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export function create_chart(req: Request, res: Response) {
  console.log("Session details", req.session.generated_data);

  const script_path = path.join(__dirname, "../python/generate_excel.py");
  const python_path = path.join(__dirname, "../python/myvenv/bin/python");

  const python_process = spawn(python_path, [
    script_path,
    JSON.stringify(req.session.generated_data),
  ]);

  let result = "";
  python_process.stdout.on("data", (data) => {
    result += data.toString();
  });

  python_process.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  python_process.on("close", (code) => {
    console.log("Python finished with code", code);
    console.log("Full result:", result);

    res
      .status(200)
      // .setHeader(
      //   "Content-Disposition",
      //   'attachment; filename="iri_segmentado.xlsx"'
      // )
      // .setHeader("Content-Type", "application/octet-stream")
      .send(result);
  });

  // res
  //   .status(200)
  //   .setHeader(
  //     "Content-Disposition",
  //     'attachment; filename="iri_segmentado.xlsx"'
  //   )
  //   .setHeader("Content-Type", "application/octet-stream")
  //   .send(result);
}
