import { useEffect, useState } from 'react'
import ActivityReport from '../components/ActivityReport'
import PageContainer from '../components/ui/PageContainer'
import PageHeader from '../components/ui/PageHeader'
import Alert from '../components/ui/Alert'
import { getActivityReport } from '../services/reportsApi'
import { extractApiError } from '../services/errors'
import type { ActivityReport as ActivityReportData } from '../types'
import { colors, fontSize } from '../styles/theme'

export default function ActivityReportPage() {
  const [data, setData] = useState<ActivityReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const report = await getActivityReport()
        if (!cancelled) setData(report)
      } catch (err) {
        if (!cancelled) setError(extractApiError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageContainer>
      <PageHeader
        title="Reporte de actividad"
        subtitle="Resumen de la operación de la biblioteca"
      />
      {loading && (
        <p style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Cargando reporte…</p>
      )}
      {error && <Alert>{error}</Alert>}
      {!loading && !error && data && <ActivityReport data={data} />}
    </PageContainer>
  )
}
