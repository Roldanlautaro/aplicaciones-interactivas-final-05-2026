import { Request, Response } from "express";
import { BookService } from "../services/book.service";
import { HttpError } from "../errors/HttpError";


// create: recibe un JSON con los datos del libro (sin id) y devuelve el libro creado con su id asignado.
// list: devuelve un array con todos los libros.
// update: recibe un id por params y un JSON con los datos a actualizar (isbn, title, author, genre, totalCopies, availableCopies, status) y devuelve el libro actualizado.
export const BookController = {
  
  async create(req: Request, res: Response) {
    const book = await BookService.create(req.body);
    res.status(201).json(book);
  },

  async list(_req: Request, res: Response) {
    const books = await BookService.findAll();
    res.json(books);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new HttpError(400, "Invalid id");
    const book = await BookService.update(id, req.body);
    res.json(book);
  },
};
