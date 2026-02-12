import Link from "next/link"
import { Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Sentiment = "bullish" | "bearish" | "neutral"

interface AnalysisCardProps {
  ticker: string
  company: string
  reportType: string
  sentimentScore: number
  sentiment: Sentiment
  date: string
  href?: string
}

const sentimentConfig = {
  bullish: {
    label: "BULLISH",
    badge: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30",
    bar: "bg-emerald-400",
  },
  bearish: {
    label: "BEARISH",
    badge: "bg-red-900/30 text-red-400 border-red-800/50 hover:bg-red-900/30",
    bar: "bg-red-400",
  },
  neutral: {
    label: "NEUTRAL",
    badge: "bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-700/50",
    bar: "bg-slate-400",
  },
}

export function AnalysisCard({
  ticker,
  company,
  reportType,
  sentimentScore,
  sentiment,
  date,
  href = "#",
}: AnalysisCardProps) {
  const config = sentimentConfig[sentiment]

  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 block"
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-xl font-bold text-foreground">{ticker}</h4>
        <Badge
          className={cn(
            "text-[10px] uppercase tracking-wider font-semibold",
            config.badge
          )}
        >
          {config.label}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {company} - {reportType}
      </p>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Sentiment Score</span>
        <span
          className={cn(
            "text-sm font-mono font-semibold",
            sentiment === "bullish"
              ? "text-emerald-400"
              : sentiment === "bearish"
                ? "text-red-400"
                : "text-foreground"
          )}
        >
          {sentimentScore}/100
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            config.bar
          )}
          style={{ width: `${sentimentScore}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{date}</span>
        </div>
        <User className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  )
}

export function NewAnalysisCard() {
  return (
    <Link
      href="/upload"
      className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card/50 p-8 transition-all hover:border-primary/40 hover:bg-card"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-xl border border-border bg-surface group-hover:bg-primary/10 transition-colors">
        <svg
          className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">New Analysis</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
          Upload Annual Report
        </p>
      </div>
    </Link>
  )
}
