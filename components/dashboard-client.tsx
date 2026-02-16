"use client"

import { useMemo } from "react"
import Link from "next/link"
import { FileText, Sparkles } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { NewAnalysisCard } from "@/components/analysis-card"
import { ConnectedAnalysisCard } from "@/components/connected-analysis-card"
import { PortfolioSentimentMap } from "@/components/intelligence-feed"
import type { DashboardStats, DocumentResponse, AnalysisResponse } from "@/lib/api/types"

interface DashboardClientProps {
  stats: DashboardStats
  documents: DocumentResponse[]
  analysisMap: Map<string, AnalysisResponse>
  userName: string
}

export function DashboardClient({ stats, documents, analysisMap, userName }: DashboardClientProps) {
  // Calculate AI Accuracy Score from the pre-fetched analysisMap
  const aiAccuracyScore = useMemo(() => {
    if (analysisMap.size === 0) return 0

    const certainties: number[] = []
    for (const analysis of analysisMap.values()) {
      if (analysis?.confidence_metrics?.metrics) {
        const aiCertainty = analysis.confidence_metrics.metrics.find(
          (m) => m.label === "AI Certainty"
        )
        if (aiCertainty) {
          certainties.push(aiCertainty.ratio * 100)
        }
      }
    }

    if (certainties.length === 0) return 0
    return certainties.reduce((sum, val) => sum + val, 0) / certainties.length
  }, [analysisMap])

  // Merge AI accuracy into stats
  const mergedStats = { ...stats, ai_accuracy_score: aiAccuracyScore }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground text-balance">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's the overview of your analyzed portfolios."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Reports"
          value={mergedStats.total_reports.toString()}
          icon={FileText}
          badge={{ text: "Active", variant: "success" }}
        />
        <PortfolioSentimentMap sentimentDistribution={mergedStats.sentiment_distribution} />
        <StatCard
          title="AI Accuracy Score"
          value={`${mergedStats.ai_accuracy_score.toFixed(1)}%`}
          icon={Sparkles}
          badge={(() => {
            const score = mergedStats.ai_accuracy_score
            if (score >= 80) return { text: "Optimal", variant: "success" as const }
            if (score >= 60) return { text: "Good", variant: "default" as const }
            return { text: "Needs Improvement", variant: "destructive" as const }
          })()}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">
            Recent Documents
          </h2>
          <Link
            href="/reports"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <ConnectedAnalysisCard 
              key={doc.document_id}
              documentId={doc.document_id}
              ticker={doc.ticker}
              filename={doc.filename}
              createdAt={doc.created_at}
              prefetchedAnalysis={analysisMap.get(doc.document_id) ?? undefined}
            />
          ))}
          <NewAnalysisCard />
        </div>
      </div>
    </div>
  )
}
