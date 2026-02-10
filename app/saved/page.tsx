"use client"

import Link from "next/link"
import {
  Bookmark,
  Clock,
  FileText,
  Trash2,
  TrendingUp,
  Star,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const savedItems = [
  {
    id: "1",
    ticker: "AAPL",
    company: "Apple Inc.",
    title: "FY 2023 Annual Report Analysis",
    savedDate: "Oct 24, 2024",
    sentimentScore: 84,
    sentiment: "bullish" as const,
    notes: "Strong growth in Services segment. Key for Q1 2025 investment thesis.",
    slug: "aapl-2023",
  },
  {
    id: "2",
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    title: "Q3 2024 Quarterly Analysis",
    savedDate: "Oct 20, 2024",
    sentimentScore: 92,
    sentiment: "bullish" as const,
    notes: "Data center revenue inflection point. Monitor H200 ramp.",
    slug: "nvda-q3",
  },
  {
    id: "3",
    ticker: "MSFT",
    company: "Microsoft Corporation",
    title: "10-K Deep Dive Analysis",
    savedDate: "Oct 15, 2024",
    sentimentScore: 76,
    sentiment: "bullish" as const,
    notes: "Azure growth trajectory aligns with AI workload projections.",
    slug: "msft-10k",
  },
]

const sentimentBadge = {
  bullish:
    "bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30",
  bearish:
    "bg-red-900/30 text-red-400 border-red-800/50 hover:bg-red-900/30",
  neutral:
    "bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-700/50",
}

export default function SavedPage() {
  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Saved Analyses
            </h1>
            <p className="text-muted-foreground mt-1">
              Your bookmarked reports and analysis notes.
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 text-xs">
            {savedItems.length} Saved
          </Badge>
        </div>

        <div className="flex flex-col gap-4">
          {savedItems.map((item) => (
            <Link
              key={item.id}
              href={`/reports/${item.slug}`}
              className="group rounded-xl border border-border bg-card p-5 lg:p-6 hover:border-primary/30 transition-all block"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground">
                        {item.ticker}
                      </h3>
                      <Badge
                        className={cn(
                          "text-[10px] uppercase tracking-wider font-semibold",
                          sentimentBadge[item.sentiment]
                        )}
                      >
                        {item.sentiment}
                      </Badge>
                      <span className="text-sm font-mono text-muted-foreground">
                        {item.sentimentScore}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.company} - {item.title}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed italic">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 md:shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {item.savedDate}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    aria-label={`Remove ${item.ticker} from saved`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {savedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
              <Bookmark className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No Saved Analyses
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Bookmark your favorite analyses to access them quickly later.
            </p>
            <Button
              asChild
              className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/analysis">Start Analyzing</Link>
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
