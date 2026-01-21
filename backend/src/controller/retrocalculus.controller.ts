import { Request, Response } from "express";

export async function retrocalculus(req: Request, res: Response) {
  res.status(200).render("retrocalculus");
}