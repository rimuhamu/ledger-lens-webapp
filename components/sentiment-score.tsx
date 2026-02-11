"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SentimentScoreProps {
  score: number
  label?: string
  description?: string
  size?: number
  trend?: string
}

function getScoreColor(score: number) {
  if (score <= 30) return { stroke: "#EF4444", text: "text-red-400", label: "BEARISH" }
  if (score <= 55) return { stroke: "#F59E0B", text: "text-amber-400", label: "NEUTRAL" }
  if (score <= 75) return { stroke: "#3B82F6", text: "text-blue-400", label: "MODERATE" }
  return { stroke: "#10B981", text: "text-emerald-400", label: "BULLISH" }
}

export function SentimentScore({
  score,
  label,
  description,
  size = 140,
}: SentimentScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const { stroke, text, label: sentimentLabel } = getScoreColor(score)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-label={`Sentiment score: ${score} out of 100`}
          role="img"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(224 20% 18%)"
            strokeWidth={8}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono text-foreground">
            {animatedScore}
            <span className="text-lg">%</span>
          </span>
          <span className={cn("text-xs font-semibold uppercase tracking-wider", text)}>
            {label || sentimentLabel}
          </span>
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground text-center max-w-[200px] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
