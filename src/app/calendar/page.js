"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import CreateTaskModal, { getMemberColor } from '@/components/CreateTaskModal'
import TaskDetailDrawer from '@/components/TaskDetailDrawer'
import {
  ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon,
  ClockIcon, ShareIcon, ArrowUpRightIcon, VideoIcon, CheckCircleIcon,
  UsersIcon, CalendarIcon, MoreHorizontalIcon, FilterIcon,
  CheckIcon, SparklesIcon, ZapIcon, TargetIcon,
  GoogleMeetIcon, ZoomIcon, FigmaIcon, NotionIcon
} from '@/components/Icons'

const AlertCircleIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const EyeIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useOrg } from '@/context/OrgContext'
import { useTasks, formatLocalDate } from '@/context/TaskContext'
import { getTasks, addTask, updateTask, deleteTask } from '@/Service/taskService'
import { handleOrganizationUsers } from '@/Service/organization'
import GraphicChartsSuite, {
  GraphicPatternDefs,
  StackedVelocityCard,
  RadialRepeatCard,
  BarcodeTallyCard,
  SectorDonutCard
} from '@/components/GraphicFigmaCharts'

// ─── 1. Base Month Matrix (Template Dots Matching Image 2) ───
const baseCalendarMatrix = [
  { day: 27, isPrev: true, dots: [] },
  { day: 28, isPrev: true, dots: [] },
  { day: 29, isPrev: true, dots: [] },
  { day: 30, isPrev: true, dots: [] },
  { day: 1, isPrev: false, dots: [] },
  { day: 2, isPrev: false, dots: [] },
  { day: 3, isPrev: false, dots: ['#84CC16'] },
  { day: 4, isPrev: false, dots: [] },
  { day: 5, isPrev: false, dots: [] },
  { day: 6, isPrev: false, dots: [] },
  { day: 7, isPrev: false, dots: [] },
  { day: 8, isPrev: false, dots: [] },
  { day: 9, isPrev: false, dots: [] },
  { day: 10, isPrev: false, dots: [] },
  { day: 11, isPrev: false, dots: [] },
  { day: 12, isPrev: false, dots: [] },
  { day: 13, isPrev: false, dots: [] },
  { day: 14, isPrev: false, dots: [] },
  { day: 15, isPrev: false, dots: [] },
  { day: 16, isPrev: false, dots: [] },
  { day: 17, isPrev: false, dots: ['#F59E0B'] },
  { day: 18, isPrev: false, dots: ['#10B981', '#3B82F6'] },
  { day: 19, isPrev: false, dots: ['#F43F5E'] },
  { day: 20, isPrev: false, dots: ['#0284C7'] },
  { day: 21, isPrev: false, dots: [] },
  { day: 22, isPrev: false, dots: [] },
  { day: 23, isPrev: false, dots: [] },
  { day: 24, isPrev: false, dots: [] },
  { day: 25, isPrev: false, dots: ['#10B981'] },
  { day: 26, isPrev: false, dots: [] },
  { day: 27, isPrev: false, dots: ['#8B5CF6'] },
  { day: 28, isPrev: false, dots: [] },
  { day: 29, isPrev: false, dots: ['#F43F5E'] },
  { day: 30, isPrev: false, dots: [] },
  { day: 1, isNext: true, dots: [] },
  { day: 2, isNext: true, dots: [] },
  { day: 3, isNext: true, dots: [] },
  { day: 4, isNext: true, dots: [] }
]

// ─── 2. Base Day Schedules (Template Days for Editorial Timeline) ───
const initialDaySchedules = [
  {
    dayNumber: '03',
    dayName: 'WE',
    isToday: true,
    events: [
      {
        id: 'evt-301',
        timeStart: '10:00',
        timeEnd: '17:30',
        category: 'LEARN DESIGN',
        title: 'Design meeting check product',
        accentColor: '#10B981',
        platform: 'Google Meet',
        platformIcon: GoogleMeetIcon,
        meetUrl: 'https://meet.google.com/mrd-design-sync',
        attendees: [
          { name: 'Alex Johnson', initials: 'AJ', color: '#8B5CF6' },
          { name: 'Sarah Chen', initials: 'SC', color: '#6366F1' },
          { name: 'Marcus Webb', initials: 'MW', color: '#10B981' }
        ]
      },
      {
        id: 'evt-302',
        timeStart: '18:00',
        timeEnd: '20:30',
        category: 'DESIGN MEETING',
        title: 'Make daily schedule design',
        accentColor: '#8B5CF6',
        platform: 'Figma Live',
        platformIcon: FigmaIcon,
        meetUrl: 'https://figma.com/@meridian/daily-schedule',
        attendees: [
          { name: 'Kacie Vance', initials: 'KV', color: '#F43F5E' },
          { name: 'Alex Johnson', initials: 'AJ', color: '#8B5CF6' }
        ]
      }
    ]
  },
  {
    dayNumber: '04',
    dayName: 'TH',
    isToday: false,
    events: []
  }
]

// ─── 3. Initial Upcoming Events for Left Panel ───
const initialUpcomingEvents = [
  {
    id: 'ue-1',
    name: 'Design meeting',
    time: '10:00 - 17:30',
    color: '#10B981',
    initials: 'SC',
    meetUrl: 'https://meet.google.com/mrd-design-sync'
  },
  {
    id: 'ue-2',
    name: 'Sprint review',
    time: '18:00 - 20:30',
    color: '#8B5CF6',
    initials: 'AJ',
    meetUrl: 'https://meet.google.com/mrd-sprint-review'
  }
]

// ─── 4. Default Fallback Tasks (Used when org has 0 tasks) ─────────
const FALLBACK_TASKS = [
  {
    id: 'tsk-f1',
    title: 'Ship Dynamic Island Command Capsule',
    description: 'Finalize capsule states, pulse animations, and interactive drawer expansion.',
    status: 'DONE',
    priority: 'CRITICAL',
    due_date: '2026-05-03',
    estimated_time_value: 4,
    estimated_time_unit: 'hours'
  },
  {
    id: 'tsk-f2',
    title: 'Refactor Design System Color Tokens',
    description: 'Implement curated pastel swimlane tokens in globals.css with high-contrast borders.',
    status: 'DONE',
    priority: 'HIGH',
    due_date: '2026-05-03',
    estimated_time_value: 3,
    estimated_time_unit: 'hours'
  },
  {
    id: 'tsk-f3',
    title: 'Connect Schedule Engine to Live Task APIs',
    description: 'Map real backend tasks into Day Focus, Sprint Planner, and Agenda views.',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    due_date: '2026-05-18',
    estimated_time_value: 5,
    estimated_time_unit: 'hours'
  },
  {
    id: 'tsk-f4',
    title: 'Microcopy & Accessibility Audit',
    description: 'Verify WCAG AA contrast on KPI widgets and screen reader aria labels.',
    status: 'TODO',
    priority: 'MEDIUM',
    due_date: '2026-05-19',
    estimated_time_value: 2,
    estimated_time_unit: 'hours'
  },
  {
    id: 'tsk-f5',
    title: 'Team Directory Presence Sync',
    description: 'Stream live member statuses into sidebar and team roster.',
    status: 'TODO',
    priority: 'LOW',
    due_date: '2026-05-25',
    estimated_time_value: 6,
    estimated_time_unit: 'hours'
  }
]

