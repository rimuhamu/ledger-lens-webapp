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
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Report {
  id: string
  ticker: string
  company: string
  reportType: string
  date: string
  sentiment: "bullish" | "bearish" | "neutral"
  sentimentScore: number
  confidence: number
  slug: string
}

const allReports: Report[] = [
  {
    id: "1",
    ticker: "AAPL",
    company: "Apple Inc.",
    reportType: "Annual Report (10-K)",
    date: "Oct 24, 2024",
    sentiment: "bullish",
    sentimentScore: 84,
    confidence: 98.4,
    slug: "aapl-2023",
  },
  {
    id: "2",
    ticker: "MSFT",
    company: "Microsoft Corporation",
    reportType: "Annual Report (10-K)",
    date: "Oct 15, 2024",
    sentiment: "bullish",
    sentimentScore: 76,
    confidence: 97.1,
    slug: "msft-10k",
  },
  {
    id: "3",
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    reportType: "Quarterly Report (10-Q)",
    date: "Oct 20, 2024",
    sentiment: "bullish",
    sentimentScore: 92,
    confidence: 99.2,
    slug: "nvda-q3",
  },
  {
    id: "4",
    ticker: "TSLA",
    company: "Tesla, Inc.",
    reportType: "Quarterly Report (10-Q)",
    date: "Oct 22, 2024",
    sentiment: "neutral",
    sentimentScore: 52,
    confidence: 95.3,
    slug: "tsla-q3",
  },
  {
    id: "5",
    ticker: "META",
    company: "Meta Platforms, Inc.",
    reportType: "Annual Report (10-K)",
    date: "Oct 18, 2024",
    sentiment: "bearish",
    sentimentScore: 28,
    confidence: 96.8,
    slug: "meta-2023",
  },
  {
    id: "6",
    ticker: "BBCA.JK",
    company: "Bank Central Asia",
    reportType: "Annual Report",
    date: "Oct 24, 2024",
    sentiment: "bullish",
    sentimentScore: 84,
    confidence: 98.4,
    slug: "bbca-2024",
  },
  {
    id: "7",
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    reportType: "Annual Report (10-K)",
    date: "Sep 30, 2024",
    sentiment: "bullish",
    sentimentScore: 79,
    confidence: 97.6,
    slug: "googl-2024",
  },
  {
    id: "8",
    ticker: "AMZN",
    company: "Amazon.com, Inc.",
    reportType: "Quarterly Report (10-Q)",
    date: "Sep 25, 2024",
    sentiment: "bullish",
    sentimentScore: 81,
    confidence: 96.9,
    slug: "amzn-q3",
  },
]

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

  const filtered = allReports.filter(
    (r) =>
      r.ticker.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase())
  )

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
          {filtered.map((report) => {
            const config = sentimentConfig[report.sentiment]
            const SentimentIcon = config.icon
            return (
              <Link
                key={report.id}
                href={`/reports/${report.slug}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors group"
              >
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
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
                  <Badge
                    className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold gap-1",
                      config.badge
                    )}
                  >
                    <SentimentIcon className="w-3 h-3" />
                    {config.label}
                  </Badge>
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
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
                </div>
                <div className="md:col-span-1 flex items-center">
                  <span className="text-sm font-mono text-emerald-400">
                    {report.confidence}%
                  </span>
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
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Showing {filtered.length} of {allReports.length} reports
          </span>
        </div>
      </div>
    </AppShell>
  )
}
