import { AppDataSource } from "../config/data-source";
import { Book, BookStatus } from "../entities/Book";
import { Loan, LoanStatus } from "../entities/Loan";
import { Member, MemberStatus } from "../entities/Member";
import { CreateLoanDto } from "../dtos/loan.dto";
import { HttpError } from "../errors/HttpError";

const LOAN_DAYS = 14;
const MAX_ACTIVE_LOANS_PER_MEMBER = 3;

export const LoanService = {
  async create(dto: CreateLoanDto): Promise<Loan> {
    return AppDataSource.transaction(async (manager) => {
      const bookRepo = manager.getRepository(Book);
      const memberRepo = manager.getRepository(Member);
      const loanRepo = manager.getRepository(Loan);

      const book = await bookRepo.findOne({ where: { id: dto.bookId } });
      if (!book) throw new HttpError(404, `Book ${dto.bookId} not found`);

      const member = await memberRepo.findOne({ where: { id: dto.memberId } });
      if (!member) throw new HttpError(404, `Member ${dto.memberId} not found`);

      if (book.status === BookStatus.WITHDRAWN) {
        throw new HttpError(409, "Book is withdrawn and cannot be loaned");
      }
      if (book.availableCopies <= 0) {
        throw new HttpError(409, "No available copies for this book");
      }
      if (member.status === MemberStatus.SUSPENDED) {
        throw new HttpError(409, "Member is suspended");
      }

      const activeLoans = await loanRepo.find({
        where: { member: { id: member.id }, status: LoanStatus.ACTIVE },
      });
      if (activeLoans.length >= MAX_ACTIVE_LOANS_PER_MEMBER) {
        throw new HttpError(409, `Member has reached the limit of ${MAX_ACTIVE_LOANS_PER_MEMBER} active loans`);
      }

      const now = new Date();
      const hasOverdue = activeLoans.some((l) => l.dueDate < now);
      if (hasOverdue) {
        throw new HttpError(409, "Member has overdue loans and cannot borrow until resolved");
      }

      const loanDate = now;
      const dueDate = new Date(loanDate.getTime() + LOAN_DAYS * 24 * 60 * 60 * 1000);

      const loan = loanRepo.create({
        loanDate,
        dueDate,
        returnDate: null,
        status: LoanStatus.ACTIVE,
        book,
        member,
      });

      book.availableCopies -= 1;
      await bookRepo.save(book);
      const saved = await loanRepo.save(loan);

      return saved;
    });
  },

  async findAll(): Promise<Loan[]> {
    return AppDataSource.getRepository(Loan).find({
      relations: { book: true, member: true },
      order: { id: "ASC" },
    });
  },

  async returnLoan(id: number): Promise<Loan> {
    return AppDataSource.transaction(async (manager) => {
      const loanRepo = manager.getRepository(Loan);
      const bookRepo = manager.getRepository(Book);

      const loan = await loanRepo.findOne({
        where: { id },
        relations: { book: true, member: true },
      });
      if (!loan) throw new HttpError(404, `Loan ${id} not found`);

      if (loan.status === LoanStatus.RETURNED) {
        throw new HttpError(409, "Loan is already returned");
      }

      loan.status = LoanStatus.RETURNED;
      loan.returnDate = new Date();

      loan.book.availableCopies = Math.min(
        loan.book.totalCopies,
        loan.book.availableCopies + 1,
      );

      await bookRepo.save(loan.book);
      return loanRepo.save(loan);
    });
  },
};
