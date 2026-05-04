import { AppDataSource } from "../config/data-source";
import { Book } from "../entities/Book";

export const BookRepository = AppDataSource.getRepository(Book);
