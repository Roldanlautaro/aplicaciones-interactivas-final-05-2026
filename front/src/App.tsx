import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import BooksPage from './pages/BooksPage'
import MembersPage from './pages/MembersPage'
import LoansPage from './pages/LoansPage'
import ActivityReportPage from './pages/ActivityReportPage'
import PageContainer from './components/ui/PageContainer'
import { colors, fontSize, fontWeight, spacing } from './styles/theme'

function NotFound() {
  return (
    <PageContainer>
      <div style={{ textAlign: 'center', padding: spacing[12] }}>
        <h2 style={{ fontSize: fontSize['2xl'], fontWeight: fontWeight.bold, marginBottom: spacing[2] }}>
          404 — Página no encontrada
        </h2>
        <p style={{ color: colors.textMuted }}>
          La ruta solicitada no existe.{' '}
          <Link to="/books" style={{ color: colors.primary, fontWeight: fontWeight.medium }}>
            Volver al inicio
          </Link>
          .
        </p>
      </div>
    </PageContainer>
  )
}

function App() {
  return (
    <div style={{ minHeight: '100vh', background: colors.bgPage }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/loans" element={<LoansPage />} />
          {/* /loans/new ya no existe — el alta se hace via modal en /loans */}
          <Route path="/loans/new" element={<Navigate to="/loans" replace />} />
          <Route path="/reports" element={<ActivityReportPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
