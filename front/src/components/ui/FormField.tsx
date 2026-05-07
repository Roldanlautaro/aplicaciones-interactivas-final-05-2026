import type { ReactNode } from 'react'
import { colors, fontSize, fontWeight, spacing } from '../../styles/theme'

interface Props {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

export default function FormField({ label, htmlFor, error, hint, required, children }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: colors.text,
        }}
      >
        {label}
        {required && <span style={{ color: colors.danger, marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <span style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: fontSize.xs, color: colors.danger }}>{error}</span>
      )}
    </div>
  )
}
