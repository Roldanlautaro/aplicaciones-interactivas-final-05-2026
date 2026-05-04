import { AppDataSource } from "../config/data-source";
import { Loan } from "../entities/Loan";

export const LoanRepository = AppDataSource.getRepository(Loan);
