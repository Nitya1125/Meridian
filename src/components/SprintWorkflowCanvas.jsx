"use client"

import React, { useState, useMemo, useRef } from 'react'
import {
  WorkflowIcon, SearchIcon, PlusIcon, FilterIcon, CalendarIcon,
  CheckIcon, CheckDoubleIcon, ArrowUpRightIcon, SparklesIcon,
  LayersIcon, ClockIcon, ZapIcon, GridIcon
} from '@/components/Icons'
import {
  Activity, SlidersHorizontal, Scale, ChevronUp, ChevronDown,
  Layers, Package, Database, ShieldCheck, Dna,
  CheckCircle2, ChevronRight,
  Maximize2, RotateCcw, Box, Cpu, Network, Terminal,
  Workflow, ArrowUpRight, ArrowDownRight,
  Globe, Server
} from 'lucide-react'
import { PASTEL } from '@/Lib/meridianTheme'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { toast } from 'react-hot-toast'

// Project Structural Modules & Packages
const PROJECT_MODULES = [
  { id: 'mod-1', title: 'Prisma Models v2.1', stage: 'spec', tag: 'Data Tier', taskId: 'MRD-001', code: 'core/db' },
  { id: 'mod-2', title: 'Kinetic Physics Engine', stage: 'spec', tag: 'UI Spec', taskId: 'MRD-001', code: 'ui/tokens' },
  { id: 'mod-3', title: 'OAuth2 PKCE Provider', stage: 'presentation', tag: 'Auth Guard', taskId: 'MRD-002', code: 'auth/sso' },
  { id: 'mod-4', title: 'Striped Shaders GL', stage: 'presentation', tag: 'Visuals', taskId: 'MRD-004', code: 'ui/shaders' },
  { id: 'mod-5', title: 'Redis Cache Cluster', stage: 'api', tag: 'Middleware', taskId: 'MRD-003', code: 'api/cache' },
  { id: 'mod-6', title: 'Gesture Interaction Drawer', stage: 'api', tag: 'Client Runtime', taskId: 'MRD-005', code: 'client/drawer' },
  { id: 'mod-7', title: '256-bit Security Guard', stage: 'qa', tag: 'Compliance', taskId: 'MRD-006', code: 'sec/crypto' },
  { id: 'mod-8', title: 'Mutation Test Suite', stage: 'qa', tag: 'Invariants', taskId: 'MRD-007', code: 'qa/fuzz' },
  { id: 'mod-9', title: 'Edge CDN Worker Pool', stage: 'deploy', tag: 'Docker & CDN', taskId: 'MRD-008', code: 'ops/cdn' },
  { id: 'mod-10', title: 'Docker Multi-Region', stage: 'deploy', tag: 'Deploy', taskId: 'MRD-009', code: 'ops/k8s' },
]

