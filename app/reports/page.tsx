"use client"

import { useState, useEffect } from "react"
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
import { documentsAPI, analysisAPI } from "@/lib/api"
import { toast } from "sonner"
import type { DocumentResponse, AnalysisResponse } from "@/lib/api/types"

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

export default function ReportsPage() {
  const [search, setSearch] = useState("")
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await documentsAPI.list()
        
        // Initial state for reports with loading status
        const initialReports: ReportData[] = docs.map(doc => ({
          id: doc.document_id,
          ticker: doc.ticker,
          company: doc.filename, // Using filename as company name for now
          reportType: "Annual Report", // Placeholder
          date: new Date(doc.created_at).toLocaleDateString(),
          sentiment: "neutral",
          sentimentScore: 0,
          confidence: 0,
          slug: doc.document_id,
          isLoading: true
        }))
        
        setReports(initialReports)
        setLoading(false)

        // Fetch analysis for each document
        docs.forEach(async (doc) => {
          try {
            const analysis = await analysisAPI.getAnalysis(doc.document_id)
            if (analysis && analysis.intelligence_hub) {
              const score = analysis.intelligence_hub.sentiment.score
              let sentiment: "bullish" | "bearish" | "neutral" = "neutral"
              if (score >= 60) sentiment = "bullish"
              if (score <= 40) sentiment = "bearish"
              
              setReports(prev => prev.map(r => 
                r.id === doc.document_id 
                  ? { 
                      ...r, 
                      sentiment, 
                      sentimentScore: score,
                      // Use actual confidence metric if available, otherwise fallback to calculation
                      confidence: analysis.confidence_metrics?.metrics?.find(m => m.label === "AI Certainty")?.ratio 
                        ? (analysis.confidence_metrics.metrics.find(m => m.label === "AI Certainty")!.ratio * 100)
                        : (85 + (Math.abs(score - 50) / 50) * 10),
                      isLoading: false
                    } 
                  : r
              ))
            } else {
               setReports(prev => prev.map(r => 
                r.id === doc.document_id ? { ...r, isLoading: false } : r
              ))
            }
          } catch (error) {
            console.error(`Failed to fetch analysis for ${doc.document_id}`, error)
             setReports(prev => prev.map(r => 
                r.id === doc.document_id ? { ...r, isLoading: false } : r
              ))
          }
        })

      } catch (error) {
        console.error("Failed to fetch documents:", error)
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const filtered = reports.filter(
    (r) =>
      r.ticker.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()

    // No need for confirm dialog if we use toast with undo or just clear feedback
    // But user asked for confirmation. We can use a sonner toast with action or just keep the confirm for now and show progress.
    // "use toast to confirm deletion" -> this might mean using a toast to ask for confirmation, OR using toast to *acknowledge* the confirmation and show progress.
    // Standard pattern: Click delete -> Confirm Dialog -> Toast Loading -> Toast Success/Error.
    
    // User said: "use toast to confirm deletion" - this is ambiguous. It could mean "replace window.confirm with a toast that has a confirm button".
    // "and show the progress" -> implies async state.
    
    // Let's stick to window.confirm for safety unless requested otherwise, but maybe wrapping the delete action in a toast promise is what they primarily want for "show progress".
    // Actually, "toast to confirm" sounds like "Toast: Are you sure? [Delete] [Cancel]".
    // Let's implement a toast-based confirmation.
    
    toast("Are you sure you want to delete this report?", {
      action: {
        label: "Delete",
        onClick: async () => {
             const promise = documentsAPI.delete(id)
             
             toast.promise(promise, {
               loading: 'Deleting report...',
               success: () => {
                 setReports(prev => prev.filter(report => report.id !== id))
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
