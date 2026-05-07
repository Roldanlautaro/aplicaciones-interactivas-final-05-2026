import type { CSSProperties, ReactNode } from 'react'
import { colors, radius, shadow } from '../../styles/theme'

interface Props {
  children: ReactNode
  padding?: string | number
  style?: CSSProperties
}

export default function Card({ children, padding = 0, style }: Props) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: shadow.sm,
        padding,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
