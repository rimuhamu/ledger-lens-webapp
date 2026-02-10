"use client"

import { use } from "react"
import Link from "next/link"
import {
  Share2,
  Download,
  Bell,
  ChevronRight,
  AlertTriangle,
  Truck,
  ShieldCheck,
  Globe,
  ArrowRight,
  FileText,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ReportCharts } from "@/components/report-charts"

const riskFactors = [
  { label: "Geopolitical", severity: "high" as const, icon: Globe },
  { label: "Supply Chain", severity: "med" as const, icon: Truck },
  { label: "Cybersecurity", severity: "low" as const, icon: ShieldCheck },
]

const quickInsights = [
  "Summarize the Data Center segment",
  "Compare with 2023 performance",
  "Break down ESG commitments",
]

const severityConfig = {
  high: {
    badge: "bg-red-900/30 text-red-400 border-red-800/50 hover:bg-red-900/30",
    label: "HIGH",
  },
  med: {
    badge:
      "bg-amber-900/30 text-amber-400 border-amber-800/50 hover:bg-amber-900/30",
    label: "MED",
  },
  low: {
    badge:
      "bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30",
    label: "LOW",
  },
}

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  return (
    <AppShell>
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top bar with breadcrumbs */}
          <div className="flex items-center justify-between h-14">
            <nav
              className="flex items-center gap-1.5 text-sm"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <Link
                href="/reports"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reports
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-foreground font-medium">
                BBCA Annual Report 2024
              </span>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Report Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground text-balance">
              BBCA Annual Report 2024
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Comprehensive Fiscal Analysis & Risk Assessment
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-transparent border-border text-foreground hover:bg-secondary gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Download className="w-4 h-4" />
              Export Analysis
            </Button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Full Analysis */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Analysis Results Card */}
            <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Analysis Results
                  </span>
                  <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30 text-[10px] uppercase tracking-wider font-semibold">
                    Pass
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  Verified by LLM-4o-V2
                </span>
              </div>

              <article className="max-w-none">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Executive Summary
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  The BBCA Annual Report 2024 reflects a period of significant
                  digital acceleration and strategic pivot towards{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    AI-integrated banking services [14]
                  </a>
                  . The institution maintained its market leadership with a Tier
                  1 capital adequacy ratio of 22.4%, surpassing regional
                  benchmarks by 340 basis points.
                </p>

                <h2 className="text-xl font-bold text-foreground mb-4">
                  Financial Performance Metrics
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Net Interest Margin (NIM) expanded slightly to 5.4%, driven by
                  efficient liquidity management despite a volatile interest rate
                  environment. Operating revenue saw an 11.2% YoY increase,
                  primarily bolstered by a{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    15% surge in non-interest income [32]
                  </a>
                  , particularly from its digital transaction ecosystem.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Operating expenses remained well-contained with a
                  Cost-to-Income Ratio (CIR) of 36.8%. The management{"'"}s
                  focus on operational excellence through{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    robotic process automation [45]
                  </a>{" "}
                  has begun yielding significant dividends in back-office
                  efficiency.
                </p>

                <blockquote className="border-l-2 border-primary/50 pl-4 my-6 italic text-muted-foreground text-sm leading-relaxed">
                  {
                    '"Our 2024 strategy was focused on resilience and technological edge. The results validate our commitment to the Data Center expansion, which is now the primary engine for our cloud-native banking platform."'
                  }
                </blockquote>

                <h2 className="text-xl font-bold text-foreground mb-4">
                  Strategic Outlook
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Looking forward to 2025, the organization identifies the{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    Data Center segment [61]
                  </a>{" "}
                  as a critical infrastructure pillar. With the completion of
                  Phase III in Q4 2024, the bank is positioned to offer
                  localized cloud hosting services to regional subsidiaries,
                  potentially opening a new B2B revenue stream.
                </p>
              </article>

              {/* Footer metadata */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border text-xs text-muted-foreground">
                <div>
                  <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
                    Ticker
                  </span>
                  <span className="font-mono text-foreground text-sm">
                    BBCA.JK
                  </span>
                </div>
                <div>
                  <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
                    Analysis Date
                  </span>
                  <span className="text-foreground text-sm">
                    October 24, 2024
                  </span>
                </div>
                <div>
                  <span className="uppercase tracking-wider font-semibold block text-[10px] mb-0.5">
                    Confidence Score
                  </span>
                  <span className="text-emerald-400 text-sm font-semibold">
                    98.4%
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <ReportCharts />
          </div>

          {/* Right Column - Intelligence Hub */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Intelligence Hub
                </h3>
              </div>

              {/* Risk Assessment */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Risk Assessment
                </h4>
                <div className="flex flex-col gap-2">
                  {riskFactors.map((risk) => {
                    const config = severityConfig[risk.severity]
                    const Icon = risk.icon
                    return (
                      <div
                        key={risk.label}
                        className="flex items-center justify-between rounded-lg bg-surface p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {risk.label}
                          </span>
                        </div>
                        <Badge
                          className={`text-[10px] uppercase tracking-wider font-semibold ${config.badge}`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Insights */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Quick Insights
                </h4>
                <div className="flex flex-col gap-2">
                  {quickInsights.map((q) => (
                    <button
                      key={q}
                      className="group flex items-center justify-between w-full rounded-lg border border-primary/20 bg-surface-hover p-3 text-left text-sm text-primary/80 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                  <button className="flex items-center gap-2 w-full rounded-lg bg-surface p-3 text-left text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span className="text-primary">+</span>
                    Ask a custom question...
                  </button>
                </div>
              </div>

              {/* Linked Sources */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Linked Sources
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    3 Sources Found
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Annual_Report_2024.pdf
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Primary Document
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat FAB */}
        <button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center hover:bg-primary/90 transition-colors z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </AppShell>
  )
}
