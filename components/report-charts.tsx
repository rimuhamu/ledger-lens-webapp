"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import { TrendingUp, PieChartIcon } from "lucide-react"

const nimData = [
  { year: "2019", value: 3.8 },
  { year: "2020", value: 4.1 },
  { year: "2021", value: 4.5 },
  { year: "2022", value: 4.9 },
  { year: "2023", value: 5.1 },
  { year: "2024", value: 5.4 },
]

const revenueMixData = [
  { name: "Interest Income", value: 75 },
  { name: "Fee Based", value: 25 },
]

const pieColors = ["#3B82F6", "#4B5563"]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-card border border-border px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-mono font-semibold text-foreground">
          {payload[0].value}%
        </p>
      </div>
    )
  }
  return null
}

export function ReportCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* NIM Trend Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            NIM Trend
          </h3>
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nimData} barCategoryGap="25%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 7]}
                hide
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {nimData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === nimData.length - 1 ? "#3B82F6" : "#1E3A5F"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Mix Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Revenue Mix
          </h3>
          <PieChartIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {revenueMixData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-mono"
                  fontSize={18}
                  fontWeight={700}
                >
                  75%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3">
            {revenueMixData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: pieColors[i] }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
