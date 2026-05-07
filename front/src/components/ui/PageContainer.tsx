import type { ReactNode } from 'react'
import { spacing } from '../../styles/theme'

interface Props {
  children: ReactNode
}

export default function PageContainer({ children }: Props) {
  return (
    <div
      className="page-container"
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: `${spacing[8]} ${spacing[6]}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[6],
      }}
    >
      {children}
    </div>
  )
}
