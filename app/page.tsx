"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Sparkles, Loader2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { NewAnalysisCard } from "@/components/analysis-card"
import { ConnectedAnalysisCard } from "@/components/connected-analysis-card"
import {
  PortfolioSentimentMap,
} from "@/components/intelligence-feed"
import { useAuth } from "@/hooks/use-auth"
import { useDocumentsWithAnalysis } from "@/hooks/use-documents-with-analysis"
import { dashboardAPI } from "@/lib/api"
import type { DashboardStats } from "@/lib/api/types"



export default function DashboardPage() {
  const { user } = useAuth()
  const { documents, analysisMap, isLoading: docsLoading } = useDocumentsWithAnalysis(!!user)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch dashboard stats separately (single call)
  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        const dashboardStats = await dashboardAPI.getStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  // Calculate AI Accuracy Score from the pre-fetched analysisMap
  const aiAccuracyScore = (() => {
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
  })()

  // Merge AI accuracy into stats
  const mergedStats = stats
    ? { ...stats, ai_accuracy_score: aiAccuracyScore }
    : null

  const isLoading = docsLoading || statsLoading

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground text-balance">
              Welcome back, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {"Here's the overview of your analyzed portfolios."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Reports"
            value={mergedStats?.total_reports.toString() || "0"}
            icon={FileText}
            badge={{ text: "Active", variant: "success" }}
          />
          <PortfolioSentimentMap sentimentDistribution={mergedStats?.sentiment_distribution} />
          <StatCard
            title="AI Accuracy Score"
            value={`${(mergedStats?.ai_accuracy_score || 0).toFixed(1)}%`}
            icon={Sparkles}
            badge={(() => {
              const score = mergedStats?.ai_accuracy_score || 0
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
          
          {isLoading ? (
             <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : (
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
          )}
        </div>


      </div>
    </AppShell>
  )
}
