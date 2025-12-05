import { create_data } from "../components/create_data.ts";
import { homogenousSegmentation } from "../components/homgenousSegmentation/homogenousSegmentation.ts";
import { read_file_info } from "../components/read_file_info.ts";
import { Data_Map } from "../types/types.ts";
import type { Request, Response } from "express";
import fs from "fs";
import create_static_data from "../components/segmentation/create_static_data.ts";

// GET
export function get_home(req: Request, res: Response) {
  res.render("home");
}

// POST
export async function upload_file(req: Request, res: Response) {
  // Ingestion layer
  req.body.parameters = JSON.parse(req.body.parameters);
  req.body.static_values = JSON.parse(req.body.static_values);

  // Get form information / values to do the analysis
  const dynamicDataMap: Record<string, any> = parseFileName(
    req.body.parameters
  );
  const staticDataMap: Record<string, any> = parseFileName(
    req.body.static_values
  );

  // Receive file information
  if (req.file == undefined) {
    res.send("Error");
    return;
  }

  // Transformation layer
  const file_data: Record<string, Data_Map> = read_file_info(req.file);

  const dynamicPages = findPages(dynamicDataMap, file_data);
  const staticPages = findPages(staticDataMap, file_data);

  if (dynamicPages.length > 0 && staticPages.length > 0) {
    let missingFiles = [];
    if (dynamicPages.length > 0) missingFiles = dynamicPages;
    else missingFiles = staticPages;
    res.status(400).json({
      error: `Uno de los parámetros seleccionados no se encuentra como una
            pestaña en el archivo de excel, recomendamos que verifique que
            esté bien escrito, o que desceleccione los parámetros que no se
            van a utilizar.`,
      parameters: missingFiles,
    });
    return;
  }

  // Processing layer
  const generated_data = await Promise.all(
    Object.keys(dynamicDataMap).map(async (key: string) => {
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
      return { [key]: await create_data(dynamicDataMap[key], file_data[key]) };
    })
  ).then((data) => data.filter((x) => !!x));

  const static_data = await Promise.all(
    Object.keys(staticDataMap).map(async (key: string) => {
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
      return {
        [key]: await create_static_data(staticDataMap[key], file_data[key]),
      };
    })
  ).then((data) => data.filter((x) => !!x));

  const hSegmentation = homogenousSegmentation(
    generated_data,
    static_data,
    req.body.h_segment_min
  );

  // @ts-ignore
  req.session.generated_data = generated_data;
  req.session.static_data = generated_data;
  req.session.hSegmentation = hSegmentation;

  // @ts-ignore
  req.session.save();

  // Response
  res.status(200).json({ generated_data, static_data, hSegmentation });
}

function parseFileName(parameters: Object[]) {
  const pair_titles: Record<string, string> = {
    agretamiento_por_fatiga: "agrfatiga",
    agrietamiento_longitudinal: "grlong",
    agrietamiento_transversal: "grtrans",
    profundidad_rodera: "pr",
    static_transito: "tdpa",
  };

  return Object.keys(parameters).reduce(
    (acum, key) => ({
      ...acum,
      // @ts-ignore
      [pair_titles[key] ?? key]: parameters[key],
    }),
    {}
  );
}

function findPages(
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
