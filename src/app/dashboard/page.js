"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import CreateTaskModal from '@/components/CreateTaskModal'
import TaskDetailDrawer from '@/components/TaskDetailDrawer'
import MetricCard from '@/components/MetricCard'
import OrgOnboarding from '@/components/OrgOnboarding'
import AttentionCenter from '@/components/AttentionCenter'
import MetricBars from '@/components/MetricBars'
import CapacityDial from '@/components/CapacityDial'
import StripedLoader from '@/components/StripedLoader'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useOrg } from '@/context/OrgContext'
import { useTasks } from '@/context/TaskContext'
import { getDashboardOverview, getLineUp } from '@/Service/dashboardService'
import {
  CheckIcon, ClockIcon, UsersIcon, BarChartIcon,
  ChevronRightIcon, PlusIcon, MoreHorizontalIcon, FilterIcon,
  ArrowUpRightIcon, SearchIcon, SparklesIcon, ZapIcon, CheckCircleIcon,
  ClipboardIcon, TargetIcon, RocketIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'


export default function Dashboard() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [workTab, setWorkTab] = useState('todo')
  const [searchQuery, setSearchQuery] = useState('')
  const [myWork, setMyWork] = useState([])
  const [hoveredBar, setHoveredBar] = useState(null)

  // Real Dashboard Overview State
  const [overview, setOverview] = useState(null)
  const [overviewLoading, setOverviewLoading] = useState(true)

  // Real Active Lineup State
  const [lineup, setLineup] = useState([])
  const [lineupLoading, setLineupLoading] = useState(true)
  const [lineupActiveCount, setLineupActiveCount] = useState(0)

  const { fullName } = useCurrentUser()
  const { userState, activeOrg, orgsLoading } = useOrg()
  const { tasks: liveTasks = [], refreshTasks, updateTask: updateLiveTask, members: orgMembers = [] } = useTasks()

  // Fetch real dashboard overview whenever active organization changes
  const fetchOverview = useCallback(async () => {
    if (!activeOrg?.id) return
    try {
      setOverviewLoading(true)
      const data = await getDashboardOverview(activeOrg.id)
      if (data && data.success) {
        setOverview(data)
      } else {
        toast.error(data?.message || 'Failed to fetch dashboard overview')
      }
    } catch (err) {
      console.error("Dashboard overview error:", err)
      toast.error(err.message || 'Failed to fetch dashboard overview')
    } finally {
      setOverviewLoading(false)
    }
  }, [activeOrg?.id])

  // Fetch real active lineup deliverables
  const fetchLineup = useCallback(async () => {
    if (!activeOrg?.id) return
    try {
      setLineupLoading(true)
      const res = await getLineUp(activeOrg.id)
      if (res && res.success) {
        const rawItems = res.data?.items || res.activeTask || []
        const count = res.data?.activeCount ?? res.activeCount ?? rawItems.length
        setLineupActiveCount(count)

        const colors = ['#f97316', '#8b5cf6', '#10b981', '#0ea5e9']
        const borders = ['border-orange-200', 'border-violet-200', 'border-emerald-200', 'border-sky-200']
        const bgs = ['bg-orange-50/50', 'bg-violet-50/50', 'bg-emerald-50/50', 'bg-sky-50/50']

        const mapped = rawItems.map((item, idx) => {
          const progress = typeof item.progress === 'number' ? item.progress : (item.pct ?? 0)
          const timeVal = item.estimatedTimeValue ?? item.estimated_time_value
          const timeUnit = item.estimatedTimeUnit ?? item.estimated_time_unit
          const timeDisplay = timeVal ? `${timeVal} ${timeUnit || 'HOURS'}` : '0 HOURS'

          return {
            id: item.id || `lu-${idx}`,
            taskId: `MRD-${String(idx + 1).padStart(3, '0')}`,
            category: item.category || 'Commercial',
            title: item.title || 'Untitled Deliverable',
            progress: progress,
            pct: progress,
            timeSpent: timeDisplay,
            priority: item.priority || 'High',
            due: item.due_date ? String(item.due_date).split('T')[0] : 'In flight',
            color: colors[idx % colors.length],
            border: borders[idx % borders.length],
            bg: bgs[idx % bgs.length],
            assignees: item.assignees || []
          }
        })
        setLineup(mapped)
      }
    } catch (err) {
      console.error("Failed to fetch active lineup:", err)
    } finally {
      setLineupLoading(false)
    }
  }, [activeOrg?.id])

  useEffect(() => {
    if (activeOrg?.id) {
      fetchOverview()
      fetchLineup()
    } else {
      setOverviewLoading(false)
      setOverview(null)
      setLineupLoading(false)
      setLineup([])
    }
  }, [activeOrg?.id, fetchOverview, fetchLineup])

  // Transform weeklyTrend for the last 7 days ending today, filling missing dates with 0
  const last7Days = useMemo(() => {
    const trendMap = new Map()
    if (overview?.weeklyTrend && Array.isArray(overview.weeklyTrend)) {
      overview.weeklyTrend.forEach(item => {
        if (!item) return
        let dStr = ''
        if (typeof item.date === 'string') {
          dStr = item.date.split('T')[0]
        } else if (item.date instanceof Date) {
          dStr = item.date.toISOString().split('T')[0]
        } else if (item.date) {
          dStr = String(item.date).split('T')[0]
        }
        if (dStr) {
          trendMap.set(dStr, Number(item.completedTasks) || 0)
        }
      })
    }

    const days = []
    const today = new Date()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}`

      const count = trendMap.get(dateKey) || 0
      const dayName = dayNames[d.getDay()]
      const monthName = monthNames[d.getMonth()]
      const dayNum = d.getDate()

      days.push({
        dateKey,
        day: dayName,
        label: `${monthName} ${dayNum}`,
        dayNum,
        v: count,
        completedTasks: count
      })
    }
    return days
  }, [overview?.weeklyTrend])

  const weeklyTrendSeries = useMemo(() => {
    const max = Math.max(...last7Days.map(d => d.v), 1)
    return last7Days.map(d => ({
      day: d.day,
      val: `${d.v}`,
      heightPercent: Math.min(100, Math.max(28, Math.round((d.v / max) * 100)))
    }))
  }, [last7Days])

  const weeklyTrendBars = useMemo(() => {
    return last7Days.map(d => ({
      day: d.day,
      v: d.v
    }))
  }, [last7Days])

  const dateRangeLabel = useMemo(() => {
    if (last7Days.length === 0) return ''
    return `${last7Days[0].label} – ${last7Days[last7Days.length - 1].label}`
  }, [last7Days])

  // Derive real trending initiatives dynamically from workspace tasks
  const trendingInitiatives = useMemo(() => {
    if (!myWork || myWork.length === 0) return []
    const groups = {}
    myWork.forEach(t => {
      const cat = t.path?.split('/')[0]?.trim() || t.path || 'Workspace'
      if (!groups[cat]) {
        groups[cat] = { category: cat, total: 0, done: 0, latestTitle: t.title }
      }
      groups[cat].total += 1
      if (t.tab === 'done' || t.status === 'DONE') {
        groups[cat].done += 1
      }
    })
    return Object.values(groups).slice(0, 3).map(g => ({
      category: g.category,
      title: g.latestTitle,
      pct: g.total > 0 ? Math.round((g.done / g.total) * 100) : 0
    }))
  }, [myWork])

  // Real-time synchronization: Map liveTasks into myWork whenever database tasks update
  useEffect(() => {
    if (liveTasks && liveTasks.length > 0) {
      const mapped = liveTasks.map((t, idx) => {
        const subtasks = Array.isArray(t.subtasks) ? t.subtasks : []
        const subtasksCompleted = subtasks.filter(s => s.done || s.is_completed || s.status === 'DONE').length
        const subtasksTotal = subtasks.length

        // Find assigned member from organization members list
        let assignedMember = null
        if (t.assigned_to && orgMembers && orgMembers.length > 0) {
          assignedMember = orgMembers.find(m => 
            String(m.user_id || m.id) === String(t.assigned_to) || 
            m.email === t.assigned_to || 
            m.full_name === t.assigned_to
          )
        }

        const assigneeName = assignedMember?.full_name || (typeof t.assigned_to === 'string' ? t.assigned_to : '') || (t.assigned_to ? 'Assigned' : '')
        const assigneeInitial = assigneeName ? assigneeName.charAt(0).toUpperCase() : ''
        const assigneeColor = assignedMember?.color || '#8b5cf6'

        // Calculate dueOffsetDays
        let dueOffset = null
        if (t.due_date) {
          const parsed = new Date(t.due_date)
          if (!isNaN(parsed.getTime())) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            parsed.setHours(0, 0, 0, 0)
            dueOffset = Math.round((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          }
        }

        // Calculate updatedOffsetDays
        let updatedOffset = 0
        const dateUpdated = t.updated_at || t.updatedAt || t.created_at || t.createdAt
        if (dateUpdated) {
          const parsed = new Date(dateUpdated)
          if (!isNaN(parsed.getTime())) {
            const diffMs = Date.now() - parsed.getTime()
            updatedOffset = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
          }
        }

        return {
          id: t.task_id || t.id || `tsk-${idx}`,
          taskId: t.task_code || `MRD-${String(idx + 1).padStart(3, '0')}`,
          path: t.category || t.path || 'Workspace / Deliverables',
          title: t.title || 'Untitled Task',
          priority: t.priority || 'MEDIUM',
          tab: (t.status === 'DONE' || t.status === 'done') ? 'done' : 'todo',
          status: t.status || 'TODO',
          due_date: t.due_date,
          due: t.due_date ? String(t.due_date).split('T')[0] : 'No date',
          dueOffsetDays: dueOffset,
          updatedOffsetDays: updatedOffset,
          subtasksCompleted,
          subtasksTotal,
          description: t.description || '',
          subtasks,
          assigneeName,
          assignees: t.assigned_to ? [{ initials: assigneeInitial || 'U', name: assigneeName, color: assigneeColor }] : []
        }
      })
      setMyWork(mapped)
    } else {
      setMyWork([])
    }
  }, [liveTasks, orgMembers, fullName])

  const handleReschedule = (taskId, days) => {
    setMyWork(prev => prev.map(t => t.id === taskId ? { ...t, dueOffsetDays: days, updatedOffsetDays: 0 } : t))
    toast.success(days === 1 ? 'Rescheduled to tomorrow' : `Rescheduled to +${days} days`)
  }

  const handleMarkDone = async (taskId) => {
    setMyWork(prev => prev.map(t => t.id === taskId ? { ...t, tab: 'done', status: 'DONE', updatedOffsetDays: 0 } : t))
    toast.success('Marked as done — nice work!')

    if (taskId && !String(taskId).startsWith('tsk-f') && !String(taskId).startsWith('lu-')) {
      try {
        await updateLiveTask({ task_id: taskId, status: 'DONE' })
        fetchOverview()
        fetchLineup()
      } catch (err) {
        console.error("Dashboard mark done error:", err)
      }
    }
  }

  const handleCaughtUp = (taskId) => {
    setMyWork(prev => prev.map(t => t.id === taskId ? { ...t, updatedOffsetDays: 0 } : t))
    toast.success('Marked as reviewed — clock reset')
  }

  const handleNudge = (taskId) => {
    const t = myWork.find(x => x.id === taskId)
    const who = t?.assigneeName || 'assignee'
    toast.success(`Nudge alert sent to ${who}`)
  }

  const filteredWork = myWork
    .filter(w => {
      if (workTab === 'todo') return w.tab === 'todo'
      if (workTab === 'done') return w.tab === 'done'
      return true
    })
    .filter(w => {
      if (!searchQuery.trim()) return true

      return (
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  const toggleTaskDone = async (e, id) => {
    e.stopPropagation()

    let nextTab = 'done'
    const target = myWork.find(t => t.id === id)
    if (target) {
      nextTab = target.tab === 'done' ? 'todo' : 'done'
    }
    const nextStatus = nextTab === 'done' ? 'DONE' : 'TODO'

    setMyWork(prev => prev.map(t => (t.id === id ? { ...t, tab: nextTab, status: nextStatus } : t)))

    toast.success(
      nextTab === 'done'
        ? 'Task moved to Done 🎯'
        : 'Task restored to Active'
    )

    if (id && !String(id).startsWith('tsk-f') && !String(id).startsWith('lu-')) {
      try {
        await updateLiveTask({ task_id: id, status: nextStatus })
        fetchOverview()
        fetchLineup()
      } catch (err) {
        console.error("Dashboard toggleTaskDone error:", err)
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">

        <Sidebar />

        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={() => setModalOpen(true)}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true
              })

              window.dispatchEvent(evt)
            }}
          />

          {!activeOrg || userState !== 'active' ? (
            <OrgOnboarding />
          ) : (
            <>
              {/* ── Greeting & Top Headline with High-Low Typographic Contrast ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-stone-900 lg:text-[40px]">
                      Good morning,{' '}
                      <span className="font-serif-italic font-normal text-violet-700">
                        {fullName || 'there'}
                      </span>
                    </h1>

                    {activeOrg?.name && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-200 text-lime-900 font-mono shadow-2xs">
                        {activeOrg.name}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-[14px] font-medium text-stone-500">
                    Here&apos;s what&apos;s moving across your workspace today — Sprint is {overviewLoading ? '...' : `${overview?.sprintCompletion ?? 0}%`} complete.
                  </p>
                </div>

                <div className="flex items-center gap-3.5 bg-white px-5 py-2.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block font-mono">
                      Tasks done
                    </span>

                    <span className="text-lg font-extrabold text-stone-950 stat-number">
                      {overviewLoading ? '...' : (overview?.completeTask ?? 0)}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                    <ArrowUpRightIcon size={16} />
                  </div>
                </div>
              </div>

              {/* ── 0. Attention & Triage Center ── */}
              <div className="mb-8">
                <AttentionCenter
                  tasks={myWork}
                  onOpenTask={(t) => setSelectedTask(t)}
                  onReschedule={handleReschedule}
                  onMarkDone={handleMarkDone}
                  onCaughtUp={handleCaughtUp}
                  onNudge={handleNudge}
                  sprintName={activeOrg?.name ? `${activeOrg.name} Sprint` : "Sprint"}
                  sprintDaysLeft={4}
                />
              </div>

              {/* ── 1. Bento KPI Metric Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                  icon={ClipboardIcon}
                  badge={overviewLoading ? '...' : `${overview?.TodoTask ?? 0} to do`}
                  value={overviewLoading ? '...' : String(overview?.totaltask ?? 0)}
                  label="Total Tasks"
                  theme="purple"
                  series={weeklyTrendSeries}
                  onClick={() => router.push('/kanban')}
                />
                <MetricCard
                  icon={ZapIcon}
                  badge="Live calculated"
                  value={overviewLoading ? '...' : (overview?.efficiencyScore !== undefined ? String(overview.efficiencyScore) : '0.0')}
                  label="Efficiency Score"
                  theme="amber"
                  onClick={() => router.push('/Analytics')}
                />
                <MetricCard
                  icon={TargetIcon}
                  badge={overviewLoading ? '...' : `${overview?.completeTask ?? 0} of ${overview?.totaltask ?? 0} done`}
                  value={overviewLoading ? '...' : `${overview?.sprintCompletion ?? 0}%`}
                  label="Sprint Completion"
                  theme="sky"
                  series={weeklyTrendSeries}
                  onClick={() => router.push('/kanban')}
                />
                <MetricCard
                  icon={RocketIcon}
                  badge={overview?.role || activeOrg?.role || 'Member'}
                  value={activeOrg?.name || 'Workspace'}
                  label="Active Workspace"
                  theme="lime"
                  onClick={() => router.push('/organization')}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                <div className="lg:col-span-2 space-y-6">

                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <h2 className="text-base sm:text-[17px] font-extrabold tracking-tight text-stone-900">
                          Active <span className="font-serif-italic font-normal text-stone-500">lineup</span>
                        </h2>

                        <span className="tech-badge rounded-md bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500 font-mono">
                          {lineupLoading ? '...' : `${lineupActiveCount} IN FLIGHT`}
                        </span>

                        <button
                          onClick={() => router.push('/kanban')}
                          className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1 transition-colors cursor-pointer ml-1"
                          aria-label="View all kanban board tasks"
                        >
                          <span>View board</span>
                          <ArrowUpRightIcon size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {lineup.length === 0 && !lineupLoading && (
                        <div className="sm:col-span-2 p-6 text-center text-xs font-medium text-stone-400 bg-stone-50 rounded-2xl border border-stone-200/60">
                          No active in-flight deliverables found.
                        </div>
                      )}
                      {lineup.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          onClick={() => {
                            const matchingTask = myWork.find(t => String(t.id) === String(item.id)) || liveTasks.find(t => String(t.task_id || t.id) === String(item.id))
                            if (matchingTask) {
                              setSelectedTask(matchingTask)
                            } else {
                              setSelectedTask({
                                id: item.id,
                                taskId: item.taskId,
                                title: item.title,
                                priority: item.priority || 'High',
                                due: item.due || 'In flight',
                                assigneeName: item.assignees?.[0]?.name || fullName || 'Unassigned',
                                assigneeColor: item.color,
                                tags: ['Deliverable', item.category],
                                description: item.description || ''
                              })
                            }
                          }}
                          className={`p-5 rounded-2xl border ${item.border} ${item.bg} hover:shadow-xs transition-all cursor-pointer group`}
                        >
                          <div className="flex items-start justify-between mb-2.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono">
                              {item.category}
                            </span>

                            <span className="text-2xl font-extrabold text-stone-900 stat-number">
                              {item.progress}%
                            </span>
                          </div>

                          <div className="text-sm font-bold text-stone-900 group-hover:text-stone-700 leading-snug mb-3">
                            {item.title}
                          </div>

                          <div className="w-full h-1.5 rounded-full bg-stone-200/60 overflow-hidden mb-3">
                            <div
                              className={`h-full rounded-full striped-anim ${item.color === '#f97316' ? 'striped-bar-orange' : 'striped-bar-purple'}`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-stone-500 pt-2.5 border-t border-stone-900/5">
                            <div className="flex items-center gap-1.5 text-xs">
                              <ClockIcon size={13} className="text-stone-400" />
                              <span className="stat-number font-mono">
                                {item.timeSpent}
                              </span>
                            </div>

                            <div className="flex -space-x-1.5 overflow-hidden">
                              {item.assignees && item.assignees.length > 0 ? (
                                item.assignees.map((a, i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded-full ring-1 ring-white text-[10px] font-bold text-white flex items-center justify-center"
                                    style={{ backgroundColor: a.color || item.color }}
                                  >
                                    {a.name?.[0] || 'U'}
                                  </div>
                                ))
                              ) : (
                                <div
                                  className="w-6 h-6 rounded-full ring-1 ring-white text-[10px] font-bold text-white flex items-center justify-center"
                                  style={{ backgroundColor: item.color }}
                                >
                                  {fullName?.[0] || 'U'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[17px] font-extrabold tracking-tight text-stone-900">
                          Trending <span className="font-serif-italic font-normal text-stone-500">initiatives</span>
                        </h3>

                        <span className="tech-badge rounded-md bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500 font-mono">
                          {trendingInitiatives.length} active
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                      {trendingInitiatives.length === 0 ? (
                        <div className="sm:col-span-3 p-5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center text-xs text-stone-400 font-medium">
                          No active space initiatives yet. Create tasks to track space velocity.
                        </div>
                      ) : (
                        trendingInitiatives.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                            <div className="text-[10px] text-stone-400 font-bold uppercase font-mono truncate">
                              {item.category}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-stone-800 truncate mt-1">
                              {item.title}
                            </div>
                            <div className="text-xl font-extrabold text-stone-900 stat-number mt-1.5">
                              {item.pct}%
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs flex flex-col justify-between">

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">
                        Working <span className="font-serif-italic font-normal text-stone-500">activity</span>
                      </h2>

                      <span className="text-[11px] font-bold text-stone-500 font-mono bg-stone-100 px-2.5 py-0.5 rounded-md">
                        {dateRangeLabel}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-500 mb-6 font-medium">
                      Daily tasks completed past 7 days
                    </p>

                    <div className="grid grid-cols-7 text-center text-xs font-bold text-stone-600 mb-3">
                      {last7Days.map((d, i) => (
                        <div key={d.dateKey} className={i === 6 ? "text-stone-900" : ""}>
                          {d.day}
                          <span className={`block stat-number text-[11px] mt-0.5 ${i === 6 ? "text-rose-600 font-bold" : "text-stone-400"}`}>
                            {d.dayNum}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 h-44 items-end relative py-2 border-b border-stone-100">
                      {last7Days.map((d, i) => {
                        const maxV = Math.max(...last7Days.map(item => item.v), 1)
                        const heightPct = Math.min(100, Math.max(12, Math.round((d.v / maxV) * 100)))
                        const isToday = i === 6
                        return (
                          <div
                            key={d.dateKey}
                            className="flex flex-col gap-1.5 h-full justify-end relative cursor-pointer group"
                            onMouseEnter={() => setHoveredBar(i)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {hoveredBar === i && (
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111318] text-white text-xs font-mono px-3 py-1 rounded-xl shadow-lg whitespace-nowrap z-20">
                                {d.v} tasks ({d.label})
                              </div>
                            )}

                            <div
                              className={`w-full rounded-lg transition-all duration-200 ${
                                isToday
                                  ? 'striped-bar-orange shadow-xs ring-2 ring-stone-900'
                                  : i % 2 === 0 ? 'bg-violet-300' : 'bg-lime-400'
                              }`}
                              style={{ height: `${heightPct}%` }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 text-xs sm:text-sm font-semibold text-stone-600">
                    <span>Completed past 7 days:</span>
                    <span className="text-stone-950 font-bold stat-number text-base sm:text-lg">
                      {overviewLoading ? '...' : `${last7Days.reduce((acc, d) => acc + d.v, 0)} tasks`}
                    </span>
                  </div>

                </div>

              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs mb-10">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-100">

                  <div className="flex items-center gap-3">
                    <h2 className="text-[17px] font-extrabold tracking-tight text-stone-900">
                      My <span className="font-serif-italic font-normal text-stone-500">focus</span> & deliverables
                    </h2>

                    <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                      ({filteredWork.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">

                    <button
                      onClick={() => setWorkTab('todo')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        workTab === 'todo'
                          ? 'bg-[#111318] text-white shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      To do ({overviewLoading ? myWork.filter(w => w.tab === 'todo').length : (overview?.TodoTask ?? myWork.filter(w => w.tab === 'todo').length)})
                    </button>

                    <button
                      onClick={() => setWorkTab('done')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        workTab === 'done'
                          ? 'bg-[#111318] text-white shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Done ({overviewLoading ? myWork.filter(w => w.tab === 'done').length : (overview?.completeTask ?? myWork.filter(w => w.tab === 'done').length)})
                    </button>

                  </div>

                </div>

                <div className="space-y-2">
                  {filteredWork.length === 0 ? (
                    <div className="p-8 text-center text-xs font-medium text-stone-400 bg-stone-50/50 rounded-2xl border border-stone-200/50">
                      {searchQuery ? `No tasks match "${searchQuery}"` : workTab === 'done' ? 'No completed tasks yet.' : 'No active tasks to do. Create a new task to get started!'}
                    </div>
                  ) : (
                    filteredWork.map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/70 hover:bg-stone-100/80 border border-stone-200/50 transition-all cursor-pointer group"
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <button
                            type="button"
                            onClick={(e) => toggleTaskDone(e, task.id)}
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                              task.tab === 'done'
                                ? 'bg-lime-500 border-lime-600 text-white'
                                : 'border-stone-300 bg-white hover:border-stone-400'
                            }`}
                          >
                            {task.tab === 'done' && (
                              <CheckIcon size={12} strokeWidth={3} />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="text-[10px] text-stone-400 font-mono tracking-tight">
                              {task.path}
                            </div>

                            <div
                              className={`text-xs font-bold text-stone-900 group-hover:text-stone-700 truncate ${
                                task.tab === 'done'
                                  ? 'line-through text-stone-400'
                                  : ''
                              }`}
                            >
                              {task.title}
                            </div>
                          </div>

                        </div>

                        <div className="flex items-center gap-4 shrink-0">

                          {task.subtasksTotal > 0 && (
                            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200/60">
                              <span>✓</span>
                              <span className="stat-number">
                                {task.subtasksCompleted}/{task.subtasksTotal}
                              </span>
                            </div>
                          )}

                          {task.assignees && task.assignees.length > 0 && (
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {task.assignees.map((a, i) => (
                                <div
                                  key={i}
                                  className="w-5 h-5 rounded-full ring-1 ring-white text-[9px] font-bold text-white flex items-center justify-center"
                                  style={{ backgroundColor: a.color }}
                                  title={a.name}
                                >
                                  {a.initials}
                                </div>
                              ))}
                            </div>
                          )}

                          <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                            {task.due}
                          </span>

                          <button className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                            <MoreHorizontalIcon size={16} />
                          </button>

                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* ── 3. Bottom Telemetry Bento Row ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {/* Estimated Workload with MetricBars */}
                <div className="bento-card bento-card-interactive p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-stone-500">Estimated workload</span>
                      <span className="stat-number inline-flex items-center gap-0.5 rounded-full bg-lime-100 px-2.5 py-0.5 text-[11px] font-extrabold text-lime-800">
                        <ArrowUpRightIcon size={12} /> {overviewLoading ? '...' : `${overview?.workloadAllocation ?? 0}% allocated`}
                      </span>
                    </div>
                    <div className="stat-number text-[34px] font-extrabold tracking-tight text-stone-900 mt-1">
                      {overviewLoading ? '...' : (overview?.estimatedWorkload ?? 0)}<span className="text-[18px] text-stone-400 font-normal ml-0.5">h</span>
                    </div>
                  </div>
                  <MetricBars tint="lime" highlight={6} unit=" tasks" data={weeklyTrendBars} />
                </div>

                {/* Tasks Completed with MetricBars */}
                <div className="bento-card bento-card-interactive p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-bold text-stone-500">Tasks completed</span>
                      <span className="stat-number inline-flex items-center gap-0.5 rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-extrabold text-purple-800">
                        <ArrowUpRightIcon size={12} /> {overviewLoading ? '...' : `${overview?.completeTask ?? 0} total`}
                      </span>
                    </div>
                    <div className="stat-number text-[34px] font-extrabold tracking-tight text-stone-900 mt-1">
                      {overviewLoading ? '...' : (overview?.completeTask ?? 0)}
                    </div>
                  </div>
                  <MetricBars tint="lavender" highlight={6} unit=" tasks" data={weeklyTrendBars} />
                </div>

                {/* Team Capacity Dial */}
                <div className="bento-card bento-card-interactive p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-stone-500 mb-3">Team capacity</div>
                    <div className="flex items-center gap-4">
                      <CapacityDial value={Math.min(100, Math.round(overview?.workloadAllocation ?? 0))} tint="peach" size={68} />
                      <div className="space-y-1 text-[12.5px]">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-500" />
                          <span className="font-semibold text-stone-700">Allocated ({overviewLoading ? '...' : `${overview?.workloadAllocation ?? 0}%`})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-200" />
                          <span className="font-semibold text-stone-500">Available ({overviewLoading ? '...' : `${Math.max(0, Number((100 - (overview?.workloadAllocation ?? 0)).toFixed(2)))}%`})</span>
                        </div>
                        <div className="stat-number pt-1 font-bold text-stone-900 text-xs">
                          {overviewLoading ? '...' : `${overview?.activeMembers ?? 0} members · ${overview?.totaltask ?? 0} tasks`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-stone-100 text-xs font-medium text-stone-500 flex items-center justify-between">
                    <span>Sprint capacity</span>
                    <span className="stat-number font-bold text-stone-800">
                      {overviewLoading ? '...' : `${Math.max(0, Number((((overview?.activeMembers ?? 0) * 8) - (overview?.estimatedWorkload ?? 0)).toFixed(1)))}h headroom`}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        organizationId={activeOrg?.id}
        members={orgMembers}
        onAdd={(newTask) => {
          refreshTasks()
          fetchOverview()
          fetchLineup()
          toast.success('Task created successfully!')
        }}
      />

      {/* Task Inspection Modal */}
      {selectedTask && (
        <TaskDetailDrawer
          key={selectedTask.id}
          task={selectedTask}
          open={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          members={orgMembers}
          onUpdateTask={(updated) => {
            setMyWork(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t))
            refreshTasks()
            fetchOverview()
            fetchLineup()
          }}
          onDeleteTask={(id) => {
            setMyWork(prev => prev.filter(t => t.id !== id))
            refreshTasks()
            fetchOverview()
            fetchLineup()
          }}
        />
      )}
    </ProtectedRoute>
  )
}