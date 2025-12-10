import { Response } from "express";
import { Data_Map, GeneralData } from "../../types/types.ts";

async function generate_data_map(
  key: string,
  res: Response,
  file_data: Data_Map,
  data_map: any,
  generate_data_function: (data: GeneralData, file_data: Data_Map) => any
) {
  if (file_data == undefined) {
    console.error(`Error, file page: ${key} not found`);
    res.status(400).json({
      error: `Uno de los parámetros seleccionados no se encuentra como una 
              pestaña en el archivo de excel, recomendamos que verifique que 
              esté bien escrito, o que desceleccione los parámetros que no se 
              van a utilizar.`,
      parameter: key.charAt(0).toUpperCase() + key.slice(1),
    });
    throw Error(`Error, file page: ${key} not found`);
  }
  return {
    [key]: await generate_data_function(data_map, file_data),
  };
}

export default generate_data_map;
