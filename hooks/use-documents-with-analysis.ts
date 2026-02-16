'use client'

import { useState, useEffect, useCallback } from 'react'
import { documentsAPI } from '@/lib/api'
import { fetchAnalysesBatch } from '@/lib/api/batch'
import type { DocumentResponse, AnalysisResponse } from '@/lib/api/types'

interface UseDocumentsWithAnalysisResult {
  documents: DocumentResponse[]
  analysisMap: Map<string, AnalysisResponse | null>
  isLoading: boolean
  error: string | null
}

/**
 * Shared hook that fetches all documents and their analyses in one batch.
 * Eliminates N+1 waterfall patterns by fetching all analyses in parallel
 * after a single document list call.
 *
 * @param enabled - Whether to fetch (e.g. only when user is authenticated)
 */
export function useDocumentsWithAnalysis(
  enabled: boolean = true
): UseDocumentsWithAnalysisResult {
  const [documents, setDocuments] = useState<DocumentResponse[]>([])
  const [analysisMap, setAnalysisMap] = useState<Map<string, AnalysisResponse | null>>(
    new Map()
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    const fetchAll = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const docs = await documentsAPI.list()

        if (cancelled) return
        setDocuments(docs)

        if (docs.length > 0) {
          const ids = docs.map((d) => d.document_id)
          const map = await fetchAnalysesBatch(ids)

          if (cancelled) return
          setAnalysisMap(map)
        }
      } catch (err) {
        if (cancelled) return
        console.error('Failed to fetch documents with analysis:', err)
        setError('Failed to load documents. Please try again.')
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [enabled])

  return { documents, analysisMap, isLoading, error }
}
