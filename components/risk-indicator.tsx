import { Shield, AlertTriangle, ShieldAlert, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { GroundednessMetrics } from "@/lib/api/types"

type RiskLevel = "low" | "moderate" | "high"

interface RiskMetric {
  label: string
  value: string | number
  ratio: number
}

interface RiskIndicatorProps {
  level: RiskLevel
  description: string
  metrics?: RiskMetric[]
  groundednessData?: GroundednessMetrics  // New: Gap analysis data
}


const riskConfig = {
  low: {
    icon: Shield,
    label: "Low Risk",
    bg: "bg-emerald-900/30",
    text: "text-emerald-400",
    border: "border-emerald-800/50",
    bar: "bg-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
  moderate: {
    icon: AlertTriangle,
    label: "Moderate Risk",
    bg: "bg-amber-900/30",
    text: "text-amber-400",
    border: "border-amber-800/50",
    bar: "bg-amber-400",
    iconBg: "bg-amber-500/20",
  },
  high: {
    icon: ShieldAlert,
    label: "High Risk",
    bg: "bg-red-900/30",
    text: "text-red-400",
    border: "border-red-800/50",
    bar: "bg-red-400",
    iconBg: "bg-red-500/20",
  },
}

export function RiskIndicator({ level, description, metrics, groundednessData }: RiskIndicatorProps) {
  const config = riskConfig[level]
  const Icon = config.icon

  // Helper to determine bar color based on individual metric ratio
  const getBarColor = (ratio: number) => {
    if (ratio >= 0.8) return "bg-red-400"     // High
    if (ratio >= 0.4) return "bg-amber-400"   // Moderate
    return "bg-emerald-400"                  // Low
  }

  // Groundedness status colors
  const groundednessStatusConfig = {
    PASS: {
      bg: "bg-emerald-900/30",
      border: "border-emerald-800/50",
      text: "text-emerald-400"
    },
    WARNING: {
      bg: "bg-amber-900/30",
      border: "border-amber-800/50",
      text: "text-amber-400"
    },
    INCOMPLETE: {
      bg: "bg-slate-900/30",
      border: "border-slate-800/50",
      text: "text-slate-400"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg p-4",
          config.bg,
          "border",
          config.border
        )}
      >
        <div>
          <Icon className={cn("w-5 h-5", config.text)} />
        </div>
        <div>
          <p className={cn("font-semibold", config.text)}>{config.label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Hallucination Warning Badge */}
      {groundednessData?.hallucination_risk && (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-800/50 bg-amber-900/20">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-400">Hallucination Risk Detected</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              AI confidence ({(groundednessData.generation_avg * 100).toFixed(0)}%) 
              exceeds document evidence ({(groundednessData.retrieval_avg * 100).toFixed(0)}%) 
              by {(groundednessData.gap * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      )}

      {/* Groundedness Metrics */}
      {groundednessData && (
        <div className={cn(
          "p-3 rounded-lg border",
          groundednessStatusConfig[groundednessData.status].bg,
          groundednessStatusConfig[groundednessData.status].border
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Groundedness</span>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px]",
                groundednessStatusConfig[groundednessData.status].text,
                groundednessStatusConfig[groundednessData.status].border
              )}
            >
              {groundednessData.status}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">
            {groundednessData.status_reason}
          </p>
          
          {/* R and G metrics */}
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Retrieval Quality (R)</span>
                <span className="font-mono font-medium text-foreground">
                  {(groundednessData.retrieval_avg * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary/70 transition-all duration-700"
                  style={{ width: `${groundednessData.retrieval_avg * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">AI Certainty (G)</span>
                <span className="font-mono font-medium text-foreground">
                  {(groundednessData.generation_avg * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary/70 transition-all duration-700"
                  style={{ width: `${groundednessData.generation_avg * 100}%` }}
                />
              </div>
            </div>

            {/* Gap indicator */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Confidence Gap</span>
                <span className={cn(
                  "font-mono font-medium",
                  groundednessData.gap > 0.15 ? "text-amber-400" : "text-emerald-400"
                )}>
                  {groundednessData.gap > 0 ? '+' : ''}{(groundednessData.gap * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    groundednessData.gap > 0.15 ? "bg-amber-400" : "bg-emerald-400"
                  )}
                  style={{ width: `${Math.abs(groundednessData.gap) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="flex flex-col gap-3">
          {metrics.map((metric) => {
            // Calculate width and color per metric
            const isHigh = metric.ratio >= 0.8;
            const barWidth = isHigh ? "100%" : `${Math.min(metric.ratio * 100, 100)}%`;
            const barColor = getBarColor(metric.ratio);

            return (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <span className="text-sm font-mono font-medium text-foreground">
                    {metric.value}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out", barColor)}
                    style={{ width: barWidth }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}