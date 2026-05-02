// TODO: Definir la entidad Book con TypeORM
// Atributos:
//   id              — clave primaria generada automáticamente
//   isbn            — string, único, no nulo
//   title           — string, no nulo
//   author          — string, no nulo
//   genre           — enum: FICTION | NON_FICTION | SCIENCE | HISTORY | TECHNOLOGY | CHILDREN
//   totalCopies     — number (>0), no nulo
//   availableCopies — number (>=0, <= totalCopies), no nulo
//   status          — enum: AVAILABLE | WITHDRAWN, default AVAILABLE


// Importar decoradores y tipos de TypeORM
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Loan } from "./Loan";

// Definir el enum para el género
export enum Genre {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  SCIENCE = 'SCIENCE',
  HISTORY = 'HISTORY',
  TECHNOLOGY = 'TECHNOLOGY',
  CHILDREN = 'CHILDREN'
}

export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  WITHDRAWN = 'WITHDRAWN'
}

// Definir la entidad Book
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  isbn: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  author: string;

  @Column({ type: 'enum', enum: Genre, nullable: false })
  genre: Genre;

  @Column({ nullable: false, type: 'int' })
  totalCopies: number;

  @Column({ nullable: false, type: 'int' })
  availableCopies: number;

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.AVAILABLE })
  status: BookStatus;

  @OneToMany(() => Loan, (loan: Loan) => loan.book)
  loans: Loan[];


}
