"use client"

import React, { useRef, useState, useLayoutEffect } from 'react'

/**
 * TactileSegmentedControl
 * High-precision mechanical segmented switch with kinetic spring momentum,
 * fluid stretching indicator pill, and tactile depress feedback.
 */
export default function TactileSegmentedControl({
  options = [],
  value,
  onChange,
  className = ''
}) {
  const containerRef = useRef(null)
  const buttonRefs = useRef({})
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
    stretching: false,
    direction: 'right'
  })
  const [prevVal, setPrevVal] = useState(value)

  // Normalize options to { id, label, badge, dotColor }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string') {
      return { id: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) }
    }
    return opt
  })

  useLayoutEffect(() => {
    const activeBtn = buttonRefs.current[value]
    const container = containerRef.current

    if (activeBtn && container) {
      const containerRect = container.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()

      const newLeft = btnRect.left - containerRect.left
      const newWidth = btnRect.width

      const prevIdx = normalizedOptions.findIndex(o => o.id === prevVal)
      const currentIdx = normalizedOptions.findIndex(o => o.id === value)
      const direction = currentIdx >= prevIdx ? 'left center' : 'right center'
      const isMoving = indicator.ready && value !== prevVal

      setPrevVal(value)

      if (isMoving) {
        setIndicator({
          left: newLeft,
          width: newWidth,
          ready: true,
          stretching: true,
          direction
        })

        const timer = setTimeout(() => {
          setIndicator(prev => ({ ...prev, stretching: false }))
        }, 180)
        return () => clearTimeout(timer)
      } else {
        setIndicator({
          left: newLeft,
          width: newWidth,
          ready: true,
          stretching: false,
          direction
        })
      }
    }
  }, [value, prevVal, normalizedOptions, indicator.ready])

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center bg-stone-200/80 p-1 rounded-2xl border border-stone-300/40 shadow-inner select-none ${className}`}
      role="tablist"
    >
      {/* Fluid Kinetic Indicator Pill */}
      {indicator.ready && (
        <div
          className="absolute top-1 bottom-1 rounded-xl bg-[#111318] shadow-sm pointer-events-none"
          style={{
            transform: `translateX(${indicator.left}px) scaleX(${indicator.stretching ? 1.06 : 1})`,
            transformOrigin: indicator.direction,
            width: `${indicator.width}px`,
            transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Subtle top light edge reflection */}
          <div className="absolute inset-x-1.5 top-0 h-[1px] bg-white/20 rounded-full" />
        </div>
      )}

      {/* Buttons */}
      {normalizedOptions.map((opt) => {
        const isActive = opt.id === value

        return (
          <button
            key={opt.id}
            ref={el => {
              if (el) buttonRefs.current[opt.id] = el
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.id)}
            className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer outline-none active:scale-[0.93] ${
              isActive
                ? 'text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {opt.dotColor && (
              <span
                className="w-2 h-2 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: opt.dotColor }}
              />
            )}
            <span>{opt.label}</span>

            {opt.badge !== undefined && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-mono rounded-full font-bold transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-300/70 text-stone-700'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
