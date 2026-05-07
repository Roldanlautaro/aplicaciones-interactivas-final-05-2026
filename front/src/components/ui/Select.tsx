import { useState, type CSSProperties, type SelectHTMLAttributes } from 'react'
import { colors, fontSize, radius, spacing, transition } from '../../styles/theme'

type Props = SelectHTMLAttributes<HTMLSelectElement>

const baseStyle: CSSProperties = {
  width: '100%',
  padding: `${spacing[2]} ${spacing[3]}`,
  fontSize: fontSize.sm,
  color: colors.text,
  background: colors.surface,
  border: `1px solid ${colors.borderStrong}`,
  borderRadius: radius.md,
  outline: 'none',
  transition: `border-color ${transition.fast}, box-shadow ${transition.fast}`,
  cursor: 'pointer',
}

export default function Select({ style, onFocus, onBlur, disabled, children, ...rest }: Props) {
  const [focus, setFocus] = useState(false)
  return (
    <select
      {...rest}
      disabled={disabled}
      onFocus={(e) => {
        setFocus(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocus(false)
        onBlur?.(e)
      }}
      style={{
        ...baseStyle,
        background: disabled ? colors.surfaceAlt : colors.surface,
        borderColor: focus ? colors.primary : colors.borderStrong,
        boxShadow: focus ? `0 0 0 3px rgba(37, 99, 235, 0.15)` : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </select>
  )
}
