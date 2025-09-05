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
  // console.log(req.files);

  const dataMap: Record<string, any> = Object.keys(req.body).reduce(
    (acum, key) => {
      return { ...acum, [key]: JSON.parse(req.body[key]) };
    },
    {}
  );

  const fileMap: Record<string, Express.Multer.File[]> = {};
  if (req.files) {
    // @ts-ignore
    Array.from(req.files).forEach((file: Express.Multer.File) => {
      const title = file.originalname.toLowerCase();
      if (title.includes("iri")) {
        try {
          fileMap["iri"].push(file);
        } catch {
          fileMap["iri"] = [file];
        }
      } else if (title.includes("friccion")) {
        try {
          fileMap["friccion"].push(file);
        } catch {
          fileMap["friccion"] = [file];
        }
      }
    });
  }

  const generated_data = await Promise.all(
    Object.keys(dataMap).map(async (key: string) => {
      return { [key]: await create_data(dataMap[key], fileMap[key]) };
    })
  );

  // @ts-ignore
  req.session.generated_data = generated_data;
  // @ts-ignore
  req.session.save();

  // Response
  res.status(200).json(generated_data);
}
