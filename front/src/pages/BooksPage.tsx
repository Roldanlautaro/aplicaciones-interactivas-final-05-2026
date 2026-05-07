import { useEffect, useState } from 'react'
import BookList from '../components/BookList'
import BookForm from '../components/BookForm'
import PageContainer from '../components/ui/PageContainer'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { createBook, listBooks, updateBook } from '../services/booksApi'
import { extractApiError } from '../services/errors'
import { BookStatus, type Book, type CreateBookInput } from '../types'
import { colors, fontSize, spacing } from '../styles/theme'

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      setBooks(await listBooks())
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchBooks()
  }, [])

  function openModal() {
    setFormError(null)
    setModalOpen(true)
  }

  function closeModal() {
    if (submitting) return
    setModalOpen(false)
    setFormError(null)
  }

  async function handleCreate(input: CreateBookInput) {
    setSubmitting(true)
    setFormError(null)
    try {
      await createBook(input)
      setModalOpen(false)
      await fetchBooks()
    } catch (err) {
      setFormError(extractApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateStatus(id: number, status: BookStatus) {
    setBusyId(id)
    setError(null)
    try {
      await updateBook(id, { status })
      await fetchBooks()
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Libros"
        subtitle={`${books.length} ${books.length === 1 ? 'título' : 'títulos'} en el catálogo`}
        actions={<Button onClick={openModal}>+ Nuevo libro</Button>}
      />

      {error && <Alert>{error}</Alert>}

      <Card>
        {loading ? (
          <div
            style={{
              padding: spacing[10],
              textAlign: 'center',
              color: colors.textMuted,
              fontSize: fontSize.sm,
            }}
          >
            Cargando libros…
          </div>
        ) : (
          <BookList books={books} onUpdateStatus={handleUpdateStatus} busyId={busyId} />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Nuevo libro"
        closeOnBackdrop={!submitting}
      >
        <BookForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          submitting={submitting}
          error={formError}
        />
      </Modal>
    </PageContainer>
  )
}
