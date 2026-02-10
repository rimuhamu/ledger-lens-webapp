import { TrendingUp, BarChart3, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Highlight {
  label: string
  value: string
  trend?: "up" | "down" | "neutral"
}

interface KeyHighlightsProps {
  highlights: Highlight[]
}

function MiniSparkline({ trend }: { trend: "up" | "down" | "neutral" }) {
  const color =
    trend === "up"
      ? "stroke-emerald-400"
      : trend === "down"
        ? "stroke-red-400"
        : "stroke-blue-400"

  const path =
    trend === "up"
      ? "M 0 20 Q 10 18 20 15 T 40 8 T 60 3"
      : trend === "down"
        ? "M 0 3 Q 10 5 20 10 T 40 15 T 60 20"
        : "M 0 12 Q 15 8 30 12 T 60 12"

  return (
    <svg width="60" height="24" viewBox="0 0 60 24" aria-hidden="true">
      <path
        d={path}
        fill="none"
        className={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function KeyHighlights({ highlights }: KeyHighlightsProps) {
  return (
    <div className="flex flex-col gap-4">
      {highlights.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-border last:border-0"
        >
          <div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-xl font-bold font-mono text-foreground">
              {item.value}
            </p>
          </div>
          {item.trend && <MiniSparkline trend={item.trend} />}
        </div>
      ))}
    </div>
  )
}

export function KeyHighlightCard({
  icon,
  text,
  metric,
  color = "blue",
}: {
  icon: "growth" | "chart" | "sparkle"
  text: string
  metric?: string
  color?: "green" | "blue" | "purple" | "orange"
}) {
  const icons = {
    growth: TrendingUp,
    chart: BarChart3,
    sparkle: Sparkles,
  }
  const colors = {
    green: "text-emerald-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    orange: "text-amber-400",
  }

  const Icon = icons[icon]

  return (
    <div className="flex items-start gap-3 rounded-lg bg-surface p-4">
      <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", colors[color])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        {metric && (
          <span className="inline-flex mt-2 px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-semibold font-mono">
            {metric}
          </span>
        )}
      </div>
    </div>
  )
}
