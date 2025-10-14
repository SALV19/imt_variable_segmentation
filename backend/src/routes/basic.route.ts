import { Router } from "express";
import multer from "multer";
import { path, __dirname } from "../utils/import_path.ts";

const upload = multer({
  storage: multer.memoryStorage(),
});

import * as home from "../controller/home.controller.ts";
import * as chart from "../controller/create_chart.controller.ts";
import * as download_example from "../controller/download_example.controller.ts";

const routes = Router();

routes.get("/", home.get_home);
routes.post("/upload_file", upload.single("file"), home.upload_file);
routes.get("/download_example", download_example.download_example);
routes.get("/create_chart", chart.chart_handler);

export default routes;
