// TODO: Definir la entidad Loan con TypeORM
// Atributos:
//   id         — clave primaria generada automáticamente
//   loanDate   — Date, se asigna automáticamente al crear (default: now)
//   dueDate    — Date, calculado como loanDate + 14 días (no lo envía el cliente)
//   returnDate — Date | null, null hasta que se registre la devolución
//   status     — enum: ACTIVE | RETURNED | OVERDUE, default ACTIVE
// Relaciones:
//   book   — ManyToOne → Book  (un préstamo pertenece a un libro)
//   member — ManyToOne → Member (un préstamo pertenece a un socio)


// Importar decoradores y tipos de TypeORM
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Book } from './Book';
import { Member } from './Member';

// Definir el enum para el estado del préstamo
export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE'
}

// Definir la entidad Loan
@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  // Fecha automática
  @CreateDateColumn()
  loanDate: Date;

  // Se calcula en el service (loanDate + 14 días)
  @Column({ type: 'datetime', nullable: false })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  returnDate: Date | null;

  @Column({
    type: "enum",
    enum: LoanStatus,
    default: LoanStatus.ACTIVE,
  })
  status: LoanStatus;

  // Relación con Book
  @ManyToOne(() => Book, (book) => book.loans, {
    nullable: false,
  })
  book: Book;

  // Relación con Member
  @ManyToOne(() => Member, (member: Member) => member.loans, {
  nullable: false,
  })
  member: Member;
}