"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { cn } from "@/lib/utils"

interface RetrievalScatterPlotProps {
  retrievalScores: number[]
  className?: string
}

export function RetrievalScatterPlot({ retrievalScores, className }: RetrievalScatterPlotProps) {
  // Transform scores into chart data
  const chartData = retrievalScores.map((score, index) => ({
    name: `C${index + 1}`,  // C1, C2, C3... for chunks
    score: score,
    percentage: Math.round(score * 100)
  }))

  // Determine if this is consensus-based or single-source
  const highQualityCount = retrievalScores.filter(score => score > 0.7).length
  const consensusType = 
    highQualityCount >= 4 ? 'consensus' :
    highQualityCount >= 1 && highQualityCount <= 2 ? 'single-source' :
    'weak'

  const getBarColor = (score: number) => {
    if (score > 0.7) return "hsl(var(--primary))"      // High quality - primary color
    if (score > 0.4) return "hsl(var(--muted))"        // Medium quality - muted
    return "hsl(var(--muted-foreground) / 0.3)"        // Low quality - very faded
  }

  const consensusConfig = {
    consensus: {
      label: "Consensus",
      description: `Strong evidence across ${highQualityCount} sources`,
      color: "text-emerald-400",
      icon: "✓"
    },
    "single-source": {
      label: "Single Source",
      description: `Relying on ${highQualityCount} primary source(s)`,
      color: "text-amber-400",
      icon: "⚠"
    },
    weak: {
      label: "Weak Retrieval",
      description: "Limited source quality",
      color: "text-red-400",
      icon: "✕"
    }
  }

  const config = consensusConfig[consensusType]

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with consensus indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-lg font-semibold", config.color)}>
            {config.icon}
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground">{config.label}</p>
            <p className="text-[10px] text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {retrievalScores.length} chunks
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 1]}
            ticks={[0, 0.5, 1]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '0.5rem',
              fontSize: '12px'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Similarity']}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-primary" />
          <span>High (&gt;70%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-muted" />
          <span>Medium (40-70%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-muted-foreground/30" />
          <span>Low (&lt;40%)</span>
        </div>
      </div>
    </div>
  )
}
