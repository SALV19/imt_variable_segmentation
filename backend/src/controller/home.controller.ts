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
  req.body.iri = JSON.parse(req.body.iri);

  const data_objects = Object.keys(req.body).map((key) => req.body[key]);

  const { generated_data, error } = await create_data(
    req.body.iri,
    req.files as Express.Multer.File[]
  );

  req.session.generated_data = generated_data;
  req.session.save();

  // Response
  res.status(200).json(generated_data);
}
