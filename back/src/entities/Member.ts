// TODO: Definir la entidad Member con TypeORM
// Atributos:
//   id           — clave primaria generada automáticamente
//   memberNumber — string, único, no nulo
//   name         — string, no nulo
//   email        — string, único, no nulo
//   status       — enum: ACTIVE | SUSPENDED, default ACTIVE

// Importar decoradores y tipos de TypeORM
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Loan } from './Loan';

// Definir el enum para el estado del socio
export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Definir la entidad Member
@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

    @Column({ unique: true, nullable: false })
    memberNumber: string;

    @Column({ nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({
        type: 'enum',
        enum: MemberStatus,
        default: MemberStatus.ACTIVE,
    })
    status: MemberStatus;   

    // Relación con Loan
    @OneToMany(() => Loan, (loan) => loan.member)
    loans: Loan[];
}