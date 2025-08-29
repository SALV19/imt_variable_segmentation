import { create_data } from "../components/create_data.ts";
import * as Aux from "../components/home.components.ts";
import { IRI, Slope, Result } from "../components/types.ts";
import { Request, Response } from "express";

// GET
export function get_home(req: Request, res: Response) {
  res.render("home");
}

// POST
export async function upload_file(req: Request, res: Response) {
  // Ingestion layer
  const dataMap: Record<string, any> = Object.keys(req.body).reduce(
    (acum, key) => {
      return { ...acum, [key]: JSON.parse(req.body[key]) };
    },
    {}
  );

  const fileMap: Record<string, Express.Multer.File[]> = {};
  if (req.files) {
    Object.keys(req.files).forEach((file: string) => {
      const key = file.split("_")[1];
      // @ts-ignore
      fileMap[key] = req.files[file] as Express.Multer.File[];
    });
  }

  const generated_data = await Promise.all(
    Object.keys(dataMap).map(async (key: string) => {
      return { [key]: await create_data(dataMap[key], fileMap[key]) };
    })
  );

  req.session.generated_data = generated_data;
  req.session.save();

  // Response
  res.status(200).json(generated_data);
}
