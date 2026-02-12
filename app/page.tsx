"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Clock, Sparkles, Search, Upload, Loader2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { AnalysisCard, NewAnalysisCard } from "@/components/analysis-card"
import { ConnectedAnalysisCard } from "@/components/connected-analysis-card"
import {
  PortfolioSentimentMap,
} from "@/components/intelligence-feed"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { documentsAPI, dashboardAPI } from "@/lib/api"
import type { DocumentResponse, DashboardStats } from "@/lib/api/types"



export default function DashboardPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<DocumentResponse[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, dashboardStats] = await Promise.all([
            documentsAPI.list(),
            dashboardAPI.getStats()
        ])
        setDocuments(docs)
        setStats(dashboardStats)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
        fetchData()
    }
  }, [user])



  const handleDelete = async (id: string) => {
    try {
        await documentsAPI.delete(id)
        setDocuments(prev => prev.filter(doc => doc.document_id !== id))
        // Refresh stats ideally, but for now we just remove from list
    } catch (error) {
        console.error("Failed to delete document:", error)
        alert("Failed to delete document. Please try again.")
    }
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground text-balance">
              Welcome back, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {"Here's the latest intelligence from your analyzed portfolios."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tickers..."
                className="pl-9 w-48 lg:w-64 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Link href="/analysis">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Quick Upload</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Reports"
            value={stats?.total_reports.toString() || "0"}
            icon={FileText}
            badge={{ text: "Active", variant: "success" }}
          />
          <PortfolioSentimentMap sentimentDistribution={stats?.sentiment_distribution} />
          <StatCard
            title="AI Accuracy Score"
            value={`${stats?.ai_accuracy_score.toFixed(1) || 0}%`}
            icon={Sparkles}
            badge={{ text: "Optimal", variant: "success" }}
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
                    onDelete={handleDelete}
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
