"use client"

import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { TokenConfidence } from "@/lib/api/types"

interface ConfidenceHeatmapProps {
  text: string
  tokenConfidences?: TokenConfidence[]
  className?: string
}

/**
 * Renders text with background highlighting based on token confidence levels
 * Lower confidence = more highlighted (warning color)
 */
export function ConfidenceHeatmap({ text, tokenConfidences, className }: ConfidenceHeatmapProps) {
  // If no token confidence data, display plain text
  if (!tokenConfidences || tokenConfidences.length === 0) {
    return <div className={cn("text-sm text-muted-foreground", className)}>{text}</div>
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("text-sm leading-relaxed", className)}>
        {tokenConfidences.map((tokenData, index) => {
          const probability = tokenData.probability
          
          // Calculate background opacity: lower probability = more visible highlight
          // Using amber/yellow color for low confidence warnings
          const opacity = 1 - probability
          const backgroundColor = `rgba(234, 179, 8, ${opacity * 0.6})` // Amber color with scaled opacity
          
          // Determine text color based on confidence
          const textColor = probability < 0.5 
            ? "text-foreground font-medium" // High contrast for very low confidence
            : "text-foreground"

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "inline-block transition-colors cursor-help rounded-sm px-0.5",
                    textColor
                  )}
                  style={{ backgroundColor }}
                >
                  {tokenData.token}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-xs">Token: "{tokenData.token}"</p>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className={cn(
                      "font-mono font-medium",
                      probability > 0.9 ? "text-emerald-400" :
                      probability > 0.7 ? "text-amber-400" :
                      "text-red-400"
                    )}>
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">Log Prob:</span>
                    <span className="font-mono">{tokenData.logprob.toFixed(3)}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

/**
 * Legend component explaining the heatmap color coding
 */
export function ConfidenceHeatmapLegend() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border">
      <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="text-xs text-muted-foreground">
        <p className="font-semibold mb-1">Confidence Heatmap</p>
        <p>
          Text is highlighted based on AI confidence. 
          <span className="inline-block mx-1 px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(234, 179, 8, 0.5)" }}>
            Brighter highlighting
          </span> 
          indicates lower confidence tokens that may require review.
        </p>
      </div>
    </div>
  )
}
