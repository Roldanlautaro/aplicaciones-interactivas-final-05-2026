import api from './api'
import type { ActivityReport } from '../types'

export async function getActivityReport(): Promise<ActivityReport> {
  const { data } = await api.get<ActivityReport>('/reports/activity')
  return data
}
