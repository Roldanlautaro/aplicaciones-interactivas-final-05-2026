import type { ReactNode } from 'react'
import { colors, fontSize, fontWeight, spacing } from '../../styles/theme'

interface Props {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: spacing[4],
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
        <h1
          style={{
            fontSize: fontSize['2xl'],
            fontWeight: fontWeight.bold,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: colors.textMuted, fontSize: fontSize.sm }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>{actions}</div>
      )}
    </header>
  )
}
