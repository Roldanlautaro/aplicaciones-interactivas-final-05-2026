import { Router, Request, Response } from "express";

export const healthcheckRouter = Router();

healthcheckRouter.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
