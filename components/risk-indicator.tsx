import { Shield, AlertTriangle, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function RiskIndicator({ level, description, metrics }: RiskIndicatorProps) {
  const config = riskConfig[level]
  const Icon = config.icon

  // Helper to determine bar color based on individual metric ratio
  const getBarColor = (ratio: number) => {
    if (ratio >= 0.8) return "bg-red-400"     // High
    if (ratio >= 0.4) return "bg-amber-400"   // Moderate
    return "bg-emerald-400"                  // Low
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