import { create_chart } from "./chart.controller.ts";
import { Response } from "express";

export function chart_handler(req: Express.Request, res: Response) {
  // @ts-ignore
  create_chart(
    res,
    req.session.generated_data,
    req.session.static_data,
    req.session.hSegmentation
  );
}
