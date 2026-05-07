import { Request, Response } from "express";
import { LoanService } from "../services/loan.service";
import { HttpError } from "../errors/HttpError";


// create: recibe un JSON con los datos del préstamo (sin id) y devuelve el préstamo creado con su id asignado.
// list: devuelve un array con todos los préstamos.
// returnLoan: recibe un id por params, marca el préstamo como devuelto (returned = true) y devuelve el préstamo actualizado.
export const LoanController = {
  async create(req: Request, res: Response) {
    const loan = await LoanService.create(req.body);
    res.status(201).json(loan);
  },

  async list(_req: Request, res: Response) {
    const loans = await LoanService.findAll();
    res.json(loans);
  },

  async returnLoan(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new HttpError(400, "Invalid id");
    const loan = await LoanService.returnLoan(id);
    res.json(loan);
  },
};
