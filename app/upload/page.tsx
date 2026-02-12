"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { FileUploadZone } from "@/components/file-upload-zone"
import { documentsAPI, analysisAPI } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles, FileText, ArrowRight } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAnalyze = async (file: File | null, ticker: string) => {
    if (!file) {
      toast.error("Please upload a PDF file.")
      return
    }
    if (!ticker) {
      toast.error("Please enter a ticker symbol.")
      return
    }

    setIsProcessing(true)

    try {
      toast.info("Uploading document...")
      const uploadResult = await documentsAPI.upload(file, ticker)
      
      toast.info("Analyzing document... This may take a minute.")
      
      // We start the analysis but redirect immediately after upload/start
      // The analysis page will handle polling or displaying results
      const analysis = await analysisAPI.analyze(
        uploadResult.document_id,
        "Provide a comprehensive financial analysis of this document."
      )
      
      toast.success("Analysis complete! Redirecting...")
      router.push(`/reports/${uploadResult.document_id}`)
      
    } catch (error: any) {
      console.error("Analysis failed:", error)
      toast.error(error.response?.data?.detail || "Analysis failed. Please try again.")
      setIsProcessing(false) // Only stop processing on error, otherwise we redirect
    }
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-12 mt-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-8 ring-primary/5">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            New Financial Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload an annual report (PDF) to generate AI-powered insights, 
            risk assessments, and grounded financial intelligence.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <FileUploadZone onAnalyze={handleAnalyze} isProcessing={isProcessing} />
          
          {!isProcessing && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-semibold mb-2">Smart Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically extracts key financial metrics and KPIs from unstructured text.
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-semibold mb-2">Risk Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Identifies potential risks and red flags hidden in footnotes and disclosures.
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Grounded Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Every AI claim is verifiable with direct citations to the source document.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
