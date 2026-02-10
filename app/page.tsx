"use client"

import Link from "next/link"
import { FileText, Clock, Sparkles, Search, Upload } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { AnalysisCard, NewAnalysisCard } from "@/components/analysis-card"
import {
  IntelligenceFeed,
  PortfolioSentimentMap,
} from "@/components/intelligence-feed"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const recentAnalyses = [
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    reportType: "FY 2023",
    sentimentScore: 84,
    sentiment: "bullish" as const,
    date: "OCT 24, 2023",
    href: "/reports/aapl-2023",
  },
  {
    ticker: "TSLA",
    company: "Tesla, Inc.",
    reportType: "Q3 Report",
    sentimentScore: 52,
    sentiment: "neutral" as const,
    date: "OCT 22, 2023",
    href: "/reports/tsla-q3",
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    reportType: "Quarterly",
    sentimentScore: 92,
    sentiment: "bullish" as const,
    date: "OCT 20, 2023",
    href: "/reports/nvda-q3",
  },
  {
    ticker: "META",
    company: "Meta Platforms",
    reportType: "Annual",
    sentimentScore: 28,
    sentiment: "bearish" as const,
    date: "OCT 18, 2023",
    href: "/reports/meta-2023",
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corp.",
    reportType: "10-K",
    sentimentScore: 76,
    sentiment: "bullish" as const,
    date: "OCT 15, 2023",
    href: "/reports/msft-10k",
  },
]

const feedItems = [
  {
    title: "Potential Risk Detected in AAPL",
    description:
      "Section 7 (Risk Factors) shows a 14% increase in supply chain mentions compared to 2022.",
    type: "risk" as const,
  },
  {
    title: "NVDA Growth Projections",
    description:
      "AI models indicate strong correlation between AI R&D spend and forward EPS growth.",
    type: "growth" as const,
  },
]

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground text-balance">
              Welcome back, Alex
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
            title="Total Reports Processed"
            value="1,284"
            icon={FileText}
            badge={{ text: "+12% vs LY", variant: "success" }}
          />
          <StatCard
            title="Last Analysis"
            value="14 minutes ago"
            icon={Clock}
            badge={{ text: "Real-time" }}
          />
          <StatCard
            title="AI Accuracy Score"
            value="98.4%"
            icon={Sparkles}
            badge={{ text: "Optimal", variant: "success" }}
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground">
              Recent Analyses
            </h2>
            <Link
              href="/reports"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAnalyses.map((analysis) => (
              <AnalysisCard key={analysis.ticker} {...analysis} />
            ))}
            <NewAnalysisCard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IntelligenceFeed items={feedItems} />
          <PortfolioSentimentMap />
        </div>
      </div>
    </AppShell>
  )
}
