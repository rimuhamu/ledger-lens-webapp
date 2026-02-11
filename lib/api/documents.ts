import apiClient from './client'
import type { DocumentResponse, DocumentIngestResponse } from './types'

export const documentsAPI = {
  /**
   * Upload a PDF document for analysis
   */
  async upload(file: File, ticker: string): Promise<DocumentIngestResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('ticker', ticker)

    const response = await apiClient.post<DocumentIngestResponse>(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Longer timeout for file uploads
        timeout: 120000, // 2 minutes
      }
    )

    return response.data
  },

  /**
   * List all documents for the current user
   */
  async list(): Promise<DocumentResponse[]> {
    const response = await apiClient.get<DocumentResponse[]>('/documents/')
    return response.data
  },

  /**
   * Get metadata for a specific document
   */
  async get(documentId: string): Promise<DocumentResponse> {
    const response = await apiClient.get<DocumentResponse>(
      `/documents/${documentId}`
    )
    return response.data
  },
}