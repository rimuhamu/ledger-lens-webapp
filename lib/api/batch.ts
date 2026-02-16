import { analysisAPI } from './analysis'
import type { AnalysisResponse } from './types'

/**
 * Fetch analysis data for multiple documents in a single parallel batch.
 * Uses Promise.allSettled so one failure doesn't block the rest.
 *
 * @returns A Map of documentId → AnalysisResponse | null
 */
export async function fetchAnalysesBatch(
  documentIds: string[]
): Promise<Map<string, AnalysisResponse | null>> {
  const results = await Promise.allSettled(
    documentIds.map(async (id) => {
      const analysis = await analysisAPI.getAnalysis(id)
      return { id, analysis }
    })
  )

  const map = new Map<string, AnalysisResponse | null>()

  for (const result of results) {
    if (result.status === 'fulfilled') {
      map.set(result.value.id, result.value.analysis)
    } else {
      console.error('Unexpected batch analysis fetch failure:', result.reason)
    }
  }
  for (const id of documentIds) {
    if (!map.has(id)) {
      map.set(id, null)
    }
  }

  return map
}
