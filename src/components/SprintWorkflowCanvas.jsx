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
  Globe, Server, User, AlertTriangle, CheckCircle, Flag
} from 'lucide-react'
import { PASTEL } from '@/Lib/meridianTheme'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { toast } from 'react-hot-toast'

// Priority colors and badges
const PRIORITY_THEME = {
  CRITICAL: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  HIGH: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  MEDIUM: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  LOW: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-400' },
}

export default function SprintWorkflowCanvas({
  columns = [],
  allTasks = [],
  activeOrg = null,
  members = [],
  onSelectTask,
  onOpenNewTask,
  onBackToBoard,
}) {
  const { fullName, initials, user } = useCurrentUser()
  const canvasRef = useRef(null)

  // Navigation / Structural Filter States
  const [activeCategory, setActiveCategory] = useState('all') // 'all' | 'priority' | 'my-tasks' | 'in-flight' | 'completed'
  const [activeLayer, setActiveLayer] = useState('all') // 'all' | 'TODO' | 'IN_PROGRESS' | 'READY' | 'DONE' | 'SUMMARY'
  const [zoomLevel, setZoomLevel] = useState(1)

  // Group real tasks by normalized canonical status
  const tasksByStage = useMemo(() => {
    const todoTasks = allTasks.filter(t => t.status === 'TODO' || t.status === 'todo')
    const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'inprogress')
    const readyTasks = allTasks.filter(t => t.status === 'READY' || t.status === 'ready' || t.status === 'review' || t.status === 'REVIEW')
    const doneTasks = allTasks.filter(t => t.status === 'DONE' || t.status === 'done' || t.status === 'completed')

    return {
      TODO: todoTasks,
      IN_PROGRESS: inProgressTasks,
      READY: readyTasks,
      DONE: doneTasks,
    }
  }, [allTasks])

  // Filter tasks based on active category
  const filteredTasksByStage = useMemo(() => {
    const filterFn = (task) => {
      if (activeCategory === 'priority') {
        const p = (task.priority || '').toUpperCase()
        return p === 'CRITICAL' || p === 'HIGH'
      }
      if (activeCategory === 'my-tasks') {
        const uid = user?.id
        if (!uid) return true
        return String(task.assigned_to) === String(uid) || task.assignees?.some(a => String(a.id) === String(uid))
      }
      if (activeCategory === 'in-flight') {
        const st = (task.status || '').toUpperCase()
        return st === 'IN_PROGRESS' || st === 'READY'
      }
      if (activeCategory === 'completed') {
        const st = (task.status || '').toUpperCase()
        return st === 'DONE'
      }
      return true
    }

    return {
      TODO: tasksByStage.TODO.filter(filterFn),
      IN_PROGRESS: tasksByStage.IN_PROGRESS.filter(filterFn),
      READY: tasksByStage.READY.filter(filterFn),
      DONE: tasksByStage.DONE.filter(filterFn),
    }
  }, [tasksByStage, activeCategory, user])

  // Real-time telemetry metrics derived from actual workspace tasks
  const telemetry = useMemo(() => {
    const total = allTasks.length
    const doneCount = tasksByStage.DONE.length
    const inProgressCount = tasksByStage.IN_PROGRESS.length
    const readyCount = tasksByStage.READY.length
    const todoCount = tasksByStage.TODO.length

    const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0

    const criticalOrHigh = allTasks.filter(t => {
      const p = (t.priority || '').toUpperCase()
      return p === 'CRITICAL' || p === 'HIGH'
    }).length

    // Calculate total estimated workload (e.g., in days or hours)
    let totalEstimatedDays = 0
    allTasks.forEach(t => {
      const val = Number(t.estimated_time_value) || 0
      const unit = (t.estimated_time_unit || 'DAYS').toUpperCase()
      if (unit === 'HOURS') totalEstimatedDays += Math.round(val / 8)
      else if (unit === 'WEEKS') totalEstimatedDays += val * 5
      else totalEstimatedDays += val
    })

    return {
      total,
      doneCount,
      inProgressCount,
      readyCount,
      todoCount,
      completionRate,
      criticalOrHigh,
      totalEstimatedDays: totalEstimatedDays || (total * 2),
      activeAssigneesCount: new Set(allTasks.map(t => t.assigned_to).filter(Boolean)).size,
    }
  }, [allTasks, tasksByStage])

  // Handle task selection to open details modal
  const handleTaskClick = (task) => {
    if (!task) return
    if (onSelectTask) {
      onSelectTask(task)
    } else {
      toast.success(`Task: ${task.title}`)
    }
  }

  // Helper renderer for a single rich task bento card
  const renderTaskCard = (task, stageColId, isFocused) => {
    if (!task) return null
    const priority = (task.priority || 'MEDIUM').toUpperCase()
    const pTheme = PRIORITY_THEME[priority] || PRIORITY_THEME.MEDIUM
    const assignee = task.assignees?.[0]

    return (
      <div
        onClick={() => handleTaskClick(task)}
        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all cursor-pointer group hover:shadow-md ${
          isFocused
            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
            : 'border-stone-200/90 hover:border-stone-400'
        }`}
      >
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              {task.taskId || `TSK-${task.task_id || task.id}`}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${pTheme.bg} ${pTheme.text} ${pTheme.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pTheme.dot}`} />
              {priority}
            </span>
          </div>

          <div className="w-6 h-6 rounded-full bg-stone-50 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-400 transition-colors">
            <ArrowUpRight size={12} />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-stone-900 font-urbanist line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors">
          {task.title}
        </h4>

        {/* Description snippet */}
        {task.description && (
          <p className="text-[11px] text-stone-500 font-medium line-clamp-2 mt-1">
            {task.description}
          </p>
        )}

        {/* Bottom meta: Assignee, due date, estimated time */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5">
            {assignee ? (
              <div
                style={{ backgroundColor: assignee.color || '#8b5cf6' }}
                className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                title={assignee.name}
              >
                {assignee.initials || 'U'}
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 text-[9px] font-bold flex items-center justify-center">
                <User size={10} />
              </div>
            )}
            <span className="text-[11px] text-stone-600 font-semibold truncate max-w-[100px]">
              {assignee?.name || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-medium text-stone-500">
            {task.due && <span>{task.due}</span>}
            {task.estimated_time_value && (
              <span className="bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded">
                {task.estimated_time_value} {task.estimated_time_unit?.slice(0, 1) || 'd'}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Helper renderer for empty stage card
  const renderEmptyStageCard = (stageTitle, stageColId, isFocused) => {
    return (
      <div
        className={`w-full p-5 bg-white/70 backdrop-blur-sm rounded-3xl border border-dashed border-stone-300 flex flex-col items-center justify-center text-center transition-all ${
          isFocused ? 'ring-2 ring-lime-400/90 border-lime-400' : ''
        }`}
      >
        <div className="w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-2">
          <Package size={16} />
        </div>
        <h5 className="text-xs font-bold text-stone-800 font-urbanist">
          No tasks in {stageTitle}
        </h5>
        <p className="text-[11px] text-stone-400 mt-0.5 mb-3 font-medium">
          Create a task or drag an existing card here
        </p>
        <button
          type="button"
          onClick={() => onOpenNewTask?.(stageColId)}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-bold hover:bg-stone-800 transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          <PlusIcon size={12} />
          <span>Add to {stageTitle}</span>
        </button>
      </div>
    )
  }

  // Helper renderer for upper/lower module pill
  const renderTaskPill = (task, defaultTag = 'Task') => {
    if (!task) return null
    const priority = (task.priority || 'MEDIUM').toUpperCase()
    const pTheme = PRIORITY_THEME[priority] || PRIORITY_THEME.MEDIUM

    return (
      <div
        onClick={() => handleTaskClick(task)}
        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div className="w-5 h-5 rounded-full bg-white group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center text-stone-700 transition-colors">
          <Box size={11} />
        </div>
        <span className="text-[11.5px] font-bold font-urbanist truncate max-w-[160px]">
          {task.title}
        </span>
        <span className={`text-[9px] font-mono font-bold ml-auto px-1.5 py-0.2 rounded-md ${pTheme.bg} ${pTheme.text}`}>
          {priority}
        </span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 mb-12">
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* OUTER PROJECT ARCHITECTURE & WORKFLOW CONSOLE FRAME              */}
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
                Sprint Workflow
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-[17px] font-serif italic text-stone-600 font-normal">
                {activeOrg?.name || 'Project Pipeline'}
              </span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-lime-100 text-lime-800 border border-lime-200">
                {allTasks.length} Live Tasks
              </span>
            </div>
          </div>

          {/* Right Category Filter Capsules (Live Task Filtering) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'all', label: `All Tasks (${allTasks.length})`, icon: <Layers size={13} /> },
              { id: 'priority', label: `Priority (${telemetry.criticalOrHigh})`, icon: <AlertTriangle size={13} /> },
              { id: 'my-tasks', label: 'My Tasks', icon: <User size={13} /> },
              { id: 'in-flight', label: `In Flight (${telemetry.inProgressCount + telemetry.readyCount})`, icon: <Cpu size={13} /> },
              { id: 'completed', label: `Shipped (${telemetry.doneCount})`, icon: <CheckCircle2 size={13} /> },
            ].map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id)
                    if (cat.id !== 'all') {
                      toast(`Filtered workflow: ${cat.label}`)
                    }
                  }}
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
        {/* UPPER TELEMETRY DECK: REAL WORKSPACE METRICS & TEAM GAUGES   */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-stone-200/60">

          {/* Project & Lead Profile Card */}
          <div className="flex items-center gap-4 bg-white/95 backdrop-blur-md rounded-3xl p-3.5 sm:px-5 sm:py-4 border border-stone-200/80 shadow-xs max-w-sm shrink-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-amber-400 p-0.5 shadow-xs">
                <div className="w-full h-full rounded-[14px] bg-stone-900 flex items-center justify-center text-white font-bold text-base font-urbanist">
                  {initials || 'U'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400">
                  Lead Contributor
                </span>
                <span className="inline-flex px-2 py-0.2 rounded-full text-[10px] font-bold bg-lime-100 text-lime-800 font-mono">
                  Synced
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate font-urbanist">
                {fullName || user?.email?.split('@')[0] || 'Team Lead'}
              </h3>
              <p className="text-[11.5px] text-stone-500 font-medium truncate">
                Workspace: <span className="font-serif italic text-stone-700 font-normal">{activeOrg?.name || 'Main Workspace'}</span>
              </p>
            </div>
          </div>

          {/* 5 Real Dynamic Telemetry Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6 flex-1">

            {/* 1. Total Pipeline Scope */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Pipeline Scope
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  {telemetry.total}
                </span>
                <span className="text-xs text-stone-500 font-medium">tasks</span>
              </div>
              <span className="text-[11px] text-violet-700 font-bold mt-0.5">
                ● {telemetry.doneCount} Shipped
              </span>
            </div>

            {/* 2. Completion Progress */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Sprint Progress
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  {telemetry.completionRate}
                </span>
                <span className="text-xs text-stone-500 font-medium">%</span>
              </div>
              <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${telemetry.completionRate}%` }}
                />
              </div>
            </div>

            {/* 3. In Active Implementation */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                In Active Build
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  {telemetry.inProgressCount}
                </span>
                <span className="text-stone-400 text-sm font-semibold">/</span>
                <span className="tnum text-sm sm:text-base font-bold text-stone-600 font-urbanist">
                  {telemetry.total}
                </span>
              </div>
              <span className="text-[11px] text-sky-600 font-mono font-bold">
                in development
              </span>
            </div>

            {/* 4. Verification & QA */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Under Review
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-urbanist">
                  {telemetry.readyCount}
                </span>
                <span className="text-xs text-stone-500 font-medium">items</span>
              </div>
              <span className="text-[11px] text-amber-700 font-bold">
                audit & QA check
              </span>
            </div>

            {/* 5. Urgency Watch */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                Priority Watch
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="tnum text-xl sm:text-2xl font-extrabold text-rose-600 tracking-tight font-urbanist">
                  {telemetry.criticalOrHigh}
                </span>
                <span className="text-xs text-stone-500 font-medium">high priority</span>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                {telemetry.totalEstimatedDays}d total effort
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Filter Rail (Architectural Layers & Stage Focus) */}
        <div className="pt-4 pb-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer shrink-0"
              title="Filter Workflow Stages"
            >
              <SlidersHorizontal size={13} />
            </button>

            {[
              { id: 'all', label: 'All Workflow Stages' },
              { id: 'TODO', label: `01. Backlog (${filteredTasksByStage.TODO.length})` },
              { id: 'IN_PROGRESS', label: `02. Active Build (${filteredTasksByStage.IN_PROGRESS.length})` },
              { id: 'READY', label: `03. Review & QA (${filteredTasksByStage.READY.length})` },
              { id: 'DONE', label: `04. Shipped (${filteredTasksByStage.DONE.length})` },
              { id: 'SUMMARY', label: '05. Velocity & Release' },
            ].map((p) => {
              const active = activeLayer === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActiveLayer(p.id)
                    if (p.id !== 'all') {
                      toast(`Stage focus: ${p.label}`)
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
        {/* THE MAIN INTERACTIVE WORKFLOW PIPELINE CANVAS                */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div
          ref={canvasRef}
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          className="relative mt-6 w-full overflow-x-auto transition-transform duration-200 py-4 scrollbar-thin"
        >
          {/* Internal min-width canvas container */}
          <div className="relative min-w-[1640px] pb-6 px-4">

            {/* ══════════════════════════════════════════════════════════ */}
            {/* CONTINUOUS CENTRAL TIMELINE TRUNK LINE (MIDDLE BACKBONE)   */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 pointer-events-none z-0">
              {/* Dual-rail gradient line */}
              <div className="w-full h-[3px] bg-gradient-to-r from-violet-500 via-sky-400 via-amber-400 via-emerald-400 to-[#E5F722] rounded-full opacity-80 shadow-xs" />
              <div className="w-full h-[1px] bg-stone-300/70 mt-[2px]" />
              <div className="w-full h-px border-b border-dashed border-stone-400/40 -mt-[6px]" />
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 5-STAGE WORKFLOW TREE                                      */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="relative z-10 flex items-center gap-7">

              {/* Leftmost Peek Slit: Workspace Topology Pin */}
              <div
                className={`transition-all duration-300 shrink-0 ${
                  activeLayer !== 'all' && activeLayer !== 'TODO'
                    ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                <div
                  onClick={() => toast(`Active Organization: ${activeOrg?.name || 'Workspace'}`)}
                  className="w-12 h-56 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/60 p-1.5 shadow-md flex flex-col items-center justify-between cursor-pointer hover:w-14 transition-all group overflow-hidden"
                >
                  <div className="w-full h-20 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 flex flex-col items-center justify-center p-1 text-[9px] font-mono text-stone-400">
                    <Workflow size={15} className="text-violet-400 mb-1" />
                    <span className="text-[8px] uppercase">PIPELINE</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                  <span className="text-[8px] font-mono font-bold text-stone-400 -rotate-90 whitespace-nowrap mb-2">
                    ORGANIZATION
                  </span>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 01: BACKLOG & SPEC (TODO TASKS)                     */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'TODO'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'TODO'
                const tasks = filteredTasksByStage.TODO
                const task1 = tasks[0]
                const task2 = tasks[1]

                return (
                  <div
                    className={`w-[295px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* UPPER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task1 ? (
                        <>
                          {renderTaskCard(task1, 'TODO', isFocused)}
                          {renderTaskPill(task1, 'Spec')}
                        </>
                      ) : (
                        renderEmptyStageCard('Backlog', 'TODO', isFocused)
                      )}
                    </div>

                    {/* UPPER CONNECTOR */}
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

                    {/* MIDDLE NODE */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'TODO' ? 'all' : 'TODO')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-violet-600 text-white ring-4 ring-violet-400/80 shadow-[0_0_25px_rgba(139,92,246,0.6)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-violet-600 text-white border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Focus 01. Backlog & Spec"
                        >
                          <Database size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-800 text-[9px] font-mono font-bold border border-violet-200">
                          {tasks.length}
                        </span>
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        01. Backlog <span className="font-mono text-[10px] text-stone-400">& Spec</span>
                      </span>
                    </div>

                    {/* LOWER CONNECTOR */}
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

                    {/* LOWER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task2 ? (
                        <>
                          {renderTaskPill(task2, 'Task')}
                          {renderTaskCard(task2, 'TODO', isFocused)}
                        </>
                      ) : (
                        <div className="w-full p-4 bg-white rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-stone-700 font-urbanist">
                              Backlog Queue
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-medium mb-3">
                            {tasks.length > 0 ? 'Review specifications and move tasks to active build.' : 'Keep your pipeline stocked with clear user requirements.'}
                          </p>
                          <button
                            type="button"
                            onClick={() => onOpenNewTask?.('TODO')}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <PlusIcon size={12} />
                            <span>Add Backlog Task</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 02: ACTIVE BUILD (IN_PROGRESS TASKS)                */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'IN_PROGRESS'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'IN_PROGRESS'
                const tasks = filteredTasksByStage.IN_PROGRESS
                const task1 = tasks[0]
                const task2 = tasks[1]

                return (
                  <div
                    className={`w-[295px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* UPPER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task1 ? (
                        <>
                          {renderTaskCard(task1, 'IN_PROGRESS', isFocused)}
                          {renderTaskPill(task1, 'Build')}
                        </>
                      ) : (
                        renderEmptyStageCard('Active Build', 'IN_PROGRESS', isFocused)
                      )}
                    </div>

                    {/* UPPER CONNECTOR */}
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

                    {/* MIDDLE NODE */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'IN_PROGRESS' ? 'all' : 'IN_PROGRESS')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-sky-600 text-white ring-4 ring-sky-400/80 shadow-[0_0_25px_rgba(14,165,233,0.6)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-sky-600 text-white border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Focus 02. Active Build"
                        >
                          <Cpu size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 text-[9px] font-mono font-bold border border-sky-200">
                          {tasks.length}
                        </span>
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        02. Active <span className="font-mono text-[10px] text-stone-400">Build</span>
                      </span>
                    </div>

                    {/* LOWER CONNECTOR */}
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

                    {/* LOWER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task2 ? (
                        <>
                          {renderTaskPill(task2, 'Feature')}
                          {renderTaskCard(task2, 'IN_PROGRESS', isFocused)}
                        </>
                      ) : (
                        <div className="w-full p-4 bg-white rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-stone-700 font-urbanist">
                              Development Stream
                            </span>
                            <span className="text-[10px] font-mono text-sky-600 font-bold">
                              ● In Progress
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-medium mb-3">
                            Features actively being engineered across contributors.
                          </p>
                          <button
                            type="button"
                            onClick={() => onOpenNewTask?.('IN_PROGRESS')}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <PlusIcon size={12} />
                            <span>Start Task in Build</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 03: REVIEW & QA (READY TASKS)                       */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'READY'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'READY'
                const tasks = filteredTasksByStage.READY
                const task1 = tasks[0]
                const task2 = tasks[1]

                return (
                  <div
                    className={`w-[295px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* UPPER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task1 ? (
                        <>
                          {renderTaskCard(task1, 'READY', isFocused)}
                          {renderTaskPill(task1, 'Review')}
                        </>
                      ) : (
                        renderEmptyStageCard('Review & QA', 'READY', isFocused)
                      )}
                    </div>

                    {/* UPPER CONNECTOR */}
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

                    {/* MIDDLE NODE */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'READY' ? 'all' : 'READY')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-amber-500 text-white ring-4 ring-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-amber-500 text-white border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Focus 03. Review & QA"
                        >
                          <ShieldCheck size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-mono font-bold border border-amber-200">
                          {tasks.length}
                        </span>
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        03. Review <span className="font-mono text-[10px] text-stone-400">& Audit</span>
                      </span>
                    </div>

                    {/* LOWER CONNECTOR */}
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

                    {/* LOWER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task2 ? (
                        <>
                          {renderTaskPill(task2, 'Audit')}
                          {renderTaskCard(task2, 'READY', isFocused)}
                        </>
                      ) : (
                        <div className="w-full p-4 bg-white rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-stone-700 font-urbanist">
                              Quality Gate
                            </span>
                            <span className="text-[10px] font-mono text-amber-700 font-bold">
                              Ready for Review
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-medium mb-3">
                            Verification, acceptance criteria testing, and code approvals.
                          </p>
                          <button
                            type="button"
                            onClick={() => onOpenNewTask?.('READY')}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <PlusIcon size={12} />
                            <span>Add Review Task</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 04: SHIPPED & DONE (COMPLETED TASKS)                */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'DONE'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'DONE'
                const tasks = filteredTasksByStage.DONE
                const task1 = tasks[0]
                const task2 = tasks[1]

                return (
                  <div
                    className={`w-[295px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* UPPER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task1 ? (
                        <>
                          {renderTaskCard(task1, 'DONE', isFocused)}
                          {renderTaskPill(task1, 'Shipped')}
                        </>
                      ) : (
                        renderEmptyStageCard('Shipped & Done', 'DONE', isFocused)
                      )}
                    </div>

                    {/* UPPER CONNECTOR */}
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

                    {/* MIDDLE NODE */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'DONE' ? 'all' : 'DONE')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-emerald-600 text-white ring-4 ring-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.6)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-emerald-600 text-white border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Focus 04. Shipped & Done"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold border border-emerald-200">
                          {tasks.length}
                        </span>
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        04. Shipped <span className="font-mono text-[10px] text-stone-400">& Done</span>
                      </span>
                    </div>

                    {/* LOWER CONNECTOR */}
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

                    {/* LOWER BRANCH */}
                    <div className="w-full flex flex-col items-center gap-3">
                      {task2 ? (
                        <>
                          {renderTaskPill(task2, 'Done')}
                          {renderTaskCard(task2, 'DONE', isFocused)}
                        </>
                      ) : (
                        <div className="w-full p-4 bg-white rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-stone-700 font-urbanist">
                              Completed Deliverables
                            </span>
                            <span className="text-[10px] font-mono text-emerald-700 font-bold">
                              ✓ {tasks.length} Shipped
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-medium mb-3">
                            Tasks that have satisfied all acceptance checks and deployed.
                          </p>
                          <button
                            type="button"
                            onClick={() => onOpenNewTask?.('DONE')}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <PlusIcon size={12} />
                            <span>Add Completed Record</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* STAGE 05: SPRINT VELOCITY & DELIVERY SUMMARY              */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const isFocused = activeLayer === 'SUMMARY'
                const isMuted = activeLayer !== 'all' && activeLayer !== 'SUMMARY'

                return (
                  <div
                    className={`w-[295px] shrink-0 flex flex-col items-center transition-all duration-300 ${
                      isMuted
                        ? 'opacity-20 grayscale contrast-75 blur-[0.4px] pointer-events-none select-none'
                        : isFocused
                        ? 'opacity-100 scale-[1.01]'
                        : 'opacity-100'
                    }`}
                  >
                    {/* UPPER BRANCH: DELIVERY HEALTH CARD */}
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Delivery Health & SLA
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Activity size={13} />
                          </div>
                        </div>

                        <span className="text-[10.5px] font-mono font-semibold text-stone-400">
                          Overall Sprint Velocity
                        </span>

                        {/* Progress Wave Indicator */}
                        <div className="relative w-full h-20 my-2.5 overflow-hidden rounded-2xl bg-[#111318] border border-stone-800 flex flex-col items-center justify-center p-2">
                          <div className="text-white text-xl font-extrabold font-urbanist tracking-tight">
                            {telemetry.completionRate}%
                          </div>
                          <div className="text-[10.5px] text-lime-400 font-mono font-bold mt-0.5">
                            {telemetry.doneCount} of {telemetry.total} tasks released
                          </div>
                          <div className="w-3/4 bg-stone-800 h-1.5 rounded-full overflow-hidden mt-2">
                            <div
                              className="bg-[#E5F722] h-full rounded-full transition-all duration-500"
                              style={{ width: `${telemetry.completionRate}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="text-stone-500 font-medium text-[11px]">
                            Status: <strong className="text-stone-800">{telemetry.completionRate === 100 ? 'All Completed' : 'In Flight'}</strong>
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                            {telemetry.criticalOrHigh === 0 ? 'Zero Blockers' : `${telemetry.criticalOrHigh} High Priority`}
                          </span>
                        </div>
                      </div>

                      {/* Summary Module Pill */}
                      <div
                        onClick={() => toast(`Total active team contributors: ${telemetry.activeAssigneesCount}`)}
                        className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/90 hover:bg-white text-stone-800 border border-stone-300/80 hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-stone-700">
                          <Globe size={11} />
                        </div>
                        <span className="text-[11.5px] font-bold font-urbanist truncate">
                          {activeOrg?.name || 'Workspace Release'}
                        </span>
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 ml-auto bg-stone-100 px-1.5 py-0.2 rounded-md">
                          v1.0
                        </span>
                      </div>
                    </div>

                    {/* UPPER CONNECTOR */}
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

                    {/* MIDDLE NODE */}
                    <div className="relative flex flex-col items-center py-2 z-20">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => setActiveLayer(activeLayer === 'SUMMARY' ? 'all' : 'SUMMARY')}
                          className={`rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isFocused
                              ? 'w-12 h-12 bg-[#E5F722] text-stone-950 ring-4 ring-lime-400/90 shadow-[0_0_30px_rgba(229,247,34,0.9)] scale-110 border-2 border-white'
                              : isMuted
                              ? 'w-10 h-10 bg-stone-200 text-stone-400 border-2 border-stone-300/60 opacity-30 scale-95'
                              : 'w-10 h-10 bg-[#E5F722] text-stone-900 border-2 border-white shadow-md hover:scale-110'
                          }`}
                          title="Focus 05. Velocity & Delivery"
                        >
                          <ZapIcon size={16} />
                        </button>
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lime-500 border-2 border-white animate-pulse" />
                      </div>

                      <span className="mt-1.5 whitespace-nowrap text-xs font-extrabold text-stone-900 font-urbanist">
                        05. Velocity <span className="font-mono text-[10px] text-stone-400">& Delivery</span>
                      </span>
                    </div>

                    {/* LOWER CONNECTOR */}
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

                    {/* LOWER BRANCH: CONTRIBUTORS & WORKLOAD */}
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        className={`w-full bento-card p-4 sm:p-5 bg-white rounded-3xl border shadow-xs relative overflow-hidden transition-all ${
                          isFocused
                            ? 'ring-2 ring-lime-400/90 shadow-[0_14px_36px_-10px_rgba(132,204,22,0.35)] border-lime-400'
                            : 'border-stone-200/90 hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-stone-900 font-urbanist">
                            Team Workload
                          </h4>
                          <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                            <Server size={13} />
                          </div>
                        </div>

                        <div className="relative w-full p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Contributors</span>
                            <div className="flex -space-x-1.5 mt-1">
                              {members.slice(0, 4).map((m, idx) => (
                                <div
                                  key={m.id || idx}
                                  className="w-6 h-6 rounded-full border-2 border-white bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs"
                                  title={m.name || m.email}
                                >
                                  {(m.name || m.email || 'U')[0].toUpperCase()}
                                </div>
                              ))}
                              {members.length > 4 && (
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-stone-200 text-stone-600 text-[9px] font-bold flex items-center justify-center">
                                  +{members.length - 4}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Estimated Effort</span>
                            <div className="text-sm font-extrabold text-stone-900 font-urbanist mt-0.5">
                              ~{telemetry.totalEstimatedDays} Days
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                            {telemetry.inProgressCount} Active
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                            {telemetry.doneCount} Shipped
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* ACTION NODE: ADD NEW TASK (+)                             */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="shrink-0 flex flex-col items-center justify-center pt-20 pl-2">
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => onOpenNewTask?.('TODO')}
                    title="Add New Task"
                    className="w-11 h-11 rounded-full bg-[#111318] text-white shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
                  >
                    <PlusIcon size={16} />
                  </button>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] font-bold text-stone-500 font-urbanist opacity-0 group-hover:opacity-100 transition-opacity">
                    Add Task
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
