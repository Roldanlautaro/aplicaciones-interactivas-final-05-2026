import { Router } from "express";
import { LoanController } from "../controllers/loan.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateDto } from "../middlewares/validateDto";
import { CreateLoanDto, ReturnLoanDto } from "../dtos/loan.dto";

export const loansRouter = Router();

loansRouter.post("/", validateDto(CreateLoanDto), asyncHandler(LoanController.create));
loansRouter.get("/", asyncHandler(LoanController.list));
loansRouter.patch("/:id", validateDto(ReturnLoanDto), asyncHandler(LoanController.returnLoan));

