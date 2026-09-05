"use client"

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import {
  ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon,
  ClockIcon, ShareIcon, ArrowUpRightIcon, VideoIcon, CheckCircleIcon,
  PaletteIcon, UsersIcon, CalendarIcon, MoreHorizontalIcon, FilterIcon,
  CheckIcon, PlayIcon, PauseIcon, CoffeeIcon,
  GoogleMeetIcon, ZoomIcon, FigmaIcon, NotionIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'

// ─── Data for Card & Table Views ─────────────────────────────────
const scheduleEvents = [
  {
    id: 'evt-1',
    day: 17,
    dayLabel: 'Mon',
    time: '9:25 - 11:15',
    title: 'Calling Customer',
    subtitle: 'Sprint retrospective sync',
    category: 'Sales',
    lead: 'Jane Cooper',
    leadInitials: 'JC',
    leadColor: '#f59e0b',
    color: '#FEF9C3',
    border: '#FEF08A',
    textColor: '#78350f',
    type: 'call',
    location: 'Phone Call',
    status: 'Completed'
  },
  {
    id: 'evt-2',
    day: 17,
    dayLabel: 'Mon',
    time: '9:30 - 12:30',
    title: 'Design Review',
    subtitle: 'Bank App .fig inspection',
    category: 'Design',
    lead: 'Jane Cooper',
    leadInitials: 'JC',
    leadColor: '#0284c7',
    color: '#E0F2FE',
    border: '#BAE6FD',
    textColor: '#0369a1',
    type: 'design',
    location: 'Figma Live',
    status: 'Completed'
  },
  {
    id: 'evt-3',
    day: 18,
    dayLabel: 'Tue',
    time: '10:30 - 14:20',
    title: 'Design Meet: UI System Audit',
    subtitle: 'High-contrast tokens & component review',
    category: 'Design',
    lead: 'Sarah Chen',
    leadInitials: 'SC',
    leadColor: '#8b5cf6',
    color: '#EDE9FE',
    border: '#DDD6FE',
    textColor: '#6d28d9',
    type: 'meet',
    location: 'Google Meet',
    status: 'In Progress',
    attendees: ['SC', 'MW', 'PN', '+3']
  },
  {
    id: 'evt-4',
    day: 19,
    dayLabel: 'Wed',
    time: '9:30 - 12:30',
    title: 'Sprint Review & Demo',
    subtitle: 'Completed: 2/4 milestones',
    category: 'Management',
    lead: 'Alex Johnson',
    leadInitials: 'AJ',
    leadColor: '#f43f5e',
    color: '#FFE4E6',
    border: '#FECDD3',
    textColor: '#be123c',
    type: 'sprint',
    location: 'Conference Room B',
    status: 'Upcoming'
  },
  {
    id: 'evt-5',
    day: 20,
    dayLabel: 'Thu',
    time: '11:30 - 13:05',
    title: 'Business Dinner & Advisory',
    subtitle: 'Downtown Bistro Cafe',
    category: 'Commercial',
    lead: 'Marcus Webb',
    leadInitials: 'MW',
    leadColor: '#10b981',
    color: '#DCFCE7',
    border: '#BBF7D0',
    textColor: '#15803D',
    type: 'dinner',
    location: 'Downtown Bistro',
    status: 'Upcoming'
  },
]

// ─── Data for Block View (New Editorial Calendar UI) ─────────────
const initialDaySchedules = [
  {
    dayNumber: '03',
    dayName: 'We',
    isToday: true,
    events: [
      {
        id: 'evt-301',
        timeStart: '10:00',
        timeEnd: '17:30',
        category: 'Learn Design',
        title: 'Design meeting check product',
        accentColor: '#10B981',
        type: 'call',
        linkText: 'Call Detile',
        platform: 'Google Meet',
        platformIcon: GoogleMeetIcon,
        attendees: [
          { name: 'Alex', initials: 'AJ', color: '#8B5CF6' },
          { name: 'Sarah', initials: 'SC', color: '#6366F1' },
          { name: 'Marcus', initials: 'MW', color: '#10B981' }
        ]
      },
      {
        id: 'evt-302',
        timeStart: '18:00',
        timeEnd: '20:30',
        category: 'Design Meeting',
        title: 'Make daily schedule design',
        accentColor: '#8B5CF6',
        type: 'meet',
        linkText: 'Live Stream',
        platform: 'Figma Live',
        platformIcon: FigmaIcon,
        attendees: [
          { name: 'Kacie', initials: 'KV', color: '#F43F5E' },
          { name: 'Alex', initials: 'AJ', color: '#8B5CF6' }
        ]
      }
    ]
  },
  {
    dayNumber: '04',
    dayName: 'Th',
    isToday: false,
    events: []
  },
  {
    dayNumber: '05',
    dayName: 'Fr',
    isToday: false,
    events: [
      {
        id: 'evt-501',
        timeStart: '13:00',
        timeEnd: '14:30',
        category: 'Focus Block',
        title: 'Component Architecture Sync & Refactor',
        accentColor: '#F59E0B',
        type: 'dev',
        platform: 'Zoom',
        platformIcon: ZoomIcon,
        attendees: [
          { name: 'Marcus', initials: 'MW', color: '#10B981' },
          { name: 'Sarah', initials: 'SC', color: '#6366F1' }
        ]
      }
    ]
  }
]

const initialDailyTasks = [
  { id: 'tsk-1', title: 'Learn design', done: true },
  { id: 'tsk-2', title: 'Design meeting check product', done: false },
  { id: 'tsk-3', title: 'Call client about project', done: false },
  { id: 'tsk-4', title: 'Update design system tokens', done: false }
]

const initialEventsList = [
  { id: 'ev-1', name: 'Design meeting', time: '10:00 - 17:30', color: '#10B981', initials: 'SC' },
  { id: 'ev-2', name: 'Sprint review', time: '18:00 - 20:30', color: '#8B5CF6', initials: 'AJ' }
]

const calendarMatrix = [
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
  { day: 18, isPrev: false, dots: ['#10B981', '#8B5CF6'] },
  { day: 19, isPrev: false, dots: ['#F43F5E'] },
  { day: 20, isPrev: false, dots: ['#3B82F6'] },
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

// ─── Data for Right Command Dock (Urgent Tasks & Data Viz) ───────
const initialUrgentTasks = [
  {
    id: 'urg-1',
    title: 'Design System 2.0 Components',
    category: 'Design',
    time: '9:00 - 13:00',
    timeColor: 'text-rose-400',
    avatars: [
      { initials: 'SC', bg: 'bg-rose-500' },
      { initials: 'AJ', bg: 'bg-indigo-500' }
    ],
    progress: 67,
    progressLabel: '67% complete',
    status: 'active',
    detail: 'Complete typography tokens, component variants, and interactive button states.'
  },
  {
    id: 'urg-2',
    title: 'Designers Sprint Handoff',
    category: 'Design',
    time: '14:30 - 16:10',
    timeColor: 'text-violet-400',
    badge: 'Important',
    meetUrl: 'meet.google.com/mzh-m...',
    fullMeetUrl: 'https://meet.google.com/mzh-mrkv-qtz',
    status: 'active',
    detail: 'Sync meeting with design engineering leads to finalize sprint deliverables.'
  },
  {
    id: 'urg-3',
    title: 'Make Weekly Velocity Report',
    category: 'Dev',
    time: '17:00 - 18:00',
    timeColor: 'text-sky-400',
    people: '19 People',
    tasksCount: '81 Tasks',
    status: 'active',
    detail: 'Consolidate engineering velocity metrics and issue burndown across 4 squads.'
  },
  {
    id: 'urg-4',
    title: 'Microcopy & Onboarding Polish',
    category: 'Copyright',
    time: '11:00 - 12:30',
    timeColor: 'text-amber-400',
    avatars: [
      { initials: 'EL', bg: 'bg-amber-500' },
      { initials: 'AJ', bg: 'bg-indigo-500' }
    ],
    progress: 40,
    progressLabel: '40% complete',
    status: 'active',
    detail: 'Audit onboarding tooltips, empty states, and validation warnings.'
  },
  {
    id: 'urg-5',
    title: 'API Gateway Health Validation',
    category: 'Dev',
    time: '18:15 - 19:30',
    timeColor: 'text-emerald-400',
    badge: 'Urgent',
    meetUrl: 'meet.google.com/api-dev',
    fullMeetUrl: 'https://meet.google.com/api-dev',
    status: 'active',
    detail: 'Validate production deployment routes, caching headers, and rate limits.'
  }
]

const statsPeriodsData = {
  all: {
    label: 'All Time',
    completedRate: 75,
    unfulfilledRate: 25,
    resultBadge: 'Great Result',
    badgeColor: 'text-lime-400 bg-lime-950/80 border-lime-500/30'
  },
  week: {
    label: 'This Week',
    completedRate: 88,
    unfulfilledRate: 12,
    resultBadge: 'Exceptional Result',
    badgeColor: 'text-lime-400 bg-lime-950/80 border-lime-500/30'
  },
  month: {
    label: 'This Month',
    completedRate: 79,
    unfulfilledRate: 21,
    resultBadge: 'Great Result',
    badgeColor: 'text-lime-400 bg-lime-950/80 border-lime-500/30'
  },
  today: {
    label: 'Today',
    completedRate: 60,
    unfulfilledRate: 40,
    resultBadge: 'On Track',
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/30'
  }
}

const allocPeriodsData = {
  all: {
    label: 'All Time',
    learning: 72,
    design: 18,
    biz: 10,
    learningInfo: '72% Learning (54 tasks, 86 hrs)',
    designInfo: '18% Design (14 tasks, 22 hrs)',
    bizInfo: '10% Biz (8 tasks, 12 hrs)'
  },
  week: {
    label: 'This Week',
    learning: 64,
    design: 26,
    biz: 10,
    learningInfo: '64% Learning (16 tasks, 24 hrs)',
    designInfo: '26% Design (7 tasks, 11 hrs)',
    bizInfo: '10% Biz (3 tasks, 4 hrs)'
  },
  month: {
    label: 'This Month',
    learning: 70,
    design: 20,
    biz: 10,
    learningInfo: '70% Learning (42 tasks, 68 hrs)',
    designInfo: '20% Design (12 tasks, 19 hrs)',
    bizInfo: '10% Biz (6 tasks, 9 hrs)'
  }
}

export default function CalendarPage() {
  const { fullName, initials } = useCurrentUser()

  // View state: 'card' | 'block' | 'table'
  const [viewMode, setViewMode] = useState('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCardDay, setSelectedCardDay] = useState(18)

  // Card View (Airbnb UX Audited) Interactive States
  const [cardCategoryFilter, setCardCategoryFilter] = useState('All')
  const [focusSessionActive, setFocusSessionActive] = useState(false)
  const [selectedCardEvent, setSelectedCardEvent] = useState(null)
  const [cardMilestones, setCardMilestones] = useState([
    { id: 'ms-1', title: 'Wireframes & User Flows', done: true },
    { id: 'ms-2', title: 'Interactive Prototypes', done: true },
    { id: 'ms-3', title: 'UI / UX Design Token Audit', done: false },
    { id: 'ms-4', title: 'Design System Component Library', done: false },
  ])

  const toggleCardMilestone = (id) => {
    setCardMilestones(prev =>
      prev.map(m => (m.id === id ? { ...m, done: !m.done } : m))
    )
    toast.success('Sprint milestone updated')
  }

  // Block View (New Editorial Calendar) states
  const [selectedMatrixDay, setSelectedMatrixDay] = useState(3)
  const [tasks, setTasks] = useState(initialDailyTasks)
  const [events, setEvents] = useState(initialEventsList)
  const [schedules, setSchedules] = useState(initialDaySchedules)
  const [newMeetingModal, setNewMeetingModal] = useState(false)
  const [newMeetingTitle, setNewMeetingTitle] = useState('')
  const [newMeetingTime, setNewMeetingTime] = useState('15:00 - 16:00')

  // Right Command Dock states (Fully working, not placeholder)
  const [urgentTasks, setUrgentTasks] = useState(initialUrgentTasks)
  const [dockCategoryFilter, setDockCategoryFilter] = useState('All')
  const [statsPeriod, setStatsPeriod] = useState('all')
  const [statsDropdownOpen, setStatsDropdownOpen] = useState(false)
  const [allocPeriod, setAllocPeriod] = useState('all')
  const [allocDropdownOpen, setAllocDropdownOpen] = useState(false)
  const [selectedUrgentTask, setSelectedUrgentTask] = useState(null)
  const [newUrgentModalOpen, setNewUrgentModalOpen] = useState(false)
  const [newUrgentTitle, setNewUrgentTitle] = useState('')
  const [newUrgentCategory, setNewUrgentCategory] = useState('Design')
  const [newUrgentTime, setNewUrgentTime] = useState('14:00 - 15:30')

  const dynamicScheduleEvents = scheduleEvents.map(e =>
    e.id === 'evt-4'
      ? { ...e, lead: fullName || e.lead, leadInitials: initials || e.leadInitials }
      : e
  )

  const filteredEvents = dynamicScheduleEvents.filter(e => {
    if (!searchQuery.trim()) return true
    return e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    )
    toast.success('Task status updated')
  }

  const handleAddNewTask = () => {
    const title = prompt('Enter new task name:')
    if (title && title.trim()) {
      const newTask = {
        id: `tsk-${Date.now()}`,
        title: title.trim(),
        done: false
      }
      setTasks(prev => [...prev, newTask])
      toast.success('Task added')
    }
  }

  const handleCreateMeeting = (e) => {
    e.preventDefault()
    if (!newMeetingTitle.trim()) return
    const newEvt = {
      id: `evt-${Date.now()}`,
      timeStart: newMeetingTime.split('-')[0]?.trim() || '15:00',
      timeEnd: newMeetingTime.split('-')[1]?.trim() || '16:00',
      category: 'Working',
      title: newMeetingTitle.trim(),
      accentColor: '#8B5CF6',
      type: 'meet',
      platform: 'Google Meet',
      platformIcon: GoogleMeetIcon
    }

    setSchedules(prev =>
      prev.map(d =>
        d.dayNumber === '03'
          ? { ...d, events: [...d.events, newEvt] }
          : d
      )
    )
    setNewMeetingTitle('')
    setNewMeetingModal(false)
    toast.success('New meeting scheduled!')
  }

  const handleToggleUrgentTask = (taskId) => {
    setUrgentTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isDone = t.status === 'completed'
        return {
          ...t,
          status: isDone ? 'active' : 'completed',
          progress: isDone ? 50 : 100,
          progressLabel: isDone ? '50% in progress' : '100% complete'
        }
      }
      return t
    }))
    toast.success('Urgent task status updated')
  }

  const handleJoinMeeting = (task) => {
    if (task.fullMeetUrl) {
      navigator.clipboard?.writeText(task.fullMeetUrl)
      window.open(task.fullMeetUrl, '_blank')
      toast.success(`Joined ${task.title} room! Link copied.`)
    } else {
      toast.success(`Joining meeting room for ${task.title}...`)
    }
  }

  const handleCreateUrgentTask = (e) => {
    e.preventDefault()
    if (!newUrgentTitle.trim()) return
    const newTask = {
      id: `urg-${Date.now()}`,
      title: newUrgentTitle.trim(),
      category: newUrgentCategory,
      time: newUrgentTime,
      timeColor: newUrgentCategory === 'Dev' ? 'text-sky-400' : newUrgentCategory === 'Copyright' ? 'text-amber-400' : 'text-violet-400',
      avatars: [{ initials: initials || 'AJ', bg: 'bg-indigo-500' }],
      progress: 0,
      progressLabel: '0% complete',
      status: 'active',
      detail: 'Added directly from the Urgent Command Dock.'
    }
    setUrgentTasks(prev => [newTask, ...prev])
    setNewUrgentTitle('')
    setNewUrgentModalOpen(false)
    toast.success('New urgent task added!')
  }

  const activeUrgentTasks = urgentTasks.filter(t => {
    if (dockCategoryFilter === 'All') return true
    return t.category.toLowerCase() === dockCategoryFilter.toLowerCase()
  })

  const activeStats = statsPeriodsData[statsPeriod] || statsPeriodsData.all
  const activeAlloc = allocPeriodsData[allocPeriod] || allocPeriodsData.all
  // 125.66 is the semi-circle circumference (radius 40, PI * 40)
  const arcDashOffset = 125.66 * (1 - (activeStats.completedRate / 100))

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5] text-stone-900 selection:bg-stone-900 selection:text-white">
        {/* Global Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-3 sm:px-5 lg:px-7 py-5 overflow-y-auto pt-16 lg:pt-5">
          {/* Dynamic Top Header */}
          <DynamicHeader
            onOpenNewTask={() => setNewMeetingModal(true)}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* ── Top Header Navigation & View Switcher Bar (Differentiated by AIM) ── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-950 tracking-tight font-serif">
                  Schedule & <em className="italic font-serif font-normal text-stone-900">Sprint Timelines</em>
                </h1>

                {/* View Switcher Capsule (Differentiated by AIM: Week Horizon | Day Focus | Agenda Ledger) */}
                <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-2xl sm:ml-2 border border-stone-200/60">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'card'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                    title="Main Aim: Multi-day capacity planning & balancing commitments with deep work"
                  >
                    <CalendarIcon size={12} className={viewMode === 'card' ? 'text-lime-400' : 'text-stone-400'} />
                    <span>Week Horizon</span>
                  </button>

                  <button
                    onClick={() => setViewMode('block')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'block'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                    title="Main Aim: Hour-by-hour operational timeline & today's immediate execution checklist"
                  >
                    <ClockIcon size={12} className={viewMode === 'block' ? 'text-lime-400' : 'text-stone-400'} />
                    <span>Day Focus</span>
                  </button>

                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-[#111318] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                    title="Main Aim: Filterable cross-functional ledger, search by lead, and meeting audit directory"
                  >
                    <FilterIcon size={12} className={viewMode === 'table' ? 'text-lime-400' : 'text-stone-400'} />
                    <span>Agenda Ledger</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60">
                  Show: 1 Week ▾
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href)
                    toast.success('Calendar link copied to clipboard!')
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <ShareIcon size={12} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Dynamic Aim Descriptor Banner */}
            <div className="py-2.5 px-3.5 mt-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0"></span>
                {viewMode === 'card' && (
                  <span>
                    <strong className="text-stone-900 font-semibold font-mono">Aim: 5-Day Capacity Horizon</strong> — Multi-day commitment balance, reviews &amp; protected deep work time.
                  </span>
                )}
                {viewMode === 'block' && (
                  <span>
                    <strong className="text-stone-900 font-semibold font-mono">Aim: Daily Time-Blocking Engine</strong> — Hour-by-hour schedule timeline for May 18 paired with immediate execution checklist.
                  </span>
                )}
                {viewMode === 'table' && (
                  <span>
                    <strong className="text-stone-900 font-semibold font-mono">Aim: Cross-Functional Operations Ledger</strong> — Search, filter, and audit all cross-functional sessions and leads.
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-stone-400 hidden md:inline">
                {viewMode === 'card' ? 'Planning Mode' : viewMode === 'block' ? 'Execution Mode' : 'Audit Mode'}
              </span>
            </div>

            {/* Search Bar for all views */}
            <div className="pt-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-400 flex-1">
                <SearchIcon size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search event, tasks, meeting, lead..."
                  className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-sans"
                />
              </div>
              <div className="flex items-center gap-2 text-stone-400 text-[11px] font-mono hidden sm:flex">
                <ClockIcon size={12} />
                <span>30 minutes ago · Active</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* MAIN UNIFIED DUAL-PANE VIEW: 8 COLS (VIEWS) + 4 COLS (DOCK)*/}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12">

            {/* ── LEFT / MAIN CONTENT AREA (8 cols) ── */}
            <div className="xl:col-span-8 flex flex-col gap-6">

              {/* VIEW MODE 1: CARD VIEW (MINIMAL, SPACIOUS & AESTHETIC DESIGN) */}
              {viewMode === 'card' && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-2xs space-y-6">
                  {/* Top Bar: Minimal Metrics & Category Filter Chips */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
                        <CalendarIcon size={13} className="text-stone-400" />
                        <strong className="text-stone-800 font-semibold">5 Events</strong> this week
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs font-mono text-stone-500 flex items-center gap-1.5 hidden sm:flex">
                        <ClockIcon size={13} className="text-stone-400" />
                        <span>9.5h Scheduled</span>
                      </span>
                      <span className="text-stone-300 hidden sm:inline">·</span>
                      <span className="text-xs font-mono text-emerald-700 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Tue 18 Active</span>
                      </span>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                      {['All', 'Design', 'Sales', 'Management', 'Commercial', 'Focus'].map(cat => {
                        const isSelected = cardCategoryFilter.toLowerCase() === cat.toLowerCase()
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCardCategoryFilter(cat)}
                            className={`px-3 py-1 text-xs font-mono font-medium rounded-full transition-all cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-[#111318] text-white shadow-2xs'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Clean & Light Rhythm Date Scrubber */}
                  <div className="grid grid-cols-5 gap-3 min-w-[700px] overflow-x-auto pb-1">
                    {[
                      { day: 17, label: 'Mon', count: '2 events' },
                      { day: 18, label: 'Tue', count: 'Live Now', type: 'live' },
                      { day: 19, label: 'Wed', count: '4 tasks' },
                      { day: 20, label: 'Thu', count: '1 event' },
                      { day: 21, label: 'Fri', count: '4h Flow' },
                    ].map(d => {
                      const isSelected = selectedCardDay === d.day
                      return (
                        <div
                          key={d.day}
                          onClick={() => {
                            setSelectedCardDay(d.day)
                            toast.success(`Focused on ${d.label} May ${d.day}`)
                          }}
                          className={`group text-center py-3 px-3.5 rounded-2xl cursor-pointer transition-all duration-200 select-none border ${
                            isSelected
                              ? 'bg-[#111318] text-white border-[#111318] shadow-sm -translate-y-0.5'
                              : 'bg-white hover:bg-stone-50 border-stone-200/70 text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-mono font-medium tracking-wider uppercase ${
                              isSelected ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-600'
                            }`}>
                              {d.label}
                            </span>
                            {d.type === 'live' && (
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                            )}
                          </div>
                          <div className="text-xl font-bold stat-number leading-tight my-0.5">
                            {d.day}
                          </div>
                          <div className={`mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full inline-block truncate max-w-full ${
                            isSelected
                              ? 'bg-white/15 text-stone-200'
                              : d.type === 'live'
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'text-stone-400'
                          }`}>
                            {d.count}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* 5 Spacious Columns with Minimal, Aesthetic Cards */}
                  <div className="grid grid-cols-5 gap-4 min-w-[700px] overflow-x-auto items-start">

                    {/* Column 1 (Mon 17) */}
                    <div className="space-y-3">
                      {/* Customer Call Card */}
                      <div
                        onClick={() => setSelectedCardEvent({
                          title: 'Customer Call: Sprint Retrospective Sync',
                          category: 'Sales',
                          categoryBg: 'bg-stone-100 text-stone-800 border-stone-200',
                          time: '09:25 – 11:15 · 1h 50m',
                          day: 'Mon, May 17',
                          lead: 'Jane Cooper (Lead)',
                          location: 'Phone Call',
                          meetUrl: null,
                          detail: 'Customer retrospective sync on Q2 delivery cadence, scope adjustments, and team feedback alignment.',
                          attendees: ['Jane Cooper', 'Client Executive Team'],
                          status: 'Completed'
                        })}
                        className={`group bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer space-y-2.5 ${
                          cardCategoryFilter !== 'All' && cardCategoryFilter.toLowerCase() !== 'sales' ? 'opacity-25' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] font-mono text-stone-500 font-medium">09:25 – 11:15</span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 font-semibold">
                            Sales
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                            Customer Call
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed line-clamp-2">
                            Sprint retrospective sync
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-mono">
                          <span>Jane Cooper</span>
                          <span className="text-stone-400">1h 50m</span>
                        </div>
                      </div>

                      {/* Design Review Card */}
                      <div
                        onClick={() => setSelectedCardEvent({
                          title: 'Design Review: Bank App .fig Inspection',
                          category: 'Design',
                          categoryBg: 'bg-stone-100 text-stone-800 border-stone-200',
                          time: '09:30 – 12:30 · 3h 00m',
                          day: 'Mon, May 17',
                          lead: 'Jane Cooper (Lead)',
                          location: 'Figma Live Session',
                          meetUrl: 'https://figma.com',
                          detail: 'Comprehensive inspection of banking dashboard components, dark-mode tokens, and accessibility contrast standards.',
                          attendees: ['Jane Cooper', 'Marcus Webb'],
                          status: 'Completed'
                        })}
                        className={`group bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer space-y-2.5 ${
                          cardCategoryFilter !== 'All' && cardCategoryFilter.toLowerCase() !== 'design' ? 'opacity-25' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] font-mono text-stone-500 font-medium">09:30 – 12:30</span>
                          <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60 font-semibold">
                            Design
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                            Design Review
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed line-clamp-2">
                            Bank App .fig inspection
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-mono">
                          <span>Jane Cooper</span>
                          <span className="text-sky-700 font-medium flex items-center gap-1">
                            <FigmaIcon size={9} /> Figma
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 (Tue 18 - Active Day) */}
                    <div className="space-y-3">
                      <div
                        onClick={() => setSelectedCardEvent({
                          title: 'Design Meet: UI System Audit',
                          category: 'Design',
                          categoryBg: 'bg-violet-100 text-violet-900 border-violet-200',
                          time: '10:30 – 14:20 · 3h 50m',
                          day: 'Tue, May 18 (Today)',
                          lead: 'Sarah Chen (Lead)',
                          location: 'Google Meet',
                          meetUrl: 'https://meet.google.com',
                          detail: 'Live design token audit across typography scales, color contrast (WCAG AAA), and reusable Figma-to-code components.',
                          attendees: ['Sarah Chen', 'Marcus Webb', 'Priya Nair', 'Alex Johnson', '+3'],
                          status: 'In Progress'
                        })}
                        className={`group bg-white rounded-2xl p-4 border-2 border-violet-200/90 shadow-2xs hover:border-violet-300 hover:shadow-xs transition-all cursor-pointer space-y-3 relative ring-4 ring-violet-50/50 ${
                          cardCategoryFilter !== 'All' && cardCategoryFilter.toLowerCase() !== 'design' ? 'opacity-25' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] font-mono text-violet-700 font-semibold">10:30 – 14:20</span>
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                            UI System Audit
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed line-clamp-2">
                            Tokens & WCAG AAA review
                          </p>
                        </div>

                        {/* Minimal Progress Bar */}
                        <div className="space-y-1 pt-0.5">
                          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                            <span>Token Audit</span>
                            <span className="font-bold text-violet-700">85%</span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-stone-100 overflow-hidden">
                            <div className="h-full bg-violet-600 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            <div className="w-4 h-4 rounded-full bg-violet-600 text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white">SC</div>
                            <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white">MW</div>
                            <div className="w-4 h-4 rounded-full bg-amber-600 text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white">PN</div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toast.success('Joining Google Meet session...')
                              window.open('https://meet.google.com', '_blank')
                            }}
                            className="text-[10px] font-bold font-mono text-violet-700 hover:text-violet-900 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <GoogleMeetIcon size={10} />
                            <span>Join Meet</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 (Wed 19 - Sprint Review) */}
                    <div className="space-y-3">
                      <div
                        className={`group bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all space-y-3 ${
                          cardCategoryFilter !== 'All' && cardCategoryFilter.toLowerCase() !== 'management' ? 'opacity-25' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] font-mono text-stone-500 font-medium">09:30 – 12:30</span>
                          <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60 font-semibold">
                            Sprint
                          </span>
                        </div>

                        <div
                          onClick={() => setSelectedCardEvent({
                            title: 'Sprint Review & Demo',
                            category: 'Management',
                            categoryBg: 'bg-rose-100 text-rose-900 border-rose-200',
                            time: '09:30 – 12:30 · 3h 00m',
                            day: 'Wed, May 19',
                            lead: 'Alex Johnson (Product)',
                            location: 'Conference Room B',
                            meetUrl: 'https://meet.google.com',
                            detail: 'Sprint 14 deliverables review: wireframe validation, interactive prototypes demo, and design system token progress.',
                            attendees: ['Alex Johnson', 'Engineering Team', 'Stakeholders'],
                            status: 'Upcoming'
                          })}
                          className="cursor-pointer"
                        >
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                            Sprint Review & Demo
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed line-clamp-1">
                            Sprint 14 deliverables
                          </p>
                        </div>

                        {/* Minimal Milestones */}
                        <div className="space-y-2 pt-0.5">
                          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                            <span>Milestones</span>
                            <span className="font-bold text-rose-700">
                              {cardMilestones.filter(m => m.done).length}/{cardMilestones.length}
                            </span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-stone-100 overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full transition-all duration-300"
                              style={{ width: `${(cardMilestones.filter(m => m.done).length / cardMilestones.length) * 100}%` }}
                            ></div>
                          </div>

                          <div className="space-y-1 pt-1">
                            {cardMilestones.map(m => (
                              <div
                                key={m.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleCardMilestone(m.id)
                                }}
                                className="flex items-center gap-1.5 text-[10.5px] cursor-pointer select-none text-stone-700 hover:text-stone-950 transition-colors py-0.5"
                              >
                                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                  m.done ? 'text-emerald-600 bg-emerald-50' : 'text-stone-300 border border-stone-200'
                                }`}>
                                  {m.done ? '✓' : ''}
                                </span>
                                <span className={`truncate ${m.done ? 'line-through text-stone-400' : 'font-medium'}`}>
                                  {m.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 4 (Thu 20 - Executive Advisory Dinner) */}
                    <div className="space-y-3">
                      <div
                        onClick={() => setSelectedCardEvent({
                          title: 'Business Dinner & Strategic Advisory',
                          category: 'Commercial',
                          categoryBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                          time: '11:30 – 13:05 · 1h 35m',
                          day: 'Thu, May 20',
                          lead: 'Marcus Webb (VP)',
                          location: 'Downtown Bistro Cafe · Table 12',
                          meetUrl: null,
                          detail: 'Quarterly executive advisory dinner with enterprise client partners. Discussion of expansion roadmap.',
                          attendees: ['Marcus Webb', 'Client Advisory Council (4 guests)'],
                          status: 'Upcoming'
                        })}
                        className={`group bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer space-y-2.5 ${
                          cardCategoryFilter !== 'All' && cardCategoryFilter.toLowerCase() !== 'commercial' ? 'opacity-25' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] font-mono text-stone-500 font-medium">11:30 – 13:05</span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-semibold">
                            Advisory
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                            Business Dinner
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed line-clamp-2">
                            Client advisory council
                          </p>
                        </div>
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                          <span className="truncate max-w-[85px]">Downtown Bistro</span>
                          <span className="text-emerald-700 font-medium">Table 12</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 5 (Fri 21 - Protected Deep Work Flow Block) */}
                    <div className="space-y-3">
                      <div
                        onClick={() => setSelectedCardEvent({
                          title: 'Deep Work & Flow State Block',
                          category: 'Focus',
                          categoryBg: 'bg-stone-100 text-stone-800 border-stone-200',
                          time: '13:00 – 17:00 · 4.0 Hours',
                          day: 'Fri, May 21',
                          lead: fullName || 'Team Lead',
                          location: 'Deep Work Lab · Quiet Zone',
                          meetUrl: null,
                          detail: 'Protected focus time reserved for high-cognitive tasks: algorithm optimization, architectural planning, and deep code refactoring.',
                          attendees: [fullName || 'You'],
                          status: focusSessionActive ? 'Active Flow' : 'Scheduled'
                        })}
                        className={`group bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer space-y-3 ${
                          cardCategoryFilter !== 'All' && cardCategoryFilter.toLowerCase() !== 'focus' ? 'opacity-25' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] font-mono text-stone-500 font-medium">4.0h Block</span>
                          <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/60 font-semibold">
                            Focus
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                            Deep Work
                          </h4>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed line-clamp-2">
                            Protected flow · No meetings
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFocusSessionActive(!focusSessionActive)
                            toast(
                              focusSessionActive
                                ? 'Focus session paused'
                                : '⚡ 25-min Pomodoro Flow Session started!'
                            )
                          }}
                          className={`w-full py-1.5 px-2.5 rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            focusSessionActive
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                          }`}
                        >
                          {focusSessionActive ? (
                            <>
                              <PauseIcon size={11} />
                              <span>Pause (24:18)</span>
                            </>
                          ) : (
                            <>
                              <PlayIcon size={11} />
                              <span>Start Focus (25m)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* VIEW MODE 2: BLOCK VIEW (REDESIGNED WITH MERIDIAN DESIGN SYSTEM) */}
              {viewMode === 'block' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                  {/* ── SUB-COL 1: LEFT MINI CALENDAR, QUICK EVENTS & TASKS (5 cols) ── */}
                  <div className="lg:col-span-5 rounded-3xl bg-white border border-stone-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-5">
                    <div>
                      {/* Mini Calendar Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#111318] text-lime-400 flex items-center justify-center font-bold text-xs shadow-2xs">
                            M
                          </div>
                          <h3 className="font-serif font-normal text-base text-stone-900 tracking-tight">
                            Calendar <em className="italic font-serif font-normal text-stone-500 text-xs">May 2026</em>
                          </h3>
                        </div>
                        <button
                          onClick={() => toast.success('Search calendar dates')}
                          className="text-stone-400 hover:text-stone-800 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Search dates"
                        >
                          <SearchIcon size={14} />
                        </button>
                      </div>

                      {/* Month Matrix Grid */}
                      <div className="mb-5">
                        <div className="grid grid-cols-7 text-center text-[10px] font-mono font-bold text-stone-400 mb-2 uppercase tracking-wider">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>

                        <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-sans">
                          {calendarMatrix.map((item, idx) => {
                            const isCurrentActive = item.day === selectedMatrixDay && !item.isPrev && !item.isNext
                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  if (!item.isPrev && !item.isNext) {
                                    setSelectedMatrixDay(item.day)
                                    toast.success(`Selected May ${item.day}`)
                                  }
                                }}
                                className="flex flex-col items-center justify-center cursor-pointer group"
                              >
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all font-semibold ${
                                    isCurrentActive
                                      ? 'bg-[#111318] text-lime-400 font-bold shadow-xs ring-1 ring-lime-400/40'
                                      : item.isPrev || item.isNext
                                      ? 'text-stone-300 font-normal'
                                      : 'text-stone-700 hover:bg-stone-100 font-medium'
                                  }`}
                                >
                                  {item.day}
                                </span>
                                <div className="flex items-center gap-0.5 mt-0.5 h-1">
                                  {item.dots.map((dotColor, dIdx) => (
                                    <span
                                      key={dIdx}
                                      className="w-1 h-1 rounded-full"
                                      style={{ backgroundColor: dotColor }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Events Section */}
                    <div className="pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-serif font-normal text-stone-900 tracking-tight">
                          Upcoming Events
                        </span>
                        <button
                          onClick={() => setNewMeetingModal(true)}
                          className="text-stone-400 hover:text-stone-900 p-1 rounded-md transition-colors cursor-pointer"
                          title="Add event"
                        >
                          <PlusIcon size={13} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {events.map(ev => (
                          <div
                            key={ev.id}
                            onClick={() => toast.success(`Viewing ${ev.name}`)}
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

                    {/* Daily Tasks Checklist */}
                    <div className="pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-serif font-normal text-stone-900 tracking-tight">
                          Tasks ({tasks.filter(t => t.done).length}/{tasks.length})
                        </span>
                        <button
                          onClick={handleAddNewTask}
                          className="text-stone-400 hover:text-stone-900 p-1 rounded-md transition-colors cursor-pointer"
                          title="Add quick task"
                        >
                          <PlusIcon size={13} />
                        </button>
                      </div>

                      <div className="space-y-1.5 font-sans">
                        {tasks.map(tsk => (
                          <div
                            key={tsk.id}
                            onClick={() => toggleTask(tsk.id)}
                            className="flex items-center justify-between text-xs cursor-pointer group p-1.5 rounded-xl hover:bg-stone-50 transition-colors"
                          >
                            <span
                              className={`text-xs font-medium transition-all truncate pr-2 ${
                                tsk.done
                                  ? 'line-through text-stone-400'
                                  : 'text-stone-700'
                              }`}
                            >
                              {tsk.title}
                            </span>

                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                tsk.done
                                  ? 'bg-[#111318] border-[#111318] text-lime-400 shadow-2xs'
                                  : 'border-stone-300 bg-white group-hover:border-stone-600'
                              }`}
                            >
                              {tsk.done && <CheckIcon size={10} strokeWidth={3} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Profile Line */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#111318] text-lime-400 flex items-center justify-center font-bold text-[10px]">
                          {initials || 'AJ'}
                        </div>
                        <span className="text-xs font-semibold text-stone-800">{fullName || 'Alex'}</span>
                      </div>
                      <button
                        onClick={() => setNewMeetingModal(true)}
                        className="w-7 h-7 rounded-full bg-[#111318] hover:bg-black text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                        title="Schedule meeting"
                      >
                        <PlusIcon size={13} />
                      </button>
                    </div>
                  </div>

                  {/* ── SUB-COL 2: MAIN TIMELINE STAGE (7 cols) ── */}
                  <div className="lg:col-span-7 rounded-3xl bg-white border border-stone-200/80 p-5 sm:p-7 shadow-2xs space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-950 tracking-tight">
                          May <em className="italic font-serif font-normal text-stone-900">2026</em>
                        </h2>
                        <p className="text-xs text-stone-400 font-sans mt-0.5">
                          Sprint & Meeting Editorial Timeline
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href)
                            toast.success('Timeline link copied!')
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ShareIcon size={12} />
                          <span>Share</span>
                        </button>
                        <button
                          onClick={() => setNewMeetingModal(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#111318] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-98 cursor-pointer"
                        >
                          <PlusIcon size={12} />
                          <span>Event</span>
                        </button>
                      </div>
                    </div>

                    {/* Stream of Day Blocks */}
                    <div className="space-y-8">
                      {schedules.map((dayItem) => (
                        <div
                          key={dayItem.dayNumber}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pt-6 border-t border-stone-100 first:border-t-0 first:pt-0"
                        >
                          {/* Day Number and Day Badge */}
                          <div className="sm:col-span-4 flex items-start select-none">
                            <span className="text-5xl sm:text-6xl font-serif font-normal text-stone-950 tracking-tight leading-none">
                              {dayItem.dayNumber}
                            </span>
                            <span
                              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ml-2 border ${
                                dayItem.isToday
                                  ? 'text-lime-900 bg-lime-100 border-lime-300'
                                  : 'text-stone-600 bg-stone-100 border-stone-200/70'
                              }`}
                            >
                              {dayItem.dayName}
                            </span>
                          </div>

                          {/* Events for this day */}
                          <div className="sm:col-span-8 space-y-3.5">
                            {dayItem.events.length === 0 ? (
                              <div className="p-4 rounded-2xl bg-stone-50/80 border border-dashed border-stone-200 flex items-center gap-3 text-stone-400 font-sans">
                                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-stone-400 shadow-2xs border border-stone-100">
                                  <CalendarIcon size={12} />
                                </div>
                                <span className="text-xs font-medium">
                                  Focus Time — No meetings scheduled
                                </span>
                              </div>
                            ) : (
                              dayItem.events.map((ev, eIdx) => {
                                const PlatIcon = ev.platformIcon
                                const isFirstLive = dayItem.isToday && eIdx === 0

                                return (
                                  <div key={ev.id} className="relative font-sans group">
                                    {isFirstLive && (
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse relative z-10" />
                                        <div className="flex-1 h-[1.5px] bg-lime-400" />
                                        <span className="text-[9px] font-mono font-bold text-lime-800 bg-lime-100 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                                          LIVE NOW
                                        </span>
                                      </div>
                                    )}

                                    <div className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/80 transition-all shadow-2xs">
                                      <div className="flex items-start justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-1.5 h-6 rounded-full shrink-0"
                                            style={{ backgroundColor: ev.accentColor }}
                                          />
                                          <div>
                                            <span
                                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono"
                                              style={{
                                                backgroundColor: `${ev.accentColor}15`,
                                                color: ev.accentColor
                                              }}
                                            >
                                              {ev.category}
                                            </span>
                                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 mt-1 font-sans">
                                              {ev.title}
                                            </h4>
                                          </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                          <span className="font-mono text-xs font-bold text-stone-700 block">
                                            {ev.timeStart}
                                          </span>
                                          <span className="font-mono text-[11px] text-stone-400">
                                            -{ev.timeEnd}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-200/60">
                                        {ev.platform && (
                                          <button
                                            type="button"
                                            onClick={() => toast.success(`Opening ${ev.platform} meeting...`)}
                                            className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                                          >
                                            {PlatIcon && <PlatIcon size={12} className="text-stone-700" />}
                                            <span>{ev.platform}</span>
                                          </button>
                                        )}

                                        {ev.attendees && (
                                          <div className="flex -space-x-1.5 ml-auto">
                                            {ev.attendees.map((att, aIdx) => (
                                              <div
                                                key={aIdx}
                                                className="w-5 h-5 rounded-full text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white shadow-2xs"
                                                style={{ backgroundColor: att.color }}
                                                title={att.name}
                                              >
                                                {att.initials}
                                              </div>
                                            ))}
                                          </div>
                                        )}
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

              {/* VIEW MODE 3: AGENDA LEDGER (AIM: TEAM OPERATIONS & DIRECTORY) */}
              {viewMode === 'table' && (
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                    <div>
                      <h2 className="text-base font-bold text-stone-900 font-serif">
                        Cross-Functional Agenda &amp; Operations Ledger
                      </h2>
                      <p className="text-xs text-stone-400">Searchable, filterable audit of all cross-functional sessions, leads, and direct meeting links</p>
                    </div>

                    <span className="text-xs font-bold text-stone-400 font-mono">
                      {filteredEvents.length} events
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3 pl-3">Day & Time</th>
                          <th className="pb-3">Event Title</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Lead / Attendees</th>
                          <th className="pb-3">Platform</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 pr-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredEvents.map(evt => (
                          <tr key={evt.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3.5 pl-3">
                              <div className="font-bold text-stone-900">{evt.dayLabel} {evt.day} May</div>
                              <div className="text-[11px] text-stone-400 font-mono">{evt.time}</div>
                            </td>

                            <td className="py-3.5">
                              <div className="font-bold text-stone-900 text-xs">{evt.title}</div>
                              <div className="text-[11px] text-stone-400">{evt.subtitle}</div>
                            </td>

                            <td className="py-3.5">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                {evt.category}
                              </span>
                            </td>

                            <td className="py-3.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-xs"
                                  style={{ backgroundColor: evt.leadColor }}
                                >
                                  {evt.leadInitials}
                                </div>
                                <span className="text-stone-800 font-medium">{evt.lead}</span>
                              </div>
                            </td>

                            <td className="py-3.5">
                              <span className="text-stone-500 font-mono text-[11px]">{evt.location}</span>
                            </td>

                            <td className="py-3.5">
                              <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                                evt.status === 'In Progress' ? 'bg-violet-100 text-violet-800' :
                                evt.status === 'Completed' ? 'bg-lime-100 text-lime-800' :
                                'bg-stone-100 text-stone-600'
                              }`}>
                                {evt.status}
                              </span>
                            </td>

                            <td className="py-3.5 pr-3 text-right">
                              <button
                                onClick={() => toast.success(`Opening ${evt.title}...`)}
                                className="px-3 py-1 rounded-xl bg-[#111318] hover:bg-black text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                              >
                                Join
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* ── RIGHT DOCK: DEEP OBSIDIAN COMMAND PANEL (4 cols) ── */}
            <div className="xl:col-span-4 dark-dock p-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Top Status & Filter Pills */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lime-400 text-xs">●</span>
                    <span className="text-xs font-mono text-stone-400">Today, 18 May 2026</span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5">
                    {['Design', 'Copyright', 'Dev'].map(t => {
                      const isActive = dockCategoryFilter.toLowerCase() === t.toLowerCase()
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            if (isActive) {
                              setDockCategoryFilter('All')
                              toast.success('Showing all urgent tasks')
                            } else {
                              setDockCategoryFilter(t)
                              toast.success(`Filtered by ${t}`)
                            }
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                            isActive
                              ? 'bg-lime-400 text-stone-950 font-bold shadow-xs'
                              : 'bg-white/10 text-stone-300 hover:bg-white/20'
                          }`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Active Deliverables Heading (Differentiated by AIM: Output Backlog vs. Left Calendar) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-normal text-white tracking-tight font-serif">
                      Active <em className="italic font-serif font-normal text-lime-400">Deliverables</em> ({activeUrgentTasks.length})
                    </h2>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-lime-400 bg-lime-950/80 border border-lime-500/30 px-2 py-0.5 rounded-full">
                        Output Backlog
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewUrgentModalOpen(true)}
                        className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                        title="Add urgent deliverable"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 font-mono mt-1">
                    Ship during open focus blocks · Output backlog &amp; velocity
                  </p>
                </div>

                {/* Dark Urgent Task Cards */}
                <div className="space-y-3 mb-6">
                  {activeUrgentTasks.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#1E2028] border border-white/10 text-center text-stone-400 text-xs font-mono">
                      No urgent tasks matching filter.
                    </div>
                  ) : (
                    activeUrgentTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-2xl bg-[#1E2028] border transition-all ${
                          task.status === 'completed'
                            ? 'border-lime-500/30 opacity-75'
                            : 'border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className={task.timeColor}>Time: {task.time}</span>
                          <div className="flex items-center gap-1.5">
                            {task.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                {task.badge}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedUrgentTask(task)}
                              className="text-stone-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                              title="View task detail"
                            >
                              <ArrowUpRightIcon size={12} className="text-white" />
                            </button>
                          </div>
                        </div>

                        <div
                          onClick={() => setSelectedUrgentTask(task)}
                          className={`text-sm font-bold text-white mb-2 font-sans cursor-pointer hover:text-lime-300 transition-colors ${
                            task.status === 'completed' ? 'line-through text-stone-400' : ''
                          }`}
                        >
                          {task.title}
                        </div>

                        {/* Card Footer: avatars, progress, meet button, or stats */}
                        {task.meetUrl ? (
                          <div className="flex items-center justify-between gap-2 mt-3">
                            <div
                              onClick={() => {
                                navigator.clipboard?.writeText(task.fullMeetUrl || task.meetUrl)
                                toast.success('Meeting link copied!')
                              }}
                              className="text-[10px] text-stone-400 font-mono truncate cursor-pointer hover:text-stone-200"
                              title="Click to copy link"
                            >
                              {task.meetUrl}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleJoinMeeting(task)}
                              className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer active:scale-95"
                            >
                              Join Meeting
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-stone-400">
                            {task.avatars ? (
                              <div className="flex -space-x-1">
                                {task.avatars.map((av, avIdx) => (
                                  <div
                                    key={avIdx}
                                    className={`w-5 h-5 rounded-full ${av.bg} text-[9px] font-bold text-white flex items-center justify-center shadow-xs`}
                                  >
                                    {av.initials}
                                  </div>
                                ))}
                              </div>
                            ) : task.people ? (
                              <span>{task.people}</span>
                            ) : (
                              <span>Team Workspace</span>
                            )}

                            {task.progressLabel ? (
                              <button
                                type="button"
                                onClick={() => handleToggleUrgentTask(task.id)}
                                className="font-extrabold text-lime-400 stat-number cursor-pointer hover:underline"
                                title="Click to toggle completion"
                              >
                                {task.progressLabel}
                              </button>
                            ) : task.tasksCount ? (
                              <span className="text-lime-400 font-extrabold stat-number">
                                {task.tasksCount}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Dark Data Viz Widgets */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                {/* Radial Speedometer Widget */}
                <div className="p-4 rounded-2xl bg-[#181A22] border border-white/10 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white font-sans">Task Statistics</span>

                    {/* Working Dropdown Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setStatsDropdownOpen(!statsDropdownOpen)
                          setAllocDropdownOpen(false)
                        }}
                        className="text-[10px] font-mono text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 transition-colors"
                      >
                        <span>{activeStats.label} ▾</span>
                      </button>

                      {statsDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-[#1E2028] border border-white/15 rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
                          {Object.entries(statsPeriodsData).map(([key, item]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setStatsPeriod(key)
                                setStatsDropdownOpen(false)
                                toast.success(`Task Statistics: ${item.label}`)
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                                statsPeriod === key
                                  ? 'text-lime-400 bg-white/10 font-bold'
                                  : 'text-stone-300 hover:bg-white/5'
                              }`}
                            >
                              <span>{item.label}</span>
                              {statsPeriod === key && <span className="text-[10px]">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center py-2">
                    <svg viewBox="0 0 100 55" className="w-36 overflow-visible">
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#2D313F"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="url(#speedometerGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="125.66"
                        strokeDashoffset={arcDashOffset}
                        className="transition-all duration-700 ease-out"
                      />
                      <defs>
                        <linearGradient id="speedometerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F43F5E" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#84CC16" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute top-7 flex flex-col items-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${activeStats.badgeColor}`}>
                        <CheckCircleIcon size={11} />
                        <span>{activeStats.resultBadge}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 text-center pt-2 border-t border-white/5">
                    <div>
                      <div className="text-2xl font-extrabold text-white stat-number transition-all">
                        {activeStats.completedRate}%
                      </div>
                      <div className="text-[10px] text-stone-400 font-sans mt-0.5">Completed Tasks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-stone-400 stat-number transition-all">
                        {activeStats.unfulfilledRate}%
                      </div>
                      <div className="text-[10px] text-stone-400 font-sans mt-0.5">Unfulfilled Tasks</div>
                    </div>
                  </div>
                </div>

                {/* Bubble Chart Widget */}
                <div className="p-4 rounded-2xl bg-[#181A22] border border-white/10 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white font-sans">Task Type Allocation</span>

                    {/* Working Dropdown Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setAllocDropdownOpen(!allocDropdownOpen)
                          setStatsDropdownOpen(false)
                        }}
                        className="text-[10px] font-mono text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 transition-colors"
                      >
                        <span>{activeAlloc.label} ▾</span>
                      </button>

                      {allocDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-[#1E2028] border border-white/15 rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
                          {Object.entries(allocPeriodsData).map(([key, item]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setAllocPeriod(key)
                                setAllocDropdownOpen(false)
                                toast.success(`Allocation: ${item.label}`)
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                                allocPeriod === key
                                  ? 'text-lime-400 bg-white/10 font-bold'
                                  : 'text-stone-300 hover:bg-white/5'
                              }`}
                            >
                              <span>{item.label}</span>
                              {allocPeriod === key && <span className="text-[10px]">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Bubbles */}
                  <div className="flex items-center justify-center gap-3 py-2">
                    <div
                      onClick={() => toast.success(activeAlloc.learningInfo, { icon: '💡' })}
                      className="w-16 h-16 rounded-full bg-[#FEF08A] hover:scale-105 active:scale-95 transition-transform text-stone-950 flex flex-col items-center justify-center font-bold shadow-md cursor-pointer"
                      title="Click for details"
                    >
                      <span className="text-sm font-extrabold stat-number leading-none">
                        {activeAlloc.learning}%
                      </span>
                      <span className="text-[9px] font-sans">Learning</span>
                    </div>

                    <div
                      onClick={() => toast.success(activeAlloc.designInfo, { icon: '🎨' })}
                      className="w-12 h-12 rounded-full bg-[#C4B5FD] hover:scale-105 active:scale-95 transition-transform text-violet-950 flex flex-col items-center justify-center font-bold shadow-md -ml-4 cursor-pointer"
                      title="Click for details"
                    >
                      <span className="text-xs font-extrabold stat-number leading-none">
                        {activeAlloc.design}%
                      </span>
                      <span className="text-[8px] font-sans">Design</span>
                    </div>

                    <div
                      onClick={() => toast.success(activeAlloc.bizInfo, { icon: '📈' })}
                      className="w-10 h-10 rounded-full bg-[#A7F3D0] hover:scale-105 active:scale-95 transition-transform text-emerald-950 flex flex-col items-center justify-center font-bold shadow-md -ml-3 cursor-pointer"
                      title="Click for details"
                    >
                      <span className="text-[10px] font-extrabold stat-number leading-none">
                        {activeAlloc.biz}%
                      </span>
                      <span className="text-[7px] font-sans">Biz</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* QUICK CREATE MEETING MODAL                                 */}
          {/* ══════════════════════════════════════════════════════════ */}
          {newMeetingModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-lg font-bold text-stone-950">
                    Schedule New Meeting
                  </h3>
                  <button
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
                      className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* URGENT TASK DETAIL & STATUS MODAL */}
          {selectedUrgentTask && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-md bg-[#111318] text-white rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/10 text-stone-300">
                      {selectedUrgentTask.category}
                    </span>
                    <span className="text-xs font-mono text-stone-400">{selectedUrgentTask.time}</span>
                  </div>
                  <button
                    onClick={() => setSelectedUrgentTask(null)}
                    className="text-stone-400 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 font-sans">
                    {selectedUrgentTask.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    {selectedUrgentTask.detail}
                  </p>
                </div>

                {selectedUrgentTask.fullMeetUrl && (
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                    <div className="text-xs text-stone-300 font-mono truncate">
                      {selectedUrgentTask.meetUrl}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleJoinMeeting(selectedUrgentTask)}
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      Join Meeting
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Status:</span>
                    <span className={`text-xs font-bold ${selectedUrgentTask.status === 'completed' ? 'text-lime-400' : 'text-amber-400'}`}>
                      {selectedUrgentTask.status === 'completed' ? 'Completed' : 'Active / In Progress'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleToggleUrgentTask(selectedUrgentTask.id)
                      setSelectedUrgentTask(null)
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedUrgentTask.status === 'completed'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-lime-400 hover:bg-lime-300 text-stone-950 shadow-xs'
                    }`}
                  >
                    {selectedUrgentTask.status === 'completed' ? 'Reopen Task' : '✓ Mark Complete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QUICK ADD URGENT TASK MODAL */}
          {newUrgentModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-md bg-[#111318] text-white rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white font-serif">
                    Add Urgent Task
                  </h3>
                  <button
                    onClick={() => setNewUrgentModalOpen(false)}
                    className="text-stone-400 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateUrgentTask} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      Task Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design System 2.0 Components"
                      value={newUrgentTitle}
                      onChange={e => setNewUrgentTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium bg-white/5 rounded-xl border border-white/15 text-white outline-none focus:border-lime-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newUrgentCategory}
                        onChange={e => setNewUrgentCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-medium bg-[#1E2028] rounded-xl border border-white/15 text-white outline-none focus:border-lime-400"
                      >
                        <option value="Design">Design</option>
                        <option value="Copyright">Copyright</option>
                        <option value="Dev">Dev</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-300 mb-1">
                        Time Window
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 14:00 - 16:30"
                        value={newUrgentTime}
                        onChange={e => setNewUrgentTime(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs font-medium bg-white/5 rounded-xl border border-white/15 text-white outline-none focus:border-lime-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setNewUrgentModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* AIRBNB AUDITED CARD EVENT DETAIL MODAL                     */}
          {/* ══════════════════════════════════════════════════════════ */}
          {selectedCardEvent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
              <div className="w-full max-w-lg bg-white text-stone-900 rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${selectedCardEvent.categoryBg}`}>
                      {selectedCardEvent.category}
                    </span>
                    <span className="text-xs font-mono text-stone-400 font-medium">
                      {selectedCardEvent.day}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCardEvent(null)}
                    className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Title & Timing */}
                <div>
                  <h3 className="text-xl font-bold text-stone-950 font-serif mb-1">
                    {selectedCardEvent.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                    <ClockIcon size={13} className="text-stone-400" />
                    <span className="font-semibold text-stone-700">{selectedCardEvent.time}</span>
                    <span>·</span>
                    <span>{selectedCardEvent.location}</span>
                  </div>
                </div>

                {/* Agenda & Details */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Agenda & Overview
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {selectedCardEvent.detail}
                  </p>
                </div>

                {/* Host & Status */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-2xl border border-stone-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Lead / Host</div>
                    <div className="text-xs font-bold text-stone-900">{selectedCardEvent.lead}</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-stone-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Status</div>
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {selectedCardEvent.status}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href)
                      toast.success('Event invitation link copied!')
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <ShareIcon size={12} />
                    <span>Copy Link</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCardEvent(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer transition-colors"
                    >
                      Close
                    </button>
                    {selectedCardEvent.meetUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          toast.success(`Joining session: ${selectedCardEvent.title}`)
                          window.open(selectedCardEvent.meetUrl, '_blank')
                        }}
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <GoogleMeetIcon size={12} />
                        <span>Join Meeting</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </ProtectedRoute>
  )
}