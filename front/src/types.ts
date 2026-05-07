export const Genre = {
  FICTION: 'FICTION',
  NON_FICTION: 'NON_FICTION',
  SCIENCE: 'SCIENCE',
  HISTORY: 'HISTORY',
  TECHNOLOGY: 'TECHNOLOGY',
  CHILDREN: 'CHILDREN',
} as const
export type Genre = (typeof Genre)[keyof typeof Genre]

export const BookStatus = {
  AVAILABLE: 'AVAILABLE',
  WITHDRAWN: 'WITHDRAWN',
} as const
export type BookStatus = (typeof BookStatus)[keyof typeof BookStatus]

export const MemberStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const
export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus]

export const LoanStatus = {
  ACTIVE: 'ACTIVE',
  RETURNED: 'RETURNED',
  OVERDUE: 'OVERDUE',
} as const
export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus]

export interface Book {
  id: number
  isbn: string
  title: string
  author: string
  genre: Genre
  totalCopies: number
  availableCopies: number
  status: BookStatus
}

export interface Member {
  id: number
  memberNumber: string
  name: string
  email: string
  status: MemberStatus
}

export interface Loan {
  id: number
  loanDate: string
  dueDate: string
  returnDate: string | null
  status: LoanStatus
  book: Book
  member: Member
}

export interface ActivityReport {
  totalBooks: number
  totalMembers: number
  activeLoans: number
  overdueLoans: number
}

export interface CreateBookInput {
  isbn: string
  title: string
  author: string
  genre: Genre
  totalCopies: number
}

export interface UpdateBookInput {
  status?: BookStatus
  totalCopies?: number
}

export interface CreateMemberInput {
  memberNumber: string
  name: string
  email: string
}

export interface UpdateMemberInput {
  status?: MemberStatus
}

export interface CreateLoanInput {
  bookId: number
  memberId: number
}
