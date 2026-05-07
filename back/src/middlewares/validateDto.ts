import { RequestHandler } from "express";
import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate } from "class-validator";

// Middleware para validar el cuerpo de las solicitudes entrantes contra una clase DTO (Data Transfer Object) utilizando class-validator y class-transformer
export const validateDto =
  <T extends object>(DtoClass: ClassConstructor<T>): RequestHandler =>
  async (req, res, next) => {
    const dto = plainToInstance(DtoClass, req.body, { enableImplicitConversion: true });
    const errors = await validate(dto as object, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      const details = errors.map((e) => ({
        field: e.property,
        constraints: e.constraints,
      }));
      res.status(400).json({ error: "Validation failed", details });
      return;
    }

    req.body = dto;
    next();
  };
