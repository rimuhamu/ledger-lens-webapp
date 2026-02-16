export { authAPI } from './auth'
export { documentsAPI } from './documents'
export { analysisAPI } from './analysis'
export { fetchAnalysesBatch } from './batch'

export type * from './types'

import { authAPI } from './auth'
import { documentsAPI } from './documents'
import { analysisAPI } from './analysis'

import apiClient from './client'
import type { DashboardStats } from './types'

export const dashboardAPI = {
  async getStats(): Promise<DashboardStats> {
    try {
        const response = await apiClient.get<DashboardStats>('/api/dashboard/stats')
        return response.data
    } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
        return {
            total_reports: 0,
            last_analysis: null,
            ai_accuracy_score: 0,
            sentiment_distribution: {}
        }
    }
  }
}

export const api = {
  auth: authAPI,
  documents: documentsAPI,
  analysis: analysisAPI,
  dashboard: dashboardAPI,
}

export default api