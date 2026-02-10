import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Bot } from "lucide-react"

export function AnalysisSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Analysis Results
          </h3>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
          AI Processing
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Processing real-time financial data...
      </p>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-2/5 bg-secondary" />
        <Skeleton className="h-4 w-full bg-secondary" />
        <Skeleton className="h-4 w-full bg-secondary" />
        <Skeleton className="h-4 w-3/4 bg-secondary" />
        <div className="h-4" />
        <Skeleton className="h-4 w-1/2 bg-secondary" />
        <Skeleton className="h-4 w-full bg-secondary" />
        <Skeleton className="h-4 w-4/5 bg-secondary" />
        <div className="h-4" />
        <Skeleton className="h-4 w-1/3 bg-secondary" />
        <Skeleton className="h-4 w-full bg-secondary" />
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-surface p-4">
            <Skeleton className="h-3 w-16 mb-2 bg-secondary" />
            <Skeleton className="h-8 w-24 bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  )
}
