import type { ActivityReport as ActivityReportData } from '../types'
import Card from './ui/Card'
import { colors, fontSize, fontWeight, spacing } from '../styles/theme'

interface Props {
  data: ActivityReportData
}

interface MetricProps {
  label: string
  value: number
  accent: string
}

// Componente para mostrar una métrica individual en el reporte de actividad, con un diseño consistente utilizando los estilos definidos en el tema.
function Metric({ label, value, accent }: MetricProps) {
  return (
    <Card padding={spacing[6]}>
      <div
        style={{
          fontSize: fontSize.xs,
          color: colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: fontWeight.semibold,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: spacing[2],
          fontSize: '2.25rem',
          fontWeight: fontWeight.bold,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </Card>
  )
}

export default function ActivityReport({ data }: Props) {
  const cards: MetricProps[] = [
    { label: 'Total de libros',    value: data.totalBooks,    accent: colors.text },
    { label: 'Total de socios',    value: data.totalMembers,  accent: colors.text },
    { label: 'Préstamos activos',  value: data.activeLoans,   accent: colors.primary },
    { label: 'Préstamos vencidos', value: data.overdueLoans,  accent: colors.danger },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing[4],
      }}
    >
      {cards.map((c) => (
        <Metric key={c.label} {...c} />
      ))}
    </div>
  )
}
