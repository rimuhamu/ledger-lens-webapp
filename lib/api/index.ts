export { authAPI } from './auth'
export { documentsAPI } from './documents'
export { analysisAPI } from './analysis'
export { getAuthToken, setAuthToken, clearAuthToken } from './client'

export type * from './types'

// Re-export everything as a single api object
import { authAPI } from './auth'
import { documentsAPI } from './documents'
import { analysisAPI } from './analysis'

export const api = {
  auth: authAPI,
  documents: documentsAPI,
  analysis: analysisAPI,
}

export default api