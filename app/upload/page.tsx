"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { FileUploadZone } from "@/components/file-upload-zone"
import { AnalysisProgress } from "@/components/analysis-progress"
import { useAnalysisProgress } from "@/hooks/use-analysis-progress"
import { documentsAPI, analysisAPI } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles, FileText, ArrowRight } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null)
  
  // Start polling once we have a document ID
  const { status } = useAnalysisProgress({
    documentId: uploadedDocumentId || '',
    enabled: !!uploadedDocumentId,
    onComplete: () => {
      toast.success("Analysis complete! Redirecting...")
      setTimeout(() => {
        router.push(`/reports/${uploadedDocumentId}`)
      }, 1000)
    },
    onError: (error) => {
      toast.error(error.message || "Analysis failed")
    },
  })

  const handleAnalyze = async (file: File | null, ticker: string) => {
    if (!file) {
      toast.error("Please upload a PDF file.")
      return
    }
    if (!ticker) {
      toast.error("Please enter a ticker symbol.")
      return
    }

    setIsUploading(true)

    try {
      toast.info("Uploading document...")
      const uploadResult = await documentsAPI.upload(file, ticker)
      
      toast.info("Starting analysis...")
      
      // Start the background analysis
      analysisAPI.analyze(
        uploadResult.document_id,
        "Provide a comprehensive financial analysis of this document."
      ).catch(err => {
        console.error("Analysis error:", err)
        // Errors will be handled by the progress hook
      })
      
      // Set document ID to trigger progress polling
      setUploadedDocumentId(uploadResult.document_id)
      setIsUploading(false)
      
      toast.success("Document uploaded! Analysis in progress...")
      
    } catch (error: any) {
      console.error("Upload failed:", error)
      toast.error(error.response?.data?.detail || "Upload failed. Please try again.")
      setIsUploading(false)
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
          {/* Show upload zone if not analyzing */}
          {!uploadedDocumentId && !isUploading && (
            <>
              <FileUploadZone onAnalyze={handleAnalyze} isProcessing={isUploading} />
              
              {!isUploading && (
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
            </>
          )}
          
          {/* Show progress component while uploading or analyzing */}
          {(isUploading || uploadedDocumentId) && (
            <AnalysisProgress 
              status={isUploading ? {
                status: 'in_progress',
                current_stage: 'uploading',
                stage_index: 0,
                total_stages: 5,
                message: 'Uploading document...'
              } : (status || {
                status: 'in_progress',
                current_stage: 'uploading',
                stage_index: 0,
                total_stages: 5,
                message: 'Initializing analysis...'
              })} 
            />
          )}
        </div>
      </div>
    </AppShell>
  )
}
