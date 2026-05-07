import api from './api'
import type { CreateLoanInput, Loan } from '../types'

export async function listLoans(): Promise<Loan[]> {
  const { data } = await api.get<Loan[]>('/loans')
  return data
}

export async function createLoan(input: CreateLoanInput): Promise<Loan> {
  const { data } = await api.post<Loan>('/loans', input)
  return data
}

export async function returnLoan(id: number): Promise<Loan> {
  const { data } = await api.patch<Loan>(`/loans/${id}`)
  return data
}
