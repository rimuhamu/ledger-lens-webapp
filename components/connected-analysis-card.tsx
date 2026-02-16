"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnalysisCard } from "@/components/analysis-card"
import { analysisAPI } from "@/lib/api"
import type { AnalysisResponse } from "@/lib/api/types"

interface ConnectedAnalysisCardProps {
  documentId: string
  ticker: string
  filename: string
  createdAt: string
  /** Pre-fetched analysis data from parent. When provided, skips the per-card API call. */
  prefetchedAnalysis?: AnalysisResponse
}

export function ConnectedAnalysisCard({
  documentId,
  ticker,
  filename,
  createdAt,
  prefetchedAnalysis,
}: ConnectedAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(
    prefetchedAnalysis ?? null
  )
  const [loading, setLoading] = useState(prefetchedAnalysis === undefined)

  useEffect(() => {
    // Skip fetch if analysis was provided by parent (even if null)
    if (prefetchedAnalysis !== undefined) return

    const fetchAnalysis = async () => {
      try {
        const data = await analysisAPI.getAnalysis(documentId)
        if (data && data.intelligence_hub) {
          setAnalysis(data)
        }
      } catch (error) {
        console.error("Failed to fetch analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [documentId, prefetchedAnalysis])

  if (loading) {
    return (
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-[320px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()
    
    setLoading(true)
    try {
      const result = await analysisAPI.analyze(
        documentId, 
        "Provide a comprehensive financial analysis of this document."
      )
      
      if (result && result.intelligence_hub) {
        setAnalysis(result)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setLoading(false)
    }
  }

  // Determine sentiment properties based on analysis data
  const sentimentScore = analysis?.intelligence_hub?.sentiment?.score || 0
  
  let sentiment: "bullish" | "bearish" | "neutral" = "neutral"
  if (sentimentScore >= 60) sentiment = "bullish"
  if (sentimentScore <= 40) sentiment = "bearish"

  // If no analysis available yet, show as 'Processing' or 'New'
  const reportType = analysis ? "Analyzed Report" : "Ready to Analyze"
  
  return (
    <div className="relative group">
      <AnalysisCard
        ticker={ticker}
        company={filename}
        reportType={reportType}
        sentimentScore={sentimentScore}
        sentiment={sentiment}
        date={(() => {
          const date = new Date(createdAt)
          return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        })()}
        href={analysis ? `/reports/${documentId}` : "#"}
      />
      
      {!analysis && !loading && (
        <button
            onClick={handleAnalyze}
            className="absolute bottom-4 right-4 z-10 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-md shadow hover:bg-primary/90 transition-colors"
        >
            Analyze
        </button>
      )}
      {loading && !analysis && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20 backdrop-blur-sm rounded-xl">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
      )}
    </div>
  )
}
