import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedItem {
  title: string
  description: string
  type: "risk" | "growth" | "info"
}

interface IntelligenceFeedProps {
  items: FeedItem[]
}

const typeColors = {
  risk: "bg-blue-400",
  growth: "bg-emerald-400",
  info: "bg-amber-400",
}

export function IntelligenceFeed({ items }: IntelligenceFeedProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          AI Intelligence Feed
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className={cn(
                "w-2 h-2 rounded-full mt-2 shrink-0",
                typeColors[item.type]
              )}
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PortfolioSentimentMap() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Portfolio Sentiment Map
        </h3>
        <span className="text-xs text-muted-foreground">Updated hourly</span>
      </div>

      <div className="flex items-center justify-center gap-8 py-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs text-muted-foreground">72% Bullish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-xs text-muted-foreground">18% Bearish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400" />
          <span className="text-xs text-muted-foreground">10% Neutral</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground italic text-center">
        Financial data visualization active
      </p>
    </div>
  )
}
