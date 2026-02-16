import { AppShell } from "@/components/app-shell"
import { ReportsClient } from "@/components/reports-client"
import { requireAuth } from "@/lib/auth/server"
import { serverDocumentsAPI, serverAnalysisAPI } from "@/lib/api/server"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"
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
    date: new Date(createdAt).toLocaleDateString('en-GB'),
    sentiment,
    sentimentScore,
    confidence,
    slug: docId,
    isLoading,
  }
}

async function ReportsContent() {
  // Require authentication
  await requireAuth()
  
  // Fetch documents on the server
  const documents = await serverDocumentsAPI.list()
  
  // Fetch all analyses in parallel
  const documentIds = documents.map(doc => doc.document_id)
  const analysisMap = await serverAnalysisAPI.batchGetAnalyses(documentIds)
  
  // Build report data
  const reports: ReportData[] = documents.map((doc) =>
    buildReportFromAnalysis(
      doc.document_id,
      doc.ticker,
      doc.filename,
      doc.created_at,
      analysisMap.get(doc.document_id) ?? null
    )
  )

  return <ReportsClient initialReports={reports} />
}

export default function ReportsPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <ReportsContent />
      </Suspense>
    </AppShell>
  )
}
