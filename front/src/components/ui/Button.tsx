import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { colors, fontSize, fontWeight, radius, spacing, transition } from '../../styles/theme'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
  border: '1px solid transparent',
  borderRadius: radius.md,
  fontWeight: fontWeight.semibold,
  lineHeight: 1.2,
  transition: `background ${transition.fast}, border-color ${transition.fast}, color ${transition.fast}`,
  whiteSpace: 'nowrap',
}

const sizes: Record<Size, CSSProperties> = {
  sm: { fontSize: fontSize.sm, padding: `${spacing[1]} ${spacing[3]}` },
  md: { fontSize: fontSize.sm, padding: `${spacing[2]} ${spacing[4]}` },
}

function variantStyles(variant: Variant, hover: boolean, disabled: boolean): CSSProperties {
  if (disabled) {
    return {
      background: colors.surfaceAlt,
      color: colors.textMuted,
      borderColor: colors.border,
    }
  }
  switch (variant) {
    case 'primary':
      return {
        background: hover ? colors.primaryHover : colors.primary,
        color: colors.textOnPrimary,
      }
    case 'danger':
      return {
        background: hover ? colors.dangerHover : colors.danger,
        color: colors.textOnPrimary,
      }
    case 'secondary':
      return {
        background: hover ? colors.surfaceAlt : colors.surface,
        color: colors.text,
        borderColor: colors.borderStrong,
      }
    case 'ghost':
      return {
        background: hover ? colors.surfaceAlt : 'transparent',
        color: colors.text,
      }
  }
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  children,
  ...rest
}: Props) {
  const [hover, setHover] = useState(false)
  return (
    <button
      {...rest}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...base,
        ...sizes[size],
        ...variantStyles(variant, hover, !!disabled),
        ...style,
      }}
    >
      {children}
    </button>
  )
}
