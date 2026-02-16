import { cookies } from 'next/headers'
import axios, { AxiosInstance } from 'axios'
import type { 
  DashboardStats, 
  DocumentResponse, 
  AnalysisResponse 
} from './types'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Create a server-side axios instance with cookie forwarding
 * This is used for server-side data fetching in Server Components
 */
async function createServerClient(): Promise<AxiosInstance> {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Cookie: `auth_token=${authToken.value}` } : {}),
    },
    timeout: 30000,
    withCredentials: true,
  })
}

/**
 * Server-side Dashboard API
 */
export const serverDashboardAPI = {
  async getStats(): Promise<DashboardStats> {
    const client = await createServerClient()
    const response = await client.get<DashboardStats>('/api/dashboard/stats')
    return response.data
  },
}

/**
 * Server-side Documents API
 */
export const serverDocumentsAPI = {
  async list(): Promise<DocumentResponse[]> {
    const client = await createServerClient()
    const response = await client.get<DocumentResponse[]>('/api/documents')
    return response.data
  },
  
  async get(documentId: string): Promise<DocumentResponse> {
    const client = await createServerClient()
    const response = await client.get<DocumentResponse>(`/api/documents/${documentId}`)
    return response.data
  },
}

/**
 * Server-side Analysis API
 */
export const serverAnalysisAPI = {
  async getAnalysis(documentId: string): Promise<AnalysisResponse | null> {
    const client = await createServerClient()
    try {
      const response = await client.get<AnalysisResponse>(`/api/documents/${documentId}/analysis`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },
  
  async batchGetAnalyses(documentIds: string[]): Promise<Map<string, AnalysisResponse>> {
    const client = await createServerClient()
    const results = new Map<string, AnalysisResponse>()
    
    // Fetch all analyses in parallel
    await Promise.all(
      documentIds.map(async (docId) => {
        try {
          const response = await client.get<AnalysisResponse>(`/api/documents/${docId}/analysis`)
          results.set(docId, response.data)
        } catch (error) {
          // Skip if analysis doesn't exist
          console.debug(`No analysis found for document ${docId}`)
        }
      })
    )
    
    return results
  },
}

/**
 * Server-side Auth API
 */
export const serverAuthAPI = {
  async getMe() {
    const client = await createServerClient()
    const response = await client.get('/api/auth/me')
    return response.data
  },
}
