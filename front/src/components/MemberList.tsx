import { MemberStatus, type Member } from '../types'
import Table, { type Column } from './ui/Table'
import Select from './ui/Select'
import { fontSize, fontWeight, radius, spacing } from '../styles/theme'

interface Props {
  members: Member[]
  onUpdateStatus: (id: number, status: MemberStatus) => void
  busyId?: number | null
}

function StatusBadge({ status }: { status: MemberStatus }) {
  const isActive = status === MemberStatus.ACTIVE
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${spacing[1]} ${spacing[2]}`,
        borderRadius: radius.full,
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        background: isActive ? '#dcfce7' : '#fee2e2',
        color: isActive ? '#166534' : '#991b1b',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {status}
    </span>
  )
}

export default function MemberList({ members, onUpdateStatus, busyId }: Props) {
  const columns: Column<Member>[] = [
    { key: 'memberNumber', header: 'Nº Socio', width: '120px' },
    { key: 'name', header: 'Nombre', render: (m) => <strong style={{ fontWeight: fontWeight.medium }}>{m.name}</strong> },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (m) => <StatusBadge status={m.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '160px',
      render: (m) => (
        <Select
          value={m.status}
          disabled={busyId === m.id}
          onChange={(e) => onUpdateStatus(m.id, e.target.value as MemberStatus)}
          style={{ padding: `${spacing[1]} ${spacing[2]}`, fontSize: fontSize.xs }}
        >
          <option value={MemberStatus.ACTIVE}>ACTIVE</option>
          <option value={MemberStatus.SUSPENDED}>SUSPENDED</option>
        </Select>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={members}
      keyExtractor={(m) => m.id}
      emptyMessage="No hay socios cargados todavía."
    />
  )
}
