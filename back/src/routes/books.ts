import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateDto } from "../middlewares/validateDto";
import { CreateBookDto, UpdateBookDto } from "../dtos/book.dto";

export const booksRouter = Router();

booksRouter.post("/", validateDto(CreateBookDto), asyncHandler(BookController.create));
booksRouter.get("/", asyncHandler(BookController.list));
booksRouter.patch("/:id", validateDto(UpdateBookDto), asyncHandler(BookController.update));
