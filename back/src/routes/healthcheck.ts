import { Router, Request, Response } from "express";

export const healthcheckRouter = Router();

// GET /health: devuelve un JSON con el estado de la aplicación (por ejemplo, { status: "ok" }) para verificar que el servidor está funcionando correctamente.
healthcheckRouter.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
