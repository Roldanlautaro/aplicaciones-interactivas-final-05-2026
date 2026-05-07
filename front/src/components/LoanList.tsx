import { LoanStatus, type Loan } from '../types'
import Table, { type Column } from './ui/Table'
import Button from './ui/Button'
import { colors, fontSize, fontWeight, radius, spacing } from '../styles/theme'

interface Props {
  loans: Loan[]
  onReturn: (id: number) => void
  busyId?: number | null
}

function fmtDate(value: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString()
}

function isOverdue(loan: Loan): boolean {
  if (loan.status !== LoanStatus.ACTIVE) return false
  const due = new Date(loan.dueDate)
  return !Number.isNaN(due.getTime()) && due.getTime() < Date.now()
}

function StatusBadge({ loan }: { loan: Loan }) {
  const overdue = isOverdue(loan)
  const label = overdue ? 'OVERDUE' : loan.status
  const palette: Record<string, { bg: string; fg: string }> = {
    ACTIVE:   { bg: '#dbeafe', fg: '#1e40af' },
    RETURNED: { bg: '#dcfce7', fg: '#166534' },
    OVERDUE:  { bg: '#fee2e2', fg: '#991b1b' },
  }
  const { bg, fg } = palette[label] ?? palette.ACTIVE
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${spacing[1]} ${spacing[2]}`,
        borderRadius: radius.full,
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        background: bg,
        color: fg,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </span>
  )
}

export default function LoanList({ loans, onReturn, busyId }: Props) {
  const columns: Column<Loan>[] = [
    {
      key: 'book',
      header: 'Libro',
      render: (l) => (
        <strong style={{ fontWeight: fontWeight.medium }}>
          {l.book?.title ?? `#${l.book?.id ?? '?'}`}
        </strong>
      ),
    },
    {
      key: 'member',
      header: 'Socio',
      render: (l) => l.member?.name ?? `#${l.member?.id ?? '?'}`,
    },
    {
      key: 'loanDate',
      header: 'Préstamo',
      width: '110px',
      render: (l) => <span style={{ color: colors.textMuted }}>{fmtDate(l.loanDate)}</span>,
    },
    {
      key: 'dueDate',
      header: 'Vencimiento',
      width: '120px',
      render: (l) => (
        <span style={{ color: isOverdue(l) ? colors.danger : colors.textMuted }}>
          {fmtDate(l.dueDate)}
        </span>
      ),
    },
    {
      key: 'returnDate',
      header: 'Devolución',
      width: '110px',
      render: (l) => <span style={{ color: colors.textMuted }}>{fmtDate(l.returnDate)}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (l) => <StatusBadge loan={l} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '120px',
      render: (l) =>
        l.status === LoanStatus.RETURNED ? (
          <span style={{ color: colors.textMuted }}>—</span>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onReturn(l.id)}
            disabled={busyId === l.id}
          >
            {busyId === l.id ? 'Devolviendo…' : 'Devolver'}
          </Button>
        ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={loans}
      keyExtractor={(l) => l.id}
      emptyMessage="No hay préstamos registrados."
    />
  )
}
