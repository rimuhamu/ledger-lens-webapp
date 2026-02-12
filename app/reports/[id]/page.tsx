"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { AnalysisSkeleton } from "@/components/analysis-skeleton"
import { SentimentScore } from "@/components/sentiment-score"
import { RiskIndicator } from "@/components/risk-indicator"
import { KeyHighlights } from "@/components/key-highlights"
import { RetrievalScatterPlot } from "@/components/retrieval-scatter-plot"
import { Sparkles, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { analysisAPI } from "@/lib/api"
import { toast } from "sonner"
import type { AnalysisResponse } from "@/lib/api/types"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { calculateGroundedness } from "@/lib/utils/groundedness"

interface ReportAnalysisPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReportAnalysisPage({ params }: ReportAnalysisPageProps) {
  const { id: documentId } = React.use(params)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)

  // Load existing analysis
  useEffect(() => {
    if (!documentId) return

    const loadAnalysis = async () => {
      setIsProcessing(true)
      try {
        const analysis = await analysisAPI.getAnalysis(documentId)
        
        if (analysis) {
          setAnalysisResult(analysis)
          
          if (!analysis.intelligence_hub) {
            toast.info("Analysis is processing. Some sections may be incomplete.")
          }
        } else {
          toast.error("No analysis data found for this document.")
        }
      } catch (error: any) {
        console.error("Failed to load analysis:", error)
        toast.error("Failed to load analysis. The document may not have been analyzed yet.")
      } finally {
        setIsProcessing(false)
      }
    }

    loadAnalysis()
  }, [documentId])

  const { intelligence_hub } = analysisResult || {}

  // Calculate groundedness metrics
  const groundednessMetrics = useMemo(() => {
    if (!analysisResult?.retrieval_scores || !analysisResult?.generation_logprobs) {
      return null
    }
    
    const result = calculateGroundedness(
      analysisResult.retrieval_scores,
      analysisResult.generation_logprobs
    )

    return {
      retrieval_avg: result.R,
      generation_avg: result.G,
      gap: result.gap,
      status: result.status,
      status_reason: result.statusReason,
      hallucination_risk: result.isHallucinationRisk
    }
  }, [analysisResult])

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Main Content Area */}
        {(isProcessing || analysisResult) && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
            {/* Left Column - Analysis Results (60%) */}
            <div className="lg:col-span-3">
              {isProcessing ? (
                <AnalysisSkeleton />
              ) : (
                <AnalysisResults result={analysisResult!} />
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
                    score={isProcessing ? 0 : intelligence_hub?.sentiment.score || 0}
                    description={intelligence_hub?.sentiment.description || "Analyzing sentiment..."}
                    trend={intelligence_hub?.sentiment.change}
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
                  <KeyHighlights 
                    highlights={(intelligence_hub?.key_highlights || []).map(h => ({
                      label: h.text,
                      value: h.metric_value || "",
                    }))} 
                  />
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
                    level={intelligence_hub?.risk.level.toLowerCase() as any || "low"}
                    description={intelligence_hub?.risk.description || ""}
                    metrics={(intelligence_hub?.risk_factors || []).map(r => ({
                        label: r.name,
                        value: r.severity,
                        ratio: r.severity === 'HIGH' ? 0.9 : r.severity === 'MED' ? 0.5 : 0.2
                    }))}
                    groundednessData={groundednessMetrics || undefined}
                  />
                )}
              </div>

              {/* Retrieval Score Distribution */}
              {!isProcessing && analysisResult?.retrieval_scores && analysisResult.retrieval_scores.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Source Quality Analysis
                    </h3>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <RetrievalScatterPlot retrievalScores={analysisResult.retrieval_scores} />
                </div>
              )}

              {/* AI Confidence & Benchmarking */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    AI Confidence & Benchmarking
                  </h3>
                  {analysisResult?.confidence_metrics?.overall_level && (
                    <Badge variant="outline" className={
                      analysisResult.confidence_metrics.overall_level === 'high' ? "text-emerald-400 border-emerald-800/50 bg-emerald-900/20" :
                      analysisResult.confidence_metrics.overall_level === 'moderate' ? "text-amber-400 border-amber-800/50 bg-amber-900/20" :
                      "text-red-400 border-red-800/50 bg-red-900/20"
                    }>
                      {analysisResult.confidence_metrics.overall_level.toUpperCase()} CONFIDENCE
                    </Badge>
                  )}
                </div>

                {isProcessing ? (
                   <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <div className="h-3 w-20 bg-secondary rounded"/>
                            <div className="h-3 w-10 bg-secondary rounded"/>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full"/>
                        </div>
                      ))}
                   </div>
                ) : (
                  <div className="space-y-5">
                    {(analysisResult?.confidence_metrics?.metrics || []).map((metric, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="font-mono font-medium text-foreground">{metric.value}</span>
                        </div>
                        <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary/70 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(Math.max(metric.ratio * 100, 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {(!analysisResult?.confidence_metrics?.metrics || analysisResult.confidence_metrics.metrics.length === 0) && (
                         <p className="text-sm text-muted-foreground italic text-center py-2">
                            Confidence metrics unavailable for this report.
                         </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isProcessing && !analysisResult && (
          <div className="mt-12 flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Analysis Available
            </h3>
            <p className="text-sm text-muted-foreground">
              This document hasn't been analyzed yet or the analysis data is unavailable.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function AnalysisResults({ result }: { result: AnalysisResponse }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">
            Analysis Results
          </h3>
          <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30 text-[10px] uppercase tracking-wider font-semibold">
            {result.verification_status}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Verified by LedgerLens AI
        </span>
      </div>

      <div className="prose prose-invert max-w-none">
        <h4 className="text-base font-semibold text-foreground mb-3">
          Executive Summary
        </h4>
        <div className="text-sm text-muted-foreground leading-relaxed mb-4 prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground prose-ul:my-4 prose-li:my-1">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
          >
            {result.answer}
          </ReactMarkdown>
        </div>
        
        {/* Suggested Questions */}
        {result.intelligence_hub.suggested_questions?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-base font-semibold text-foreground mb-3">
                    Suggested Follow-up Questions
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                    {result.intelligence_hub.suggested_questions.map((q, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{q}</li>
                    ))}
                </ul>
            </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border mt-6 text-xs text-muted-foreground">
        <div>
          <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
            Document ID
          </span>
          <span className="font-mono text-foreground text-sm">{result.metadata.document_id}</span>
        </div>
        <div>
          <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
            Analysis Date
          </span>
          <span className="text-foreground text-sm">{new Date().toLocaleDateString('en-GB')}</span>
        </div>
      </div>
    </div>
  )
}
