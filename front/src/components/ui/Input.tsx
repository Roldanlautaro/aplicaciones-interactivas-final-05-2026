import { useState, type CSSProperties, type InputHTMLAttributes } from 'react'
import { colors, fontSize, radius, spacing, transition } from '../../styles/theme'

type Props = InputHTMLAttributes<HTMLInputElement>

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
}

export default function Input({ style, onFocus, onBlur, disabled, ...rest }: Props) {
  const [focus, setFocus] = useState(false)
  return (
    <input
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
        ...style,
      }}
    />
  )
}
