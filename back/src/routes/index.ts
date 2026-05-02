import { Router } from "express";
import { healthcheckRouter } from "./healthcheck";

export const router = Router();

router.use(healthcheckRouter);

// TODO: importar y montar los routers de books, members, loans y reports
// Ejemplo:
// import { booksRouter } from "./books";
// router.use("/books", booksRouter);
