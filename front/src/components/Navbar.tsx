import { NavLink } from 'react-router-dom'
import { colors, fontSize, fontWeight, radius, spacing, transition } from '../styles/theme'

const links = [
  { to: '/books', label: 'Libros' },
  { to: '/members', label: 'Socios' },
  { to: '/loans', label: 'Préstamos' },
  { to: '/reports', label: 'Reporte' },
]

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? '#ffffff' : '#cbd5e1',
  textDecoration: 'none',
  fontWeight: isActive ? fontWeight.semibold : fontWeight.medium,
  fontSize: fontSize.sm,
  padding: `${spacing[2]} ${spacing[3]}`,
  borderRadius: radius.md,
  background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
  transition: `background ${transition.fast}, color ${transition.fast}`,
})

export default function Navbar() {
  return (
    <nav
      style={{
        background: '#0f172a',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: `${spacing[3]} ${spacing[6]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[6],
          flexWrap: 'wrap',
        }}
      >
        <strong style={{ color: '#ffffff', fontSize: fontSize.md, letterSpacing: '-0.01em' }}>
          📚 Biblioteca
        </strong>
        <div style={{ display: 'flex', gap: spacing[1], alignItems: 'center', flexWrap: 'wrap' }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} style={linkStyle}>
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
