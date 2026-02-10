import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  badge?: {
    text: string
    variant?: "default" | "success" | "warning"
  }
}

const badgeColors = {
  default: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/10",
  success: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30",
  warning: "bg-amber-900/30 text-amber-400 border-amber-800/50 hover:bg-amber-900/30",
}

export function StatCard({ title, value, icon: Icon, badge }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {badge && (
          <Badge
            className={cn(
              "text-[10px] uppercase tracking-wider font-semibold",
              badgeColors[badge.variant || "default"]
            )}
          >
            {badge.text}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground font-mono mt-1">{value}</p>
    </div>
  )
}
