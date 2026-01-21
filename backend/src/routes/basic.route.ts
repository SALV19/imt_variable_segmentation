import { Router } from "express";
import multer from "multer";
import { path, __dirname } from "../utils/import_path.ts";

const upload = multer({
  storage: multer.memoryStorage(),
});

import * as home from "../controller/home.controller.ts";
import download_example from "../controller/downlaod_example.controller.ts";
import { create_chart } from "../controller/chart.controller.ts";
import { retrocalculus } from "../controller/retrocalculus.controller.ts";

const routes = Router();

routes.get("/", home.get_home);
routes.get("/retrocalculo_pavimento", retrocalculus)
routes.get("/download_example", download_example);
routes.post("/upload_file", upload.single("file"), home.upload_file);
routes.get("/create_chart", create_chart);

export default routes;
