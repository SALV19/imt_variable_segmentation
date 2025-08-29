import { create_chart } from "./chart.controller.ts";
import { Response } from "express";

export function chart_handler(req: Express.Request, res: Response) {
  create_chart(res, req.session.generated_data);
}
