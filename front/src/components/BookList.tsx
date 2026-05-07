import { BookStatus, type Book } from '../types'
import Table, { type Column } from './ui/Table'
import Select from './ui/Select'
import { colors, fontSize, fontWeight, radius, spacing } from '../styles/theme'

interface Props {
  books: Book[]
  onUpdateStatus: (id: number, status: BookStatus) => void
  busyId?: number | null
}

function StatusBadge({ status }: { status: BookStatus }) {
  const isAvailable = status === BookStatus.AVAILABLE
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${spacing[1]} ${spacing[2]}`,
        borderRadius: radius.full,
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        background: isAvailable ? '#dcfce7' : '#fef3c7',
        color: isAvailable ? '#166534' : '#92400e',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {status}
    </span>
  )
}

// Componente para mostrar la lista de libros en una tabla
export default function BookList({ books, onUpdateStatus, busyId }: Props) {
  const columns: Column<Book>[] = [
    { key: 'isbn', header: 'ISBN', width: '160px' },
    { key: 'title', header: 'Título', render: (b) => <strong style={{ fontWeight: fontWeight.medium }}>{b.title}</strong> },
    { key: 'author', header: 'Autor' },
    {
      key: 'genre',
      header: 'Género',
      render: (b) => <span style={{ color: colors.textMuted }}>{b.genre}</span>,
    },
    {
      key: 'copies',
      header: 'Disp. / Total',
      align: 'center',
      width: '110px',
      render: (b) => `${b.availableCopies} / ${b.totalCopies}`,
    },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (b) => <StatusBadge status={b.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '160px',
      render: (b) => (
        <Select
          value={b.status}
          disabled={busyId === b.id}
          onChange={(e) => onUpdateStatus(b.id, e.target.value as BookStatus)}
          style={{ padding: `${spacing[1]} ${spacing[2]}`, fontSize: fontSize.xs }}
        >
          <option value={BookStatus.AVAILABLE}>AVAILABLE</option>
          <option value={BookStatus.WITHDRAWN}>WITHDRAWN</option>
        </Select>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={books}
      keyExtractor={(b) => b.id}
      emptyMessage="No hay libros cargados todavía."
    />
  )
}
