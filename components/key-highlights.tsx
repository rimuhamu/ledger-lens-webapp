import { Sparkles } from "lucide-react"

interface Highlight {
  label: string
  value: string
}

interface KeyHighlightsProps {
  highlights: Highlight[]
}

// Helper function to bold important metrics in text
function formatTextWithBoldMetrics(text: string) {
  // Pattern to match: percentages, dollar amounts, and numbers with units
  const pattern = /(\$[\d,]+(?:\.\d+)?\s*(?:million|billion|thousand)?|-?\d+(?:\.\d+)?%|\d+(?:\.\d+)?\s*(?:million|billion|thousand))/gi
  
  const parts = text.split(pattern)
  
  return parts.map((part, index) => {
    if (pattern.test(part)) {
      return <strong key={index} className="font-bold text-foreground">{part}</strong>
    }
    return part
  })
}

export function KeyHighlights({ highlights }: KeyHighlightsProps) {
  return (
    <div className="flex flex-col gap-4">
      {highlights.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-border last:border-0"
        >
          <div className="flex-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {formatTextWithBoldMetrics(item.label)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function KeyHighlightCard({
  text,
}: {
  text: string
}) {

 return (
    <div className="flex items-start gap-3 rounded-lg bg-surface p-4">
      <Sparkles className="w-5 h-5 mt-0.5 shrink-0 text-blue-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {formatTextWithBoldMetrics(text)}
        </p>
      </div>
    </div>
  )
}
