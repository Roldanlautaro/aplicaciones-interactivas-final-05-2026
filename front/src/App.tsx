import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import BooksPage from './pages/BooksPage'
import MembersPage from './pages/MembersPage'
import LoansPage from './pages/LoansPage'
import LoanFormPage from './pages/LoanFormPage'
import ActivityReportPage from './pages/ActivityReportPage'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/loans/new" element={<LoanFormPage />} />
          <Route path="/reports" element={<ActivityReportPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
