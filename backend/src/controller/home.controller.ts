import { create_data } from "../components/create_data.ts";
import { read_file_info } from "../components/read_file_info.ts";
import { Data_Map } from "../components/types.ts";
import type { Request, Response } from "express";

// GET
export function get_home(req: Request, res: Response) {
  res.render("home");
}

// POST
export async function upload_file(req: Request, res: Response) {
  // Ingestion layer

  const pair_titles: Record<string, string> = {
    agretamiento_por_fatiga: "AgrFatiga",
    agrietamiento_longitudinal: "GrLong",
    agrietamiento_transversal: "GrTrans",
    profundidad_rodera: "PR",
  };

  // Get form information / values to do the analysis
  const dataMap: Record<string, any> = Object.keys(req.body).reduce(
    (acum, key) => {
      return { ...acum, [pair_titles[key] ?? key]: JSON.parse(req.body[key]) };
    },
    {}
  );

  // Receive file information
  if (req.file == undefined) {
    res.send("Error");
    return;
  }

  // Transformation layer
  const file_data: Record<string, Data_Map> = read_file_info(req.file);

  // Processing layer
  const generated_data = await Promise.all(
    Object.keys(dataMap).map(async (key: string) => {
      if (file_data[key] == undefined) {
        console.error(`Error, file page: ${key} not found`);
        res.status(400).json({
          error: `Uno de los parámetros seleccionados no se encuentra como una 
            pestaña en el archivo de excel, recomendamos que verifique que 
            esté bien escrito, o que desceleccione los parámetros que no se 
            van a utilizar.`,
          parameter: key.charAt(0).toUpperCase() + key.slice(1),
        });
        return;
      }
      return { [key]: await create_data(dataMap[key], file_data[key]) };
    })
  );

  // @ts-ignore
  req.session.generated_data = generated_data;
  // @ts-ignore
  req.session.save();

  // Response
  res.status(200).json(generated_data);
}
