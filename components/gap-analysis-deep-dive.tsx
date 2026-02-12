"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, FileText } from "lucide-react"
import { ConfidenceHeatmap, ConfidenceHeatmapLegend } from "./confidence-heatmap"
import type { TokenConfidence } from "@/lib/api/types"

interface GapAnalysisDeepDiveProps {
  answer: string
  tokenConfidences?: TokenConfidence[]
  retrievedSources?: string[]
  className?: string
}

/**
 * Interactive deep dive component for gap analysis
 * Features:
 * 1. Source highlighting on click
 * 2. Confidence heatmap for text
 * 3. Verification toggle for high-confidence sentences
 */
export function GapAnalysisDeepDive({
  answer,
  tokenConfidences,
  retrievedSources,
  className
}: GapAnalysisDeepDiveProps) {
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(null)
  const [showOnlyHighConfidence, setShowOnlyHighConfidence] = useState(false)

  // Filter tokens to only show high confidence ones (> 0.9) when toggle is active
  const filteredTokens = tokenConfidences && showOnlyHighConfidence
    ? tokenConfidences.filter(t => t.probability > 0.9)
    : tokenConfidences

  // Split answer into sentences for high-confidence filtering
  const sentences = answer.split(/(?<=[.!?])\s+/)
  
  // Calculate confidence for each sentence
  const sentenceConfidences = sentences.map(sentence => {
    if (!tokenConfidences) return { sentence, avgConfidence: 1 }
    
    // Find tokens that belong to this sentence (simplified approach)
    const sentenceTokens = tokenConfidences.filter(t => 
      sentence.toLowerCase().includes(t.token.toLowerCase())
    )
    
    if (sentenceTokens.length === 0) return { sentence, avgConfidence: 1 }
    
    const avgConfidence = sentenceTokens.reduce((sum, t) => sum + t.probability, 0) / sentenceTokens.length
    return { sentence, avgConfidence }
  })

  // Filter to high-confidence sentences when toggle is active
  const displayText = showOnlyHighConfidence
    ? sentenceConfidences
        .filter(s => s.avgConfidence > 0.9)
        .map(s => s.sentence)
        .join(' ')
    : answer

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">Deep Dive Analysis</h4>
        </div>
        
        {tokenConfidences && tokenConfidences.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyHighConfidence(!showOnlyHighConfidence)}
            className="text-xs"
          >
            {showOnlyHighConfidence ? (
              <>
                <Eye className="w-3 h-3 mr-1.5" />
                Show All
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 mr-1.5" />
                High Confidence Only
              </>
            )}
          </Button>
        )}
      </div>

      {/* Verification Toggle Info */}
      {showOnlyHighConfidence && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-900/20 border border-emerald-800/50">
          <Eye className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-emerald-400">
            Showing only sentences with high AI confidence (&gt;90%). 
            This helps you focus on well-supported claims.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Answer with Confidence Heatmap */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Answer Text
            </h5>
            {tokenConfidences && tokenConfidences.length > 0 && <ConfidenceHeatmapLegend />}
          </div>
          
          {tokenConfidences && tokenConfidences.length > 0 ? (
            <ConfidenceHeatmap 
              text={displayText}
              tokenConfidences={filteredTokens}
              className="mt-3"
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayText}
            </p>
          )}
        </div>

        {/* Retrieved Sources */}
        {retrievedSources && retrievedSources.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Retrieved Sources ({retrievedSources.length})
            </h5>
            <p className="text-xs text-muted-foreground">
              Click on a source to explore which parts of the answer were derived from it.
            </p>
            
            <div className="grid gap-2">
              {retrievedSources.map((source, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSourceIndex(
                    selectedSourceIndex === index ? null : index
                  )}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-all",
                    selectedSourceIndex === index
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Source {index + 1}
                    </Badge>
                    {selectedSourceIndex === index && (
                      <Badge className="bg-primary/20 text-primary border-primary/50 text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {source}
                  </p>
                </button>
              ))}
            </div>

            {selectedSourceIndex !== null && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Future Enhancement:</strong> Source-to-answer highlighting will map 
                  which parts of the answer text were derived from Source {selectedSourceIndex + 1}. 
                  This requires additional metadata from the backend tracking token-to-source attribution.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
