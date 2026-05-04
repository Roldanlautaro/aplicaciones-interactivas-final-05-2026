import { Router } from "express";
import { healthcheckRouter } from "./healthcheck";
import { booksRouter } from "./books";
import { membersRouter } from "./members";
import { loansRouter } from "./loans";
import { reportsRouter } from "./reports";


// TODO: importar y montar los routers de books, members, loans y reports
// Ejemplo:
// import { booksRouter } from "./books";
// router.use("/books", booksRouter);

export const router = Router();

router.use(healthcheckRouter);
router.use("/books", booksRouter);
router.use("/members", membersRouter);
router.use("/loans", loansRouter);
router.use("/reports", reportsRouter);
