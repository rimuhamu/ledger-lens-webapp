"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { FileUploadZone } from "@/components/file-upload-zone"
import { AnalysisSkeleton } from "@/components/analysis-skeleton"
import { SentimentScore } from "@/components/sentiment-score"
import { RiskIndicator } from "@/components/risk-indicator"
import { KeyHighlights } from "@/components/key-highlights"
import { Sparkles, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockHighlights = [
  { label: "YoY Revenue Growth", value: "+12.4%", trend: "up" as const },
  { label: "Operating Margin", value: "28.0%", trend: "up" as const },
  { label: "Free Cash Flow", value: "$4.2B", trend: "up" as const },
]

const mockRiskMetrics = [
  { label: "Debt/Equity Ratio", value: "0.45", ratio: 0.45 },
  { label: "Current Ratio", value: "2.1", ratio: 0.7 },
]

const suggestedQuestions = [
  "Summarize the Data Center segment",
  "Compare with 2023 performance",
  "Break down ESG commitments",
]

export default function AnalysisPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleAnalyze = () => {
    setIsProcessing(true)
    setShowResults(false)
    setTimeout(() => {
      setIsProcessing(false)
      setShowResults(true)
    }, 3000)
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <FileUploadZone onAnalyze={handleAnalyze} isProcessing={isProcessing} />

        {(isProcessing || showResults) && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
            {/* Left Column - Analysis Results (60%) */}
            <div className="lg:col-span-3">
              {isProcessing ? (
                <AnalysisSkeleton />
              ) : (
                <AnalysisResults />
              )}
            </div>

            {/* Right Column - Intelligence Hub (40%) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Sentiment Score */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                  AI Sentiment Score
                </h3>
                <div className="flex justify-center">
                  <SentimentScore
                    score={isProcessing ? 0 : 84}
                    description="Based on management commentary and outlook sections of the 10-K."
                  />
                </div>
              </div>

              {/* Key Highlights */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Highlights
                  </h3>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                {isProcessing ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 w-24 bg-secondary rounded mb-2" />
                        <div className="h-6 w-20 bg-secondary rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <KeyHighlights highlights={mockHighlights} />
                )}
              </div>

              {/* Risk Level */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Risk Level Indicator
                </h3>
                {isProcessing ? (
                  <div className="animate-pulse">
                    <div className="h-16 bg-secondary rounded-lg mb-4" />
                    <div className="h-3 w-full bg-secondary rounded mb-3" />
                    <div className="h-3 w-3/4 bg-secondary rounded" />
                  </div>
                ) : (
                  <RiskIndicator
                    level="low"
                    description="Financial stability metrics are within safe range."
                    metrics={mockRiskMetrics}
                  />
                )}
              </div>

              {/* AI Insight */}
              {showResults && (
                <div className="rounded-lg bg-emerald-900/20 border border-emerald-800/30 p-4">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-primary">
                      AI Insight:{" "}
                    </span>
                    <span className="text-emerald-300/90">
                      Revenue growth is primarily driven by Cloud Services
                      expansion. Operating leverage remains strong despite
                      increased R&D spending.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!isProcessing && !showResults && (
          <div className="mt-12 flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No Reports Analyzed Yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Upload a PDF annual report to get started with AI-powered
              financial analysis.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function AnalysisResults() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">
            Analysis Results
          </h3>
          <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30 text-[10px] uppercase tracking-wider font-semibold">
            Pass
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Verified by LLM-4o-V2
        </span>
      </div>

      <div className="prose prose-invert max-w-none">
        <h4 className="text-base font-semibold text-foreground mb-3">
          Executive Summary
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The Annual Report 2024 reflects a period of significant digital
          acceleration and strategic pivot towards{" "}
          <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2">
            AI-integrated banking services [14]
          </a>
          . The institution maintained its market leadership with a Tier 1
          capital adequacy ratio of 22.4%, surpassing regional benchmarks by 340
          basis points.
        </p>

        <h4 className="text-base font-semibold text-foreground mb-3">
          Financial Performance Metrics
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Net Interest Margin (NIM) expanded slightly to 5.4%, driven by
          efficient liquidity management despite a volatile interest rate
          environment. Operating revenue saw an 11.2% YoY increase, primarily
          bolstered by a{" "}
          <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2">
            15% surge in non-interest income [32]
          </a>
          , particularly from its digital transaction ecosystem.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Operating expenses remained well-contained with a Cost-to-Income Ratio
          (CIR) of 36.8%. The management{"'"}s focus on operational excellence
          through{" "}
          <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2">
            robotic process automation [45]
          </a>{" "}
          has begun yielding significant dividends in back-office efficiency.
        </p>

        <blockquote className="border-l-2 border-primary/50 pl-4 my-6 italic text-muted-foreground text-sm">
          {
            '"Our 2024 strategy was focused on resilience and technological edge. The results validate our commitment to the Data Center expansion, which is now the primary engine for our cloud-native banking platform."'
          }
        </blockquote>

        <h4 className="text-base font-semibold text-foreground mb-3">
          Strategic Outlook
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Looking forward to 2025, the organization identifies the{" "}
          <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-2">
            Data Center segment [61]
          </a>{" "}
          as a critical infrastructure pillar. With the completion of Phase III
          in Q4 2024, the bank is positioned to offer localized cloud hosting
          services to regional subsidiaries, potentially opening a new B2B
          revenue stream.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border text-xs text-muted-foreground">
        <div>
          <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
            Ticker
          </span>
          <span className="font-mono text-foreground text-sm">BBCA.JK</span>
        </div>
        <div>
          <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
            Analysis Date
          </span>
          <span className="text-foreground text-sm">October 24, 2024</span>
        </div>
        <div>
          <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
            Confidence Score
          </span>
          <span className="text-emerald-400 text-sm font-semibold">98.4%</span>
        </div>
      </div>
    </div>
  )
}
