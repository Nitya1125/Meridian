"use client"

import React from 'react'

const COLOR_MAP = {
  green: {
    dot: '#84cc16',
    halo: 'rgba(132, 204, 22, 0.18)',
    bar: 'striped-bar-green',
    text: 'text-lime-700',
    border: 'border-lime-300/60'
  },
  purple: {
    dot: '#a855f7',
    halo: 'rgba(168, 85, 247, 0.18)',
    bar: 'striped-bar-purple',
    text: 'text-purple-700',
    border: 'border-purple-300/60'
  },
  sky: {
    dot: '#0ea5e9',
    halo: 'rgba(14, 165, 233, 0.18)',
    bar: 'striped-bar-sky',
    text: 'text-sky-700',
    border: 'border-sky-300/60'
  },
  blue: {
    dot: '#3b82f6',
    halo: 'rgba(59, 130, 246, 0.18)',
    bar: 'striped-bar-blue',
    text: 'text-blue-700',
    border: 'border-blue-300/60'
  },
  orange: {
    dot: '#f97316',
    halo: 'rgba(249, 115, 22, 0.18)',
    bar: 'striped-bar-orange',
    text: 'text-orange-700',
    border: 'border-orange-300/60'
  },
  rose: {
    dot: '#f43f5e',
    halo: 'rgba(244, 63, 94, 0.18)',
    bar: 'striped-bar-rose',
    text: 'text-rose-700',
    border: 'border-rose-300/60'
  },
  amber: {
    dot: '#f59e0b',
    halo: 'rgba(245, 158, 11, 0.18)',
    bar: 'striped-bar-amber',
    text: 'text-amber-700',
    border: 'border-amber-300/60'
  },
  emerald: {
    dot: '#10b981',
    halo: 'rgba(16, 185, 129, 0.18)',
    bar: 'striped-bar-emerald',
    text: 'text-emerald-700',
    border: 'border-emerald-300/60'
  }
}

const SIZE_MAP = {
  sm: {
    barHeight: 'h-1',
    halo: 'w-4 h-4',
    dot: 'w-2 h-2',
    gap: 'gap-2'
  },
  md: {
    barHeight: 'h-1.5',
    halo: 'w-5 h-5',
    dot: 'w-2.5 h-2.5',
    gap: 'gap-2.5'
  },
  lg: {
    barHeight: 'h-2',
    halo: 'w-6 h-6',
    dot: 'w-3 h-3',
    gap: 'gap-3'
  }
}

/**
 * StripedLoader
 * Kinetic animated loader with leading beacon dot and diagonal flowing stripes.
 * Matches user's custom Figma Make reference image.
 *
 * @param {'green'|'purple'|'sky'|'blue'|'orange'|'rose'|'amber'|'emerald'} [color='green'] - Color theme
 * @param {'sm'|'md'|'lg'} [size='md'] - Sizing option
 * @param {string} [label] - Optional technical status label
 * @param {'line'|'page'|'inline'} [variant='line'] - Layout variant
 * @param {string} [className] - Additional wrapper classes
 * @param {boolean} [showDot=true] - Whether to render leading circular beacon
 */
export default function StripedLoader({
  color = 'green',
  size = 'md',
  label,
  variant = 'line',
  className = '',
  showDot = true
}) {
  const theme = COLOR_MAP[color] || COLOR_MAP.green
  const s = SIZE_MAP[size] || SIZE_MAP.md

  // ── 1. Page-level Fullscreen Loader ──
  if (variant === 'page') {
    return (
      <div className={`flex min-h-screen w-full flex-col items-center justify-center bg-[#FAF8F5] p-4 select-none ${className}`}>
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 border border-stone-200/90 shadow-xl space-y-5 animate-in zoom-in-95 fade-in duration-300">
          
          {/* Brand & Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl bg-[#111318] text-lime-400 flex items-center justify-center font-serif italic text-xs font-bold shadow-2xs">
                M
              </div>
              <span className="font-serif text-sm font-normal text-stone-900">
                Meridian <em className="italic font-serif font-normal text-stone-500">Workspace</em>
              </span>
            </div>
            <span className="tech-badge text-[9.5px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 font-mono">
              Live
            </span>
          </div>

          {/* Kinetic Striped Loader Line */}
          <div className={`flex items-center ${s.gap} w-full`}>
            {showDot && (
              <div
                className={`relative flex items-center justify-center shrink-0 ${s.halo} rounded-full transition-transform`}
                style={{ backgroundColor: theme.halo }}
              >
                <div
                  className={`${s.dot} rounded-full beacon`}
                  style={{ backgroundColor: theme.dot }}
                />
              </div>
            )}
            <div className={`flex-1 ${s.barHeight} rounded-full overflow-hidden bg-stone-100`}>
              <div className={`w-full h-full ${theme.bar} striped-loader-anim rounded-full`} />
            </div>
          </div>

          {/* Technical Status Caption */}
          <div className="flex items-center justify-between text-[11px] font-mono font-medium text-stone-400 pt-1">
            <span className="truncate">{label || 'Syncing workspace session...'}</span>
            <span className="shrink-0 text-stone-500 font-bold ml-2">···</span>
          </div>
        </div>
      </div>
    )
  }

  // ── 2. Standard Horizontal Line Loader (Default) ──
  return (
    <div className={`flex flex-col gap-1.5 w-full select-none ${className}`}>
      <div className={`flex items-center ${s.gap} w-full`}>
        {showDot && (
          <div
            className={`relative flex items-center justify-center shrink-0 ${s.halo} rounded-full`}
            style={{ backgroundColor: theme.halo }}
          >
            <div
              className={`${s.dot} rounded-full beacon`}
              style={{ backgroundColor: theme.dot }}
            />
          </div>
        )}
        <div className={`flex-1 ${s.barHeight} rounded-full overflow-hidden bg-stone-100`}>
          <div className={`w-full h-full ${theme.bar} striped-loader-anim rounded-full`} />
        </div>
      </div>

      {label && (
        <span className={`text-[11px] font-mono font-medium ${theme.text} pl-7`}>
          {label}
        </span>
      )}
    </div>
  )
}
