import { useEffect, type ReactNode } from 'react'
import { colors, fontSize, fontWeight, radius, shadow, spacing, transition } from '../../styles/theme'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  closeOnBackdrop?: boolean
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => closeOnBackdrop && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
        zIndex: 50,
        animation: 'fadeIn 120ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface,
          borderRadius: radius.lg,
          boxShadow: shadow.lg,
          width: '100%',
          maxWidth: 'min(520px, calc(100vw - 2rem))',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${spacing[4]} ${spacing[6]}`,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <h2
            style={{
              fontSize: fontSize.lg,
              fontWeight: fontWeight.semibold,
              color: colors.text,
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: fontSize.xl,
              lineHeight: 1,
              color: colors.textMuted,
              padding: spacing[1],
              borderRadius: radius.sm,
              transition: `background ${transition.fast}, color ${transition.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.surfaceAlt
              e.currentTarget.style.color = colors.text
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = colors.textMuted
            }}
          >
            ×
          </button>
        </header>
        <div style={{ padding: spacing[6] }}>{children}</div>
        {footer && (
          <footer
            style={{
              padding: `${spacing[4]} ${spacing[6]}`,
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: spacing[2],
            }}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
