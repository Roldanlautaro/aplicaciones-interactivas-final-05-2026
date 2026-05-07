import type { ReactNode } from 'react'
import { colors, fontSize, radius, spacing } from '../../styles/theme'

interface Props {
  variant?: 'error' | 'info'
  children: ReactNode
}

export default function Alert({ variant = 'error', children }: Props) {
  const styles =
    variant === 'error'
      ? {
          background: colors.errorBg,
          border: `1px solid ${colors.errorBorder}`,
          color: colors.errorText,
        }
      : {
          background: colors.surfaceAlt,
          border: `1px solid ${colors.border}`,
          color: colors.text,
        }
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      style={{
        ...styles,
        padding: `${spacing[2]} ${spacing[3]}`,
        borderRadius: radius.md,
        fontSize: fontSize.sm,
      }}
    >
      {children}
    </div>
  )
}
