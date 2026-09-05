"use client"

import React from 'react'

const THEMES = {
  purple: {
    cardBg: 'bg-[#F3F0FF]',
    border: 'border-[#DDD6FE]/80 hover:border-[#C4B5FD]',
    iconColor: 'text-[#7C3AED]',
    iconBorder: 'border-violet-100',
    pillBg: 'bg-white/90',
    pillBorder: 'border-violet-100',
    pillText: 'text-[#7C3AED]',
    bars: [
      'bg-[#C4B5FD]/60 group-hover:bg-[#8B5CF6]',
      'bg-[#C4B5FD]/80 group-hover:bg-[#8B5CF6]',
      'bg-[#A78BFA] group-hover:bg-[#7C3AED]',
      'bg-[#8B5CF6] group-hover:bg-[#6D28D9]',
      'bg-[#7C3AED] group-hover:bg-[#5B21B6]',
      'bg-[#6D28D9] group-hover:bg-[#4C1D95]',
      'bg-[#5B21B6] group-hover:bg-[#3B0764]'
    ]
  },
  amber: {
    cardBg: 'bg-[#FFF7ED]',
    border: 'border-[#FED7AA]/80 hover:border-[#FDBA74]',
    iconColor: 'text-[#EA580C]',
    iconBorder: 'border-orange-100',
    pillBg: 'bg-white/90',
    pillBorder: 'border-orange-100',
    pillText: 'text-[#EA580C]',
    bars: [
      'bg-[#FDBA74]/60 group-hover:bg-[#F97316]',
      'bg-[#FDBA74]/80 group-hover:bg-[#F97316]',
      'bg-[#FB923C] group-hover:bg-[#EA580C]',
      'bg-[#F97316] group-hover:bg-[#C2410C]',
      'bg-[#EA580C] group-hover:bg-[#9A3412]',
      'bg-[#C2410C] group-hover:bg-[#7C2D12]',
      'bg-[#9A3412] group-hover:bg-[#431407]'
    ]
  },
  sky: {
    cardBg: 'bg-[#F0F9FF]',
    border: 'border-[#BAE6FD]/80 hover:border-[#7DD3FC]',
    iconColor: 'text-[#0284C7]',
    iconBorder: 'border-sky-100',
    pillBg: 'bg-white/90',
    pillBorder: 'border-sky-100',
    pillText: 'text-[#0284C7]',
    bars: [
      'bg-[#7DD3FC]/60 group-hover:bg-[#0EA5E9]',
      'bg-[#7DD3FC]/80 group-hover:bg-[#0EA5E9]',
      'bg-[#38BDF8] group-hover:bg-[#0284C7]',
      'bg-[#0EA5E9] group-hover:bg-[#0369A1]',
      'bg-[#0284C7] group-hover:bg-[#075985]',
      'bg-[#0369A1] group-hover:bg-[#0C4A6E]',
      'bg-[#075985] group-hover:bg-[#082F49]'
    ]
  },
  lime: {
    cardBg: 'bg-[#F7FEE7]',
    border: 'border-[#D9F99D]/80 hover:border-[#BEF264]',
    iconColor: 'text-[#65A30D]',
    iconBorder: 'border-lime-100',
    pillBg: 'bg-white/90',
    pillBorder: 'border-lime-100',
    pillText: 'text-[#65A30D]',
    bars: [
      'bg-[#BEF264]/60 group-hover:bg-[#84CC16]',
      'bg-[#BEF264]/80 group-hover:bg-[#84CC16]',
      'bg-[#A3E635] group-hover:bg-[#65A30D]',
      'bg-[#84CC16] group-hover:bg-[#4D7C0F]',
      'bg-[#65A30D] group-hover:bg-[#3F6212]',
      'bg-[#4D7C0F] group-hover:bg-[#365314]',
      'bg-[#3F6212] group-hover:bg-[#1A2E05]'
    ]
  },
  rose: {
    cardBg: 'bg-[#FFF1F2]',
    border: 'border-[#FECDD3]/80 hover:border-[#FDA4AF]',
    iconColor: 'text-[#E11D48]',
    iconBorder: 'border-rose-100',
    pillBg: 'bg-white/90',
    pillBorder: 'border-rose-100',
    pillText: 'text-[#E11D48]',
    bars: [
      'bg-[#FDA4AF]/60 group-hover:bg-[#F43F5E]',
      'bg-[#FDA4AF]/80 group-hover:bg-[#F43F5E]',
      'bg-[#FB7185] group-hover:bg-[#E11D48]',
      'bg-[#F43F5E] group-hover:bg-[#BE123C]',
      'bg-[#E11D48] group-hover:bg-[#9F1239]',
      'bg-[#BE123C] group-hover:bg-[#881337]',
      'bg-[#9F1239] group-hover:bg-[#4C0519]'
    ]
  }
}

export default function MetricCard({
  icon: Icon,
  badge,
  value,
  label,
  theme = 'purple',
  onClick,
  className = ''
}) {
  const t = THEMES[theme] || THEMES.purple

  return (
    <div
      onClick={onClick}
      className={`group rounded-[28px] p-5 sm:p-6 ${t.cardBg} border ${t.border} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full bg-white shadow-2xs border ${t.iconBorder} flex items-center justify-center ${t.iconColor} group-hover:scale-105 transition-transform`}>
          {typeof Icon === 'function' ? <Icon size={18} strokeWidth={2} /> : Icon}
        </div>
        {badge && (
          <span className={`${t.pillBg} px-3 py-1 rounded-full text-[11px] font-bold font-sans ${t.pillText} shadow-2xs border ${t.pillBorder}`}>
            {badge}
          </span>
        )}
      </div>

      <div>
        <div className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight stat-number">
          {value}
        </div>
        <div className="text-xs font-semibold text-stone-500 mt-1">
          {label}
        </div>
      </div>

      {/* Stepped progression pill bars */}
      <div className="flex items-center gap-1.5 mt-5">
        <div className={`h-2 w-7 rounded-full ${t.bars[0]} transition-colors`} />
        <div className={`h-2 w-9 rounded-full ${t.bars[1]} transition-colors`} />
        <div className={`h-2 w-11 rounded-full ${t.bars[2]} transition-colors`} />
        <div className={`h-2 w-12 rounded-full ${t.bars[3]} transition-colors`} />
        <div className={`h-2 w-14 rounded-full ${t.bars[4]} transition-colors`} />
        <div className={`h-2 w-14 rounded-full ${t.bars[5]} transition-colors`} />
        <div className={`h-2.5 w-16 rounded-full ${t.bars[6]} transition-colors`} />
      </div>
    </div>
  )
}
