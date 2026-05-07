import api from './api'
import type { Book, CreateBookInput, UpdateBookInput } from '../types'

export async function listBooks(): Promise<Book[]> {
  const { data } = await api.get<Book[]>('/books')
  return data
}

export async function createBook(input: CreateBookInput): Promise<Book> {
  const { data } = await api.post<Book>('/books', input)
  return data
}

export async function updateBook(id: number, input: UpdateBookInput): Promise<Book> {
  const { data } = await api.patch<Book>(`/books/${id}`, input)
  return data
}
