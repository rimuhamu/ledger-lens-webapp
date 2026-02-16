'use client'

import { useState, useEffect, useCallback } from 'react'
import { analysisAPI } from '@/lib/api'
import type { AnalysisStatus } from '@/lib/api/types'

interface UseAnalysisProgressOptions {
  documentId: string
  enabled?: boolean
  pollingInterval?: number // milliseconds
  onComplete?: () => void
  onError?: (error: Error) => void
}

interface UseAnalysisProgressReturn {
  status: AnalysisStatus | null
  isPolling: boolean
  error: Error | null
  stopPolling: () => void
  startPolling: () => void
}

/**
 * Custom hook for polling analysis progress
 * Automatically polls the backend status endpoint until analysis is complete
 */
export function useAnalysisProgress({
  documentId,
  enabled = true,
  pollingInterval = 2000, // 2 seconds default
  onComplete,
  onError,
}: UseAnalysisProgressOptions): UseAnalysisProgressReturn {
  const [status, setStatus] = useState<AnalysisStatus | null>(null)
  const [isPolling, setIsPolling] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  const startPolling = useCallback(() => {
    setIsPolling(true)
    setError(null)
  }, [])

  useEffect(() => {
    if (!enabled && isPolling) {
      setIsPolling(false)
    } else if (enabled && !isPolling) {
      setIsPolling(true)
    }
  }, [enabled])

  useEffect(() => {
    if (!isPolling || !documentId) {
      return
    }

    let intervalId: NodeJS.Timeout
    let retryCount = 0
    const MAX_RETRIES = 5 // Allow 5 consecutive failures before reporting error

    const poll = async () => {
      try {
        const currentStatus = await analysisAPI.getStatus(documentId)
        setStatus(currentStatus)
        retryCount = 0 // Reset retry count on success

        // Stop polling if analysis is complete or failed
        if (currentStatus.status === 'completed' || currentStatus.status === 'failed') {
          stopPolling()
          
          if (currentStatus.status === 'completed' && onComplete) {
            onComplete()
          }
          
          if (currentStatus.status === 'failed' && onError) {
            onError(new Error(currentStatus.message || 'Analysis failed'))
          }
        }
      } catch (err: any) {
        // Handle 404 specifically - it often means analysis hasn't started/initialized yet
        if (err.response && err.response.status === 404) {
          console.log('Analysis status not found (404), initializing...')
          // Don't set error, just keep polling
          return
        }

        console.error('Failed to fetch analysis status:', err)
        retryCount++
        
        if (retryCount >= MAX_RETRIES) {
          const errorObj = err instanceof Error ? err : new Error('Unknown error')
          setError(errorObj)
          
          if (onError) {
            onError(errorObj)
          }
          // Don't stop polling even on error, let the user cancel or retry manually if needed
          // or maybe we should stop after max retries? 
          // For now, let's keep it robust as networks can be flaky
        }
      }
    }

    // Poll immediately, then set interval
    poll()
    intervalId = setInterval(poll, pollingInterval)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [documentId, isPolling, pollingInterval, onComplete, onError, stopPolling])

  return {
    status,
    isPolling,
    error,
    stopPolling,
    startPolling,
  }
}
