"use client"

import React, { useRef, useState, useCallback } from 'react'
import { MessageIcon, ClockIcon, ZapIcon, CheckIcon } from '@/components/Icons'
import { Gauge, Mail, ArrowRight } from 'lucide-react'
import { PASTEL } from '@/Lib/meridianTheme'

function capacityMeta(hours = 32) {
  const pct = Math.min(100, Math.round((hours / 40) * 100))
  if (hours >= 37) return { pct, label: 'At capacity', tint: 'rose', color: '#f43f5e' }
  if (hours >= 30) return { pct, label: 'Balanced', tint: 'gold', color: '#eab308' }
  return { pct, label: 'Has room', tint: 'mint', color: '#22c55e' }
}

/**
 * MagneticButton: Button that physically pulls toward the cursor within its bounds
 */
function MagneticButton({ children, onClick, className = '', title = '' }) {
  const btnRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const handleMouseMove = (e) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = (e.clientX - centerX) * 0.28
    const dy = (e.clientY - centerY) * 0.28
    setOffset({ x: dx, y: dy })
  }

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 })
    setActive(false)
  }

  return (
    <button
      ref={btnRef}
      type="button"
      title={title}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      className={`relative cursor-pointer transition-transform duration-150 outline-none ${className}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${active ? 0.88 : 1})`,
        transition: offset.x === 0 ? 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out'
      }}
    >
      {children}
    </button>
  )
}

/**
 * KineticMemberCard: Alive, reactive member card with cursor spotlight,
 * living presence halo, capacity gauge, ambient glow, and tactile mechanics.
 */
export default function KineticMemberCard({
  member,
  onMessage,
  onClick
}) {
  const cardRef = useRef(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false })
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const normX = x / rect.width - 0.5
    const normY = y / rect.height - 0.5

    setTilt({
      rx: -(normY * 4.5),
      ry: (normX * 4.5)
    })
    setMouse({ x, y, active: true })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 })
    setMouse(prev => ({ ...prev, active: false }))
  }, [])

  const isOnline = member.status === 'online'
  const isAway = member.status === 'away'
  const hours = member.hours || 32
  const cap = capacityMeta(hours)
  const accentColor = member.color || '#8b5cf6'

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bento-card bento-card-interactive group relative overflow-hidden p-5 flex flex-col justify-between select-none cursor-default active:scale-[0.99] active:translate-y-[1px]"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
        transition: mouse.active
          ? 'transform 0.08s ease-out, box-shadow 0.25s ease'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
      }}
    >
      {/* Ambient Gradient Glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ background: accentColor }}
      />

      {/* Specular Spotlight Glow (Tracks Cursor) */}
      {mouse.active && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-200"
          style={{
            background: `radial-gradient(280px circle at ${mouse.x}px ${mouse.y}px, rgba(17, 19, 24, 0.04), transparent 70%)`
          }}
        />
      )}

      {/* Dynamic Edge Light */}
      {mouse.active && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl border border-stone-900/15"
          style={{
            maskImage: `radial-gradient(160px circle at ${mouse.x}px ${mouse.y}px, black, transparent)`
          }}
        />
      )}

      {/* Card Body */}
      <div className="relative z-10">
        {/* Top Avatar & Living Presence Orb */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="relative">
            {/* Avatar */}
            <div
              className="w-13 h-13 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300 ring-2 ring-white"
              style={{ backgroundColor: accentColor }}
            >
              {member.initials}
            </div>

            {/* Living Presence Beacon */}
            <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
              {isOnline && (
                <>
                  <span className="absolute w-4 h-4 rounded-full bg-emerald-400 opacity-60 animate-ping group-hover:duration-700" />
                  <span className="relative w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs" />
                </>
              )}
              {isAway && (
                <span className="relative w-3.5 h-3.5 rounded-full bg-amber-500 ring-2 ring-white shadow-xs" />
              )}
              {!isOnline && !isAway && (
                <span className="relative w-3.5 h-3.5 rounded-full bg-stone-400 ring-2 ring-white shadow-xs" />
              )}
            </div>
          </div>

          {/* Status Badge with Live Dot */}
          <div className="flex items-center gap-1.5 bg-stone-50 group-hover:bg-stone-100/90 px-2.5 py-1 rounded-xl border border-stone-200/70 transition-colors">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : isAway ? 'bg-amber-500' : 'bg-stone-400'
              }`}
            />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600">
              {member.status}
            </span>
          </div>
        </div>

        {/* Name & Role */}
        <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug group-hover:text-black transition-colors">
          {member.name}
        </h3>
        <div className="mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-stone-100 text-stone-700 border border-stone-200/80">
          {member.role}
        </div>
        <div className="text-[11px] text-stone-400 font-mono mt-1.5 truncate">{member.email}</div>

        {/* Workload Dual Bento Tiles */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[12px]">
          <div className="rounded-xl bg-stone-50 px-3 py-2 border border-stone-200/50">
            <div className="font-mono text-[17px] font-extrabold text-stone-900 leading-tight">
              {member.projects || 1}
            </div>
            <div className="text-[11px] font-medium text-stone-500">Projects</div>
          </div>
          <div className="rounded-xl bg-stone-50 px-3 py-2 border border-stone-200/50">
            <div className="font-mono text-[17px] font-extrabold text-stone-900 leading-tight">
              {member.tasks !== undefined ? member.tasks : (member.projects ? member.projects * 3 : 4)}
            </div>
            <div className="text-[11px] font-medium text-stone-500">Sprint tasks</div>
          </div>
        </div>

        {/* Capacity Gauge Meter */}
        <div className="mt-3.5">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1" style={{ color: cap.color }}>
              <Gauge className="h-3.5 w-3.5" strokeWidth={2.2} />
              {cap.label}
            </span>
            <span className="font-mono text-stone-900 font-bold">{hours}h / 40h</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200/70">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${cap.pct}%`, background: cap.color }}
            />
          </div>
        </div>
      </div>

      {/* Footer Dual Actions */}
      <div className="relative z-10 mt-4 pt-3.5 border-t border-stone-100 flex gap-2">
        <button
          type="button"
          onClick={onMessage}
          className="tactile flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-stone-900 py-2 text-[12px] font-extrabold text-white hover:bg-black cursor-pointer shadow-2xs"
        >
          <Mail className="h-3.5 w-3.5" strokeWidth={2.2} />
          <span>Message</span>
        </button>
        <button
          type="button"
          onClick={onClick}
          className="tactile flex items-center justify-center gap-1 rounded-xl bg-stone-100 px-3 py-2 text-[12px] font-extrabold text-stone-700 hover:bg-stone-200 cursor-pointer"
        >
          <span>Profile</span>
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
