import { Request, Response, NextFunction, RequestHandler } from "express";

// Middleware para manejar errores en funciones asíncronas de Express, evitando la necesidad de usar try/catch en cada controlador.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