// Priority Color Badges
const PRIORITY_BADGES = {
  CRITICAL: { bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400', dot: 'bg-rose-400' },
  HIGH: { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400', dot: 'bg-amber-400' },
  MEDIUM: { bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400', dot: 'bg-indigo-400' },
  LOW: { bg: 'bg-stone-500/15 border-stone-500/30 text-stone-400', dot: 'bg-stone-400' }
}

// ─────────────────────────────────────────────────────────────────
// RIGHT COMMAND DOCK: LUXURY TASK STATISTICS & ALLOCATION WIDGETS
// ─────────────────────────────────────────────────────────────────
function DeliverablesDock({
  tasks = [],
  members = [],
  sprintMetrics = null,
  onToggleTask,
  onOpenTask,
  onOpenCreateModal,
  isDockCollapsed,
  setIsDockCollapsed,
  onSelectDate,
  selectedDateStr
}) {
  const [statsPeriod, setStatsPeriod] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [velocityChartStyle, setVelocityChartStyle] = useState('stacked') // 'stacked' | 'radial'
  const [allocChartStyle, setAllocChartStyle] = useState('barcode') // 'barcode' | 'sector'

  const todayStr = useMemo(() => formatLocalDate(new Date()), [])

  // 1. Real Period Tasks & Metrics Calculation
  // All Sprints / All Tasks
  const allTotal = tasks.length || 1
  const allDone = tasks.filter(t => t.status === 'DONE').length
  const allRate = Math.round((allDone / allTotal) * 100)
  // Current Week Tasks (Monday - Sunday window)
  const weekTasks = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    const dayOfWeek = (startOfWeek.getDay() + 6) % 7 // Monday = 0
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return tasks.filter(t => {
      if (!t.due_date) return false
      const d = new Date(t.due_date)
      return d >= startOfWeek && d <= endOfWeek
    })
  }, [tasks])

  const weekTotal = weekTasks.length || 1
  const weekDone = weekTasks.filter(t => t.status === 'DONE').length
  const weekRate = weekTasks.length > 0 ? Math.round((weekDone / weekTotal) * 100) : allRate

  // Today Tasks
  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.due_date && String(t.due_date).startsWith(todayStr))
  }, [tasks, todayStr])

  const todayTotal = todayTasks.length || 1
  const todayDone = todayTasks.filter(t => t.status === 'DONE').length
  const todayRate = todayTasks.length > 0
    ? Math.round((todayDone / todayTotal) * 100)
    : (allDone > 0 ? 100 : 0)

  // Periods config for RadialRepeatCard
  const periodsConfig = useMemo(() => {
    const allBadge = allRate >= 75
      ? { text: 'Optimal', color: 'text-lime-400' }
      : allRate >= 40
      ? { text: 'On Track', color: 'text-amber-400' }
      : { text: 'Pacing', color: 'text-orange-400' }

    const weekBadge = weekRate >= 75
      ? { text: 'Optimal', color: 'text-lime-400' }
      : { text: 'Active', color: 'text-amber-400' }

    const todayBadge = todayRate >= 100
      ? { text: 'Great', color: 'text-lime-400' }
      : todayRate >= 50
      ? { text: 'Progress', color: 'text-amber-400' }
      : { text: 'Queued', color: 'text-stone-400' }

    return {
      all: { label: 'All Sprints', completedRate: allRate, resultBadge: allBadge },
      week: { label: 'This Week', completedRate: weekRate, resultBadge: weekBadge },
      today: { label: 'Today', completedRate: todayRate, resultBadge: todayBadge }
    }
  }, [allRate, weekRate, todayRate])

  // Filter tasks based on selected period
  const filteredTasks = useMemo(() => {
    if (statsPeriod === 'today') {
      return todayTasks.length > 0 ? todayTasks : tasks
    }
    if (statsPeriod === 'week') {
      return weekTasks.length > 0 ? weekTasks : tasks
    }
    return tasks
  }, [tasks, statsPeriod, todayTasks, weekTasks])

  const currentTotalCount = filteredTasks.length || tasks.length || 1
  const currentCompletedCount = filteredTasks.filter(t => t.status === 'DONE').length
  const currentCompletedRate = Math.round((currentCompletedCount / currentTotalCount) * 100)

  // 2. Real Stacked Velocity Columns Calculated from Live Tasks
  const velocityData = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    const dayOfWeek = (startOfWeek.getDay() + 6) % 7 // Monday = 0
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const colList = []
    let sprintTotalHours = 0
    let recentHours = 0

    for (let i = 0; i < 5; i++) {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(dayDate.getDate() + i)
      const dateStr = formatLocalDate(dayDate)
      const isToday = dateStr === todayStr
      const isSelected = selectedDateStr === dateStr

      // Find tasks due on this date
      const dayTasks = tasks.filter(t => t.due_date && String(t.due_date).startsWith(dateStr))
      const doneTasks = dayTasks.filter(t => t.status === 'DONE')
      const inProgTasks = dayTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'INPROGRESS' || t.status === 'REVIEW')
      const todoTasks = dayTasks.filter(t => t.status === 'TODO' || !t.status)

      const getTaskHours = (tList) => tList.reduce((acc, t) => acc + (parseFloat(t.estimated_time_value) || 2), 0)

      const doneH = getTaskHours(doneTasks)
      const inProgH = getTaskHours(inProgTasks)
      const todoH = getTaskHours(todoTasks)
      const dayTotalH = doneH + inProgH + todoH

      sprintTotalHours += dayTotalH
      if (isToday) {
        recentHours += (doneH > 0 ? doneH : dayTotalH)
      }

      const blocks = []
      if (dayTasks.length === 0) {
        blocks.push({
          id: `${dateStr}-empty`,
          h: 8,
          fill: 'rgba(255,255,255,0.08)',
          label: 'No Tasks',
          sprint: 'Open Buffer',
          hours: '0.0h',
          dateStr
        })
      } else {
        const scale = Math.min(10, 70 / (dayTotalH || 1))

        if (todoTasks.length > 0) {
          blocks.push({
            id: `${dateStr}-todo`,
            h: Math.max(12, Math.round(todoH * scale)),
            fill: '#F97316',
            label: 'Deliverables',
            sprint: `${todoTasks.length} To Do`,
            hours: `${todoH.toFixed(1)}h`,
            dateStr
          })
        }

        if (inProgTasks.length > 0) {
          blocks.push({
            id: `${dateStr}-inprog`,
            h: Math.max(12, Math.round(inProgH * scale)),
            fill: '#3B82F6',
            label: 'In Review',
            sprint: `${inProgTasks.length} Active`,
            hours: `${inProgH.toFixed(1)}h`,
            dateStr
          })
        }

        if (doneTasks.length > 0) {
          const isRecentHatch = isToday
          blocks.push({
            id: `${dateStr}-done`,
            h: Math.max(14, Math.round(doneH * scale)),
            fill: isRecentHatch ? 'url(#recent-work-hatch)' : '#10B981',
            stroke: isRecentHatch ? '#FFFFFF' : 'none',
            strokeWidth: isRecentHatch ? 1.8 : 0,
            isRecentWork: isRecentHatch,
            label: isRecentHatch ? 'Recent Work' : 'Completed',
            sprint: `${doneTasks.length} Done`,
            hours: `${doneH.toFixed(1)}h`,
            badge: isRecentHatch ? 'Recent Work' : undefined,
            dateStr
          })
        }
      }

      colList.push({
        id: `col-${days[i].toLowerCase()}`,
        day: days[i],
        dateStr,
        isToday,
        isSelected,
        total: `${dayTotalH.toFixed(1)}h`,
        blocks
      })
    }

    const calculatedRecent = recentHours > 0
      ? recentHours
      : (tasks.filter(t => t.status === 'DONE').length * 2.5) || 4.0

    return {
      columns: colList,
      totalHours: `${(sprintTotalHours || 24.5).toFixed(1)}h`,
      recentWorkHours: `${calculatedRecent.toFixed(1)}h`
    }
  }, [tasks, todayStr, selectedDateStr])

  // 3. Real Priority Streams Breakdown for SectorDonutCard
  const prioritySectors = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
    filteredTasks.forEach(t => {
      const prio = (t.priority || 'MEDIUM').toUpperCase()
      if (counts[prio] !== undefined) counts[prio]++
      else counts.MEDIUM++
    })

    const total = filteredTasks.length || 1
    const list = [
      {
        id: 'CRITICAL',
        label: 'Critical Focus',
        count: counts.CRITICAL,
        pct: Math.round((counts.CRITICAL / total) * 100),
        fill: '#EF4444',
        stroke: '#EF4444',
        badge: `${counts.CRITICAL}`
      },
      {
        id: 'HIGH',
        label: 'High Priority',
        count: counts.HIGH,
        pct: Math.round((counts.HIGH / total) * 100),
        fill: '#FF4400',
        stroke: '#FF4400',
        badge: `${counts.HIGH}`
      },
      {
        id: 'MEDIUM',
        label: 'Medium Stream',
        count: counts.MEDIUM,
        pct: Math.round((counts.MEDIUM / total) * 100),
        fill: '#6366F1',
        stroke: '#6366F1',
        badge: `${counts.MEDIUM}`
      },
      {
        id: 'LOW',
        label: 'Low / Routine',
        count: counts.LOW,
        pct: Math.round((counts.LOW / total) * 100),
        fill: '#10B981',
        stroke: '#10B981',
        badge: `${counts.LOW}`
      }
    ]

    const nonZero = list.filter(s => s.count > 0)
    if (nonZero.length === 0) {
      return [
        {
          id: 'ALL',
          label: 'Standard Deliverables',
          count: filteredTasks.length,
          pct: 100,
          fill: '#FF4400',
          stroke: '#FF4400',
          badge: '100%'
        }
      ]
    }
    return nonZero
  }, [filteredTasks])

  // Real Database Tasks Filtered for Deliverables List
  const activeDeliverables = useMemo(() => {
    let list = filteredTasks.filter(t => t.status !== 'DONE')
    if (categoryFilter !== 'ALL') {
      list = list.filter(t => (t.priority || '').toUpperCase() === categoryFilter)
    }
    return list
  }, [filteredTasks, categoryFilter])

  return (
    <div
      className="rounded-3xl p-5 text-white space-y-6 xl:sticky xl:top-4 xl:self-start transition-all border border-stone-800/80 shadow-2xl"
      style={{ background: '#14161F' }}
    >
      <GraphicPatternDefs />

      {/* Dock Header with Collapse Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-xs font-sans font-semibold text-white/90 uppercase tracking-wider">
            Deliverables Dock
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsDockCollapsed(true)}
          className="text-xs font-sans font-medium text-stone-400 hover:text-white px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Collapse dock to focus on schedule"
        >
          <span>Focus Mode</span>
          <span>⇤</span>
        </button>
      </div>

      {/* ─── WIDGET 1: SPRINT VELOCITY (Stacked Velocity Graph with Live Data & Hatch) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400">
            Sprint Velocity
          </span>
          <div className="flex items-center bg-black/50 p-1 rounded-full shadow-inner border border-white/10">
            <button
              type="button"
              onClick={() => setVelocityChartStyle('stacked')}
              className={`px-3 py-1 text-xs font-sans font-semibold rounded-full transition-all cursor-pointer leading-none ${
                velocityChartStyle === 'stacked'
                  ? 'bg-[#FF4400] text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Stacked Velocity
            </button>
            <button
              type="button"
              onClick={() => setVelocityChartStyle('radial')}
              className={`px-3 py-1 text-xs font-sans font-semibold rounded-full transition-all cursor-pointer leading-none ${
                velocityChartStyle === 'radial'
                  ? 'bg-[#FF4400] text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Radial Repeat
            </button>
          </div>
        </div>

        {velocityChartStyle === 'stacked' && (
          <StackedVelocityCard
            title="Sprint Velocity"
            subtitle="Cadence & Velocity Allocation"
            recentWorkHours={velocityData.recentWorkHours}
            totalSprintHours={velocityData.totalHours}
            columns={velocityData.columns}
            selectedDayId={selectedDateStr ? `col-${new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()}` : null}
            onSelectDay={(col) => {
              if (onSelectDate && col.dateStr) {
                onSelectDate(col.dateStr)
                toast.success(`Focused on ${col.day} (${col.dateStr})`)
              }
            }}
            onSelectBlock={(block, col) => {
              if (onSelectDate && col.dateStr) {
                onSelectDate(col.dateStr)
              }
              toast.success(`${col.day} • ${block.label}: ${block.hours}`)
            }}
          />
        )}

        {velocityChartStyle === 'radial' && (
          <RadialRepeatCard
            rate={currentCompletedRate}
            title="Radial Repeat"
            subtitle="Cadence index"
            badgeLabel={{ text: `${currentCompletedRate}% Velocity`, color: 'text-lime-400' }}
            periods={periodsConfig}
            activePeriod={statsPeriod}
            onSelectPeriod={setStatsPeriod}
          />
        )}
      </div>

      {/* ─── WIDGET 2: DELIVERABLES ALLOCATION (Barcode Tally / Priority Streams) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400">
            Stream Allocation
          </span>
          <div className="flex items-center bg-black/50 p-1 rounded-full shadow-inner border border-white/10">
            <button
              type="button"
              onClick={() => setAllocChartStyle('barcode')}
              className={`px-3 py-1 text-xs font-sans font-semibold rounded-full transition-all cursor-pointer leading-none ${
                allocChartStyle === 'barcode'
                  ? 'bg-[#FF4400] text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {currentCompletedRate}%
            </button>
            <button
              type="button"
              onClick={() => setAllocChartStyle('sector')}
              className={`px-3 py-1 text-xs font-sans font-semibold rounded-full transition-all cursor-pointer leading-none ${
                allocChartStyle === 'sector'
                  ? 'bg-[#FF4400] text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Priority Streams
            </button>
          </div>
        </div>

        {allocChartStyle === 'barcode' && (
          <BarcodeTallyCard
            rate={currentCompletedRate}
            totalTasks={currentTotalCount}
            completedTasks={currentCompletedCount}
            title="Deliverables Tally"
          />
        )}

        {allocChartStyle === 'sector' && (
          <SectorDonutCard
            title="Priority Streams"
            subtitle="Deliverable priority distribution"
            sectors={prioritySectors}
            activeSectorId={categoryFilter !== 'ALL' ? categoryFilter : null}
            onSliceClick={(slice) => {
              setCategoryFilter(prev => prev === slice.id ? 'ALL' : slice.id)
            }}
          />
        )}
      </div>

      {/* ─── WIDGET 3: ACTIVE DELIVERABLES (Real Database Tasks) ─── */}
<div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white font-sans">Active Deliverables</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
              {activeDeliverables.length} Open
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="text-xs font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <PlusIcon size={12} />
            <span>New</span>
          </button>
        </div>

        {/* Priority Filter Chips */}
        <div className="flex items-center gap-1 mb-3">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(pri => (
            <button
              key={pri}
              type="button"
              onClick={() => setCategoryFilter(pri)}
              className={`text-xs font-sans font-semibold px-2.5 py-1 rounded-lg leading-none transition-all cursor-pointer ${
                categoryFilter === pri
                  ? 'bg-lime-400 text-stone-950 shadow-2xs'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {pri}
            </button>
          ))}
        </div>

        {/* Tasks Stream */}
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {activeDeliverables.length === 0 ? (
            <div className="text-center py-6 text-xs text-stone-400 font-mono">
              No open deliverables in this view
            </div>
          ) : (
            activeDeliverables.map(task => {
              const tid = task.task_id || task.id
              const isDone = task.status === 'DONE'
              return (
                <div
                  key={tid}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between gap-2.5 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task)}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-lime-400 border-lime-400 text-stone-950 font-bold'
                          : 'border-white/30 hover:border-white'
                      }`}
                    >
                      {isDone && <CheckIcon size={10} />}
                    </button>
                    <span
                      onClick={() => onOpenTask(task)}
                      className={`text-xs font-medium cursor-pointer hover:text-lime-400 transition-colors truncate ${
                        isDone ? 'line-through text-stone-500' : 'text-stone-200'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  {task.priority && (
                    <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-md tracking-tight bg-white/10 text-stone-300 uppercase shrink-0">
                      {task.priority}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Helper: Get Distinct Dot Color by Assignee or Priority ───
function getTaskDotColor(task, members = []) {
  if (!task) return '#8B5CF6'
  const assignedId = task.assigned_to || task.assign_to
  if (assignedId) {
    const member = members.find(m => String(m.id) === String(assignedId))
    if (member) {
      return getMemberColor(member.id)
    }
    return getMemberColor(assignedId)
  }
  if (task.priority === 'CRITICAL') return '#F43F5E'
  if (task.priority === 'HIGH') return '#F59E0B'
  if (task.priority === 'MEDIUM') return '#8B5CF6'
  if (task.priority === 'LOW') return '#10B981'
  return '#3B82F6'
}

export default function CalendarPage() {
  const { activeOrgId } = useOrg() || {}
  const { fullName, initials, user } = useCurrentUser()

  // Centralized Tasks Context (Shared live across Calendar, Dashboard, Kanban, and DynamicHeader)
  const {
    tasks = [],
    members = [],
    loading,
    refreshTasks,
    addTask: addTaskToContext,
    updateTask: updateTaskToContext,
    deleteTask: deleteTaskToContext,
    sprintMetrics
  } = useTasks()

    const [searchQuery, setSearchQuery] = useState('')

  // View Mode: 'focus' (Day Focus) | 'week' (7-Day Sprint Planner) | 'agenda' (Deliverables Agenda)
  const [viewMode, setViewMode] = useState('focus')

  // Modals & Drawers
  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState('TODO')

  // ─── DYNAMIC CALENDAR DATE ENGINE ───
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(() => formatLocalDate(new Date()))
  const [isDayFiltered, setIsDayFiltered] = useState(false)
  const [isDockCollapsed, setIsDockCollapsed] = useState(false)

  const handlePrevMonth = useCallback(() => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [setCurrentMonthDate])

  const handleNextMonth = useCallback(() => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [setCurrentMonthDate])

  const handleToday = useCallback(() => {
    const now = new Date()
    setCurrentMonthDate(now)
    setSelectedDateStr(formatLocalDate(now))
    setIsDayFiltered(false)
  }, [setCurrentMonthDate, setSelectedDateStr, setIsDayFiltered])

  // ─── Curated Base Tasks Anchored to Active Month ───
  // Guarantees that even if org has 0 tasks, days are clearly marked with assignee-colored dots
  const effectiveTasks = useMemo(() => {
    if (tasks && tasks.length > 0) {
      return tasks
    }
    const year = currentMonthDate ? currentMonthDate.getFullYear() : 2026
    const m = currentMonthDate ? String(currentMonthDate.getMonth() + 1).padStart(2, '0') : '09'
    return [
      {
        id: 'fallback-1',
        task_id: 'fallback-1',
        title: 'Design System & Token Architecture',
        status: 'DONE',
        priority: 'CRITICAL',
        due_date: `${year}-${m}-03`,
        assigned_to: members[0]?.id || 1,
        estimated_time_value: 4
      },
      {
        id: 'fallback-2',
        task_id: 'fallback-2',
        title: 'Dynamic Island Command Capsule',
        status: 'DONE',
        priority: 'HIGH',
        due_date: `${year}-${m}-08`,
        assigned_to: members[1]?.id || 2,
        estimated_time_value: 3
      },
      {
        id: 'fallback-3',
        task_id: 'fallback-3',
        title: 'Editorial Schedule Matrix Sync',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        due_date: `${year}-${m}-14`,
        assigned_to: members[0]?.id || 1,
        estimated_time_value: 6
      },
      {
        id: 'fallback-4',
        task_id: 'fallback-4',
        title: 'Real-Time Task Context Audit',
        status: 'TODO',
        priority: 'HIGH',
        due_date: `${year}-${m}-18`,
        assigned_to: members[2]?.id || 3,
        estimated_time_value: 2
      },
      {
        id: 'fallback-5',
        task_id: 'fallback-5',
        title: 'Swiss Graphic Charts & Hatched Blocks',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        due_date: `${year}-${m}-21`,
        assigned_to: members[1]?.id || 2,
        estimated_time_value: 5
      },
      {
        id: 'fallback-6',
        task_id: 'fallback-6',
        title: 'Team Directory & Access Governance',
        status: 'TODO',
        priority: 'LOW',
        due_date: `${year}-${m}-25`,
        assigned_to: members[0]?.id || 1,
        estimated_time_value: 3
      }
    ]
  }, [tasks, currentMonthDate, members])

  // Quick Meeting Scheduling Modal (Persists to Backend)
  const [newMeetingModal, setNewMeetingModal] = useState(false)
  const [newMeetingTitle, setNewMeetingTitle] = useState('')
  const [newMeetingTime, setNewMeetingTime] = useState('15:00 - 16:00')
  const [newMeetingPlatform, setNewMeetingPlatform] = useState('Google Meet')
  const [newMeetingCategory, setNewMeetingCategory] = useState('Design Meeting')

  // ─── 1-Click Task Completion Toggle (Syncs to Backend API via TaskContext) ───
  const handleToggleTaskDone = async (task) => {
    const isDone = task.status === 'DONE'
    const nextStatus = isDone ? 'TODO' : 'DONE'
    const realId = task.task_id || task.id

    try {
      await updateTaskToContext({ task_id: realId, status: nextStatus })
      toast.success(nextStatus === 'DONE' ? 'Task marked complete! 🎯' : 'Task restored to active')
    } catch (err) {
      toast.error('Failed to update task status')
    }
  }

  // Handle task creation
  const handleTaskAdded = () => {
    refreshTasks()
    toast.success('Deliverable scheduled!')
  }

  // Handle task update from drawer
  const handleTaskUpdated = async (updatedTask) => {
    try {
      await updateTaskToContext(updatedTask)
      toast.success('Deliverable updated!')
    } catch (err) {
      toast.error('Failed to update deliverable')
    }
  }

  // Handle task deletion from drawer
  const handleTaskDeleted = async (deletedTaskId) => {
    try {
      await deleteTaskToContext(deletedTaskId)
      setSelectedTaskForDrawer(null)
      toast.success('Deliverable deleted')
    } catch (err) {
      toast.error('Failed to delete deliverable')
    }
  }

  // Join meeting handler
  const handleJoinMeeting = (event) => {
    if (event.meetUrl) {
      const url = event.meetUrl.startsWith('http') ? event.meetUrl : `https://${event.meetUrl}`
      navigator.clipboard?.writeText(url)
      window.open(url, '_blank')
      toast.success(`Opening ${event.title}... Link copied!`)
    } else {
      toast.success(`Joining session: ${event.title}`)
    }
  }

  // ─── Handle Create Meeting from Modal (Persists to Backend Tasks API) ───
  const handleCreateMeeting = async (e) => {
    e.preventDefault()
    if (!newMeetingTitle.trim()) return

    const times = newMeetingTime.split('-')
    const timeStart = times[0]?.trim() || '15:00'
    const timeEnd = times[1]?.trim() || '16:00'

    const isDesign = newMeetingCategory.toLowerCase().includes('design')
    const priority = isDesign ? 'HIGH' : 'MEDIUM'

    const payload = {
      title: newMeetingTitle.trim(),
      description: `Meeting via ${newMeetingPlatform} (${newMeetingCategory}). Time slot: ${timeStart} - ${timeEnd}`,
      status: 'TODO',
      priority,
      due_date: selectedDateStr,
      estimate_time_value: 1,
      estimate_time_unit: 'hours',
      assign_to: user?.id,
      organization_id: activeOrgId
    }

    try {
      await addTaskToContext(payload)
      toast.success('New session scheduled and synced across workspace!')
    } catch (err) {
      console.warn("Could not persist meeting task to backend:", err)
      toast.error(err.message || 'Failed to schedule meeting')
    }

    setNewMeetingTitle('')
    setNewMeetingModal(false)
  }

  // ─── Dynamically Compute Calendar Matrix from Active Month & Tasks ───
  const dynamicCalendarMatrix = useMemo(() => {
    const year = currentMonthDate.getFullYear()
    const month = currentMonthDate.getMonth() // 0-indexed

    const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sun
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const todayStr = new Date().toISOString().split('T')[0]
    const cells = []

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`

      const dayTasks = effectiveTasks.filter(t => t.due_date && String(t.due_date).startsWith(dateStr))
      const dots = dayTasks.map(t => ({
        color: getTaskDotColor(t, members),
        title: t.title,
        priority: t.priority
      }))
      cells.push({
        day: dayNum,
        dateStr,
        isPrev: true,
        isNext: false,
        isToday: dateStr === todayStr,
        hasTasks: dayTasks.length > 0,
        dots: dots.slice(0, 3)
      })
    }

    // Days of current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

      const dayTasks = effectiveTasks.filter(t => t.due_date && String(t.due_date).startsWith(dateStr))
      const dots = dayTasks.map(t => {
        const assignedMember = members.find(m => String(m.id) === String(t.assigned_to || t.assign_to))
        return {
          color: getTaskDotColor(t, members),
          title: t.title,
          priority: t.priority,
          assignee: assignedMember ? (assignedMember.first_name || assignedMember.name || 'Assignee') : 'Unassigned'
        }
      })

      cells.push({
        day: d,
        dateStr,
        isPrev: false,
        isNext: false,
        isToday: dateStr === todayStr,
        hasTasks: dayTasks.length > 0,
        taskCount: dayTasks.length,
        dots: dots.slice(0, 3),
        overflowCount: dots.length > 3 ? dots.length - 3 : 0
      })
    }

    // Trailing days to fill standard 35 or 42 grid
    const totalCellsNeeded = cells.length > 35 ? 42 : 35
    const remaining = totalCellsNeeded - cells.length
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

      const dayTasks = effectiveTasks.filter(t => t.due_date && String(t.due_date).startsWith(dateStr))
      const dots = dayTasks.map(t => ({
        color: getTaskDotColor(t, members),
        title: t.title,
        priority: t.priority
      }))
      cells.push({
        day: d,
        dateStr,
        isPrev: false,
        isNext: true,
        isToday: dateStr === todayStr,
        hasTasks: dayTasks.length > 0,
        dots: dots.slice(0, 3)
      })
    }

    return cells
  }, [currentMonthDate, effectiveTasks, members])

  // ─── Merge Tasks into Day Editorial Timeline for the Selected Month ───
  const mergedSchedules = useMemo(() => {
    const year = currentMonthDate.getFullYear()
    const month = currentMonthDate.getMonth()
    const currentYearMonth = `${year}-${String(month + 1).padStart(2, '0')}`
    const dayNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    const todayStr = new Date().toISOString().split('T')[0]

    const dayMap = new Map()

    effectiveTasks.forEach(task => {
      if (!task.due_date) return
      const taskDateStr = String(task.due_date).split('T')[0]
      if (!taskDateStr.startsWith(currentYearMonth)) return

      const d = new Date(taskDateStr + 'T12:00:00Z')
      const dayNum = String(d.getUTCDate()).padStart(2, '0')
      const dayName = dayNames[d.getUTCDay()] || 'DY'

      const isCritical = task.priority === 'CRITICAL'
      const isHigh = task.priority === 'HIGH'
      const isDesign = (task.title + (task.description || '')).toLowerCase().includes('design')

      const accentColor = isCritical ? '#F43F5E' : isHigh ? '#F59E0B' : isDesign ? '#8B5CF6' : '#10B981'
      const category = isDesign
        ? 'LEARN DESIGN'
        : task.priority
        ? `${task.priority} DELIVERABLE`
        : 'DELIVERABLE'

      const platIcon = task.description?.includes('Figma')
        ? FigmaIcon
        : task.description?.includes('Zoom')
        ? ZoomIcon
        : GoogleMeetIcon

      const platform = task.description?.includes('Figma')
        ? 'Figma Live'
        : task.description?.includes('Zoom')
        ? 'Zoom'
        : 'Google Meet'

      const assignedMember = members.find(m => String(m.id) === String(task.assigned_to))

      const taskEvt = {
        id: `task-evt-${task.task_id || task.id}`,
        task_id: task.task_id || task.id,
        timeStart: '10:00',
        timeEnd: task.estimated_time_value ? `${10 + Math.min(Number(task.estimated_time_value), 8)}:00` : '17:30',
        category,
        title: task.title,
        accentColor,
        platform,
        platformIcon: platIcon,
        meetUrl: 'https://meet.google.com/mrd-sync',
        isTask: true,
        taskRef: task,
        attendees: assignedMember ? [
          {
            name: `${assignedMember.first_name || ''} ${assignedMember.last_name || ''}`.trim() || 'Member',
            initials: (assignedMember.first_name?.[0] || 'M').toUpperCase(),
            color: accentColor
          }
        ] : [
          { name: fullName || 'Alex Johnson', initials: initials || 'AJ', color: '#8B5CF6' }
        ]
      }

      if (dayMap.has(dayNum)) {
        const existingDay = dayMap.get(dayNum)
        if (!existingDay.events.some(e => e.title === task.title || e.task_id === taskEvt.task_id)) {
          existingDay.events.push(taskEvt)
        }
      } else {
        dayMap.set(dayNum, {
          dayNumber: dayNum,
          dateStr: taskDateStr,
          dayName,
          isToday: taskDateStr === todayStr,
          events: [taskEvt]
        })
      }
    })

    // Ensure currently selected day is present on the timeline
    if (selectedDateStr && selectedDateStr.startsWith(currentYearMonth)) {
      const selD = new Date(selectedDateStr + 'T12:00:00Z')
      const selDayNum = String(selD.getUTCDate()).padStart(2, '0')
      if (!dayMap.has(selDayNum)) {
        dayMap.set(selDayNum, {
          dayNumber: selDayNum,
          dateStr: selectedDateStr,
          dayName: dayNames[selD.getUTCDay()] || 'DY',
          isToday: selectedDateStr === todayStr,
          events: []
        })
      }
    }

    if (dayMap.size === 0) {
      const defaultD = selectedDateStr.startsWith(currentYearMonth)
        ? new Date(selectedDateStr + 'T12:00:00Z')
        : new Date(`${currentYearMonth}-01T12:00:00Z`)
      const defDayNum = String(defaultD.getUTCDate()).padStart(2, '0')
      const defDateStr = `${currentYearMonth}-${defDayNum}`
      dayMap.set(defDayNum, {
        dayNumber: defDayNum,
        dateStr: defDateStr,
        dayName: dayNames[defaultD.getUTCDay()] || 'DY',
        isToday: defDateStr === todayStr,
        events: []
      })
    }

    return Array.from(dayMap.values()).sort((a, b) => Number(a.dayNumber) - Number(b.dayNumber))
  }, [currentMonthDate, selectedDateStr, effectiveTasks, members, fullName, initials])

  // ── Filter Real Tasks for Today's Focus Section ──
  const todaysFocusTasks = useMemo(() => {
    const source = (tasks && tasks.length > 0) ? tasks : effectiveTasks
    const todayStr = formatLocalDate(new Date())
    const active = source.filter(t => {
      if (t.due_date && String(t.due_date).startsWith(todayStr)) return true
      if (t.status === 'IN_PROGRESS' || t.status === 'INPROGRESS') return true
      return false
    })
    return active.length > 0 ? active.slice(0, 5) : source.slice(0, 5)
  }, [tasks, effectiveTasks])

  // ── Upcoming Events list from Real Tasks ──
  const dynamicUpcomingEvents = useMemo(() => {
    const source = (tasks && tasks.length > 0) ? tasks : effectiveTasks
    return source
      .filter(t => t.status !== 'DONE' && t.due_date)
      .slice(0, 4)
      .map(t => {
        const assigned = members.find(m => String(m.id) === String(t.assigned_to))
        const col = t.priority === 'CRITICAL' ? '#F43F5E' : t.priority === 'HIGH' ? '#F59E0B' : '#8B5CF6'
        return {
          id: `ue-task-${t.task_id || t.id}`,
          name: t.title,
          time: t.due_date ? String(t.due_date).split('T')[0] : '10:00 - 17:30',
          color: col,
          initials: assigned ? (assigned.first_name?.[0] || 'U').toUpperCase() : (initials || 'AJ'),
          meetUrl: 'https://meet.google.com/mrd-sync',
          taskRef: t
        }
      })
  }, [tasks, effectiveTasks, members, initials])

  // Filter tasks by search query (fallback to effectiveTasks so agenda is always populated)
  const filteredTasks = useMemo(() => {
    const source = (tasks && tasks.length > 0) ? tasks : effectiveTasks
    if (!searchQuery.trim()) return source
    const q = searchQuery.toLowerCase()
    return source.filter(t =>
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.priority?.toLowerCase().includes(q)
    )
  }, [tasks, effectiveTasks, searchQuery])

  // 7-Day Sprint Planner Days Generator
  const sprintDays = useMemo(() => {
    const today = new Date()
    const currentDay = today.getDay()
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay
    const monday = new Date(today)
    monday.setDate(today.getDate() + diffToMonday)

    return [0, 1, 2, 3, 4, 5, 6].map(offset => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + offset)
      const dateStr = formatLocalDate(d)
      const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][offset]
      const isToday = dateStr === formatLocalDate(today)

      const dayTasks = effectiveTasks.filter(t => t.due_date && String(t.due_date).startsWith(dateStr))

      return {
        dateStr,
        dayName,
        dayNum: d.getDate(),
        isToday,
        tasks: dayTasks
      }
    })
  }, [effectiveTasks])

  // Urgency Grouped Tasks for Deliverables Agenda
  const agendaSections = useMemo(() => {
    const todayStr = formatLocalDate(new Date())
    const now = new Date()

    const overdue = []
    const dueToday = []
    const dueThisWeek = []
    const later = []
    const completed = []

    filteredTasks.forEach(task => {
      if (task.status === 'DONE') {
        completed.push(task)
        return
      }
      if (!task.due_date) {
        later.push(task)
        return
      }
      const taskDate = String(task.due_date).split('T')[0]
      if (taskDate < todayStr) {
        overdue.push(task)
      } else if (taskDate === todayStr) {
        dueToday.push(task)
      } else {
        const diffDays = (new Date(taskDate) - now) / 86400000
        if (diffDays <= 7 && diffDays >= 0) {
          dueThisWeek.push(task)
        } else {
          later.push(task)
        }
      }
    })

    return [
      { id: 'today', title: 'Due Today', icon: ZapIcon, count: dueToday.length, color: 'text-amber-600 bg-amber-50 border-amber-200', items: dueToday },
      { id: 'week', title: 'Upcoming This Week', icon: CalendarIcon, count: dueThisWeek.length, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', items: dueThisWeek },
      { id: 'overdue', title: 'Overdue Deliverables', icon: AlertCircleIcon, count: overdue.length, color: 'text-rose-600 bg-rose-50 border-rose-200', items: overdue },
      { id: 'later', title: 'Later & Sprint Backlog', icon: TargetIcon, count: later.length, color: 'text-stone-600 bg-stone-50 border-stone-200', items: later },
      { id: 'completed', title: 'Completed Deliverables', icon: CheckIcon, count: completed.length, color: 'text-lime-600 bg-lime-50 border-lime-200', items: completed }
    ]
  }, [filteredTasks])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#FAF8F5]">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <main className="flex-1 p-6 lg:p-8 max-w-[1680px] mx-auto w-full">
            <DynamicHeader
              onOpenNewTask={() => setIsCreateModalOpen(true)}
              onOpenSearch={() => {
                const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
                window.dispatchEvent(evt)
              }}
            />

            {/* ── TOP ACTION & TITLE BAR ── */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900 lg:text-[38px]">
                  Schedule &amp; <span className="font-serif-italic font-normal text-violet-700">Calendar</span>
                </h1>
                <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">
                  Sprint velocity, real task deadlines &amp; team sync timeline.
                </p>
              </div>

              {/* ── VIEW SWITCHER CAPSULE ── */}
              <div className="flex items-center gap-2">
                {isDockCollapsed && (
                  <button
                    type="button"
                    onClick={() => setIsDockCollapsed(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14161F] text-white text-xs font-bold border border-stone-800 shadow-xs hover:bg-stone-900 transition-all cursor-pointer"
                    title="Show deliverables dock"
                  >
                    <span>⇤ Show Dock</span>
                  </button>
                )}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200/80 shadow-2xs">
                  {/* Mode 1: Day Focus (Editorial Design) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('focus')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'focus'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <ClockIcon size={13} className={viewMode === 'focus' ? 'text-lime-400' : 'text-stone-400'} />
                    <span>Day Focus</span>
                  </button>

                  {/* Mode 2: 7-Day Sprint Planner */}
                  <button
                    type="button"
                    onClick={() => setViewMode('week')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'week'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <CalendarIcon size={13} className={viewMode === 'week' ? 'text-lime-400' : 'text-stone-400'} />
                    <span>7-Day Sprint Planner</span>
                  </button>

                  {/* Mode 3: Deliverables Agenda */}
                  <button
                    type="button"
                    onClick={() => setViewMode('agenda')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'agenda'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <FilterIcon size={13} className={viewMode === 'agenda' ? 'text-lime-400' : 'text-stone-400'} />
                    <span>Deliverables Agenda</span>
                  </button>
                </div>

                {/* Quick Add Deliverable Button */}
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="tactile flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#111318] hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <PlusIcon size={14} />
                  <span>New Deliverable</span>
                </button>
              </div>
            </div>

            {/* ── SEARCH & AIM DESCRIPTOR STRIP ── */}
            <div className="mb-6 p-3 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1 text-xs">
                <SearchIcon size={15} className="text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter schedule by task name, milestone, priority..."
                  className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-sans"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-stone-500 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {viewMode === 'focus' ? 'Editorial Day Focus · Live Timeline' : viewMode === 'week' ? 'Sprint Planning Mode · Mon–Sun' : 'Urgency Audit Mode · Chronological Feed'}
                </span>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* MAIN CONTENT GRID (8 COLS LEFT/CENTER + 4 COLS RIGHT DOCK) */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12">
              {/* ── LEFT & CENTER AREA (8 cols normally, 12 cols when dock is collapsed) ── */}
              <div className={`${isDockCollapsed ? 'xl:col-span-12' : 'xl:col-span-8'} flex flex-col gap-6`}>

                {/* ──────────────────────────────────────────────────────── */}
                {/* VIEW 1: DAY FOCUS (Beloved Editorial Design Image 2)     */}
                {/* ──────────────────────────────────────────────────────── */}
                {viewMode === 'focus' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* ── SUB-COL 1: LEFT MINI CALENDAR, TODAY'S FOCUS & UPCOMING EVENTS (5 cols) ── */}
                    <div className="lg:col-span-5 rounded-3xl bg-white border border-stone-200/80 p-5 shadow-2xs space-y-5">
                      {/* Mini Calendar Header */}
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-[#111318] text-[#84CC16] flex items-center justify-center font-bold text-sm shadow-2xs font-serif italic">
                              M
                            </div>
                            <h3 className="font-bold text-sm text-stone-900 tracking-tight flex items-baseline gap-1.5">
                              <span>Calendar</span>
                              <em className="italic font-serif font-normal text-stone-500 text-xs">
                                {currentMonthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </em>
                            </h3>
                          </div>
                          
                          {/* Month Navigation: Jump to Today, Prev Month, Next Month */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={handleToday}
                              className="px-2 py-0.5 text-[10px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                              title="Jump to today"
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="text-stone-400 hover:text-stone-800 p-1 rounded-lg transition-colors cursor-pointer hover:bg-stone-100"
                              title="Previous month"
                            >
                              <ChevronLeftIcon size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="text-stone-400 hover:text-stone-800 p-1 rounded-lg transition-colors cursor-pointer hover:bg-stone-100"
                              title="Next month"
                            >
                              <ChevronRightIcon size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Month Matrix Grid (Dynamically Populated Dots from Database Tasks) */}
                        <div>
                          <div className="grid grid-cols-7 text-center text-[10px] font-mono font-bold text-stone-400 mb-2 uppercase tracking-wider">
                            <span>Su</span>
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                          </div>

                          <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-sans">
                            {dynamicCalendarMatrix.map((item, idx) => {
                              const isCurrentActive = item.dateStr === selectedDateStr
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setSelectedDateStr(item.dateStr)
                                    setIsDayFiltered(true)
                                    toast.success(`Showing agenda for ${new Date(item.dateStr + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`)
                                  }}
                                  className="flex flex-col items-center justify-center py-0.5 cursor-pointer group"
                                >
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all relative ${
                                      isCurrentActive
                                        ? 'bg-[#111318] text-white font-bold shadow-xs'
                                        : item.isToday
                                        ? 'border-2 border-lime-500 text-stone-900 font-bold bg-lime-50/50'
                                        : item.isPrev || item.isNext
                                        ? 'text-stone-300 font-normal'
                                        : item.hasTasks
                                        ? 'text-stone-950 font-bold hover:bg-stone-100'
                                        : 'text-stone-600 hover:bg-stone-100 font-medium'
                                    }`}
                                  >
                                    {item.day}
                                  </span>
                                  <div className="flex items-center justify-center gap-1 mt-1 h-2">
                                    {item.dots && item.dots.length > 0 ? (
                                      <>
                                        {item.dots.map((dot, dIdx) => (
                                          <span
                                            key={dIdx}
                                            className="w-1.5 h-1.5 rounded-full ring-1 ring-white/90 shadow-2xs transition-transform group-hover:scale-125 shrink-0"
                                            style={{ backgroundColor: typeof dot === 'string' ? dot : dot.color }}
                                            title={typeof dot === 'string' ? 'Task scheduled' : `${dot.title} · ${dot.assignee} (${dot.priority || 'Task'})`}
                                          />
                                        ))}
                                        {item.overflowCount > 0 && (
                                          <span className="text-[7.5px] font-mono font-bold text-stone-400 leading-none">
                                            +{item.overflowCount}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="w-1.5 h-1.5 opacity-0" />
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* ── TODAY'S FOCUS SECTION (Directly below calendar, connected to real DB tasks) ── */}
                      <div className="pt-3 border-t border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-serif italic text-stone-900 font-semibold tracking-tight">
                            Today&apos;s Focus ({todaysFocusTasks.filter(t => t.status === 'DONE').length}/{todaysFocusTasks.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-stone-400 hover:text-stone-900 p-1 rounded-md transition-colors cursor-pointer hover:bg-stone-100"
                            title="Add deliverable to backend"
                          >
                            <PlusIcon size={13} />
                          </button>
                        </div>

                        <div className="space-y-1.5 font-sans">
                          {todaysFocusTasks.map(tsk => {
                            const isDone = tsk.status === 'DONE'
                            return (
                              <div
                                key={tsk.id}
                                className="flex items-center justify-between text-xs group p-1.5 rounded-xl hover:bg-stone-50 transition-colors select-none"
                              >
                                <span
                                  onClick={() => setSelectedTaskForDrawer(tsk)}
                                  className={`text-xs font-medium transition-all truncate pr-2 cursor-pointer hover:text-violet-700 ${
                                    isDone ? 'line-through text-stone-400' : 'text-stone-800'
                                  }`}
                                  title="Click to view &amp; edit task"
                                >
                                  {tsk.title}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleToggleTaskDone(tsk)}
                                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                    isDone
                                      ? 'bg-[#111318] border-[#111318] text-lime-400 shadow-2xs'
                                      : 'border-stone-300 bg-white group-hover:border-stone-600'
                                  }`}
                                  title={isDone ? 'Mark as todo' : 'Mark as done'}
                                >
                                  {isDone && <CheckIcon size={10} strokeWidth={3} />}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* ── UPCOMING EVENTS SECTION (Connected to real upcoming deliverables & meetings) ── */}
                      <div className="pt-3 border-t border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-serif italic text-stone-900 font-semibold tracking-tight">
                            Upcoming Events
                          </span>
                          <button
                            type="button"
                            onClick={() => setNewMeetingModal(true)}
                            className="text-stone-400 hover:text-stone-900 p-1 rounded-md transition-colors cursor-pointer hover:bg-stone-100"
                            title="Schedule meeting"
                          >
                            <PlusIcon size={13} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          {dynamicUpcomingEvents.map(ev => (
                            <div
                              key={ev.id}
                              onClick={() => {
                                if (ev.taskRef) {
                                  setSelectedTaskForDrawer(ev.taskRef)
                                } else if (ev.meetUrl) {
                                  window.open(ev.meetUrl, '_blank')
                                  toast.success(`Opening ${ev.name}...`)
                                } else {
                                  toast.success(`Viewing ${ev.name}`)
                                }
                              }}
                              className="flex items-center justify-between text-xs group cursor-pointer hover:bg-stone-50 p-2 rounded-xl transition-all border border-transparent hover:border-stone-200/60"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-2xs shrink-0"
                                  style={{ backgroundColor: ev.color }}
                                >
                                  {ev.initials}
                                </div>
                                <span className="font-semibold text-stone-800 text-xs truncate">
                                  {ev.name}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-stone-400 font-normal shrink-0">
                                {ev.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── BOTTOM PROFILE & QUICK ACTION BAR ── */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#111318] text-lime-400 flex items-center justify-center font-bold text-[10px]">
                            {initials || 'AJ'}
                          </div>
                          <span className="text-xs font-semibold text-stone-800">{fullName || 'Alex Johnson'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewMeetingModal(true)}
                          className="w-7 h-7 rounded-full bg-[#111318] hover:bg-black text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                          title="Schedule meeting"
                        >
                          <PlusIcon size={13} />
                        </button>
                      </div>
                    </div>

                    {/* ── SUB-COL 2: MAIN TIMELINE STAGE (7 cols, Connected to Real Tasks) ── */}
                    <div className="lg:col-span-7 rounded-3xl bg-white border border-stone-200/80 p-5 sm:p-7 shadow-2xs space-y-6">
                      {/* Editorial Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-3xl sm:text-4xl font-serif italic font-normal text-stone-950 tracking-tight leading-none">
                              {currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Previous month"
                              >
                                <ChevronLeftIcon size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Next month"
                              >
                                <ChevronRightIcon size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-stone-400 font-sans mt-1">
                            Sprint &amp; Meeting Editorial Timeline
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(window.location.href)
                              toast.success('Timeline link copied to clipboard!')
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ShareIcon size={12} />
                            <span>Share</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewMeetingModal(true)}
                            className="px-4 py-1.5 rounded-full bg-[#111318] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-98 cursor-pointer"
                          >
                            <PlusIcon size={12} />
                            <span>+ Event</span>
                          </button>
                        </div>
                      </div>

                      {/* Active Day Filter Banner (Audit Item 2: Timezone & Day Highlighting) */}
                      {isDayFiltered && (
                        <div className="flex items-center justify-between bg-stone-100 p-3 px-4 rounded-2xl border border-stone-200/80">
                          <div className="flex items-center gap-2.5 text-xs font-medium text-stone-800">
                            <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse" />
                            <span>
                              Showing: <strong className="text-stone-950 font-bold">{new Date(selectedDateStr + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsDayFiltered(false)}
                            className="text-xs font-bold text-violet-700 hover:text-violet-900 hover:underline cursor-pointer transition-colors"
                          >
                            Show Full Month (Clear Filter)
                          </button>
                        </div>
                      )}

                      {/* Stream of Day Blocks (Filtered or Full Month) */}
                      <div className="space-y-8">
                        {mergedSchedules
                          .filter(dayItem => (!isDayFiltered ? true : (dayItem.dateStr === selectedDateStr || String(dayItem.dayNumber).padStart(2, '0') === selectedDateStr.split('-')[2])))
                          .map((dayItem) => (
                          <div
                            key={dayItem.dayNumber}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pt-6 border-t border-stone-100 first:border-t-0 first:pt-0"
                          >
                            {/* Day Number and Task Dots Badge */}
                            <div className="sm:col-span-3 flex flex-col items-start select-none">
                              <span className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-widest block">
                                {dayItem.dayName}
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-5xl sm:text-6xl font-serif italic font-normal text-stone-950 tracking-tight leading-none mt-1">
                                  {dayItem.dayNumber}
                                </span>
                                {dayItem.events && dayItem.events.length > 0 && (
                                  <div className="flex items-center gap-1 self-center mt-3">
                                    {dayItem.events.slice(0, 4).map((ev, evIdx) => (
                                      <span
                                        key={evIdx}
                                        className="w-2 h-2 rounded-full ring-1 ring-white shadow-2xs"
                                        style={{ backgroundColor: ev.accentColor || '#8B5CF6' }}
                                        title={ev.title}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Events & Tasks for this day */}
                            <div className="sm:col-span-9 space-y-3.5">
                              {dayItem.events.length === 0 ? (
                                <div className="p-4 rounded-2xl bg-stone-50/70 border border-dashed border-stone-200 flex items-center justify-between gap-3 text-stone-400 font-sans">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-stone-400 shadow-2xs border border-stone-100">
                                      <CalendarIcon size={13} />
                                    </div>
                                    <span className="text-xs font-medium">
                                      Focus Time — No meetings scheduled
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (dayItem.dateStr) {
                                        setSelectedDateStr(dayItem.dateStr)
                                      }
                                      setNewMeetingModal(true)
                                    }}
                                    className="text-xs font-bold text-stone-700 hover:text-black flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-2xs hover:bg-stone-100 cursor-pointer transition-all"
                                  >
                                    <PlusIcon size={11} />
                                    <span>Schedule</span>
                                  </button>
                                </div>
                              ) : (
                                dayItem.events.map((ev, eIdx) => {
                                  const PlatIcon = ev.platformIcon || GoogleMeetIcon
                                  const isFirstLive = dayItem.isToday && eIdx === 0

                                  return (
                                    <div key={ev.id} className="relative font-sans group">
                                      {/* Pulsing LIVE NOW Bar matching reference image */}
                                      {isFirstLive && (
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse relative z-10 ring-4 ring-lime-100" />
                                          <div className="flex-1 h-[1.5px] bg-lime-400" />
                                          <span className="text-[9.5px] font-mono font-black text-lime-900 bg-[#D9F99D] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                                            LIVE NOW
                                          </span>
                                        </div>
                                      )}

                                      {/* Editorial Event Card */}
                                      <div
                                        className={`p-4 sm:p-5 rounded-2xl bg-white hover:bg-stone-50/80 border border-stone-200/80 transition-all shadow-2xs hover:shadow-xs flex items-stretch gap-3.5 ${
                                          ev.taskRef && ev.taskRef.status === 'DONE' ? 'opacity-65' : ''
                                        }`}
                                      >
                                        {/* Vertical Accent Stripe */}
                                        <div
                                          className="w-1.5 rounded-full shrink-0"
                                          style={{ backgroundColor: ev.accentColor }}
                                        />

                                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                                          {/* Top: Category Tag & Time */}
                                          <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              {/* Audit Item 1: Distinct Mental Model Badges */}
                                              {ev.taskRef ? (
                                                <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 border border-violet-200/80 flex items-center gap-1">
                                                  <TargetIcon size={10} />
                                                  <span>DELIVERABLE / DUE</span>
                                                </span>
                                              ) : (
                                                <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                                                  <VideoIcon size={10} />
                                                  <span>EVENT / SYNC</span>
                                                </span>
                                              )}
                                              <span
                                                className="text-[10.5px] font-mono font-bold tracking-wider uppercase"
                                                style={{ color: ev.accentColor }}
                                              >
                                                {ev.category}
                                              </span>
                                              {ev.taskRef && (
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                                                  ev.taskRef.status === 'DONE'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-stone-100 text-stone-600'
                                                }`}>
                                                  {ev.taskRef.status || 'TODO'}
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <div className="text-sm font-mono font-bold text-stone-900 text-right leading-tight">
                                                {ev.timeStart}
                                                <span className="text-xs font-medium text-stone-400 block sm:inline sm:ml-1">
                                                  -{ev.timeEnd}
                                                </span>
                                              </div>

                                              {/* 1-Click Task Done Toggle if connected to real task */}
                                              {ev.taskRef && (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleToggleTaskDone(ev.taskRef)
                                                  }}
                                                  className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                                    ev.taskRef.status === 'DONE'
                                                      ? 'bg-stone-900 border-stone-900 text-lime-400'
                                                      : 'border-stone-300 bg-white hover:border-lime-500'
                                                  }`}
                                                  title={ev.taskRef.status === 'DONE' ? 'Mark incomplete' : 'Mark complete'}
                                                >
                                                  {ev.taskRef.status === 'DONE' && <CheckIcon size={12} strokeWidth={3} />}
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          {/* Title (Opens Task Detail Drawer when taskRef exists) */}
                                          <h4
                                            onClick={() => {
                                              if (ev.taskRef) {
                                                setSelectedTaskForDrawer(ev.taskRef)
                                              } else {
                                                toast.success(`Event: ${ev.title}`)
                                              }
                                            }}
                                            className={`text-sm sm:text-base font-bold font-sans leading-snug cursor-pointer hover:text-violet-700 transition-colors ${
                                              ev.taskRef && ev.taskRef.status === 'DONE' ? 'line-through text-stone-400' : 'text-stone-900'
                                            }`}
                                            title={ev.taskRef ? "Click to view/edit task details" : ev.title}
                                          >
                                            {ev.title}
                                          </h4>

                                          {/* Bottom: Platform & Attendee Avatars */}
                                          <div className="flex items-center justify-between pt-2 border-t border-stone-100/80">
                                            <button
                                              type="button"
                                              onClick={() => handleJoinMeeting(ev)}
                                              className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium transition-colors cursor-pointer"
                                            >
                                              <PlatIcon size={14} className="text-stone-700" />
                                              <span>{ev.platform}</span>
                                            </button>

                                            {/* Attendee Avatars Pile */}
                                            {ev.attendees && ev.attendees.length > 0 && (
                                              <div className="flex items-center -space-x-1.5">
                                                {ev.attendees.map((at, aIdx) => (
                                                  <div
                                                    key={aIdx}
                                                    className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white shadow-2xs"
                                                    style={{ backgroundColor: at.color }}
                                                    title={at.name}
                                                  >
                                                    {at.initials}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* VIEW 2: 7-DAY SPRINT PLANNER (Monday to Sunday Grid)     */}
                {/* ──────────────────────────────────────────────────────── */}
                {viewMode === 'week' && (
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div>
                        <h2 className="font-serif-italic text-2xl text-stone-900 leading-none">
                          Sprint Week Deadlines
                        </h2>
                        <p className="text-xs text-stone-500 font-medium mt-1">
                          Monday to Sunday roadmap with live task due dates
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toast.success('Showing current sprint cycle')}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
                        >
                          Current Week
                        </button>
                      </div>
                    </div>

                    {/* 7 Columns: Mon to Sun */}
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                      {sprintDays.map(day => (
                        <div
                          key={day.dateStr}
                          className={`rounded-2xl p-3 border transition-all flex flex-col min-h-[360px] ${
                            day.isToday
                              ? 'bg-amber-50/40 border-amber-300/80 shadow-2xs'
                              : 'bg-stone-50/50 border-stone-200/60 hover:bg-white hover:border-stone-300'
                          }`}
                        >
                          {/* Day Header */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/60">
                            <div>
                              <span className="text-[11px] font-bold text-stone-500 block uppercase font-mono">
                                {day.dayName}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`text-lg font-black leading-none stat-number ${day.isToday ? 'text-amber-700' : 'text-stone-900'}`}>
                                  {day.dayNum}
                                </span>
                                {day.tasks.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    {day.tasks.slice(0, 3).map((t, idx) => (
                                      <span
                                        key={idx}
                                        className="w-1.5 h-1.5 rounded-full ring-1 ring-white/80"
                                        style={{ backgroundColor: getTaskDotColor(t, members) }}
                                        title={t.title}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {day.isToday && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono">
                                Today
                              </span>
                            )}
                          </div>

                          {/* Day Tasks Stack */}
                          <div className="space-y-2 flex-1">
                            {day.tasks.length === 0 ? (
                              <div className="h-full flex items-center justify-center text-center p-2 text-[11px] text-stone-400 font-mono">
                                No deadlines
                              </div>
                            ) : (
                              day.tasks.map(t => {
                                const isDone = t.status === 'DONE'
                                const pStyle = PRIORITY_BADGES[t.priority] || PRIORITY_BADGES.MEDIUM

                                return (
                                  <div
                                    key={t.id}
                                    className={`p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs transition-all hover:shadow-xs ${
                                      isDone ? 'opacity-60 bg-stone-50' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border ${pStyle.bg}`}>
                                        {t.priority || 'MED'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleTaskDone(t)}
                                        className="h-3.5 w-3.5 rounded border border-stone-300 flex items-center justify-center hover:border-lime-500 cursor-pointer"
                                      >
                                        {isDone && <CheckIcon size={8} className="text-lime-600" />}
                                      </button>
                                    </div>

                                    <h4
                                      onClick={() => setSelectedTaskForDrawer(t)}
                                      className={`text-xs font-bold leading-tight line-clamp-2 cursor-pointer hover:text-violet-700 ${
                                        isDone ? 'line-through text-stone-400' : 'text-stone-900'
                                      }`}
                                    >
                                      {t.title}
                                    </h4>
                                  </div>
                                )
                              })
                            )}
                          </div>

                          {/* Quick Add Button on Day */}
                          <button
                            type="button"
                            onClick={() => {
                              setCreateModalDefaultStatus('TODO')
                              setIsCreateModalOpen(true)
                            }}
                            className="w-full mt-2 py-1.5 text-[10px] font-bold text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/50 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <PlusIcon size={11} />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* VIEW 3: DELIVERABLES AGENDA (Urgency Chronological Feed) */}
                {/* ──────────────────────────────────────────────────────── */}
                {viewMode === 'agenda' && (
                  <div className="space-y-6">
                    {agendaSections.every(sec => sec.items.length === 0) ? (
                      <div className="bg-white rounded-3xl p-12 border border-stone-200/80 text-center shadow-2xs">
                        <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                          <FilterIcon size={24} />
                        </div>
                        <h3 className="text-base font-extrabold text-stone-900">No deliverables found</h3>
                        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                          There are no deliverables matching your current view or filter.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsCreateModalOpen(true)}
                          className="mt-4 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                        >
                          + Create Deliverable
                        </button>
                      </div>
                    ) : (
                      agendaSections.map(sec => {
                        const SecIcon = sec.icon
                        if (sec.items.length === 0) return null

                        return (
                          <div key={sec.id} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                              <div className="flex items-center gap-2">
                                <span className={`p-1.5 rounded-xl border ${sec.color}`}>
                                  <SecIcon size={14} />
                                </span>
                                <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
                                  {sec.title}
                                </h3>
                                <span className="text-xs font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                                  {sec.count}
                                </span>
                              </div>
                            </div>

                            {/* Section Tasks */}
                            <div className="divide-y divide-stone-100">
                              {sec.items.map(task => {
                                const isDone = task.status === 'DONE'
                                const pStyle = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.MEDIUM
                                const assignedMember = members.find(m => String(m.id) === String(task.assigned_to))

                                return (
                                  <div
                                    key={task.id}
                                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/80 px-2 rounded-xl transition-colors"
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleTaskDone(task)}
                                        className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                          isDone
                                            ? 'bg-stone-900 border-stone-900 text-white'
                                            : 'border-stone-300 bg-white hover:border-lime-500'
                                        }`}
                                      >
                                        {isDone && <CheckIcon size={12} strokeWidth={3} />}
                                      </button>

                                      <div className="min-w-0">
                                        <h4
                                          onClick={() => setSelectedTaskForDrawer(task)}
                                          className={`text-sm font-bold truncate cursor-pointer hover:text-violet-700 transition-colors ${
                                            isDone ? 'line-through text-stone-400' : 'text-stone-900'
                                          }`}
                                        >
                                          {task.title}
                                        </h4>
                                        {task.description && (
                                          <p className="text-xs text-stone-500 truncate max-w-lg mt-0.5">
                                            {task.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${pStyle.bg}`}>
                                        {task.priority || 'MEDIUM'}
                                      </span>

                                      {task.due_date && (
                                        <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                                          {String(task.due_date).split('T')[0]}
                                        </span>
                                      )}

                                      {assignedMember && (
                                        <div
                                          className="h-6 w-6 rounded-full bg-violet-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-2xs"
                                          title={assignedMember.first_name}
                                        >
                                          {(assignedMember.first_name?.[0] || 'U').toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>

              {/* ── RIGHT DOCK: REAL WORKING STATS & DELIVERABLES (4 cols when open) ── */}
            {!isDockCollapsed && (
              <div className="xl:col-span-4">
                <DeliverablesDock
                  tasks={effectiveTasks}
                  members={members}
                  sprintMetrics={sprintMetrics}
                  onToggleTask={handleToggleTaskDone}
                  onOpenTask={setSelectedTaskForDrawer}
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  isDockCollapsed={isDockCollapsed}
                  setIsDockCollapsed={setIsDockCollapsed}
                  onSelectDate={(dateStr) => {
                    setSelectedDateStr(dateStr)
                    setIsDayFiltered(true)
                  }}
                  selectedDateStr={selectedDateStr}
                />
              </div>
            )}
            </div>
          </main>
        </div>

        {/* ── QUICK SCHEDULE MEETING MODAL (Persists to Backend Tasks API) ── */}
        {newMeetingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-lg font-bold text-stone-950">
                  Schedule New Meeting
                </h3>
                <button
                  type="button"
                  onClick={() => setNewMeetingModal(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design System Review"
                    value={newMeetingTitle}
                    onChange={e => setNewMeetingTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15:00 - 16:00"
                    value={newMeetingTime}
                    onChange={e => setNewMeetingTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-stone-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Platform
                    </label>
                    <select
                      value={newMeetingPlatform}
                      onChange={e => setNewMeetingPlatform(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium bg-stone-50 rounded-xl border border-stone-200 outline-none cursor-pointer"
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Figma Live">Figma Live</option>
                      <option value="Zoom">Zoom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newMeetingCategory}
                      onChange={e => setNewMeetingCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium bg-stone-50 rounded-xl border border-stone-200 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setNewMeetingModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#111318] hover:bg-black text-white shadow-xs cursor-pointer"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── CREATE DELIVERABLE MODAL (Database Task via /api/tasks/add_task) ── */}
        <CreateTaskModal
          open={isCreateModalOpen}
          defaultColumnId={createModalDefaultStatus}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleTaskAdded}
          members={members}
          organizationId={activeOrgId}
        />

        {/* ── TASK DETAIL DRAWER (Deep Inspection & Edit via /api/tasks/update_task) ── */}
        {selectedTaskForDrawer && (
          <TaskDetailDrawer
            task={selectedTaskForDrawer}
            open={Boolean(selectedTaskForDrawer)}
            onClose={() => setSelectedTaskForDrawer(null)}
            onUpdateTask={handleTaskUpdated}
            onDeleteTask={handleTaskDeleted}
            members={members}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
