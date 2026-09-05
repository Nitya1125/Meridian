"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import CreateTaskModal from '@/components/CreateTaskModal'
import TaskDetailDrawer from '@/components/TaskDetailDrawer'
import MetricCard from '@/components/MetricCard'
import OrgOnboarding from '@/components/OrgOnboarding'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useOrg } from '@/context/OrgContext'
import {
  CheckIcon, ClockIcon, UsersIcon, BarChartIcon,
  ChevronRightIcon, PlusIcon, MoreHorizontalIcon, FilterIcon,
  ArrowUpRightIcon, SearchIcon, SparklesIcon, ZapIcon, CheckCircleIcon,
  ClipboardIcon, TargetIcon, RocketIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'


const bentoKPIs = [
  {
    id: 'tasks',
    label: 'Total Tasks',
    value: '137',
    delta: '+20% vs last month',
    bg: 'bg-[#EDE9FE]',
    text: 'text-[#6D28D9]',
    border: 'border-[#DDD6FE]',
    icon: <ClipboardIcon size={18} className="text-[#6D28D9]" />,
    sparkline: [30, 45, 60, 55, 80, 95, 137]
  },
  {
    id: 'efficiency',
    label: 'Efficiency Score',
    value: '8.6',
    delta: '+0.5 vs last month',
    bg: 'bg-[#FFEDD5]',
    text: 'text-[#C2410C]',
    border: 'border-[#FDBA74]',
    icon: <ZapIcon size={18} className="text-[#C2410C]" />,
    sparkline: [6.8, 7.2, 7.5, 7.9, 8.1, 8.4, 8.6]
  },
  {
    id: 'completion',
    label: 'Sprint Completion',
    value: '74%',
    delta: '+10% vs last month',
    bg: 'bg-[#E0F2FE]',
    text: 'text-[#0369A1]',
    border: 'border-[#BAE6FD]',
    icon: <TargetIcon size={18} className="text-[#0369A1]" />,
    sparkline: [40, 52, 58, 62, 68, 70, 74]
  },
  {
    id: 'velocity',
    label: 'Team Velocity',
    value: '94%',
    delta: 'Top 5% speed',
    bg: 'bg-[#ECFCCB]',
    text: 'text-[#3F6212]',
    border: 'border-[#D9F99D]',
    icon: <RocketIcon size={18} className="text-[#3F6212]" />,
    sparkline: [50, 60, 75, 80, 88, 91, 94]
  },
]

const initialLineUp = [
  {
    id: 'lu-1',
    taskId: 'MRD-012',
    category: 'Commercial',
    title: 'Financial Mobile Banking App UI Kit',
    pct: 68,
    timeSpent: '14:20:00',
    color: '#f97316',
    border: 'border-orange-200',
    bg: 'bg-orange-50/50',
    assignees: []
  },
  {
    id: 'lu-2',
    taskId: 'MRD-014',
    category: 'Publications',
    title: 'Design System 2.0 Typography & Tokens',
    pct: 92,
    timeSpent: '28:45:10',
    color: '#8b5cf6',
    border: 'border-violet-200',
    bg: 'bg-violet-50/50',
    assignees: []
  }
]

const myWorkInitial = [
  {
    id: 'mw-1',
    taskId: 'MRD-021',
    path: 'Publications / Shots',
    title: 'Design 3 variations for iOS widget card mockup',
    subtasksCompleted: 3,
    subtasksTotal: 5,
    due: 'Today 5pm',
    tab: 'todo',
    priority: 'High',
    assignees: [],
    description: 'Deliverable required for marketing hero shots on Dribbble and social publication channels.',
    subtasks: [
      { text: 'Dark mode contrast audit', done: true },
      { text: 'Export PNG assets @2x and @3x', done: true },
      { text: 'Create motion preview in AfterEffects', done: true },
      { text: 'Figma review with team lead', done: false },
      { text: 'Client signoff', done: false }
    ]
  },
  {
    id: 'mw-2',
    taskId: 'MRD-022',
    path: 'Commercial / Portals',
    title: 'Implement OAuth2 token refresh & user session handler',
    subtasksCompleted: 4,
    subtasksTotal: 5,
    due: 'Tomorrow',
    tab: 'todo',
    priority: 'Critical',
    assignees: [],
    description: 'Secure JWT rotation with Redis distributed cache for fast token validation.',
    subtasks: [
      { text: 'Write Redis session adapter', done: true },
      { text: 'Setup cookie encryption', done: true },
      { text: 'Write unit tests for token expiration', done: true },
      { text: 'Security penetration test', done: true },
      { text: 'Deploy to staging cluster', done: false }
    ]
  },
  {
    id: 'mw-3',
    taskId: 'MRD-038',
    path: 'Design Internal / Exploration',
    title: 'Explore responsive tablet layouts for task board view',
    subtasksCompleted: 1,
    subtasksTotal: 2,
    due: 'July 30',
    tab: 'todo',
    priority: 'Medium',
    assignees: [],
    description: 'Provide seamless touch gestures and drag-and-drop column handling for iPad Pro and Galaxy Tab.',
    subtasks: [
      { text: 'Touch drag gesture prototypes', done: true },
      { text: 'Test on Safari Mobile', done: false }
    ]
  },
  {
    id: 'mw-4',
    taskId: 'MRD-044',
    path: 'Commercial / Portals',
    title: 'Client Review & Feedback on v2 redesign',
    subtasksCompleted: 1,
    subtasksTotal: 1,
    due: 'July 28',
    tab: 'done',
    priority: 'Low',
    assignees: [],
    description: 'Signed off by enterprise stakeholder committee.',
    subtasks: [
      { text: 'Final client signoff', done: true }
    ]
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [workTab, setWorkTab] = useState('todo')
  const [searchQuery, setSearchQuery] = useState('')
  const [myWork, setMyWork] = useState(myWorkInitial)
  const [hoveredBar, setHoveredBar] = useState(null)

  const { fullName } = useCurrentUser()
  const { userState, activeOrg } = useOrg()

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

  const toggleTaskDone = (e, id) => {
    e.stopPropagation()

    setMyWork(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextTab = t.tab === 'done' ? 'todo' : 'done'

          toast.success(
            nextTab === 'done'
              ? 'Task moved to Done'
              : 'Task restored to Active'
          )

          return { ...t, tab: nextTab }
        }

        return t
      })
    )
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
              {/* ── Greeting & Top Headline with Instrument Serif Italic ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif leading-tight">
                      Good morning,{' '}
                      <em className="italic font-serif font-normal text-stone-900">
                        {fullName || 'there'}
                      </em>
                    </h1>

                    {activeOrg?.name && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-lime-200 text-lime-900 font-mono shadow-2xs">
                        {activeOrg.name}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-stone-600 font-medium mt-1.5">
                    Command center for{' '}
                    <em className="font-serif italic font-normal text-stone-800 text-base sm:text-lg">
                      {activeOrg?.name || 'workspace'}
                    </em>{' '}
                    execution · 3 priorities queued
                  </p>
                </div>

                <div className="flex items-center gap-3.5 bg-white px-5 py-2.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block font-mono">
                      Tasks done
                    </span>

                    <span className="text-lg font-extrabold text-stone-950 stat-number">
                      {myWork.filter(w => w.tab === 'done').length}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                    <ArrowUpRightIcon size={16} />
                  </div>
                </div>
              </div>

              {/* ── 1. Bento KPI Metric Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                  icon={ClipboardIcon}
                  badge={`${myWork.filter(w => w.tab === 'todo').length} to do`}
                  value={String(myWork.length)}
                  label="Total Tasks"
                  theme="purple"
                  onClick={() => router.push('/kanban')}
                />
                <MetricCard
                  icon={ZapIcon}
                  badge="Live calculated"
                  value={myWork.length > 0 ? (myWork.filter(w => w.tab === 'done').length / myWork.length * 10).toFixed(1) : '10.0'}
                  label="Efficiency Score"
                  theme="amber"
                  onClick={() => router.push('/Analytics')}
                />
                <MetricCard
                  icon={TargetIcon}
                  badge={`${myWork.filter(w => w.tab === 'done').length} of ${myWork.length} done`}
                  value={`${myWork.length > 0 ? Math.round((myWork.filter(w => w.tab === 'done').length / myWork.length) * 100) : 0}%`}
                  label="Sprint Completion"
                  theme="sky"
                  onClick={() => router.push('/kanban')}
                />
                <MetricCard
                  icon={RocketIcon}
                  badge={activeOrg?.role || 'Member'}
                  value={activeOrg?.name || 'Standard'}
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
                        <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif tracking-tight">
                          LineUp &{' '}
                          <em className="italic font-serif font-normal text-stone-800">
                            Focal Points
                          </em>
                        </h2>

                        <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                          2 active
                        </span>
                      </div>

                      <button
                        onClick={() => router.push('/kanban')}
                        className="text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>View all board</span>
                        <ArrowUpRightIcon size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {initialLineUp.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTask({
                              id: item.id,
                              taskId: item.taskId,
                              title: item.title,
                              priority: 'High',
                              due: 'Today 5pm',
                              assigneeName: fullName || 'Team Lead',
                              assigneeColor: item.color,
                              tags: ['Design', item.category],
                              description: 'Active sprint focal point deliverable with live timer sync.'
                            })
                          }}
                          className={`p-5 rounded-2xl border ${item.border} ${item.bg} hover:shadow-xs transition-all cursor-pointer group`}
                        >
                          <div className="flex items-start justify-between mb-2.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-mono">
                              {item.category}
                            </span>

                            <span className="text-2xl font-extrabold text-stone-900 stat-number">
                              {item.pct}%
                            </span>
                          </div>

                          <div className="text-sm font-bold text-stone-900 group-hover:text-stone-700 leading-snug mb-3.5">
                            {item.title}
                          </div>

                          <div className="flex items-center justify-between text-xs text-stone-500 pt-2.5 border-t border-stone-900/5">
                            <div className="flex items-center gap-1.5 text-xs">
                              <ClockIcon size={13} className="text-stone-400" />
                              <span className="stat-number font-mono">
                                {item.timeSpent}
                              </span>
                            </div>

                            <div className="flex -space-x-1.5 overflow-hidden">
                              {item.assignees.map((a, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full ring-1 ring-white text-[10px] font-bold text-white flex items-center justify-center"
                                  style={{ backgroundColor: a.color }}
                                >
                                  {a.name[0]}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl sm:text-2xl font-normal text-stone-950 font-serif tracking-tight">
                          Trending{' '}
                          <em className="italic font-serif font-normal text-stone-800">
                            Initiatives
                          </em>
                        </h3>

                        <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                          3 total
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                        <div className="text-[10px] text-stone-400 font-bold uppercase font-mono">
                          Dribbble
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-stone-800 truncate mt-1">
                          Banking App Animation
                        </div>
                        <div className="text-xl font-extrabold text-stone-900 stat-number mt-1.5">
                          12%
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                        <div className="text-[10px] text-stone-400 font-bold uppercase font-mono">
                          Behance
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-stone-800 truncate mt-1">
                          AI chat app case study
                        </div>
                        <div className="text-xl font-extrabold text-stone-900 stat-number mt-1.5">
                          36%
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                        <div className="text-[10px] text-stone-400 font-bold uppercase font-mono">
                          Design Internal
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-stone-800 truncate mt-1">
                          Logotype & Token Specs
                        </div>
                        <div className="text-xl font-extrabold text-stone-900 stat-number mt-1.5">
                          98%
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs flex flex-col justify-between">

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif tracking-tight">
                        Working{' '}
                        <em className="italic font-serif font-normal text-stone-800">
                          Activity
                        </em>
                      </h2>

                      <span className="text-[11px] font-bold text-stone-500 font-mono bg-stone-100 px-2.5 py-0.5 rounded-md">
                        July 24 – 28
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-500 mb-6 font-medium">
                      Sprint hours logged across active days
                    </p>

                    <div className="grid grid-cols-5 text-center text-xs font-bold text-stone-600 mb-3">
                      <div>
                        Wed
                        <span className="block text-stone-400 stat-number text-[11px] mt-0.5">
                          24
                        </span>
                      </div>

                      <div>
                        Thu
                        <span className="block text-stone-400 stat-number text-[11px] mt-0.5">
                          25
                        </span>
                      </div>

                      <div className="text-stone-900">
                        Fri
                        <span className="block text-rose-600 font-bold stat-number text-[11px] mt-0.5">
                          26
                        </span>
                      </div>

                      <div>
                        Sat
                        <span className="block text-stone-400 stat-number text-[11px] mt-0.5">
                          27
                        </span>
                      </div>

                      <div>
                        Sun
                        <span className="block text-stone-400 stat-number text-[11px] mt-0.5">
                          28
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2.5 h-44 items-end relative py-2 border-b border-stone-100">

                      <div className="flex flex-col gap-1.5 h-full justify-end">
                        <div className="w-full h-8 bg-rose-200 rounded-lg" />
                        <div className="w-full h-14 bg-orange-400 rounded-lg" />
                      </div>

                      <div className="flex flex-col gap-1.5 h-full justify-end">
                        <div className="w-full h-12 bg-lime-400 rounded-lg" />
                        <div className="w-full h-16 bg-orange-500 rounded-lg" />
                      </div>

                      <div
                        className="flex flex-col gap-1.5 h-full justify-end relative cursor-pointer group"
                        onMouseEnter={() => setHoveredBar('fri')}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {hoveredBar === 'fri' && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111318] text-white text-xs font-mono px-3 py-1 rounded-xl shadow-lg whitespace-nowrap z-20">
                            10:59:16 Banking App
                          </div>
                        )}

                        <div className="w-full h-6 bg-pink-400 rounded-lg" />
                        <div className="w-full h-16 striped-bar-orange rounded-lg shadow-xs ring-2 ring-stone-900" />
                        <div className="w-full h-8 bg-lime-300 rounded-lg" />
                      </div>

                      <div className="flex flex-col gap-1.5 h-full justify-end">
                        <div className="w-full h-10 bg-lime-400 rounded-lg" />
                        <div className="w-full h-6 bg-violet-300 rounded-lg" />
                      </div>

                      <div className="flex flex-col gap-1.5 h-full justify-end">
                        <div className="w-full h-8 bg-pink-300 rounded-lg" />
                        <div className="w-full h-14 bg-orange-400 rounded-lg" />
                        <div className="w-full h-6 bg-lime-400 rounded-lg" />
                      </div>

                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 text-xs sm:text-sm font-semibold text-stone-600">
                    <span>Total sprint logged:</span>
                    <span className="text-stone-950 font-bold stat-number text-base sm:text-lg">
                      24.5 hours
                    </span>
                  </div>

                </div>

              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs mb-10">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-100">

                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif tracking-tight">
                      My{' '}
                      <em className="italic font-serif font-normal text-stone-800">
                        Work
                      </em>{' '}
                      & Deliverables
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
                      To do ({myWork.filter(w => w.tab === 'todo').length})
                    </button>

                    <button
                      onClick={() => setWorkTab('done')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        workTab === 'done'
                          ? 'bg-[#111318] text-white shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Done ({myWork.filter(w => w.tab === 'done').length})
                    </button>

                  </div>

                </div>

                <div className="space-y-2">

                  {filteredWork.map(task => (
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

                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200/60">
                          <span>✓</span>
                          <span className="stat-number">
                            {task.subtasksCompleted}/{task.subtasksTotal}
                          </span>
                        </div>

                        <div className="flex -space-x-1.5 overflow-hidden">
                          {task.assignees.map((a, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full ring-1 ring-white text-[9px] font-bold text-white flex items-center justify-center"
                              style={{ backgroundColor: a.color }}
                            >
                              {a.initials}
                            </div>
                          ))}
                        </div>

                        <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                          {task.due}
                        </span>

                        <button className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                          <MoreHorizontalIcon size={16} />
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            </>
          )}

        </main>
      </div>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(newTask) => {
          setMyWork(prev => [
            {
              id: newTask.id,
              taskId: newTask.taskId,
              path: 'Internal / Tasks',
              title: newTask.title,
              subtasksCompleted: 0,
              subtasksTotal: 2,
              due: newTask.due,
              tab: 'todo',
              priority: newTask.priority,
              assignees: [
                {
                  initials: newTask.assignee,
                  color: newTask.assigneeColor
                }
              ],
              description: newTask.description,
              subtasks: newTask.subtasks
            },
            ...prev
          ])

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
          onUpdateTask={(updated) => {
            setMyWork(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t))
          }}
          onDeleteTask={(id) => {
            setMyWork(prev => prev.filter(t => t.id !== id))
          }}
        />
      )}
    </ProtectedRoute>
  )
}