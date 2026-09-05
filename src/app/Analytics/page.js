"use client"

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import MetricCard from '@/components/MetricCard'
import {
  BarChartIcon, TrendingUpIcon, UsersIcon, ClockIcon,
  ChevronDownIcon, ArrowUpRightIcon, DownloadIcon, FilterIcon,
  ShareIcon, CheckCircleIcon, ZapIcon, ClipboardIcon, TargetIcon, RocketIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const weeklyData = [
  { week: 'W28', completed: 48, added: 32 },
  { week: 'W29', completed: 54, added: 42 },
  { week: 'W30', completed: 68, added: 38 },
  { week: 'W31', completed: 52, added: 54 },
  { week: 'W32', completed: 74, added: 35 },
  { week: 'W33', completed: 62, added: 44 },
  { week: 'W34', completed: 59, added: 48 },
  { week: 'W35', completed: 86, added: 34 },
]

const projectDistribution = [
  { name: 'Publications & Shots', share: 34, color: '#f43f5e', tasks: 28 },
  { name: 'Commercial Portals', share: 22, color: '#8b5cf6', tasks: 18 },
  { name: 'Design Internal', share: 18, color: '#10b981', tasks: 14 },
  { name: 'Mobile App v2', share: 15, color: '#f59e0b', tasks: 12 },
  { name: 'Analytics Core', share: 11, color: '#0ea5e9', tasks: 9 },
]

const memberVelocity = [
  { name: 'Alex Johnson', role: 'Design Lead', pts: 42, target: 35, speed: '120%', avatar: 'AJ', color: '#8b5cf6' },
  { name: 'Sarah Chen', role: 'Full Stack Engineer', pts: 38, target: 35, speed: '108%', avatar: 'SC', color: '#6366f1' },
  { name: 'Marcus Webb', role: 'Security Architect', pts: 31, target: 30, speed: '103%', avatar: 'MW', color: '#10b981' },
  { name: 'Kacie Velasquez', role: 'UI Engineer', pts: 29, target: 28, speed: '104%', avatar: 'KV', color: '#f43f5e' },
  { name: 'Priya Nair', role: 'Backend Lead', pts: 26, target: 25, speed: '104%', avatar: 'PN', color: '#f59e0b' },
]

export default function AnalyticsPage() {
  const { fullName, initials } = useCurrentUser()
  const [timeRange, setTimeRange] = useState('Sprint 14')
  const [hoveredWeek, setHoveredWeek] = useState(null)
  const maxVal = 95

  // Replace first velocity row with real logged-in user
  const velocityData = memberVelocity.map((m, i) =>
    i === 0 ? { ...m, name: fullName || m.name, avatar: initials || m.avatar } : m
  )

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={() => toast.success('Analytics report downloaded')}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Page Title & Range Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif">
                High-throughput <em className="italic font-serif font-normal text-stone-900">Velocity & Insights</em>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
                Real-time throughput velocity, burndown accuracy, and resource allocation across spaces
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success('Exporting CSV & PDF...')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
              >
                <DownloadIcon size={13} />
                <span>Export Report</span>
              </button>

              <button
                onClick={() => toast.success('Filtered range applied')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#111318] text-white text-xs font-bold shadow-xs hover:bg-black transition-all cursor-pointer"
              >
                <span>{timeRange}</span>
                <ChevronDownIcon size={12} />
              </button>
            </div>
          </div>

          {/* Bento KPI Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <MetricCard
              icon={ZapIcon}
              badge="+14% vs 4w avg"
              value="103 pts"
              label="Weekly Velocity"
              theme="purple"
            />
            <MetricCard
              icon={ClockIcon}
              badge="-0.8d reduction"
              value="2.4 days"
              label="Cycle Time"
              theme="amber"
            />
            <MetricCard
              icon={CheckCircleIcon}
              badge="42 PRs merged"
              value="98.2%"
              label="PR Merge Rate"
              theme="sky"
            />
            <MetricCard
              icon={TargetIcon}
              badge="High team morale"
              value="87.4%"
              label="Member Efficiency"
              theme="lime"
            />
          </div>

          {/* Main Chart Grid: Velocity Burn-up + Project Allocation (Ref Image 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-7">

            {/* Left 2 Cols: Sprint Burn-Up Bar Chart (Image 1 Left) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif">
                      Sprint Throughput & <em className="italic font-serif font-normal text-stone-800">Scope</em>
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">Story points completed vs scope additions per week</p>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#111318]" />
                      <span className="text-stone-700">Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635]" />
                      <span className="text-stone-700">Added</span>
                    </div>
                  </div>
                </div>

                {/* Bar Columns Container with Gridlines */}
                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-3 border-b border-stone-100 relative">

                  {/* Subtle Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                    <div className="border-b border-dashed border-stone-200 w-full" />
                    <div className="border-b border-dashed border-stone-200 w-full" />
                    <div className="border-b border-dashed border-stone-200 w-full" />
                    <div className="border-b border-dashed border-stone-200 w-full" />
                  </div>

                  {weeklyData.map((d) => {
                    const isHovered = hoveredWeek === d.week
                    return (
                      <div
                        key={d.week}
                        onMouseEnter={() => setHoveredWeek(d.week)}
                        onMouseLeave={() => setHoveredWeek(null)}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative cursor-pointer group z-10"
                      >
                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#111318] text-white text-[11px] font-sans font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap z-30 flex items-center gap-2 border border-white/10">
                            <span className="text-white">{d.completed} pts done</span>
                            <span className="text-stone-400">·</span>
                            <span className="text-lime-400">{d.added} added</span>
                          </div>
                        )}

                        <div className="w-full flex items-end justify-center gap-1.5 h-full">
                          {/* Completed Bar (Dark Charcoal) */}
                          <div
                            className="w-full max-w-[18px] bg-[#111318] rounded-t-md transition-all duration-300 group-hover:bg-black group-hover:scale-y-105 origin-bottom shadow-xs"
                            style={{ height: `${(d.completed / maxVal) * 100}%` }}
                          />
                          {/* Added Bar (Lime Green) */}
                          <div
                            className="w-full max-w-[18px] bg-[#a3e635] rounded-t-md transition-all duration-300 group-hover:bg-[#84cc16] group-hover:scale-y-105 origin-bottom shadow-xs"
                            style={{ height: `${(d.added / maxVal) * 100}%` }}
                          />
                        </div>

                        {/* Week Label (Clean, Sharp, No Fuzzy Serif!) */}
                        <span className="chart-axis-label font-sans font-semibold text-[11px] text-stone-500 group-hover:text-stone-900 group-hover:font-bold transition-colors">
                          {d.week}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Insight Footer */}
              <div className="mt-4 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Peak throughput: <strong>W35 (86 pts)</strong></span>
                <span className="text-lime-700 font-bold">+28% Sprint Velocity Surge</span>
              </div>
            </div>

            {/* Right 1 Col: Project Distribution (Image 1 Right) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif mb-1">
                  Project <em className="italic font-serif font-normal text-stone-800">Distribution</em>
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 font-medium mb-6">Resource effort by space category</p>

                {/* Progress Breakdown Rows */}
                <div className="space-y-4">
                  {projectDistribution.map(p => (
                    <div key={p.name} className="group cursor-pointer">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="font-semibold text-stone-800 group-hover:text-stone-950 transition-colors">
                            {p.name}
                          </span>
                        </div>
                        <span className="chart-percentage-badge text-stone-950 font-bold text-xs">
                          {p.share}%
                        </span>
                      </div>

                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${p.share}%`, backgroundColor: p.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Tracked Spaces Footer (as shown in image) */}
              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Active Tracked Spaces:</span>
                <span className="font-bold text-stone-950 font-sans">5 spaces</span>
              </div>
            </div>

          </div>

          {/* Member Velocity Leaderboard */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif">
                  Team Member Velocity & <em className="italic font-serif font-normal text-stone-800">Output</em>
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">Individual points delivered against target capacity</p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-stone-800">
                Sprint 14 Target: 160 pts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-3">Member</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Points Delivered</th>
                    <th className="pb-3">Target</th>
                    <th className="pb-3">Efficiency</th>
                    <th className="pb-3 pr-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {velocityData.map(m => (
                    <tr key={m.name} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 pl-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-2xs"
                            style={{ backgroundColor: m.color }}
                          >
                            {m.avatar}
                          </div>
                          <span className="font-bold text-stone-900">{m.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-stone-500">{m.role}</td>
                      <td className="py-3.5 font-bold text-stone-900 stat-number text-sm">{m.pts} pts</td>
                      <td className="py-3.5 text-stone-400 stat-number">{m.target} pts</td>
                      <td className="py-3.5">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] stat-number">
                          {m.speed}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-100 text-lime-800">
                          ● On Track
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </ProtectedRoute>
  )
}