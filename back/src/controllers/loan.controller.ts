import { Request, Response } from "express";
import { LoanService } from "../services/loan.service";
import { HttpError } from "../errors/HttpError";

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