export default function SprintWorkflowCanvas({
  columns = [],
  allTasks = [],
  onSelectTask,
  onOpenNewTask,
  onBackToBoard,
}) {
  const { fullName, initials, user } = useCurrentUser()
  const canvasRef = useRef(null)

  // Navigation / Structural Filter States
  const [activeCategory, setActiveCategory] = useState('topology')
  const [activeLayer, setActiveLayer] = useState('all')
  const [stepperIndex, setStepperIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Map real tasks into project modules if available
  const modules = useMemo(() => {
    if (!allTasks || allTasks.length === 0) return PROJECT_MODULES

    return PROJECT_MODULES.map((mod) => {
      const matched = allTasks.find(
        (t) => t.taskId === mod.taskId || t.title?.toLowerCase().includes(mod.title?.toLowerCase())
      )
      if (matched) {
        return {
          ...mod,
          title: matched.title.length > 22 ? matched.title.slice(0, 20) + '…' : matched.title,
          status: matched.status === 'ready' || matched.status === 'done' ? 'done' : matched.status === 'inprogress' ? 'in-progress' : 'todo',
          taskRef: matched,
        }
      }
      return mod
    })
  }, [allTasks])

  const handleModuleClick = (mod) => {
    if (mod.taskRef && onSelectTask) {
      onSelectTask(mod.taskRef)
    } else if (allTasks && allTasks.length > 0 && onSelectTask) {
      onSelectTask(allTasks[0])
    } else {
      toast('Module: ' + mod.title)
    }
  }

  return (
    <div className="w-full space-y-6 mb-12">
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* OUTER RON-DESIGN PROJECT ARCHITECTURE CONSOLE FRAME             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-[32px] sm:rounded-[40px] bg-[#FAF8F5] border border-stone-200/90 shadow-[0_20px_50px_-15px_rgba(18,19,22,0.07)] p-4 sm:p-7 overflow-hidden select-none">
        
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/25 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-violet-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ──────────────────────────────────────────────────────────── */}
        {/* TOP LEVEL DOCK: ORGANIC TITLE BAR & SYSTEM CAPSULES          */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200/60">
          
          {/* Left Title Capsule (Fluid Organic Silhouette) */}
          <div className="flex items-center gap-3">
            {onBackToBoard && (
              <button
                type="button"
                onClick={onBackToBoard}
                title="Return to Board View"
                className="w-10 h-10 rounded-full bg-white border border-stone-200/80 shadow-xs flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <span className="text-base font-semibold leading-none">✕</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-xs">
              <span className="text-[15px] font-extrabold text-stone-900 tracking-tight font-urbanist">
                Project Architecture
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-[17px] font-serif italic text-stone-600 font-normal">
                Structural Workflow & Pipeline
              </span>
            </div>
          </div>

          {/* Right Category Filter Capsules (Project Topology & Architecture Views) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'topology', label: 'System Topology', icon: <Network size={13} /> },
              { id: 'modules', label: 'Modules & Packages', icon: <Package size={13} /> },
              { id: 'contracts', label: 'API Contracts', icon: <Terminal size={13} /> },
              { id: 'dataflow', label: 'Data Flow & DB', icon: <Database size={13} /> },
              { id: 'security', label: 'Security Boundaries', icon: <ShieldCheck size={13} /> },
              { id: 'deptree', label: 'Dependency Tree', icon: <Dna size={13} /> },
            ].map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-white text-stone-950 shadow-xs border border-stone-200/90'
                      : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-violet-600' : 'text-stone-400'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* UPPER TELEMETRY DECK: ARCHITECT PROFILE & SYSTEM GAUGES      */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-stone-200/60">
          
          {/* Project & Lead Profile Card */}
          <div className="flex items-center gap-4 bg-white/95 backdrop-blur-md rounded-3xl p-3.5 sm:px-5 sm:py-4 border border-stone-200/80 shadow-xs max-w-sm shrink-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-amber-400 p-0.5 shadow-xs">
                <div className="w-full h-full rounded-[14px] bg-stone-900 flex items-center justify-center text-white font-bold text-base font-urbanist">
                  {initials || 'AJ'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400">
                  Lead Architect
                </span>
                <span className="inline-flex px-2 py-0.2 rounded-full text-[10px] font-bold bg-lime-100 text-lime-800 font-mono">
                  Operational
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate font-urbanist">
                {fullName || user?.email?.split('@')[0] || 'Alex Johnson'}
              </h3>
              <p className="text-[11.5px] text-stone-500 font-medium truncate">
                Project: <span className="font-serif italic text-stone-700 font-normal">Meridian Core Engine v2.4</span>
              </p>
            </div>
          </div>

          {/* 5 Haute Architectural Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6 flex-1">
            
            {/* 1. Architecture Paradigm */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Architecture
              </span>
              <span className="text-base sm:text-lg font-bold text-stone-900 truncate tracking-tight mt-0.5 font-urbanist">
                Hexagonal / Clean
              </span>
              <span className="text-[11px] text-lime-700 font-bold mt-0.5">
                ● High Cohesion
              </span>
            </div>

            {/* 2. System Health */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                System Health
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  99.4
                </span>
                <span className="text-xs text-stone-500 font-medium">%</span>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                zero critical faults
              </span>
            </div>

            {/* 3. Module Coupling */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Module Coupling
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  18
                </span>
                <span className="text-stone-400 text-sm font-semibold">/</span>
                <span className="tnum text-sm sm:text-base font-bold text-stone-600 font-urbanist">
                  100
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono font-bold">
                low coupling (ideal)
              </span>
            </div>

            {/* 4. Test Coverage */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Test Coverage
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  94.2
                </span>
                <span className="text-xs text-stone-500 font-medium">%</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">
                ✓ 142/142 unit tests
              </span>
            </div>

            {/* 5. Service Latency */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Service Latency
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  24.6
                </span>
                <span className="text-xs text-stone-500 font-medium">ms</span>
              </div>
              <span className="text-[11px] text-lime-700 font-mono">
                p95 response time
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Filter Rail (Architectural Layers & Tiers) */}
        <div className="pt-4 pb-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer shrink-0"
              title="Toggle Architectural Layers"
            >
              <SlidersHorizontal size={13} />
            </button>

            {[
              { id: 'all', label: 'All System Layers' },
              { id: 'spec', label: '01. Spec & Schema' },
              { id: 'presentation', label: '02. Presentation Tier' },
              { id: 'api', label: '03. Application & API' },
              { id: 'qa', label: '04. Verification & QA' },
              { id: 'deploy', label: '05. Edge Infrastructure' },
            ].map((p) => {
              const active = activeLayer === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActiveLayer(p.id)
                    if (p.id !== 'all') {
                      toast(`Focused on section: ${p.label}`)
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#111318] text-white shadow-xs ring-1 ring-stone-900/10'
                      : 'bg-stone-100/80 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 border border-transparent'
                  }`}
                >
                  {active && p.id !== 'all' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5F722] animate-pulse" />
                  )}
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* Canvas View Controls (Zoom / Reset) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.2))}
              className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-600 hover:text-stone-900 shadow-2xs cursor-pointer"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.85))}
              className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-600 hover:text-stone-900 shadow-2xs cursor-pointer"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-[11px] font-bold text-stone-600 hover:text-stone-900 shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* THE MAIN INTERACTIVE ARCHITECTURE & PIPELINE CANVAS          */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div
          ref={canvasRef}
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          className="relative mt-6 w-full overflow-x-auto transition-transform duration-200 py-4 scrollbar-thin"
        >
          {/* Internal min-width canvas container */}
          <div className="relative min-w-[1620px] pb-6 px-4">

            {/* ══════════════════════════════════════════════════════════ */}
            {/* CONTINUOUS CENTRAL TIMELINE TRUNK LINE (MIDDLE BACKBONE)   */}
            {/* ══════════════════════════════════════════════════════════ */}
            {/* Horizontal timeline track passing through vertical center of canvas */}
            <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 pointer-events-none z-0">
              {/* Dual-rail gradient line */}
              <div className="w-full h-[3px] bg-gradient-to-r from-amber-400 via-rose-400 via-violet-500 via-emerald-400 to-sky-400 rounded-full opacity-80 shadow-xs" />
              <div className="w-full h-[1px] bg-stone-300/70 mt-[2px]" />
              
              {/* Git commit track guide dashes */}
              <div className="w-full h-px border-b border-dashed border-stone-400/40 -mt-[6px]" />
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 5-STAGE TREE / GITHUB BRANCH COLUMNS GRID                 */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="relative z-10 flex items-center gap-7">

              {/* Leftmost Architecture Spec Peek Slit */}
              <div
                className={`transition-all duration-300 shrink-0 ${
                  activeLayer !== 'all' && activeLayer !== 'spec'
                    ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                <div
                  onClick={() => toast('Displaying Architecture Schema & Entity Graph')}
                  className="w-12 h-56 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/60 p-1.5 shadow-md flex flex-col items-center justify-between cursor-pointer hover:w-14 transition-all group overflow-hidden"
                >
                  <div className="w-full h-20 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 flex flex-col items-center justify-center p-1 text-[9px] font-mono text-stone-400">
                    <Network size={15} className="text-violet-400 mb-1" />
                    <span className="text-[8px] uppercase">SCHEMA</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                  <span className="text-[8px] font-mono font-bold text-stone-400 -rotate-90 whitespace-nowrap mb-2">
                    SYS TOPOLOGY
                  </span>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 01: SPEC & SCHEMA                                   */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'spec'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'spec'

                return (
                  <div
                    className={`w-[285px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* TIER 1: UPPER BRANCH (TOP CARD & MODULE) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {/* 1. Module Complexity & Coupling Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        {/* Focus Attention Badge */}
                        {isFocused && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#111318] text-[#E5F722] text-[9px] font-mono font-bold tracking-wider">
                              ● IN FOCUS · STAGE 01
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Module Complexity & Coupling
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Scale size={13} />
                          </div>
                        </div>

                        <span className="text-[10.5px] font-mono font-semibold text-stone-400">
                          Cyclomatic Index · Stage 01
                        </span>

                        {/* Dual-Layer Undulating Wave Chart Area */}
                        <div className="relative w-full h-20 my-2.5 overflow-hidden rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-center">
                          <svg viewBox="0 0 240 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="waveTopGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#facc15" stopOpacity="0.85" />
                                <stop offset="50%" stopColor="#a3e635" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#facc15" stopOpacity="0.85" />
                              </linearGradient>
                              <linearGradient id="waveBottomGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#d6d3d1" stopOpacity="0.7" />
                                <stop offset="50%" stopColor="#a8a29e" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#d6d3d1" stopOpacity="0.7" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 50 Q 40 30, 80 52 T 160 45 T 240 50 L 240 80 L 0 80 Z" fill="url(#waveBottomGrad1)" />
                            <path d="M 0 35 Q 40 18, 80 34 T 160 26 T 240 35 L 240 50 L 0 50 Z" fill="url(#waveTopGrad1)" />
                          </svg>

                          <div className="relative z-10 px-3 py-0.5 rounded-full bg-[#111318] text-white text-[11px] font-mono font-bold shadow-md border border-white/20">
                            180 LOC <span className="text-stone-400 text-[10px]">/</span> 14 Deps
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="text-stone-500 font-medium text-[11px]">
                            Avg Cohesion: <strong className="tnum text-stone-800">89% High</strong>
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                            +10% Stability
                          </span>
                        </div>
                      </div>

                      {/* Upper Module Pill */}
                      <div
                        onClick={() => handleModuleClick(modules[1])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Cpu size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[1]?.title || 'Kinetic Physics Engine'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          UI Spec
                        </span>
                      </div>
                    </div>

                    {/* UPPER TREE CONNECTOR (CURVES UP FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 36 C 50 16, 50 16, 50 0"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 2: MIDDLE TIMELINE MILESTONE NODE (TRUNK) */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'spec' ? 'all' : 'spec')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-[#E5F722] text-stone-950 ring-4 ring-lime-400/90 shadow-[0_0_30px_rgba(229,247,34,0.9)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-[#E5F722] text-stone-900 border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Click to focus Spec & Schema"
                        >
                          <Database size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
                      </div>

                      {/* Milestone Label */}
                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        01. Spec <span className="font-mono text-[10px] text-stone-400">& Schema</span>
                      </span>
                    </div>

                    {/* LOWER TREE CONNECTOR (CURVES DOWN FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 0 C 50 20, 50 20, 50 36"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 3: LOWER BRANCH (MODULE & BOTTOM CARD) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {/* Lower Module Pill */}
                      <div
                        onClick={() => handleModuleClick(modules[0])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Database size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[0]?.title || 'Prisma Models v2.1'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          Data Tier
                        </span>
                      </div>

                      {/* 2. System Anatomy & Dependencies Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            System Anatomy & Deps
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Network size={13} />
                          </div>
                        </div>

                        {/* Node Wireframe Graphic */}
                        <div className="relative w-full h-20 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-center overflow-hidden p-1.5">
                          <svg viewBox="0 0 160 80" className="w-24 h-16 opacity-80">
                            <circle cx="80" cy="18" r="8" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="1.5" />
                            <path d="M 80 26 L 80 50 M 65 35 L 95 35 M 65 35 L 55 65 M 95 35 L 105 65 M 80 50 L 70 75 M 80 50 L 90 75" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="80" cy="18" r="4" fill="#84cc16" className="animate-ping" />
                            <circle cx="80" cy="18" r="3" fill="#84cc16" />
                            <circle cx="80" cy="38" r="3" fill="#6366f1" />
                          </svg>

                          <div className="absolute top-1.5 left-1.5 px-2 py-0.2 rounded-md bg-emerald-100 border border-emerald-200 text-emerald-800 text-[9.5px] font-bold">
                            0 Circular Deps
                          </div>
                          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.2 rounded-md bg-indigo-100 border border-indigo-200 text-indigo-800 text-[9.5px] font-bold">
                            Pool: 98%
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]">
                            Figma Drift: 2%
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                            SSO Guard
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 02: PRESENTATION TIER                               */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'presentation'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'presentation'

                return (
                  <div
                    className={`w-[285px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* TIER 1: UPPER BRANCH (TOP CARD & MODULE) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {/* Client Hydration & Frame Budget Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        {isFocused && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#111318] text-[#E5F722] text-[9px] font-mono font-bold tracking-wider">
                              ● IN FOCUS · STAGE 02
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Client Hydration & Budget
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <SparklesIcon size={13} />
                          </div>
                        </div>

                        <span className="text-[10.5px] font-mono font-semibold text-stone-400">
                          Frame Budget · Stage 02
                        </span>

                        <div className="relative w-full h-20 my-2.5 overflow-hidden rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-center">
                          <svg viewBox="0 0 240 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path d="M 0 55 Q 40 40, 80 50 T 160 42 T 240 55 L 240 80 L 0 80 Z" fill="#d8b4fe" fillOpacity="0.5" />
                            <path d="M 0 30 Q 40 15, 80 32 T 160 22 T 240 30 L 240 55 L 0 55 Z" fill="#a855f7" fillOpacity="0.8" />
                          </svg>

                          <div className="relative z-10 px-3 py-0.5 rounded-full bg-[#111318] text-white text-[11px] font-mono font-bold shadow-md border border-white/20">
                            60.2 FPS <span className="text-stone-400 text-[10px]">·</span> 1.2ms TTI
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="text-stone-500 font-medium text-[11px]">
                            CLS: <strong className="tnum text-stone-800">0.001 Clean</strong>
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full font-mono">
                            Hydrate: 18ms
                          </span>
                        </div>
                      </div>

                      {/* Upper Module Pill */}
                      <div
                        onClick={() => handleModuleClick(modules[3])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Box size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[3]?.title || 'Striped Shaders GL'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          Visuals
                        </span>
                      </div>
                    </div>

                    {/* UPPER TREE CONNECTOR (CURVES UP FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 36 C 50 16, 50 16, 50 0"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 2: MIDDLE TIMELINE MILESTONE NODE (TRUNK) */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'presentation' ? 'all' : 'presentation')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-[#E5F722] text-stone-950 ring-4 ring-lime-400/90 shadow-[0_0_30px_rgba(229,247,34,0.9)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-[#E5F722] text-stone-900 border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Click to focus Presentation Tier"
                        >
                          <Layers size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        02. Presentation <span className="font-mono text-[10px] text-stone-400">Tier</span>
                      </span>
                    </div>

                    {/* LOWER TREE CONNECTOR (CURVES DOWN FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 0 C 50 20, 50 20, 50 36"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 3: LOWER BRANCH (MODULE & BOTTOM CARD) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        onClick={() => handleModuleClick(modules[2])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Package size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[2]?.title || 'OAuth2 PKCE Provider'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          Auth Guard
                        </span>
                      </div>

                      {/* Design System & Kinetic Tokens Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Design System Tokens
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Layers size={13} />
                          </div>
                        </div>

                        <div className="relative w-full h-20 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-around overflow-hidden p-2">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-lg bg-violet-600 shadow-xs" />
                            <span className="text-[8.5px] font-mono text-stone-500 font-bold">#7c3aed</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-lg bg-amber-400 shadow-xs" />
                            <span className="text-[8.5px] font-mono text-stone-500 font-bold">#fbbf24</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-lg bg-[#E5F722] shadow-xs" />
                            <span className="text-[8.5px] font-mono text-stone-500 font-bold">#e5f722</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-lg bg-stone-900 shadow-xs" />
                            <span className="text-[8.5px] font-mono text-stone-500 font-bold">#1c1917</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                            WCAG AAA 100%
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                            Coverage: 96%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 03: CORE APPLICATION & API                          */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'api'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'api'

                return (
                  <div
                    className={`w-[285px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* TIER 1: UPPER BRANCH (TOP CARD & MODULE) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {/* API Gateway Throughput Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        {isFocused && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#111318] text-[#E5F722] text-[9px] font-mono font-bold tracking-wider">
                              ● IN FOCUS · STAGE 03
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            API Gateway Throughput
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Scale size={13} />
                          </div>
                        </div>

                        <span className="text-[10.5px] font-mono font-semibold text-stone-400">
                          p95 Latency · Core Engine
                        </span>

                        <div className="relative w-full h-20 my-2.5 overflow-hidden rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-center">
                          <svg viewBox="0 0 240 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path d="M 0 55 Q 40 40, 80 50 T 160 42 T 240 55 L 240 80 L 0 80 Z" fill="#a8a29e" fillOpacity="0.6" />
                            <path d="M 0 30 Q 40 15, 80 32 T 160 22 T 240 30 L 240 55 L 0 55 Z" fill="#84cc16" fillOpacity="0.8" />
                          </svg>

                          <div className="relative z-10 px-3 py-0.5 rounded-full bg-[#111318] text-white text-[11px] font-mono font-bold shadow-md border border-white/20">
                            240 req/s <span className="text-stone-400 text-[10px]">·</span> 24ms
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="text-stone-500 font-medium text-[11px]">
                            P99 Load: <strong className="tnum text-stone-800">42ms</strong>
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                            100% Uptime
                          </span>
                        </div>
                      </div>

                      {/* Upper Module Pill */}
                      <div
                        onClick={() => handleModuleClick(modules[5])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Box size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[5]?.title || 'Gesture Interaction'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          Client
                        </span>
                      </div>
                    </div>

                    {/* UPPER TREE CONNECTOR (CURVES UP FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 36 C 50 16, 50 16, 50 0"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 2: MIDDLE TIMELINE MILESTONE NODE (TRUNK) */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'api' ? 'all' : 'api')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-[#E5F722] text-stone-950 ring-4 ring-lime-400/90 shadow-[0_0_30px_rgba(229,247,34,0.9)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-[#E5F722] text-stone-900 border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Click to focus Application & API"
                        >
                          <Cpu size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        03. Core API <span className="font-mono text-[10px] text-stone-400">& Logic</span>
                      </span>
                    </div>

                    {/* LOWER TREE CONNECTOR (CURVES DOWN FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 0 C 50 20, 50 20, 50 36"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 3: LOWER BRANCH (MODULE & BOTTOM CARD) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        onClick={() => handleModuleClick(modules[4])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Cpu size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[4]?.title || 'Redis Cache Cluster'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          x3 Nodes
                        </span>
                      </div>

                      {/* CI/CD Build Pulse (Heartbeat) Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            CI/CD Build Pulse
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Scale size={13} />
                          </div>
                        </div>

                        {/* Animated Continuous Build Waveform Monitor */}
                        <div className="relative w-full h-20 rounded-2xl bg-[#111318] border border-stone-800 flex items-center justify-center overflow-hidden p-2">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px]" />
                          <svg viewBox="0 0 240 60" className="w-full h-full stroke-lime-400 fill-none">
                            <path
                              d="M 0 30 L 40 30 L 50 15 L 60 45 L 70 10 L 80 50 L 90 30 L 130 30 L 140 18 L 150 42 L 160 30 L 200 30 L 210 12 L 220 48 L 230 30 L 240 30"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-pulse"
                            />
                          </svg>
                          <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-lime-400 font-bold">
                            ● RUNNER ACTIVE · 120ms
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2.5 border-t border-stone-100 mt-2">
                          <span className="text-stone-500 font-medium text-[11px]">34 Checks Passing</span>
                          <span className="font-bold text-stone-800 font-mono text-[11px]">0 Regressions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 04: VERIFICATION & QA                               */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'qa'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'qa'

                return (
                  <div
                    className={`w-[285px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* TIER 1: UPPER BRANCH (TOP CARD & MODULE) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {/* Security & Compliance Guard Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        {isFocused && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#111318] text-[#E5F722] text-[9px] font-mono font-bold tracking-wider">
                              ● IN FOCUS · STAGE 04
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Security & Trust Guard
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <ShieldCheck size={13} />
                          </div>
                        </div>

                        <span className="text-[10.5px] font-mono font-semibold text-stone-400">
                          Compliance & Cryptography
                        </span>

                        <div className="relative w-full h-20 my-2.5 overflow-hidden rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-center">
                          <svg viewBox="0 0 240 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path d="M 0 50 Q 40 35, 80 48 T 160 38 T 240 50 L 240 80 L 0 80 Z" fill="#bbf7d0" fillOpacity="0.6" />
                            <path d="M 0 28 Q 40 12, 80 28 T 160 18 T 240 28 L 240 50 L 0 50 Z" fill="#22c55e" fillOpacity="0.8" />
                          </svg>

                          <div className="relative z-10 px-3 py-0.5 rounded-full bg-[#111318] text-white text-[11px] font-mono font-bold shadow-md border border-white/20">
                            AES-256-GCM <span className="text-stone-400 text-[10px]">·</span> 0 CVEs
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="text-stone-500 font-medium text-[11px]">
                            SOC2: <strong className="tnum text-stone-800">Type II Valid</strong>
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                            Zero-Trust RBAC
                          </span>
                        </div>
                      </div>

                      {/* Upper Module Pill */}
                      <div
                        onClick={() => handleModuleClick(modules[6])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <ShieldCheck size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[6]?.title || '256-bit Security Guard'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          Compliance
                        </span>
                      </div>
                    </div>

                    {/* UPPER TREE CONNECTOR (CURVES UP FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 36 C 50 16, 50 16, 50 0"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 2: MIDDLE TIMELINE MILESTONE NODE (TRUNK) */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'qa' ? 'all' : 'qa')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-[#E5F722] text-stone-950 ring-4 ring-lime-400/90 shadow-[0_0_30px_rgba(229,247,34,0.9)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-[#E5F722] text-stone-900 border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Click to focus Verification & QA"
                        >
                          <ShieldCheck size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        04. Verify <span className="font-mono text-[10px] text-stone-400">& Audit</span>
                      </span>
                    </div>

                    {/* LOWER TREE CONNECTOR (CURVES DOWN FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 0 C 50 20, 50 20, 50 36"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 3: LOWER BRANCH (MODULE & BOTTOM CARD) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        onClick={() => handleModuleClick(modules[7] || modules[0])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <CheckCircle2 size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[7]?.title || 'Mutation Test Suite'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          Invariants
                        </span>
                      </div>

                      {/* Automated Test Matrix & Coverage Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Automated Test Matrix
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <CheckCircle2 size={13} />
                          </div>
                        </div>

                        <div className="relative w-full h-20 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex flex-col justify-center px-3 gap-1.5">
                          <div className="flex items-center justify-between text-[10.5px]">
                            <span className="font-semibold text-stone-600">Unit Tests (142/142)</span>
                            <span className="font-mono font-bold text-emerald-600">100%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-emerald-500 rounded-full" />
                          </div>

                          <div className="flex items-center justify-between text-[10.5px] mt-0.5">
                            <span className="font-semibold text-stone-600">Integration & E2E (50)</span>
                            <span className="font-mono font-bold text-emerald-600">98%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div className="w-[98%] h-full bg-lime-500 rounded-full" />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                            98.4% Coverage
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF9C3] text-[#A16207] border border-[#FEF08A]">
                            0 Regressions
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 05: EDGE INFRASTRUCTURE                             */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'deploy'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'deploy'

                return (
                  <div
                    className={`w-[285px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* TIER 1: UPPER BRANCH (TOP CARD & MODULE) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {/* Edge CDN & Global POP Routing Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        {isFocused && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#111318] text-[#E5F722] text-[9px] font-mono font-bold tracking-wider">
                              ● IN FOCUS · STAGE 05
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Edge CDN & POP Routing
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Globe size={13} />
                          </div>
                        </div>

                        <span className="text-[10.5px] font-mono font-semibold text-stone-400">
                          Global Latency · Stage 05
                        </span>

                        <div className="relative w-full h-20 my-2.5 overflow-hidden rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-center">
                          <svg viewBox="0 0 240 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path d="M 0 52 Q 40 38, 80 46 T 160 40 T 240 52 L 240 80 L 0 80 Z" fill="#bae6fd" fillOpacity="0.6" />
                            <path d="M 0 28 Q 40 14, 80 30 T 160 20 T 240 28 L 240 50 L 0 50 Z" fill="#0284c7" fillOpacity="0.8" />
                          </svg>

                          <div className="relative z-10 px-3 py-0.5 rounded-full bg-[#111318] text-white text-[11px] font-mono font-bold shadow-md border border-white/20">
                            14 Global POPs <span className="text-stone-400 text-[10px]">·</span> 12ms TTFB
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="text-stone-500 font-medium text-[11px]">
                            Anycast: <strong className="tnum text-stone-800">100% Active</strong>
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full font-mono">
                            Edge Workers
                          </span>
                        </div>
                      </div>

                      {/* Upper Module Pill */}
                      <div
                        onClick={() => handleModuleClick(modules[8] || modules[0])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Server size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[8]?.title || 'Edge CDN Worker Pool'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          CDN Mesh
                        </span>
                      </div>
                    </div>

                    {/* UPPER TREE CONNECTOR (CURVES UP FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 36 C 50 16, 50 16, 50 0"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 2: MIDDLE TIMELINE MILESTONE NODE (TRUNK) */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'deploy' ? 'all' : 'deploy')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-[#E5F722] text-stone-950 ring-4 ring-lime-400/90 shadow-[0_0_30px_rgba(229,247,34,0.9)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-[#E5F722] text-stone-900 border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Click to focus Edge Infrastructure"
                        >
                          <Network size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        05. Edge <span className="font-mono text-[10px] text-stone-400">Deploy</span>
                      </span>
                    </div>

                    {/* LOWER TREE CONNECTOR (CURVES DOWN FROM MIDDLE) */}
                    <div className="w-full flex flex-col items-center my-0.5 relative">
                      <svg viewBox="0 0 100 36" className="w-16 h-7 overflow-visible">
                        <path
                          d="M 50 0 C 50 20, 50 20, 50 36"
                          fill="none"
                          stroke={isFocused ? '#84cc16' : isMuted ? '#d6d3d1' : '#a8a29e'}
                          strokeWidth={isFocused ? '2.5' : '1.75'}
                        />
                        <circle cx="50" cy="18" r={isFocused ? '4' : '3'} fill={isFocused ? '#84cc16' : '#a8a29e'} stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* TIER 3: LOWER BRANCH (MODULE & BOTTOM CARD) */}
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        onClick={() => handleModuleClick(modules[9] || modules[0])}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Package size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {modules[9]?.title || 'Docker Multi-Region'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          Deploy
                        </span>
                      </div>

                      {/* Container Mesh & Autoscaling Card */}
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Container Mesh & K8s
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Server size={13} />
                          </div>
                        </div>

                        <div className="relative w-full h-20 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-center overflow-hidden p-2">
                          <div className="grid grid-cols-4 gap-2 w-full">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((pod) => (
                              <div key={pod} className="flex items-center gap-1 bg-white p-1 rounded-md border border-stone-200 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-mono text-stone-600 font-bold">p-{pod}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                            0.4s Cold Start
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                            99.99% SLA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* ACTION NODE: ADD NEW TASK / MODULE PIN (+)                */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="shrink-0 flex flex-col items-center justify-center pt-20 pl-2">
                <div className="relative group">
                  <button
                    type="button"
                    onClick={onOpenNewTask}
                    title="Add Architectural Module / Task"
                    className="w-11 h-11 rounded-full bg-[#111318] text-white shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
                  >
                    <PlusIcon size={16} />
                  </button>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] font-bold text-stone-500 font-urbanist opacity-0 group-hover:opacity-100 transition-opacity">
                    Add Module
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
