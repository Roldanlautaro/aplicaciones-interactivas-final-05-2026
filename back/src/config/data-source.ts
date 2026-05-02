import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { Book } from "../entities/Book";
import { Member } from "../entities/Member";
import { Loan } from "../entities/Loan";

dotenv.config();

// TODO: Cambiar synchronize a false y usar migraciones en su lugar.
// Agregar las entidades al array entities[] una vez definidas.
// Agregar migrations: ["src/migrations/*.ts"] cuando estén listas.
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Lr45873098.ñ",
  database: process.env.DB_NAME || "library",
  synchronize: false,
  logging: false,
  entities: [Book, Member, Loan],
  migrations: ["src/migrations/*.ts"],
});
