import { useState } from 'react'
import type { CreateMemberInput } from '../types'
import FormField from './ui/FormField'
import Input from './ui/Input'
import Button from './ui/Button'
import Alert from './ui/Alert'
import { spacing } from '../styles/theme'

interface Props {
  onSubmit: (input: CreateMemberInput) => void | Promise<void>
  onCancel: () => void
  submitting: boolean
  error: string | null
}

const initial: CreateMemberInput = { memberNumber: '', name: '', email: '' }

export default function MemberForm({ onSubmit, onCancel, submitting, error }: Props) {
  const [form, setForm] = useState<CreateMemberInput>(initial)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: spacing[4] }}>
      <FormField label="Número de socio" htmlFor="member-number" required>
        <Input
          id="member-number"
          value={form.memberNumber}
          onChange={(e) => setForm({ ...form, memberNumber: e.target.value })}
          placeholder="M-001"
          required
        />
      </FormField>

      <FormField label="Nombre" htmlFor="member-name" required>
        <Input
          id="member-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </FormField>

      <FormField label="Email" htmlFor="member-email" required>
        <Input
          id="member-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </FormField>

      {error && <Alert>{error}</Alert>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[2] }}>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creando…' : 'Crear socio'}
        </Button>
      </div>
    </form>
  )
}
