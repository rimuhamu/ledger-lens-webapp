import apiClient from './client'
import type { AnalysisRequest, AnalysisResponse } from './types'

export const analysisAPI = {
  /**
   * Analyze a document with a specific query
   */
  async analyze(
    documentId: string,
    query: string
  ): Promise<AnalysisResponse> {
    const data: AnalysisRequest = { query }

    const response = await apiClient.post<AnalysisResponse>(
      `/api/analysis/${documentId}`,
      data,
      {
        // Longer timeout for analysis which may take time
        timeout: 180000, // 3 minutes
      }
    )

    return response.data
  },

  /**
   * Get the analysis result for a document
   */
  async getAnalysis(documentId: string): Promise<AnalysisResponse | null> {
    try {
      const response = await apiClient.get<AnalysisResponse>(
        `/api/documents/${documentId}/analysis`
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch analysis:', error)
      // Return null if analysis not found or error
      return null
    }
  }
}