import { useState } from 'react'
import { Genre, type CreateBookInput } from '../types'
import FormField from './ui/FormField'
import Input from './ui/Input'
import Select from './ui/Select'
import Button from './ui/Button'
import Alert from './ui/Alert'
import { spacing } from '../styles/theme'

interface Props {
  onSubmit: (input: CreateBookInput) => void | Promise<void>
  onCancel: () => void
  submitting: boolean
  error: string | null
}

const initial: CreateBookInput = {
  isbn: '',
  title: '',
  author: '',
  genre: Genre.FICTION,
  totalCopies: 1,
}

// Componente para el formulario de creación de libros
export default function BookForm({ onSubmit, onCancel, submitting, error }: Props) {
  const [form, setForm] = useState<CreateBookInput>(initial)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    onSubmit({ ...form, totalCopies: Number(form.totalCopies) })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: spacing[4] }}>
      <FormField label="ISBN" htmlFor="book-isbn" required>
        <Input
          id="book-isbn"
          value={form.isbn}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          placeholder="978-..."
          required
        />
      </FormField>

      <FormField label="Título" htmlFor="book-title" required>
        <Input
          id="book-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </FormField>

      <FormField label="Autor" htmlFor="book-author" required>
        <Input
          id="book-author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
      </FormField>

      <FormField label="Género" htmlFor="book-genre" required>
        <Select
          id="book-genre"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value as Genre })}
        >
          {Object.values(Genre).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Total de ejemplares" htmlFor="book-totalCopies" required>
        <Input
          id="book-totalCopies"
          type="number"
          min={1}
          value={form.totalCopies}
          onChange={(e) => setForm({ ...form, totalCopies: Number(e.target.value) })}
          required
        />
      </FormField>

      {error && <Alert>{error}</Alert>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[2] }}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creando…' : 'Crear libro'}
        </Button>
      </div>
    </form>
  )
}
