import { useState } from 'react'
import type { Book, Member, CreateLoanInput } from '../types'
import { BookStatus, MemberStatus } from '../types'
import FormField from './ui/FormField'
import Select from './ui/Select'
import Button from './ui/Button'
import Alert from './ui/Alert'
import { colors, fontSize, spacing } from '../styles/theme'

interface Props {
  books: Book[]
  members: Member[]
  onSubmit: (input: CreateLoanInput) => void | Promise<void>
  onCancel: () => void
  submitting: boolean
  error: string | null
}

export default function LoanForm({
  books,
  members,
  onSubmit,
  onCancel,
  submitting,
  error,
}: Props) {
  const [bookId, setBookId] = useState<string>('')
  const [memberId, setMemberId] = useState<string>('')

  const availableBooks = books.filter(
    (b) => b.status === BookStatus.AVAILABLE && b.availableCopies > 0,
  )
  const activeMembers = members.filter((m) => m.status === MemberStatus.ACTIVE)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!bookId || !memberId || submitting) return
    onSubmit({ bookId: Number(bookId), memberId: Number(memberId) })
  }

  const noBooks = availableBooks.length === 0
  const noMembers = activeMembers.length === 0

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: spacing[4] }}>
      <FormField
        label="Libro"
        htmlFor="loan-book"
        required
        hint={noBooks ? 'No hay libros disponibles para prestar' : undefined}
      >
        <Select
          id="loan-book"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
          disabled={submitting || noBooks}
        >
          <option value="">— Seleccioná un libro —</option>
          {availableBooks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.availableCopies} disp.)
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Socio"
        htmlFor="loan-member"
        required
        hint={noMembers ? 'No hay socios activos' : undefined}
      >
        <Select
          id="loan-member"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
          disabled={submitting || noMembers}
        >
          <option value="">— Seleccioná un socio —</option>
          {activeMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.memberNumber})
            </option>
          ))}
        </Select>
      </FormField>

      {error && <Alert>{error}</Alert>}

      <p style={{ color: colors.textMuted, fontSize: fontSize.xs, margin: 0 }}>
        El préstamo se otorga por 14 días. La fecha de vencimiento se calcula automáticamente.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[2] }}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting || !bookId || !memberId}>
          {submitting ? 'Creando…' : 'Crear préstamo'}
        </Button>
      </div>
    </form>
  )
}
