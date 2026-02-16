"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  SortAsc,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Trash2,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { documentsAPI } from "@/lib/api"
import { useDocumentsWithAnalysis } from "@/hooks/use-documents-with-analysis"
import { toast } from "sonner"
import type { AnalysisResponse } from "@/lib/api/types"

interface ReportData {
  id: string
  ticker: string
  company: string
  reportType: string
  date: string
  sentiment: "bullish" | "bearish" | "neutral"
  sentimentScore: number
  confidence: number
  slug: string
  isLoading: boolean
}

const sentimentConfig = {
  bullish: {
    label: "Bullish",
    badge:
      "bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30",
    icon: TrendingUp,
    bar: "bg-emerald-400",
  },
  bearish: {
    label: "Bearish",
    badge: "bg-red-900/30 text-red-400 border-red-800/50 hover:bg-red-900/30",
    icon: TrendingDown,
    bar: "bg-red-400",
  },
  neutral: {
    label: "Neutral",
    badge:
      "bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-700/50",
    icon: Minus,
    bar: "bg-slate-400",
  },
}

function buildReportFromAnalysis(
  docId: string,
  ticker: string,
  filename: string,
  createdAt: string,
  analysis: AnalysisResponse | null | undefined
): ReportData {
  let sentiment: "bullish" | "bearish" | "neutral" = "neutral"
  let sentimentScore = 0
  let confidence = 0
  const isLoading = analysis === undefined // undefined = still loading, null = no data

  if (analysis?.intelligence_hub) {
    sentimentScore = analysis.intelligence_hub.sentiment.score
    if (sentimentScore >= 60) sentiment = "bullish"
    if (sentimentScore <= 40) sentiment = "bearish"

    const aiCertainty = analysis.confidence_metrics?.metrics?.find(
      (m) => m.label === "AI Certainty"
    )
    confidence = aiCertainty ? aiCertainty.ratio * 100 : 0
  }

  return {
    id: docId,
    ticker,
    company: filename,
    reportType: "Annual Report",
    date: new Date(createdAt).toLocaleDateString(),
    sentiment,
    sentimentScore,
    confidence,
    slug: docId,
    isLoading,
  }
}

export default function ReportsPage() {
  const [search, setSearch] = useState("")
  const { documents, analysisMap, isLoading: loading } = useDocumentsWithAnalysis()
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

  // Build report data from the pre-fetched documents + analysisMap
  const reports: ReportData[] = documents
    .filter((doc) => !deletedIds.has(doc.document_id))
    .map((doc) =>
      buildReportFromAnalysis(
        doc.document_id,
        doc.ticker,
        doc.filename,
        doc.created_at,
        analysisMap.get(doc.document_id)
      )
    )

  const filtered = reports.filter(
    (r) =>
      r.ticker.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    toast("Are you sure you want to delete this report?", {
      action: {
        label: "Delete",
        onClick: async () => {
             const promise = documentsAPI.delete(id)
             
             toast.promise(promise, {
               loading: 'Deleting report...',
               success: () => {
                 setDeletedIds((prev) => new Set(prev).add(id))
                 return 'Report deleted successfully'
               },
               error: 'Failed to delete report',
             })
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => console.log("Cancelled"),
      }
    })
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              All analyzed reports and financial intelligence.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-48 lg:w-64 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              variant="outline"
              className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-secondary gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-secondary gap-2"
            >
              <SortAsc className="w-4 h-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-3">Company</div>
            <div className="col-span-2">Report Type</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Sentiment</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-1">Conf.</div>
          </div>

          {/* Table Rows */}
          {loading ? (
             <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : (
            <>
              {filtered.map((report) => {
                const config = sentimentConfig[report.sentiment]
                const SentimentIcon = config.icon
                return (
                  <Link
                    key={report.id}
                    href={report.isLoading ? "#" : `/reports/${report.slug}`}
                    className={cn(
                        "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors group relative",
                        report.isLoading && "opacity-60 pointer-events-none"
                    )}
                  >
                    <div className="md:col-span-3 flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface shrink-0">
                        {report.isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        ) : (
                            <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {report.ticker}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {report.company}
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center">
                      <span className="text-sm text-muted-foreground">
                        {report.reportType}
                      </span>
                    </div>
                    <div className="md:col-span-2 flex items-center">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 md:hidden" />
                        {report.date}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center">
                      {report.isLoading ? (
                          <span className="text-xs text-muted-foreground">Loading...</span>
                      ) : (
                        <Badge
                            className={cn(
                            "text-[10px] uppercase tracking-wider font-semibold gap-1",
                            config.badge
                            )}
                        >
                            <SentimentIcon className="w-3 h-3" />
                            {config.label}
                        </Badge>
                      )}
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                        {report.isLoading ? (
                             <div className="h-1.5 w-full max-w-[100px] rounded-full bg-secondary animate-pulse" />
                        ) : (
                            <>
                                <div className="flex-1 max-w-[100px]">
                                    <div className="h-1.5 w-full rounded-full bg-secondary">
                                    <div
                                        className={cn(
                                        "h-full rounded-full",
                                        config.bar
                                        )}
                                        style={{ width: `${report.sentimentScore}%` }}
                                    />
                                    </div>
                                </div>
                                <span className="text-sm font-mono text-foreground">
                                    {report.sentimentScore}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="md:col-span-1 flex items-center justify-between">
                        {report.isLoading ? (
                            <span className="text-xs text-muted-foreground">...</span>
                        ) : (
                            <span className="text-sm font-mono text-emerald-400">
                                {report.confidence.toFixed(1)}%
                            </span>
                        )}
                         <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 md:static"
                            onClick={(e) => handleDelete(e, report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                    </div>
                  </Link>
                )
              })}

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    No reports found
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search terms or upload a new report.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Showing {filtered.length} of {reports.length} reports
          </span>
        </div>
      </div>
    </AppShell>
  )
}
