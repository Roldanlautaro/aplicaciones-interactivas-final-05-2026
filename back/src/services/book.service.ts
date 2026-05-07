import { BookRepository } from "../repositories/book.repository";
import { Book, BookStatus } from "../entities/Book";
import { CreateBookDto, UpdateBookDto } from "../dtos/book.dto";
import { HttpError } from "../errors/HttpError";


export const BookService = {
  async create(dto: CreateBookDto): Promise<Book> {
    const existing = await BookRepository.findOne({ where: { isbn: dto.isbn } });
    if (existing) {
      throw new HttpError(409, `ISBN ${dto.isbn} already exists`);
    }

    const book = BookRepository.create({
      isbn: dto.isbn,
      title: dto.title,
      author: dto.author,
      genre: dto.genre,
      totalCopies: dto.totalCopies,
      availableCopies: dto.totalCopies,
      status: BookStatus.AVAILABLE,
    });

    return BookRepository.save(book);
  },

  async findAll(): Promise<Book[]> {
    return BookRepository.find();
  },

  async findById(id: number): Promise<Book> {
    const book = await BookRepository.findOne({ where: { id } });
    if (!book) {
      throw new HttpError(404, `Book ${id} not found`);
    }
    return book;
  },

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findById(id);

    if (dto.status !== undefined) {
      book.status = dto.status;
    }

    if (dto.totalCopies !== undefined) {
      const loanedCopies = book.totalCopies - book.availableCopies;
      if (dto.totalCopies < loanedCopies) {
        throw new HttpError(
          409,
          `totalCopies (${dto.totalCopies}) cannot be less than copies currently on loan (${loanedCopies})`,
        );
      }
      book.totalCopies = dto.totalCopies;
      book.availableCopies = dto.totalCopies - loanedCopies;
    }

    return BookRepository.save(book);
  },
};
