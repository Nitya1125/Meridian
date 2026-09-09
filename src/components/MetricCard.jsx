"use client"

import React, { useState, useRef, useMemo, useCallback } from 'react'

const THEMES = {
  purple: {
    cardBg: 'bg-[#F5F2FF]',
    border: 'border-[#DDD6FE]/90 hover:border-[#8B5CF6]/50',
    iconColor: 'text-[#7C3AED]',
    iconBorder: 'border-violet-200/80',
    iconBg: 'bg-white shadow-xs',
    pillBg: 'bg-white/90',
    pillBorder: 'border-violet-200/80',
    pillText: 'text-[#7C3AED]',
    activeBar: 'bg-[#7C3AED] shadow-[0_2px_10px_rgba(124,58,237,0.35)]',
    defaultBar: 'bg-[#C4B5FD]/70 hover:bg-[#8B5CF6]',
    glowColor: 'rgba(139, 92, 246, 0.16)',
    accentHex: '#7C3AED'
  },
  amber: {
    cardBg: 'bg-[#FFF7ED]',
    border: 'border-[#FED7AA]/90 hover:border-[#F97316]/50',
    iconColor: 'text-[#EA580C]',
    iconBorder: 'border-orange-200/80',
    iconBg: 'bg-white shadow-xs',
    pillBg: 'bg-white/90',
    pillBorder: 'border-orange-200/80',
    pillText: 'text-[#EA580C]',
    activeBar: 'bg-[#EA580C] shadow-[0_2px_10px_rgba(234,88,12,0.35)]',
    defaultBar: 'bg-[#FDBA74]/70 hover:bg-[#F97316]',
    glowColor: 'rgba(234, 88, 12, 0.16)',
    accentHex: '#EA580C'
  },
  sky: {
    cardBg: 'bg-[#F0F9FF]',
    border: 'border-[#BAE6FD]/90 hover:border-[#0284C7]/50',
    iconColor: 'text-[#0284C7]',
    iconBorder: 'border-sky-200/80',
    iconBg: 'bg-white shadow-xs',
    pillBg: 'bg-white/90',
    pillBorder: 'border-sky-200/80',
    pillText: 'text-[#0284C7]',
    activeBar: 'bg-[#0284C7] shadow-[0_2px_10px_rgba(2,132,199,0.35)]',
    defaultBar: 'bg-[#7DD3FC]/70 hover:bg-[#0EA5E9]',
    glowColor: 'rgba(2, 132, 199, 0.16)',
    accentHex: '#0284C7'
  },
  lime: {
    cardBg: 'bg-[#F7FEE7]',
    border: 'border-[#D9F99D]/90 hover:border-[#65A30D]/50',
    iconColor: 'text-[#65A30D]',
    iconBorder: 'border-lime-200/80',
    iconBg: 'bg-white shadow-xs',
    pillBg: 'bg-white/90',
    pillBorder: 'border-lime-200/80',
    pillText: 'text-[#65A30D]',
    activeBar: 'bg-[#65A30D] shadow-[0_2px_10px_rgba(101,163,13,0.35)]',
    defaultBar: 'bg-[#BEF264]/70 hover:bg-[#84CC16]',
    glowColor: 'rgba(101, 163, 13, 0.16)',
    accentHex: '#65A30D'
  },
  rose: {
    cardBg: 'bg-[#FFF1F2]',
    border: 'border-[#FECDD3]/90 hover:border-[#E11D48]/50',
    iconColor: 'text-[#E11D48]',
    iconBorder: 'border-rose-200/80',
    iconBg: 'bg-white shadow-xs',
    pillBg: 'bg-white/90',
    pillBorder: 'border-rose-200/80',
    pillText: 'text-[#E11D48]',
    activeBar: 'bg-[#E11D48] shadow-[0_2px_10px_rgba(225,29,72,0.35)]',
    defaultBar: 'bg-[#FDA4AF]/70 hover:bg-[#F43F5E]',
    glowColor: 'rgba(225, 29, 72, 0.16)',
    accentHex: '#E11D48'
  }
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function MetricCard({
  icon: Icon,
  badge,
  value,
  label,
  theme = 'purple',
  series,
  onClick,
  className = ''
}) {
  const t = THEMES[theme] || THEMES.purple
  const cardRef = useRef(null)

  // Kinetic Mouse Physics state
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false })
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [scrubIndex, setScrubIndex] = useState(null)

  // Generate realistic progression data points if series not explicitly provided
  const timelineData = useMemo(() => {
    if (series && Array.isArray(series) && series.length === 7) {
      return series
    }
    // Parse numeric value if present
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 10
    const hasHours = String(value).includes('h')
    const unit = hasHours ? 'h' : ''

    // Create an authentic distribution curve
    const weights = [0.11, 0.14, 0.18, 0.16, 0.22, 0.10, 0.09]
    return DAYS.map((day, idx) => {
      const stepVal = hasHours
        ? Math.round(numeric * weights[idx])
        : Math.max(1, Math.round((numeric / 7) * (idx + 1) * (0.8 + weights[idx])))
      return {
        day,
        val: `${stepVal}${unit}`,
        heightPercent: Math.min(100, Math.max(28, Math.round(weights[idx] * 380)))
      }
    })
  }, [series, value])

  // Continuous Pointer Motion Handler
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Normalized coordinates (-0.5 to +0.5)
    const normX = x / rect.width - 0.5
    const normY = y / rect.height - 0.5

    // Physical tilt resistance
    setTilt({
      rx: -(normY * 6), // Tilt up/down
      ry: (normX * 6)   // Tilt left/right
    })
    setCoords({ x, y, active: true })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 })
    setCoords(prev => ({ ...prev, active: false }))
    setScrubIndex(null)
  }, [])

  const currentDisplayValue = scrubIndex !== null ? timelineData[scrubIndex].val : value
  const currentDisplayDay = scrubIndex !== null ? timelineData[scrubIndex].day : null

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-[28px] p-5 sm:p-6 ${t.cardBg} border ${t.border} shadow-2xs hover:shadow-lg transition-all duration-300 select-none overflow-hidden flex flex-col justify-between active:scale-[0.985] active:translate-y-[1px] ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      } ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
        transition: coords.active ? 'transform 0.08s ease-out, box-shadow 0.25s ease' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
      }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      {coords.active && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[28px] opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, ${t.glowColor}, transparent 70%)`
          }}
        />
      )}

      {/* Subtle Specular Border Highlight */}
      {coords.active && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/60 opacity-60"
          style={{
            maskImage: `radial-gradient(220px circle at ${coords.x}px ${coords.y}px, black, transparent)`
          }}
        />
      )}

      {/* Card Header: Icon & Live Badge */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-2xl ${t.iconBg} border ${t.iconBorder} flex items-center justify-center ${t.iconColor} group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-200`}>
          {React.isValidElement(Icon) ? Icon : Icon ? <Icon size={18} strokeWidth={2.2} /> : null}
        </div>

        {/* Dynamic Badge / Scrub Indicator */}
        <div className="flex items-center gap-1.5">
          {currentDisplayDay && (
            <span className="animate-in fade-in zoom-in-95 duration-150 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#111318] text-white shadow-xs">
              {currentDisplayDay}
            </span>
          )}
          {badge && !currentDisplayDay && (
            <span className={`${t.pillBg} px-3 py-1 rounded-full text-[11px] font-bold font-sans ${t.pillText} shadow-2xs border ${t.pillBorder} transition-transform group-hover:scale-105`}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* KPI Value & Label */}
      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight stat-number transition-all duration-150 ${
            scrubIndex !== null ? t.iconColor : 'text-stone-900'
          }`}>
            {currentDisplayValue}
          </span>
          {scrubIndex !== null && (
            <span className="animate-in fade-in slide-in-from-bottom-1 duration-150 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#111318] text-white shadow-xs">
              {currentDisplayDay} snapshot
            </span>
          )}
        </div>
        <div className="text-xs font-semibold text-stone-500 mt-1 flex items-center justify-between">
          <span>{label}</span>
          <span className={`text-[10px] font-mono transition-all ${
            scrubIndex !== null ? 'text-stone-800 font-bold opacity-100' : 'text-stone-400 opacity-0 group-hover:opacity-100'
          }`}>
            {scrubIndex !== null ? `Day ${scrubIndex + 1} of 7` : 'scrub 7d →'}
          </span>
        </div>
      </div>

      {/* Interactive 7-Day Scrubbing Bars with Multi-Event Tracking */}
      <div
        className="relative z-10 pt-4 mt-2"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const relativeX = e.clientX - rect.left
          const segmentWidth = rect.width / 7
          const index = Math.min(6, Math.max(0, Math.floor(relativeX / segmentWidth)))
          setScrubIndex(index)
        }}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const relativeX = e.clientX - rect.left
          const segmentWidth = rect.width / 7
          const index = Math.min(6, Math.max(0, Math.floor(relativeX / segmentWidth)))
          setScrubIndex(index)
        }}
        onTouchMove={(e) => {
          if (!e.touches[0]) return
          const rect = e.currentTarget.getBoundingClientRect()
          const relativeX = e.touches[0].clientX - rect.left
          const segmentWidth = rect.width / 7
          const index = Math.min(6, Math.max(0, Math.floor(relativeX / segmentWidth)))
          setScrubIndex(index)
        }}
        onMouseLeave={() => setScrubIndex(null)}
        onPointerLeave={() => setScrubIndex(null)}
        onTouchEnd={() => setScrubIndex(null)}
      >
        <div className="flex items-end justify-between gap-1.5 h-8">
          {timelineData.map((item, idx) => {
            const isHovered = scrubIndex === idx
            const isDefaultState = scrubIndex === null

            return (
              <div
                key={item.day}
                onMouseEnter={() => setScrubIndex(idx)}
                className="relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer py-0.5"
              >
                {/* Visual Pill Bar */}
                <div
                  className={`w-full rounded-full transition-all duration-150 ${
                    isHovered
                      ? `${t.activeBar} -translate-y-1.5 scale-x-110 shadow-sm`
                      : isDefaultState
                        ? `${t.defaultBar}`
                        : 'bg-stone-300/40 opacity-40'
                  }`}
                  style={{
                    height: isHovered ? '100%' : `${item.heightPercent}%`
                  }}
                />

                {/* Day Mini Dot Indicator on active */}
                {isHovered && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-stone-900 shadow-2xs" />
                )}
              </div>
            )
          })}
        </div>

        {/* Micro Day-Axis Labels */}
        <div className="flex justify-between items-center text-[9px] font-mono font-semibold text-stone-400 mt-2 px-0.5 select-none">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  )
}
