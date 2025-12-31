import { create_data } from "../components/create_data.ts";
import { homogenousSegmentation } from "../components/homgenousSegmentation/homogenousSegmentation.ts";
import { read_file_info } from "../components/read_file_info.ts";
import { Data_Map } from "../types/types.ts";
import type { Request, Response } from "express";
import create_static_data from "../components/segmentation/create_static_data.ts";
import generate_data_map from "../components/segmentation/generate_data_map.ts";
import parseFileName from "../components/parseFilename.ts";
import findPages from "../components/findPages.ts";

// GET
export function get_home(req: Request, res: Response) {
  res.render("home");
}

// POST
export async function upload_file(req: Request, res: Response) {
  // Ingestion layer
  req.body.parameters = JSON.parse(req.body.parameters);
  req.body.static_values = JSON.parse(req.body.static_values);

  console.log(req.body.parameters)

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
    console.log(dynamicPages, staticPages);
    let missingFiles: (string | undefined)[] = [];
    if (dynamicPages.length > 0) missingFiles = dynamicPages;
    if (staticPages.length > 0) {
      missingFiles = missingFiles.concat(staticPages);
    }

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
    Object.keys(dynamicDataMap).map(async (key) => {
      return generate_data_map(
        key,
        res,
        file_data[key],
        dynamicDataMap[key],
        create_data
      );
    })
  ).then((data) => data.filter((x) => !!x));

  const static_data = await Promise.all(
    Object.keys(staticDataMap).map(async (key) =>
      generate_data_map(
        key,
        res,
        file_data[key],
        staticDataMap[key],
        create_static_data
      )
    )
  ).then((data) => data.filter((x) => !!x));

  const hSegmentation = homogenousSegmentation(
    generated_data,
    static_data,
    req.body.h_segment_min
  );

  // @ts-ignore
  req.session.generated_data = generated_data;
  req.session.static_data = static_data;
  req.session.hSegmentation = hSegmentation;

  // @ts-ignore
  req.session.save();

  // Response
  res.status(200).json({ generated_data, static_data, hSegmentation });
}
