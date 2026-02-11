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
      `/analysis/${documentId}`,
      data,
      {
        // Longer timeout for analysis which may take time
        timeout: 180000, // 3 minutes
      }
    )

    return response.data
  },
}