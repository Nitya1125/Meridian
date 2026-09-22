"use client"

import React, { useState, useMemo } from 'react'
import {
  FigmaIcon, CheckIcon, ClockIcon, ZapIcon,
  ArrowUpRightIcon, SparklesIcon, ActivityIcon,
  FlameIcon, ShieldIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

// ─── Shared Graphic SVG Patterns (Diagonal Hatch & Stipple Matrix) ───
export function GraphicPatternDefs() {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Crisp Diagonal Orange Hatch (45deg lines) */}
        {/* Recent Work Diagonal Hatch (Orange fill + dark orange stripes matching reference image) */}
        <pattern
          id="recent-work-hatch"
          width="7"
          height="7"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="7" height="7" fill="#F97316" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#9A3412" strokeWidth="2.2" />
        </pattern>

        <pattern
          id="figma-hatch-orange"
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="#FF4400" strokeWidth="1.5" />
        </pattern>

        {/* Crisp Diagonal White Hatch (45deg lines) */}
        <pattern
          id="figma-hatch-white"
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
        </pattern>

        {/* Crisp Diagonal Dark Hatch */}
        <pattern
          id="figma-hatch-dark"
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="#252733" strokeWidth="1.5" />
        </pattern>

        {/* Stipple Dot Matrix Pattern */}
        <pattern
          id="figma-stipple-dots"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2.5" cy="2.5" r="0.9" fill="rgba(255,255,255,0.45)" />
        </pattern>
      </defs>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────
// 1. PATTERN HERO CARD (6x4 = 24 Bead Matrix: Solid vs Diagonal Hatch)
// ─────────────────────────────────────────────────────────────────────
export function PatternHeroCard({
  rate = 82,
  title = "Pattern Hero",
  subtitle = "Output cadence",
  tasksTotal = 24,
  onDotClick
}) {
  const [hoveredDot, setHoveredDot] = useState(null)
  const activeCount = Math.round((Math.min(Math.max(rate, 0), 100) / 100) * 24)

  const dots = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      isActive: i < activeCount,
      row: Math.floor(i / 6),
      col: i % 6
    }))
  }, [activeCount])

  return (
    <div className="p-5 rounded-[26px] bg-[#121318] border border-white/10 relative transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white tracking-tight font-sans stat-number leading-none">
              {rate}%
            </span>
          </div>
          <span className="text-xs font-bold text-white/70 font-sans block mt-1 tracking-wide">
            {title}
          </span>
          <span className="text-xs text-stone-400 font-sans">
            {activeCount} of 24 units completed
          </span>
        </div>

        {/* Flat Figma Badge */}
        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
          <FigmaIcon size={14} />
        </div>
      </div>

      {/* 6x4 Bead Matrix Grid */}
      <div className="pt-1 pb-2">
        <svg viewBox="0 0 180 120" className="w-full max-w-[240px] mx-auto overflow-visible">
          {dots.map((dot) => {
            const cx = 15 + dot.col * 30
            const cy = 15 + dot.row * 30
            const isHovered = hoveredDot === dot.id

            return (
              <g
                key={dot.id}
                className="cursor-pointer transition-opacity"
                style={{ opacity: hoveredDot !== null && !isHovered ? 0.45 : 1 }}
                onMouseEnter={() => setHoveredDot(dot.id)}
                onMouseLeave={() => setHoveredDot(null)}
                onClick={() => {
                  if (onDotClick) onDotClick(dot)
                  toast.success(
                    dot.isActive
                      ? `Deliverable Unit #${dot.id + 1}: Finalized`
                      : `Backlog Unit #${dot.id + 1}: In Progress`
                  )
                }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="11"
                  fill={dot.isActive ? '#FF4400' : 'url(#figma-hatch-white)'}
                  stroke={dot.isActive ? '#FF4400' : 'rgba(255,255,255,0.35)'}
                  strokeWidth="1.2"
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Clean Footer Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-1 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF4400]" />
          <span className="text-white/80 font-bold">Done ({activeCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full border border-white/40"
            style={{
              background:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.75) 0, rgba(255,255,255,0.75) 1px, transparent 0, transparent 3px)'
            }}
          />
          <span className="text-white/50">Remaining ({24 - activeCount})</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// 2. RADIAL REPEAT CARD (Sunburst Precision Rays + Solid Beacon Bead)
// ─────────────────────────────────────────────────────────────────────
export function RadialRepeatCard({
  rate = 75,
  title = "Radial repeat",
  subtitle = "Cadence index",
  badgeLabel = "On Track",
  periods = null,
  activePeriod = 'all',
  onSelectPeriod
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const badgeText = typeof badgeLabel === 'object' && badgeLabel !== null ? (badgeLabel.text || '') : String(badgeLabel || '')
  const badgeColorClass = typeof badgeLabel === 'object' && badgeLabel !== null && badgeLabel.color ? badgeLabel.color : 'text-lime-400'
  const totalTicks = 48
  const activeTicksCount = Math.round((Math.min(Math.max(rate, 0), 100) / 100) * totalTicks)

  // Beacon angle & position:
  const beaconAngle = -90 + (Math.min(Math.max(rate, 0), 100) / 100) * 360
  const beaconRad = (beaconAngle * Math.PI) / 180
  const beaconX = 80 + 56 * Math.cos(beaconRad)
  const beaconY = 80 + 56 * Math.sin(beaconRad)

  return (
    <div className="p-5 rounded-[26px] bg-[#121318] border border-white/10 relative transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-white font-sans block">
            {title}
          </span>
          <span className="text-xs text-stone-400 font-sans">
            {subtitle}
          </span>
        </div>

        {/* Right Action / Period */}
        <div className="flex items-center gap-2">
          {periods && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-xs font-sans font-medium text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 transition-colors"
              >
                <span>{periods[activePeriod]?.label || 'All'}</span>
                <span className="text-[9px] text-stone-400">▾</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-32 bg-[#1A1C24] border border-white/15 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                  {Object.entries(periods).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (onSelectPeriod) onSelectPeriod(key)
                        setDropdownOpen(false)
                        toast.success(`Window: ${item.label}`)
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-sans font-medium transition-colors flex items-center justify-between cursor-pointer ${activePeriod === key ? 'text-[#FF4400] bg-white/10 font-bold' : 'text-stone-300 hover:bg-white/5'
                        }`}
                    >
                      <span>{item.label}</span>
                      {activePeriod === key && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
            <FigmaIcon size={14} />
          </div>
        </div>
      </div>

      {/* Sunburst Dial SVG */}
      <div className="relative flex flex-col items-center justify-center py-2">
        <svg viewBox="0 0 160 160" className="w-44 h-44 overflow-visible">
          {/* 48 Clean Radial Sunburst Rays */}
          {Array.from({ length: totalTicks }).map((_, i) => {
            const angle = -90 + i * (360 / totalTicks)
            const rad = (angle * Math.PI) / 180
            const rIn = 42
            const rOut = 68
            const x1 = 80 + rIn * Math.cos(rad)
            const y1 = 80 + rIn * Math.sin(rad)
            const x2 = 80 + rOut * Math.cos(rad)
            const y2 = 80 + rOut * Math.sin(rad)
            const isLit = i < activeTicksCount

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isLit ? '#FF4400' : 'rgba(255,255,255,0.18)'}
                strokeWidth={isLit ? 2 : 1.2}
                strokeLinecap="round"
              />
            )
          })}

          {/* Solid Graphic Orange Beacon Bead */}
          <g>
            <circle
              cx={beaconX}
              cy={beaconY}
              r="7"
              fill="#FF4400"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx={beaconX} cy={beaconY} r="2" fill="#FFFFFF" />
          </g>
        </svg>

        {/* Center Typography Cluster */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-semibold tracking-wider text-stone-400 uppercase font-sans">
            Velocity
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-black text-white tracking-tight stat-number font-sans">
              {rate}
            </span>
            <span className="text-sm font-bold text-[#FF4400] font-sans">%</span>
          </div>
          <span className={`text-[10px] font-semibold uppercase tracking-wider font-sans ${badgeColorClass}`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Clean Metric Row */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-medium text-stone-400 font-sans block">Velocity</span>
          <span className="text-base font-bold text-white font-sans">{rate}%</span>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-medium text-stone-400 font-sans block">Backlog</span>
          <span className="text-base font-bold text-white/70 font-sans">{100 - rate}%</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// 3. RIDGELINE HATCH CARD (Chart Line with Diagonal Orange Hatch)
// ─────────────────────────────────────────────────────────────────────
export function RidgelineHatchCard({
  title = "Chart line",
  progress = 85,
  subtitle = "Progress bar"
}) {
  const [activePoint, setActivePoint] = useState(4)

  const points = [
    { x: 0, y: 75, label: 'Mon', val: '45%' },
    { x: 40, y: 95, label: 'Tue', val: '30%' },
    { x: 85, y: 45, label: 'Wed', val: '72%' },
    { x: 130, y: 80, label: 'Thu', val: '50%' },
    { x: 175, y: 28, label: 'Fri', val: '85%' },
    { x: 210, y: 52, label: 'Sat', val: '64%' },
    { x: 240, y: 20, label: 'Sun', val: '92%' }
  ]

  // Smooth spline curve
  const curvePath = "M 0 75 C 20 75, 25 95, 40 95 C 60 95, 70 45, 85 45 C 105 45, 115 80, 130 80 C 150 80, 160 28, 175 28 C 190 28, 200 52, 210 52 C 225 52, 230 20, 240 20"
  const underfillPath = `${curvePath} L 240 120 L 0 120 Z`

  return (
    <div className="p-5 rounded-[26px] bg-[#121318] border border-white/10 relative transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xl font-black text-white tracking-tight font-sans block leading-none">
            {title}
          </span>
          <span className="text-[10px] text-white/40 font-mono mt-1 block">
            Continuous spline cadence
          </span>
        </div>

        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
          <FigmaIcon size={14} />
        </div>
      </div>

      {/* SVG Wave Chart with Diagonal Hatch */}
      <div className="py-2 relative">
        <svg viewBox="0 0 240 120" className="w-full h-28 overflow-visible">
          {/* Diagonal Orange Hatch Underfill */}
          <path
            d={underfillPath}
            fill="url(#figma-hatch-orange)"
            opacity="0.9"
          />

          {/* Smooth Solid Orange Spline Stroke */}
          <path
            d={curvePath}
            fill="none"
            stroke="#FF4400"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Solid Point Markers */}
          {points.map((pt, idx) => {
            const isSelected = activePoint === idx
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={() => {
                  setActivePoint(idx)
                  toast.success(`${pt.label}: ${pt.val} output velocity`)
                }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 5.5 : 3.5}
                  fill="#FFFFFF"
                  stroke="#FF4400"
                  strokeWidth="2.5"
                />
              </g>
            )
          })}
        </svg>

        {/* Clean Point Badge */}
        {points[activePoint] && (
          <div
            className="absolute -top-1 bg-[#FF4400] text-white px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${(points[activePoint].x / 240) * 100}%` }}
          >
            {points[activePoint].val}
          </div>
        )}
      </div>

      {/* Progress Bar Row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-1">
        <div>
          <span className="text-[10px] font-mono text-white/50 block leading-tight">{subtitle}</span>
          <div
            className="h-3 w-32 rounded-full overflow-hidden relative mt-1"
            style={{
              background:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 1px, transparent 0, transparent 4px)'
            }}
          >
            <div
              className="h-full rounded-full bg-[#FF4400] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-white font-mono stat-number">{progress}%</span>
          <span className="text-[9px] text-[#FF4400] block font-mono">Peak flow</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// 4. BARCODE TALLY CARD (71% ⌘+D: Equalizer Frequency Barcode Lines)
// ─────────────────────────────────────────────────────────────────────
export function BarcodeTallyCard({
  rate = 71,
  command = null,
  title = "Stream Frequency",
  totalTasks = null,
  completedTasks = null
}) {
  const totalBars = 24
  const activeBars = Math.round((Math.min(Math.max(rate, 0), 100) / 100) * totalBars)

  return (
    <div className="p-5 rounded-[26px] bg-[#121318] border border-white/10 relative transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white font-sans tracking-tight stat-number leading-none">
              {rate}%
            </span>
          </div>
          {command ? (
            <span className="text-xs font-medium text-stone-400 font-sans mt-1 block">
              {command}
            </span>
          ) : (
            <span className="text-xs font-medium text-stone-400 font-sans mt-1 block">
              {completedTasks !== null && totalTasks !== null
                ? `${completedTasks} of ${totalTasks} deliverables closed`
                : `${activeBars} of ${totalBars} streams active`}
            </span>
          )}
        </div>

        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
          <FigmaIcon size={14} />
        </div>
      </div>

      {/* Barcode Equalizer Tally Lines */}
      <div className="py-2 flex items-end justify-between gap-1 h-14">
        {Array.from({ length: totalBars }).map((_, i) => {
          const isDone = i < activeBars
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm cursor-pointer transition-opacity ${isDone ? 'bg-[#FF4400]' : 'bg-white/20'}`}
              style={{
                height: isDone ? '100%' : '65%',
                background: !isDone
                  ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 1px, transparent 0, transparent 3px)'
                  : undefined
              }}
              onClick={() => toast.success(`Stream #${i + 1}: ${isDone ? 'Completed' : 'Pending'}`)}
            />
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2 text-xs font-sans font-medium">
        <span className="text-white/60 font-bold">{activeBars} active tallies</span>
        <span className="text-[#FF4400] font-bold">{title}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// 5. SECTOR DONUT CARD (Figma Tools / Pinwheel Sectors with Diagonal Hatch)
// ─────────────────────────────────────────────────────────────────────
export function SectorDonutCard({
  title = "Figma tools",
  activeAlloc = { learning: 50, design: 30, biz: 20 },
  onSliceClick
}) {
  const [hoveredSlice, setHoveredSlice] = useState(null)

  const sectors = [
    {
      id: 's1',
      label: 'Design Core',
      pct: activeAlloc.learning || 50,
      fill: '#FF4400',
      stroke: '#FF4400',
      badge: '50%'
    },
    {
      id: 's2',
      label: 'Sprint Tokens',
      pct: activeAlloc.design || 30,
      fill: 'url(#figma-hatch-orange)',
      stroke: '#FF4400',
      badge: '30%'
    },
    {
      id: 's3',
      label: 'Review Buffer',
      pct: activeAlloc.biz || 20,
      fill: 'url(#figma-hatch-white)',
      stroke: 'rgba(255,255,255,0.5)',
      badge: '20%'
    }
  ]

  return (
    <div className="p-5 rounded-[26px] bg-[#121318] border border-white/10 relative transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-lg font-black text-white tracking-tight font-sans block">
            {title}
          </span>
          <span className="text-[10px] text-white/40 font-mono">
            Radial sector allocation
          </span>
        </div>

        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
          <FigmaIcon size={14} />
        </div>
      </div>

      {/* Sector Graphic */}
      <div className="relative flex items-center justify-center py-2">
        <svg viewBox="0 0 160 160" className="w-40 h-40 overflow-visible">
          {/* Sector 1: 50% Top-Right (from -90 to 90 deg) */}
          <path
            d="M 80 80 L 80 20 A 60 60 0 0 1 80 140 Z"
            fill="#FF4400"
            stroke="#FF4400"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity"
            style={{ opacity: hoveredSlice && hoveredSlice !== 's1' ? 0.4 : 1 }}
            onMouseEnter={() => setHoveredSlice('s1')}
            onMouseLeave={() => setHoveredSlice(null)}
            onClick={() => {
              if (onSliceClick) onSliceClick('s1')
              toast.success('Design Core: 50% allocation')
            }}
          />

          {/* Sector 2: 30% Bottom-Left (from 90 to 198 deg) */}
          <path
            d="M 80 80 L 80 140 A 60 60 0 0 1 22.94 61.46 Z"
            fill="url(#figma-hatch-orange)"
            stroke="#FF4400"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity"
            style={{ opacity: hoveredSlice && hoveredSlice !== 's2' ? 0.4 : 1 }}
            onMouseEnter={() => setHoveredSlice('s2')}
            onMouseLeave={() => setHoveredSlice(null)}
            onClick={() => {
              if (onSliceClick) onSliceClick('s2')
              toast.success('Sprint Tokens: 30% allocation')
            }}
          />

          {/* Sector 3: 20% Top-Left (from 198 to 270 deg) */}
          <path
            d="M 80 80 L 22.94 61.46 A 60 60 0 0 1 80 20 Z"
            fill="url(#figma-hatch-white)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            className="cursor-pointer transition-opacity"
            style={{ opacity: hoveredSlice && hoveredSlice !== 's3' ? 0.4 : 1 }}
            onMouseEnter={() => setHoveredSlice('s3')}
            onMouseLeave={() => setHoveredSlice(null)}
            onClick={() => {
              if (onSliceClick) onSliceClick('s3')
              toast.success('Review Buffer: 20% allocation')
            }}
          />

          {/* Center cutout */}
          <circle cx="80" cy="80" r="18" fill="#121318" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="5" fill="#FF4400" />
        </svg>

        {/* Crisp Callout Labels */}
        <div className="absolute top-8 right-6 bg-[#FF4400] text-white text-[10px] font-black font-mono px-2 py-0.5 rounded-md">
          50%
        </div>
        <div className="absolute bottom-6 left-6 bg-[#121318] border border-[#FF4400] text-[#FF4400] text-[10px] font-black font-mono px-2 py-0.5 rounded-md">
          30%
        </div>
        <div className="absolute top-8 left-6 bg-[#121318] border border-white/30 text-white/80 text-[10px] font-black font-mono px-2 py-0.5 rounded-md">
          20%
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-1.5 pt-2 border-t border-white/10 mt-1">
        {sectors.map((sec) => (
          <div
            key={sec.id}
            onMouseEnter={() => setHoveredSlice(sec.id)}
            onMouseLeave={() => setHoveredSlice(null)}
            className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-colors cursor-pointer ${hoveredSlice === sec.id
              ? 'bg-white/10 border-white/20'
              : 'bg-white/[0.03] border-white/[0.06]'
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF4400]" />
              <span className="font-bold text-white/80">{sec.label}</span>
            </div>
            <span className="font-mono font-black text-white">{sec.badge}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// 6. MASTER FIGMA GRAPHIC CHARTS SUITE
// ─────────────────────────────────────────────────────────────────────
export default function GraphicChartsSuite({
  rate = 82,
  title = "Figma Charts",
  activeAlloc = { learning: 50, design: 30, biz: 20 },
  periods = null,
  activePeriod = 'all',
  onSelectPeriod
}) {
  const [selectedTab, setSelectedTab] = useState('pattern')

  return (
    <div className="space-y-3">
      <GraphicPatternDefs />

      {/* Clean Selector Pills */}
      <div className="flex items-center gap-1 bg-[#111318] p-1 rounded-2xl border border-white/10 overflow-x-auto">
        {[
          { id: 'pattern', label: '82% Pattern Hero' },
          { id: 'radial', label: 'Radial Repeat' },
          { id: 'wave', label: 'Chart Line' },
          { id: 'barcode', label: '71%' },
          { id: 'sector', label: 'Sector Fan' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${selectedTab === tab.id
              ? 'bg-[#FF4400] text-white'
              : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Active Figma Chart */}
      {selectedTab === 'pattern' && (
        <PatternHeroCard
          rate={rate}
          title="Pattern Hero"
          subtitle="Sprint deliverable units"
        />
      )}

      {selectedTab === 'radial' && (
        <RadialRepeatCard
          rate={rate}
          title="Radial repeat"
          subtitle="Precision cadence clock"
          periods={periods}
          activePeriod={activePeriod}
          onSelectPeriod={onSelectPeriod}
        />
      )}

      {selectedTab === 'wave' && (
        <RidgelineHatchCard
          title="Chart line"
          progress={rate}
          subtitle="Output velocity"
        />
      )}

      {selectedTab === 'barcode' && (
        <BarcodeTallyCard
          rate={rate}
          title="Stream Frequency"
        />
      )}

      {selectedTab === 'sector' && (
        <SectorDonutCard
          title="Figma tools"
          activeAlloc={activeAlloc}
        />
      )}
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────
// 7. STACKED VELOCITY GRAPH (Recent Work Hatched Block + Stacked Bars)
// ─────────────────────────────────────────────────────────────────────
export function StackedVelocityCard({
  title = "Sprint Velocity",
  subtitle = "Cadence & Work Allocation",
  recentWorkHours = "6.0h",
  totalSprintHours = "38.5h",
  columns: propColumns = null,
  selectedDayId = null,
  onSelectDay = null,
  onSelectBlock = null
}) {
  const [hoveredBlock, setHoveredBlock] = useState(null)

  // Use dynamic columns if provided, else fallback to standard
  const columns = propColumns && propColumns.length > 0 ? propColumns : [
    {
      id: 'mon',
      day: 'Mon',
      total: '5.8h',
      blocks: [
        { id: 'mon-1', h: 36, fill: '#F97316', label: 'Deliverables', sprint: 'Sprint 24 (Active)', hours: '3.6h' },
        { id: 'mon-2', h: 22, fill: '#F472B6', label: 'Design Tokens', sprint: 'Sprint 22 (Done)', hours: '2.2h' }
      ]
    },
    {
      id: 'tue',
      day: 'Tue',
      total: '7.6h',
      blocks: [
        { id: 'tue-1', h: 42, fill: '#F97316', label: 'Deliverables', sprint: 'Sprint 24 (Active)', hours: '4.2h' },
        { id: 'tue-2', h: 34, fill: '#A3E635', label: 'QA & Reviews', sprint: 'Sprint 23 (Done)', hours: '3.4h' }
      ]
    },
    {
      id: 'wed',
      day: 'Wed',
      isToday: true,
      total: '8.8h',
      blocks: [
        { id: 'wed-1', h: 24, fill: '#BEF264', label: 'Backlog Triage', sprint: 'Sprint 23 (Done)', hours: '2.4h' },
        {
          id: 'wed-2',
          h: 46,
          fill: 'url(#recent-work-hatch)',
          stroke: '#FFFFFF',
          strokeWidth: 1.8,
          isRecentWork: true,
          label: 'Recent Work',
          sprint: 'Sprint 24 (Active)',
          hours: recentWorkHours,
          badge: 'Recent Work'
        },
        { id: 'wed-3', h: 18, fill: '#EC4899', label: 'Sprint Handoff', sprint: 'Sprint 22 (Done)', hours: '1.8h' }
      ]
    },
    {
      id: 'thu',
      day: 'Thu',
      total: '5.2h',
      blocks: [
        { id: 'thu-1', h: 22, fill: '#C4B5FD', label: 'System Design', sprint: 'Sprint 22 (Done)', hours: '2.2h' },
        { id: 'thu-2', h: 30, fill: '#A3E635', label: 'QA & Reviews', sprint: 'Sprint 23 (Done)', hours: '3.0h' }
      ]
    },
    {
      id: 'fri',
      day: 'Fri',
      total: '8.4h',
      blocks: [
        { id: 'fri-1', h: 20, fill: '#BEF264', label: 'Backlog Buffer', sprint: 'Sprint 23 (Done)', hours: '2.0h' },
        { id: 'fri-2', h: 40, fill: '#F97316', label: 'Deliverables', sprint: 'Sprint 24 (Active)', hours: '4.0h' },
        { id: 'fri-3', h: 24, fill: '#F472B6', label: 'Specs & Handoff', sprint: 'Sprint 22 (Done)', hours: '2.4h' }
      ]
    }
  ]

  const baseY = 124
  const gap = 3.5
  const colWidth = 36
  const colGap = 14

  return (
    <div className="p-5 rounded-[26px] bg-[#121318] border border-white/10 relative transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white font-sans tracking-tight uppercase">
              {title}
            </span>
            <span className="px-2 py-0.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#FF4400] text-[10px] font-semibold font-sans">
              Recent Work Active
            </span>
          </div>
          <span className="text-xs text-stone-400 font-sans mt-0.5 block">
            {subtitle} • {totalSprintHours} logged
          </span>
        </div>

        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
          <FigmaIcon size={14} />
        </div>
      </div>

      {/* SVG Stacked Block Chart */}
      <div className="py-2 relative">
        <svg viewBox="0 0 260 148" className="w-full h-36 overflow-visible">
          {/* Baseline subtle guide rule */}
          <line x1="6" y1={baseY + 1} x2="254" y2={baseY + 1} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

          {/* Render Stacked Block Columns */}
          {columns.map((col, cIdx) => {
            const x = 14 + cIdx * (colWidth + colGap)
            let currY = baseY
            const isColSelected = selectedDayId === col.id || col.isSelected

            return (
              <g
                key={col.id}
                className="cursor-pointer"
                onClick={() => {
                  if (onSelectDay) onSelectDay(col)
                }}
              >
                {/* Column background selection highlight */}
                {isColSelected && (
                  <rect
                    x={x - 3}
                    y={16}
                    width={colWidth + 6}
                    height={baseY - 10}
                    rx="8"
                    ry="8"
                    fill="rgba(255, 68, 0, 0.08)"
                    stroke="rgba(255, 68, 0, 0.4)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {col.blocks.map((block) => {
                  currY -= block.h
                  const blockY = currY
                  currY -= gap
                  const isHovered = hoveredBlock?.id === block.id

                  return (
                    <g
                      key={block.id}
                      className="cursor-pointer transition-opacity"
                      style={{ opacity: hoveredBlock && !isHovered ? 0.45 : 1 }}
                      onMouseEnter={(e) => {
                        e.stopPropagation()
                        setHoveredBlock({ ...block, day: col.day })
                      }}
                      onMouseLeave={() => setHoveredBlock(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onSelectBlock) onSelectBlock(block, col)
                        if (onSelectDay) onSelectDay(col)
                        toast.success(`${col.day} • ${block.sprint || block.label}: ${block.hours}`)
                      }}
                    >
                      <rect
                        x={x}
                        y={blockY}
                        width={colWidth}
                        height={block.h}
                        rx="6"
                        ry="6"
                        fill={block.fill}
                        stroke={block.stroke || 'none'}
                        strokeWidth={block.strokeWidth || 0}
                      />
                    </g>
                  )
                })}

                {/* Day Label Below Column */}
                <text
                  x={x + colWidth / 2}
                  y={baseY + 16}
                  textAnchor="middle"
                  fill={col.isToday ? '#FF4400' : isColSelected ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                  fontSize="10"
                  fontWeight={col.isToday || isColSelected ? 'bold' : '500'}
                  fontFamily="var(--font-jakarta), var(--font-urbanist), Inter, system-ui, sans-serif"
                >
                  {col.day.toUpperCase()}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Hovered Block Floating Readout Pill */}
        {hoveredBlock && (
          <div className="absolute top-0 right-0 bg-[#1E2028] border border-white/20 px-3 py-1.5 rounded-xl text-xs font-sans text-white shadow-xl pointer-events-none flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: hoveredBlock.fill?.startsWith('url') ? '#F97316' : hoveredBlock.fill }}
            />
            <span className="text-[#FF4400] font-bold">{hoveredBlock.day}:</span>
            <span className="text-white/90 font-semibold">{hoveredBlock.sprint ? `${hoveredBlock.sprint} • ` : ''}{hoveredBlock.label}</span>
            <span className="text-white/50">({hoveredBlock.hours})</span>
          </div>
        )}
      </div>

      {/* Legend / Metrics Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-1 text-xs font-sans">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs" style={{ background: 'repeating-linear-gradient(45deg, #F97316 0, #F97316 2px, #9A3412 2px, #9A3412 4px)' }} />
            <span className="text-white/70 font-medium">Recent ({recentWorkHours})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F97316]" />
            <span className="text-white/70 font-medium">Active</span>
          </div>
        </div>

        <span className="text-[#FF4400] font-bold">{totalSprintHours} total</span>
      </div>
    </div>
  )
}
