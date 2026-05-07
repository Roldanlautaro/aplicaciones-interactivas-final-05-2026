import { useEffect, useState } from 'react'
import MemberList from '../components/MemberList'
import MemberForm from '../components/MemberForm'
import PageContainer from '../components/ui/PageContainer'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import { createMember, listMembers, updateMember } from '../services/membersApi'
import { extractApiError } from '../services/errors'
import { MemberStatus, type CreateMemberInput, type Member } from '../types'
import { colors, fontSize, spacing } from '../styles/theme'

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const fetchMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      setMembers(await listMembers())
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchMembers()
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

  async function handleCreate(input: CreateMemberInput) {
    setSubmitting(true)
    setFormError(null)
    try {
      await createMember(input)
      setModalOpen(false)
      await fetchMembers()
    } catch (err) {
      setFormError(extractApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateStatus(id: number, status: MemberStatus) {
    setBusyId(id)
    setError(null)
    try {
      await updateMember(id, { status })
      await fetchMembers()
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Socios"
        subtitle={`${members.length} ${members.length === 1 ? 'socio' : 'socios'} registrados`}
        actions={<Button onClick={openModal}>+ Nuevo miembro</Button>}
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
            Cargando socios…
          </div>
        ) : (
          <MemberList members={members} onUpdateStatus={handleUpdateStatus} busyId={busyId} />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Nuevo socio"
        closeOnBackdrop={!submitting}
      >
        <MemberForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          submitting={submitting}
          error={formError}
        />
      </Modal>
    </PageContainer>
  )
}
