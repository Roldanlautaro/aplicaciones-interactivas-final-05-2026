import { useEffect, useState } from 'react'
import LoanList from '../components/LoanList'
import LoanForm from '../components/LoanForm'
import PageContainer from '../components/ui/PageContainer'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { listLoans, returnLoan, createLoan } from '../services/loansApi'
import { listBooks } from '../services/booksApi'
import { listMembers } from '../services/membersApi'
import { extractApiError } from '../services/errors'
import type { Book, CreateLoanInput, Loan, Member } from '../types'
import { colors, fontSize, spacing } from '../styles/theme'

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [modalLoading, setModalLoading] = useState(false)
  const [modalLoadError, setModalLoadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchLoans = async () => {
    setLoading(true)
    setError(null)
    try {
      setLoans(await listLoans())
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchLoans()
  }, [])

  async function openModal() {
    setFormError(null)
    setModalLoadError(null)
    setModalOpen(true)
    setModalLoading(true)
    try {
      const [b, m] = await Promise.all([listBooks(), listMembers()])
      setBooks(b)
      setMembers(m)
    } catch (err) {
      setModalLoadError(extractApiError(err))
    } finally {
      setModalLoading(false)
    }
  }

  function closeModal() {
    if (submitting) return
    setModalOpen(false)
    setFormError(null)
  }

  async function handleCreate(input: CreateLoanInput) {
    setSubmitting(true)
    setFormError(null)
    try {
      await createLoan(input)
      setModalOpen(false)
      await fetchLoans()
    } catch (err) {
      setFormError(extractApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReturn(id: number) {
    setBusyId(id)
    setError(null)
    try {
      await returnLoan(id)
      await fetchLoans()
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Préstamos"
        subtitle={`${loans.length} ${loans.length === 1 ? 'préstamo' : 'préstamos'} en historial`}
        actions={<Button onClick={openModal}>+ Nuevo préstamo</Button>}
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
            Cargando préstamos…
          </div>
        ) : (
          <LoanList loans={loans} onReturn={handleReturn} busyId={busyId} />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Nuevo préstamo"
        closeOnBackdrop={!submitting}
      >
        {modalLoading ? (
          <p style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
            Cargando libros y socios…
          </p>
        ) : modalLoadError ? (
          <Alert>{modalLoadError}</Alert>
        ) : (
          <LoanForm
            books={books}
            members={members}
            onSubmit={handleCreate}
            onCancel={closeModal}
            submitting={submitting}
            error={formError}
          />
        )}
      </Modal>
    </PageContainer>
  )
}
