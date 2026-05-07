import axios from 'axios'

export function extractApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message
    }
    if (data?.error) return data.error
    if (err.response) {
      return `Error ${err.response.status}: ${err.response.statusText}`
    }
    return err.message
  }
  if (err instanceof Error) return err.message
  return 'Error desconocido'
}
