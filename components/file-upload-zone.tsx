"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, FileText, X, Search, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileUploadZoneProps {
  onAnalyze?: (file: File | null, ticker: string) => void
  isProcessing?: boolean
}

export function FileUploadZone({
  onAnalyze,
  isProcessing = false,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [ticker, setTicker] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === "application/pdf") {
      setFile(dropped)
    }
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) setFile(selected)
    },
    []
  )

  const handleAnalyze = () => {
    onAnalyze?.(file, ticker)
  }

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed transition-all duration-300 bg-card",
        isDragOver
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4 px-6 py-10 md:py-12">
        <div
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-full transition-colors",
            isDragOver ? "bg-primary/20" : "bg-primary/10"
          )}
        >
          <Upload
            className={cn(
              "w-6 h-6 transition-colors",
              isDragOver ? "text-primary" : "text-primary/70"
            )}
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Upload Annual Report
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Drag and drop PDF files here, or browse to select files from your
            computer for instant AI-powered financial intelligence.
          </p>
        </div>

        {file ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{file.name}</span>
            <button
              onClick={() => {
                setFile(null)
                if (fileRef.current) fileRef.current.value = ""
              }}
              className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="sr-only"
            id="file-upload"
            onChange={handleFileSelect}
          />
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter Ticker (e.g. MSFT, AAPL)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="pl-9 bg-surface border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Report
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {!file && (
          <label
            htmlFor="file-upload"
            className="text-sm text-primary hover:text-primary/80 cursor-pointer underline-offset-2 hover:underline transition-colors"
          >
            Browse files
          </label>
        )}
      </div>
    </div>
  )
}
