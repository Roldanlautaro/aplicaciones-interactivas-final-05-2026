import {IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min,} from "class-validator";
import { BookStatus, Genre } from "../entities/Book";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsEnum(Genre)
  genre: Genre;

  @IsInt()
  @Min(1)
  totalCopies: number;
}

export class UpdateBookDto {
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalCopies?: number;
}
