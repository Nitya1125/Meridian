"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import MetricCard from '@/components/MetricCard'
import {
  BarChartIcon, TrendingUpIcon, UsersIcon, ClockIcon,
  ChevronDownIcon, ArrowUpRightIcon, DownloadIcon, FilterIcon,
  ShareIcon, CheckCircleIcon, ZapIcon, ClipboardIcon, TargetIcon, RocketIcon
} from '@/components/Icons'
import { Timer, Flame, OctagonAlert, Gauge } from 'lucide-react'
import { PASTEL } from '@/Lib/meridianTheme'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'

// ─── Burndown Data ──────────────────────────────────────────────────────────
const BURNDOWN = [
  { d: "W1", ideal: 100, actual: 100 },
  { d: "W2", ideal: 83, actual: 88 },
  { d: "W3", ideal: 66, actual: 71 },
  { d: "W4", ideal: 50, actual: 52 },
  { d: "W5", ideal: 33, actual: 30 },
  { d: "W6", ideal: 16, actual: 14 },
  { d: "W7", ideal: 0, actual: 4 },
]

const VELOCITY = [32, 38, 29, 44, 41, 48, 42, 51]

const DIST = [
  { label: "Design", v: 34, tint: "lavender" },
  { label: "Dev", v: 41, tint: "sky" },
  { label: "QA", v: 15, tint: "mint" },
  { label: "Research", v: 10, tint: "peach" },
]

// 7 cols (days) x 5 rows (weeks) of activity intensity 0-4
const HEAT = [
  [1, 2, 0, 3, 2, 1, 0],
  [2, 3, 4, 2, 3, 1, 0],
  [0, 1, 2, 4, 3, 2, 1],
  [1, 4, 3, 2, 4, 2, 0],
  [2, 3, 4, 3, 4, 1, 0],
]
const HEAT_TINTS = ["#f1efe9", "#dcedc8", "#bef264", "#a3e635", "#84cc16"]
const DOW = ["M", "T", "W", "T", "F", "S", "S"]

