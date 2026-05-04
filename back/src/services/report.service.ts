import { LessThan } from "typeorm";
import { BookRepository } from "../repositories/book.repository";
import { MemberRepository } from "../repositories/member.repository";
import { LoanRepository } from "../repositories/loan.repository";
import { LoanStatus } from "../entities/Loan";

export interface ActivityReport {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
}

export const ReportService = {
  async getActivity(): Promise<ActivityReport> {
    const now = new Date();

    const [totalBooks, totalMembers, activeLoans, overdueLoans] = await Promise.all([
      BookRepository.count(),
      MemberRepository.count(),
      LoanRepository.count({ where: { status: LoanStatus.ACTIVE } }),
      LoanRepository.count({
        where: { status: LoanStatus.ACTIVE, dueDate: LessThan(now) },
      }),
    ]);

    return { totalBooks, totalMembers, activeLoans, overdueLoans };
  },
};
