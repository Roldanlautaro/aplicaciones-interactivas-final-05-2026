import { useState, type CSSProperties, type ReactNode } from 'react'
import { colors, fontSize, fontWeight, spacing } from '../../styles/theme'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  emptyMessage?: string
}

const thBase: CSSProperties = {
  textAlign: 'left',
  padding: `${spacing[3]} ${spacing[4]}`,
  background: colors.surfaceAlt,
  fontSize: fontSize.xs,
  fontWeight: fontWeight.semibold,
  color: colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: `1px solid ${colors.border}`,
  whiteSpace: 'nowrap',
}

const tdBase: CSSProperties = {
  padding: `${spacing[3]} ${spacing[4]}`,
  fontSize: fontSize.sm,
  color: colors.text,
  borderBottom: `1px solid ${colors.border}`,
  verticalAlign: 'middle',
}

function Row<T>({
  row,
  columns,
}: {
  row: T
  columns: Column<T>[]
}) {
  const [hover, setHover] = useState(false)
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? colors.surfaceHover : 'transparent' }}
    >
      {columns.map((col) => (
        <td
          key={col.key}
          style={{
            ...tdBase,
            textAlign: col.align ?? 'left',
            width: col.width,
          }}
        >
          {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
        </td>
      ))}
    </tr>
  )
}

export default function Table<T>({ columns, data, keyExtractor, emptyMessage = 'Sin datos.' }: Props<T>) {
  if (data.length === 0) {
    return (
      <div
        style={{
          padding: `${spacing[10]} ${spacing[4]}`,
          textAlign: 'center',
          color: colors.textMuted,
          fontSize: fontSize.sm,
        }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...thBase,
                  textAlign: col.align ?? 'left',
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Row key={keyExtractor(row)} row={row} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