// ─── Interactive SVG Burndown Line Chart ─────────────────────────────────────
function BurndownChart() {
  const w = 620, h = 210, pad = 14
  const [hover, setHover] = useState(null)
  const x = (i) => pad + (i / (BURNDOWN.length - 1)) * (w - pad * 2)
  const y = (v) => pad + (1 - v / 100) * (h - pad * 2)
  const path = (key) =>
    BURNDOWN.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[key])}`).join(" ")
  const area = `${path("actual")} L${x(BURNDOWN.length - 1)},${h - pad} L${x(0)},${h - pad} Z`
  const hp = hover !== null ? BURNDOWN[hover] : null

  return (
    <div className="relative pt-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full overflow-visible">
        <defs>
          <linearGradient id="burnfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line
              x1={pad}
              x2={w - pad}
              y1={y(g)}
              y2={y(g)}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
            <text
              x={0}
              y={y(g) + 3}
              className="stat-number font-mono"
              fontSize="9"
              fontWeight="700"
              fill="#a8a29e"
            >
              {g}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#burnfill)" />
        <path
          d={path("ideal")}
          fill="none"
          stroke="#d6d3d1"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
        <path
          d={path("actual")}
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={pad}
            y2={h - pad}
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.6"
          />
        )}
        {BURNDOWN.map((p, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(p.actual)}
            r={hover === i ? 6 : 4}
            fill="#fff"
            stroke="#a855f7"
            strokeWidth="2.5"
            className="transition-all"
          />
        ))}
        {BURNDOWN.map((_, i) => (
          <rect
            key={i}
            x={x(i) - w / BURNDOWN.length / 2}
            y={0}
            width={w / BURNDOWN.length}
            height={h}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hp && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-xl bg-[#111318] px-3 py-1.5 text-white shadow-xl z-20 border border-white/10"
          style={{ left: `${(x(hover) / w) * 100}%`, top: 0 }}
        >
          <div className="tech-badge text-[8px] text-lime-400 font-mono">{hp.d}</div>
          <div className="stat-number text-[12px] font-extrabold">{hp.actual} pts remaining</div>
        </div>
      )}
    </div>
  )
}

// ─── Interactive SVG Donut Chart ────────────────────────────────────────────
function DonutChart() {
  const total = DIST.reduce((s, d) => s + d.v, 0)
  const [active, setActive] = useState(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  const size = 168,
    R = 66,
    SW = 20,
    C = 2 * Math.PI * R,
    GAP = 0.02
  const segs = useMemo(() => {
    return DIST.map((d, i) => {
      const frac = d.v / total
      const dash = Math.max(frac - GAP, 0.001) * C
      const prevSum = DIST.slice(0, i).reduce((acc, curr) => acc + (curr.v / total), 0)
      const rot = prevSum * 360 - 90
      return { d, i, dash, rot }
    })
  }, [total, C, GAP])
  const sel = active !== null ? DIST[active] : null
  const selPct = sel ? Math.round((sel.v / total) * 100) : 100

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        onMouseLeave={() => setActive(null)}
      >
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={R}
            fill="none"
            stroke="#f4f0e6"
            strokeWidth={SW}
          />
          {segs.map(({ d, i, dash, rot }) => {
            const on = active === i
            const dim = active !== null && !on
            return (
              <circle
                key={d.label}
                className="donut-seg cursor-pointer"
                cx={size / 2}
                cy={size / 2}
                r={R}
                fill="none"
                stroke={PASTEL[d.tint].solid}
                strokeWidth={on ? SW + 6 : SW}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                strokeDashoffset={mounted ? 0 : C}
                opacity={dim ? 0.28 : 1}
                transform={`rotate(${rot} ${size / 2} ${size / 2})`}
                style={{
                  "--dash-len": `${C}px`,
                  "--dash-to": "0px",
                  animationDelay: `${i * 120}ms`,
                  filter: on ? "drop-shadow(0 4px 10px rgba(0,0,0,0.14))" : "none",
                }}
                onMouseEnter={() => setActive(i)}
              />
            )
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div key={active ?? "all"} className="count-pop">
            <div
              className="stat-number text-[32px] font-extrabold leading-none tracking-tight"
              style={{ color: sel ? PASTEL[sel.tint].solid : "#1c1917" }}
            >
              {selPct}%
            </div>
            <div className="tech-badge mt-1 text-[9px] text-stone-400 font-mono">
              {sel ? sel.label : "Total tasks"}
            </div>
            {sel && (
              <div className="stat-number mt-0.5 text-[11px] font-bold text-stone-500">
                {sel.v} of {total}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex-1 space-y-1.5">
        {DIST.map((d, i) => {
          const on = active === i
          const pct = Math.round((d.v / total) * 100)
          return (
            <button
              key={d.label}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="tactile flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors cursor-pointer"
              style={{ background: on ? PASTEL[d.tint].bg : "transparent" }}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full transition-transform"
                style={{
                  background: PASTEL[d.tint].solid,
                  transform: on ? "scale(1.3)" : "scale(1)",
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-stone-700">{d.label}</span>
                  <span
                    className="stat-number text-[12.5px] font-extrabold"
                    style={{ color: on ? PASTEL[d.tint].text : "#1c1917" }}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: PASTEL[d.tint].solid,
                      opacity: active === null || on ? 1 : 0.35,
                    }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { fullName, initials } = useCurrentUser()
  const [timeRange, setTimeRange] = useState("30d")
  const maxVel = Math.max(...VELOCITY)

  const memberVelocity = [
    { name: fullName || "Alex Johnson", role: "Design Lead", tasks: 42, color: "#8b5cf6", initials: initials || "AJ" },
    { name: "Marcus Chen", role: "Full Stack Engineer", tasks: 38, color: "#6366f1", initials: "MC" },
    { name: "Elena Vance", role: "Security Architect", tasks: 31, color: "#10b981", initials: "EV" },
    { name: "Sophia Aris", role: "UI Engineer", tasks: 29, color: "#f43f5e", initials: "SA" },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          <DynamicHeader
            onOpenNewTask={() => toast.success("Analytics report downloaded")}
            onOpenSearch={() => {
              const evt = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Page Title & Range Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900 lg:text-[38px]">
                Sprint <span className="font-serif-italic font-normal text-violet-700">telemetry</span>
              </h1>
              <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">
                Velocity, burndown & throughput across the org.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.success("Exporting CSV & PDF...")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
              >
                <DownloadIcon size={13} />
                <span>Export Report</span>
              </button>

              <div className="inline-flex rounded-full bg-stone-200/70 p-1">
                {[
                  ["7d", "7 days"],
                  ["30d", "30 days"],
                  ["90d", "90 days"],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTimeRange(val)}
                    className={`tactile rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                      timeRange === val
                        ? "bg-[#111318] text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 1. Bento Stat Tiles with Mini Sparklines ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <MetricCard
              icon={Gauge}
              badge="+8.2% surge"
              value="42 pts"
              label="Sprint Velocity"
              theme="lime"
            />
            <MetricCard
              icon={Timer}
              badge="-12% cycle drop"
              value="2.4 days"
              label="Avg Cycle Time"
              theme="sky"
            />
            <MetricCard
              icon={Flame}
              badge="+20% vs target"
              value="137 tasks"
              label="Total Throughput"
              theme="purple"
            />
            <MetricCard
              icon={OctagonAlert}
              badge="+2 resolved"
              value="6 blocked"
              label="Blocker Clearance"
              theme="amber"
            />
          </div>

          {/* ── 2. Middle Row: Burndown Line Chart & Interactive Donut ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
            <div className="bento-card p-6 sm:p-7 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">
                      Sprint <span className="font-serif-italic font-normal text-stone-500">burndown</span>
                    </h2>
                    <p className="text-xs font-medium text-stone-400 mt-0.5">
                      4 pts ahead of ideal trajectory · on track to close early
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-stone-700">
                      <span className="h-2.5 w-4 rounded-full bg-[#a855f7]" />
                      Actual
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <span className="h-2.5 w-4 rounded-full border-b-2 border-dashed border-stone-300" />
                      Ideal
                    </span>
                  </div>
                </div>

                <BurndownChart />

                <div className="mt-2 flex justify-between px-3 text-[10px] font-bold text-stone-400 font-mono">
                  {BURNDOWN.map((p) => (
                    <span key={p.d}>{p.d}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Current status: <strong className="text-stone-900">Sprint 24 · Week 5</strong></span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                  96% Burndown Accuracy
                </span>
              </div>
            </div>

            {/* Right: Work Distribution Interactive Donut */}
            <div className="bento-card p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900 mb-1">
                  Work <span className="font-serif-italic font-normal text-stone-500">distribution</span>
                </h2>
                <p className="text-xs font-medium text-stone-400 mb-6">Resource effort by space category</p>
                <DonutChart />
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Active Spaces</span>
                <span className="font-bold text-stone-900 font-mono">4 spaces</span>
              </div>
            </div>
          </div>

          {/* ── 3. Weekly Velocity Histogram & 5-Week Activity Map ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">
            {/* Weekly Velocity Bars */}
            <div className="bento-card p-6 sm:p-7 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">
                      Weekly <span className="font-serif-italic font-normal text-stone-500">velocity</span>
                    </h2>
                    <p className="text-xs font-medium text-stone-400 mt-0.5">Throughput across consecutive sprints</p>
                  </div>
                  <span className="stat-number text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2.5 py-1 rounded-full">
                    Avg {Math.round(VELOCITY.reduce((a, b) => a + b, 0) / VELOCITY.length)} pts / sprint
                  </span>
                </div>

                <div className="flex h-44 items-end gap-3 pt-6 pb-2 border-b border-stone-100">
                  {VELOCITY.map((v, i) => {
                    const last = i === VELOCITY.length - 1
                    return (
                      <div key={i} className="group flex flex-1 flex-col items-center gap-2 cursor-pointer">
                        <span className="stat-number text-[11px] font-extrabold text-stone-600 opacity-0 transition-opacity group-hover:opacity-100 font-mono">
                          {v}
                        </span>
                        <div className="flex w-full flex-1 items-end">
                          <div
                            className="bar-grow w-full rounded-lg transition-all group-hover:brightness-95 shadow-xs"
                            style={{
                              height: `${(v / maxVel) * 100}%`,
                              background: last ? "#84cc16" : "#e7e5e4",
                              animationDelay: `${i * 45}ms`,
                            }}
                          />
                        </div>
                        <span className="stat-number text-[10px] font-bold text-stone-400 font-mono">
                          S{i + 1}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Peak Sprint: <strong>S8 (51 pts)</strong></span>
                <span className="text-lime-700 font-bold font-mono">+18% Velocity Trend</span>
              </div>
            </div>

            {/* 5-Week Activity Map (Heatmap) */}
            <div className="bento-card p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900 mb-1">
                  Activity <span className="font-serif-italic font-normal text-stone-500">map</span>
                </h2>
                <p className="text-xs font-medium text-stone-400 mb-5">Commits & task completions, last 5 weeks</p>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex gap-1.5 pl-6">
                    {DOW.map((d, i) => (
                      <span key={i} className="w-6 text-center text-[9px] font-bold text-stone-400 font-mono">
                        {d}
                      </span>
                    ))}
                  </div>
                  {HEAT.map((week, wi) => (
                    <div key={wi} className="flex items-center gap-1.5">
                      <span className="w-4 text-[8px] font-bold text-stone-400 font-mono">
                        {5 - wi}w
                      </span>
                      {week.map((lvl, di) => (
                        <span
                          key={di}
                          className="h-6 w-6 rounded-md transition-transform hover:scale-115 cursor-pointer shadow-2xs"
                          style={{ background: HEAT_TINTS[lvl] }}
                          title={`Week ${5 - wi}, Day ${di + 1}: ${lvl * 3} actions`}
                        />
                      ))}
                    </div>
                  ))}
                  <div className="mt-3 flex items-center gap-1.5 self-end text-[9px] font-bold text-stone-400 font-mono">
                    <span>Less</span>
                    {HEAT_TINTS.map((c) => (
                      <span key={c} className="h-3 w-3 rounded-xs" style={{ background: c }} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Total logged</span>
                <span className="font-bold text-stone-900 font-mono">82 actions</span>
              </div>
            </div>
          </div>

          {/* ── 4. Top Contributors Leaderboard ── */}
          <div className="bento-card p-6 sm:p-7 mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">
                  Top <span className="font-serif-italic font-normal text-stone-500">contributors</span>
                </h2>
                <p className="text-xs font-medium text-stone-400 mt-0.5">Sprint throughput ranking and output</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-mono">
                Sprint 24 Leaderboard
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {memberVelocity.map((m, i) => {
                const max = memberVelocity[0].tasks
                return (
                  <div
                    key={m.name}
                    className="flex items-center gap-3 rounded-2xl bg-stone-50/80 p-3.5 border border-stone-200/60 hover:bg-stone-100/80 transition-colors"
                  >
                    <span
                      className="stat-number flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
                      style={{
                        background: i === 0 ? PASTEL.gold.bg : "#fff",
                        color: i === 0 ? PASTEL.gold.text : "#a8a29e",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white shadow-2xs"
                      style={{ background: m.color }}
                    >
                      {m.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-bold text-stone-900">{m.name}</div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(m.tasks / max) * 100}%`,
                            background: m.color,
                          }}
                        />
                      </div>
                    </div>
                    <span className="stat-number text-[15px] font-extrabold text-stone-900 ml-1">
                      {m.tasks}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}