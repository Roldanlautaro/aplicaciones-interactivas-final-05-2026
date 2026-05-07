import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";

// Middleware para manejar errores en Express, diferenciando entre errores HTTP personalizados y errores genéricos.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
