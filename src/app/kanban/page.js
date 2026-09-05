"use client"

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import CreateTaskModal from '@/components/CreateTaskModal'
import TaskDetailDrawer from '@/components/TaskDetailDrawer'
import MetricCard from '@/components/MetricCard'
import {
  SearchIcon, PlusIcon, FilterIcon, SortIcon, ShareIcon,
  MessageIcon, AttachIcon, CalendarIcon, MoreHorizontalIcon,
  CheckIcon, CheckDoubleIcon, ClockIcon, ArrowUpRightIcon,
  ClipboardIcon, TargetIcon, ZapIcon, GripVerticalIcon,
  ListIcon, KanbanBoardIcon, WorkflowIcon, LayersIcon, CheckCircleIcon,
  RocketIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'

// Initial task data
const initialColumns = [
  {
    id: 'todo',
    title: 'To do',
    count: 20,
    tasks: [
      {
        id: 'task-1',
        taskId: 'MRD-001',
        title: 'Design System 2.0 Tokens & Component Specs',
        description: 'Establish high-contrast typographic scales, Didot display styles, and warm stone container tokens for the workspace.',
        priority: 'High',
        due: '20 Aug',
        commentsCount: 8,
        attachmentsCount: 3,
        tags: ['Design', 'Internal Tasks'],
        hasMockup: true,
        assignees: [
          { initials: 'KV', name: 'Kacie Velasquez', color: '#f43f5e' },
          { initials: 'AJ', name: 'Alex Johnson', color: '#8b5cf6' }
        ],
        subtasks: [
          { text: 'Audit typography hierarchy', done: true },
          { text: 'Define Didot and Avenir pairings', done: true },
          { text: 'Export SVG icon definitions', done: false },
          { text: 'Verify accessibility contrast', done: false },
        ]
      },
      {
        id: 'task-2',
        taskId: 'MRD-002',
        title: 'OAuth2 Authentication Flow with GitHub & Google',
        description: 'Implement tokenized single sign-on with automatic session persistence and role-based redirect routing.',
        priority: 'Critical',
        due: '22 Aug',
        commentsCount: 14,
        attachmentsCount: 1,
        tags: ['Dev', 'Commercial'],
        hasMockup: false,
        assignees: [
          { initials: 'SC', name: 'Sarah Chen', color: '#6366f1' }
        ],
        subtasks: [
          { text: 'Create OAuth endpoint handlers', done: true },
          { text: 'Setup session token cache', done: false }
        ]
      },
      {
        id: 'task-3',
        taskId: 'MRD-003',
        title: 'Global Search Indexing Engine',
        description: 'Raycast-style search indexing across active tasks, projects, channels, and team directory.',
        priority: 'Medium',
        due: '24 Aug',
        commentsCount: 4,
        attachmentsCount: 2,
        tags: ['Dev'],
        hasMockup: false,
        assignees: [
          { initials: 'MW', name: 'Marcus Webb', color: '#10b981' }
        ],
        subtasks: [
          { text: 'Build indexing worker', done: true },
          { text: 'Add keyboard shortcut handler', done: true }
        ]
      }
    ]
  },
  {
    id: 'inprogress',
    title: 'In progress',
    count: 12,
    tasks: [
      {
        id: 'task-4',
        taskId: 'MRD-004',
        title: 'Financial Analytics & Burn-Up Charts',
        description: 'Real-time throughput velocity visualization with striped bar graphs, sprint burndown, and capacity tracking.',
        priority: 'High',
        due: '21 Aug',
        commentsCount: 11,
        attachmentsCount: 4,
        tags: ['Commercial', 'Design'],
        hasMockup: true,
        assignees: [
          { initials: 'AJ', name: 'Alex Johnson', color: '#8b5cf6' },
          { initials: 'PN', name: 'Priya Nair', color: '#f59e0b' }
        ],
        subtasks: [
          { text: 'Build SVG radial speedometer', done: true },
          { text: 'Implement striped bar shaders', done: true },
          { text: 'Hook live websocket feed', done: false }
        ]
      },
      {
        id: 'task-5',
        taskId: 'MRD-005',
        title: 'Mobile Touch Gestures & Responsive Drawer',
        description: 'Optimized touch interactions for iOS and Android responsive breakpoints with hardware acceleration.',
        priority: 'Medium',
        due: '23 Aug',
        commentsCount: 6,
        attachmentsCount: 2,
        tags: ['Dev', 'Mobile'],
        hasMockup: false,
        assignees: [
          { initials: 'KV', name: 'Kacie Velasquez', color: '#f43f5e' }
        ],
        subtasks: [
          { text: 'Swipe to dismiss gesture', done: true },
          { text: 'Smooth backdrop blur transition', done: true }
        ]
      }
    ]
  },
  {
    id: 'review',
    title: 'Under review',
    count: 3,
    tasks: [
      {
        id: 'task-6',
        taskId: 'MRD-006',
        title: 'Security Audit & 2FA Implementation',
        description: 'Enterprise 256-bit encryption compliance and multi-factor authenticator verification.',
        priority: 'Critical',
        due: '19 Aug',
        commentsCount: 19,
        attachmentsCount: 5,
        tags: ['Security', 'Dev'],
        hasMockup: false,
        assignees: [
          { initials: 'SC', name: 'Sarah Chen', color: '#6366f1' },
          { initials: 'MW', name: 'Marcus Webb', color: '#10b981' }
        ],
        subtasks: [
          { text: 'Penetration testing report', done: true },
          { text: 'HMAC signature verification', done: true },
          { text: 'Compliance signoff', done: true }
        ]
      }
    ]
  },
  {
    id: 'ready',
    title: 'Ready',
    count: 102,
    tasks: [
      {
        id: 'task-7',
        taskId: 'MRD-007',
        title: 'Workspace Onboarding & Welcome Flow',
        description: 'Interactive product walkthrough modal with 1-click demo persona switcher.',
        priority: 'Low',
        due: '15 Aug',
        commentsCount: 7,
        attachmentsCount: 2,
        tags: ['Design', 'Internal Tasks'],
        hasMockup: true,
        assignees: [
          { initials: 'AJ', name: 'Alex Johnson', color: '#8b5cf6' }
        ],
        subtasks: [
          { text: 'Design welcome illustration', done: true },
          { text: 'Build demo login shortcut', done: true }
        ]
      },
      {
        id: 'task-8',
        taskId: 'MRD-008',
        title: 'Real-time Chat Channels & Reaction Emojis',
        description: 'WebSocket messaging stream with instant message reactions and participant presence indicators.',
        priority: 'Medium',
        due: '14 Aug',
        commentsCount: 12,
        attachmentsCount: 3,
        tags: ['Commercial', 'Dev'],
        hasMockup: false,
        assignees: [
          { initials: 'PN', name: 'Priya Nair', color: '#f59e0b' }
        ],
        subtasks: [
          { text: 'WebSocket connection manager', done: true },
          { text: 'Reaction counters UI', done: true }
        ]
      }
    ]
  }
]

const tagPills = {
  Design: 'bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]',
  'Internal Tasks': 'bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]',
  Commercial: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
  Dev: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
  Security: 'bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]',
  Mobile: 'bg-[#FEF9C3] text-[#A16207] border-[#FEF08A]'
}

const workflowStages = [
  {
    step: '01',
    name: 'Discovery & Spec',
    desc: 'Product scope, user stories & token definitions',
    status: 'completed',
    progress: 100,
    owner: 'Alex Johnson',
    tasks: ['Design Tokens 2.0', 'Information Architecture', 'User Journey Maps'],
    color: '#8b5cf6'
  },
  {
    step: '02',
    name: 'UI/UX Prototyping',
    desc: 'High-fidelity Figma mockups and micro-interactions',
    status: 'in-progress',
    progress: 75,
    owner: 'Kacie Velasquez',
    tasks: ['Kanban Drag & Drop', 'Dynamic Schedule Island', 'Dark Command Dock'],
    color: '#f43f5e'
  },
  {
    step: '03',
    name: 'Production Engineering',
    desc: 'Next.js 16 App Router implementation & state sync',
    status: 'in-progress',
    progress: 60,
    owner: 'Sarah Chen',
    tasks: ['OAuth2 Integration', 'Throughput Charts', 'Touch Gestures'],
    color: '#0ea5e9'
  },
  {
    step: '04',
    name: 'Audit & Release',
    desc: 'Automated verification, accessibility & production deploy',
    status: 'upcoming',
    progress: 25,
    owner: 'Marcus Webb',
    tasks: ['Security Penetration', 'Cross-browser Verification', 'Staging Deploy'],
    color: '#10b981'
  }
]

export default function KanbanPage() {
  const { fullName, initials } = useCurrentUser()
  const [columns, setColumns] = useState(initialColumns)
  const [viewMode, setViewMode] = useState('board') // 'list' | 'board' | 'workflow'
  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [targetColId, setTargetColId] = useState('todo')
  const [selectedTask, setSelectedTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragSourceColId, setDragSourceColId] = useState(null)
  const [dragOverColId, setDragOverColId] = useState(null)

  // Inject real user name into workflow stage 1
  const workflowStagesWithUser = workflowStages.map((s, i) =>
    i === 0 ? { ...s, owner: fullName || s.owner } : s
  )

  // ── Drag & Drop Event Handlers ──
  const handleDragStart = (e, task, fromColId) => {
    setDraggedTask(task)
    setDragSourceColId(fromColId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
  }

  const handleDragOver = (e, colId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColId !== colId) {
      setDragOverColId(colId)
    }
  }

  const handleDragLeave = (e, colId) => {
    e.preventDefault()
    if (dragOverColId === colId) {
      setDragOverColId(null)
    }
  }

  const handleDrop = (e, targetColId) => {
    e.preventDefault()
    setDragOverColId(null)
    if (!draggedTask || !dragSourceColId) return

    if (dragSourceColId === targetColId) {
      setDraggedTask(null)
      setDragSourceColId(null)
      return
    }

    setColumns(prev => {
      let movedItem = null
      // 1. Remove from source
      const updated = prev.map(col => {
        if (col.id === dragSourceColId) {
          const filtered = col.tasks.filter(t => {
            if (t.id === draggedTask.id) {
              movedItem = t
              return false
            }
            return true
          })
          return { ...col, tasks: filtered, count: Math.max(0, col.count - 1) }
        }
        return col
      })

      // 2. Add to target
      if (movedItem) {
        return updated.map(col => {
          if (col.id === targetColId) {
            return {
              ...col,
              tasks: [{ ...movedItem, status: targetColId }, ...col.tasks],
              count: col.count + 1
            }
          }
          return col
        })
      }
      return prev
    })

    toast.success(`Task moved to ${columns.find(c => c.id === targetColId)?.title}`)
    setDraggedTask(null)
    setDragSourceColId(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragSourceColId(null)
    setDragOverColId(null)
  }

  const moveTaskButton = (e, taskId, fromColId, toColId) => {
    e.stopPropagation()
    setColumns(prev => {
      let movedTask = null
      const updated = prev.map(col => {
        if (col.id === fromColId) {
          const remaining = col.tasks.filter(t => {
            if (t.id === taskId) {
              movedTask = t
              return false
            }
            return true
          })
          return { ...col, tasks: remaining, count: col.count - 1 }
        }
        return col
      })

      if (movedTask) {
        return updated.map(col => {
          if (col.id === toColId) {
            return { ...col, tasks: [{ ...movedTask, status: toColId }, ...col.tasks], count: col.count + 1 }
          }
          return col
        })
      }
      return prev
    })
    toast.success('Task moved')
  }

  const allTasks = columns.flatMap(c => c.tasks.map(t => ({ ...t, columnTitle: c.title, columnId: c.id })))

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Kanban Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          {/* Top Dynamic Header */}
          <DynamicHeader
            onOpenNewTask={() => {
              setTargetColId('todo')
              setCreateModalOpen(true)
            }}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* ── Header Title & View Pill Controls ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif">
                Sprint 14 <em className="italic font-serif font-normal text-stone-900">Task Orchestration</em>
              </h1>

              {/* View Switcher Capsule (List | Board | Workflow) */}
              <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === 'list'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                    }`}
                >
                  <ListIcon size={13} />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === 'board'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                    }`}
                >
                  <KanbanBoardIcon size={13} />
                  <span>Board</span>
                </button>
                <button
                  onClick={() => setViewMode('workflow')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === 'workflow'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                    }`}
                >
                  <WorkflowIcon size={13} />
                  <span>Workflow</span>
                </button>
              </div>
            </div>

            {/* Quick Actions (Share, Filter, Sort) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success('Link copied to clipboard!')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-stone-200/80 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
              >
                <ShareIcon size={14} />
                <span>Share</span>
              </button>

              <button
                onClick={() => toast.success('Filtered by High Priority')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-stone-200/80 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
              >
                <FilterIcon size={14} />
                <span>Filters</span>
              </button>

              <button
                onClick={() => toast.success('Sorted by Due Date')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-stone-200/80 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
              >
                <SortIcon size={14} />
                <span>Sort by</span>
              </button>
            </div>
          </div>

          {/* ── Search Input (Ref 1) ── */}
          <div className="relative mb-6">
            <SearchIcon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title, tag, or assignee..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-white rounded-2xl border border-stone-200/80 shadow-2xs outline-none focus:border-stone-400 font-sans"
            />
          </div>

          {/* ── Bento KPI Metric Banners (Reusable MetricCard Suite) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <MetricCard
              icon={ClipboardIcon}
              badge="+20% vs last month"
              value="137"
              label="Total Tasks"
              theme="purple"
            />
            <MetricCard
              icon={ZapIcon}
              badge="+0.5 vs last month"
              value="8.6"
              label="Efficiency Score"
              theme="amber"
            />
            <MetricCard
              icon={TargetIcon}
              badge="+10% vs last month"
              value="74%"
              label="Sprint Completion"
              theme="sky"
            />
            <MetricCard
              icon={RocketIcon}
              badge="Top 5% speed"
              value="94%"
              label="Team Velocity"
              theme="lime"
            />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 1: KANBAN BOARD (with Interactive Drag & Drop)       */}
          {/* ══════════════════════════════════════════════════════════ */}
          {viewMode === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start mb-12">
              {columns.map(col => {
                const isDragOver = dragOverColId === col.id
                const filteredTasks = col.tasks.filter(t => {
                  if (!searchQuery.trim()) return true
                  return t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                })

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={(e) => handleDragLeave(e, col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`flex flex-col gap-3.5 p-2 rounded-3xl transition-all duration-200 ${isDragOver ? 'drag-over-column' : 'bg-transparent'
                      }`}
                  >
                    {/* Column Header Pill */}
                    <div className="flex items-center justify-between px-2.5 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-stone-950">
                          {col.title}
                        </span>
                        <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                          {col.count}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setTargetColId(col.id)
                          setCreateModalOpen(true)
                        }}
                        className="p-1.5 rounded-xl hover:bg-stone-200/70 text-stone-400 hover:text-stone-800 transition-colors"
                        title="Add task in this column"
                      >
                        <PlusIcon size={14} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Tasks Container */}
                    <div className="space-y-3.5 min-h-[220px]">
                      {filteredTasks.map(task => {
                        const isBeingDragged = draggedTask?.id === task.id
                        return (
                          <div
                            key={task.id}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, task, col.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => setSelectedTask(task)}
                            className={`bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md bento-card-interactive cursor-grab active:cursor-grabbing group relative transition-all ${isBeingDragged ? 'card-dragging' : ''
                              }`}
                          >
                            {/* Drag Handle Indicator */}
                            <div className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-stone-600">
                              <GripVerticalIcon size={14} />
                            </div>

                            {/* Tag Badges & Context Menu */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex flex-wrap gap-1.5">
                                {task.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${tagPills[tag] || 'bg-stone-100 text-stone-700 border-stone-200'
                                      }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const nextCol = col.id === 'todo' ? 'inprogress' : col.id === 'inprogress' ? 'review' : 'ready'
                                  moveTaskButton(e, task.id, col.id, nextCol)
                                }}
                                className="text-stone-400 hover:text-stone-800 p-1 rounded-md hover:bg-stone-100"
                                title="Quick move forward"
                              >
                                <MoreHorizontalIcon size={15} />
                              </button>
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-sm font-normal text-stone-900 group-hover:text-stone-700 tracking-tight leading-snug mb-2 font-serif">
                              {task.title}
                            </h3>

                            <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-4 font-normal">
                              {task.description}
                            </p>

                            {/* Embedded Mockup Preview Card (from Ref 1) */}
                            {task.hasMockup && (
                              <div className="mb-4 p-2.5 rounded-2xl bg-[#111318] text-white flex items-center justify-center gap-3 shadow-inner">
                                <div className="w-16 h-24 rounded-xl bg-stone-900 border border-white/10 p-1.5 flex flex-col justify-between">
                                  <div className="w-full h-1.5 bg-white/20 rounded-full" />
                                  <div className="w-4 h-4 rounded-full bg-violet-500 mx-auto" />
                                  <div className="w-full h-1 bg-white/20 rounded-full" />
                                </div>
                                <div className="w-16 h-24 rounded-xl bg-stone-900 border border-white/10 p-1.5 flex flex-col justify-between">
                                  <div className="flex gap-1">
                                    <div className="w-2 h-8 bg-lime-400 rounded-sm" />
                                    <div className="w-2 h-5 bg-orange-400 rounded-sm mt-3" />
                                  </div>
                                  <div className="text-[7px] text-stone-400 mono-tag text-center">Charts</div>
                                </div>
                              </div>
                            )}

                            {/* Due Date & Assignee Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
                              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/50">
                                <CalendarIcon size={12} className="text-stone-400" />
                                <span>{task.due}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Comments & Attachments */}
                                <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                                  <span className="flex items-center gap-0.5">
                                    <MessageIcon size={12} />
                                    <span className="stat-number">{task.commentsCount}</span>
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <AttachIcon size={12} />
                                    <span className="stat-number">{task.attachmentsCount}</span>
                                  </span>
                                </div>

                                {/* Assignee Avatar */}
                                <div className="flex -space-x-1.5 overflow-hidden">
                                  {task.assignees.map((a, i) => (
                                    <div
                                      key={i}
                                      className="w-5 h-5 rounded-full ring-2 ring-white text-[9px] font-bold text-white flex items-center justify-center shadow-2xs"
                                      style={{ backgroundColor: a.color }}
                                      title={a.name}
                                    >
                                      {a.initials}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                          </div>
                        )
                      })}

                      {/* Quick Add Card Placeholder */}
                      <button
                        onClick={() => {
                          setTargetColId(col.id)
                          setCreateModalOpen(true)
                        }}
                        className="w-full py-3 rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-400 text-stone-400 hover:text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <PlusIcon size={14} />
                        <span>Add Task</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 2: INTERACTIVE LIST VIEW                             */}
          {/* ══════════════════════════════════════════════════════════ */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-6 mb-12">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif">
                    Task <em className="italic font-serif font-normal">Inventory</em> List
                  </h2>
                  <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">{allTasks.length} total</span>
                </div>

                <button
                  onClick={() => {
                    setTargetColId('todo')
                    setCreateModalOpen(true)
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#111318] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-xs"
                >
                  <PlusIcon size={13} strokeWidth={2.5} />
                  <span>New Task</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="pb-3 pl-3">Task & ID</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Priority</th>
                      <th className="pb-3">Assignee</th>
                      <th className="pb-3">Subtasks</th>
                      <th className="pb-3">Due Date</th>
                      <th className="pb-3 pr-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {allTasks
                      .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(t => (
                        <tr
                          key={t.id}
                          onClick={() => setSelectedTask(t)}
                          className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 pl-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                                {t.taskId}
                              </span>
                              <div>
                                <div className="font-bold text-stone-900 group-hover:text-violet-700 text-xs">
                                  {t.title}
                                </div>
                                <div className="text-[11px] text-stone-400 line-clamp-1 max-w-md">
                                  {t.description}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                              {t.columnTitle}
                            </span>
                          </td>

                          <td className="py-3.5">
                            <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${t.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                t.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                                  t.priority === 'Medium' ? 'bg-indigo-100 text-indigo-700' :
                                    'bg-stone-100 text-stone-700'
                              }`}>
                              {t.priority}
                            </span>
                          </td>

                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1">
                                {t.assignees?.map((a, i) => (
                                  <div
                                    key={i}
                                    className="w-5 h-5 rounded-full ring-1 ring-white text-[9px] font-bold text-white flex items-center justify-center shadow-2xs"
                                    style={{ backgroundColor: a.color }}
                                  >
                                    {a.initials}
                                  </div>
                                ))}
                              </div>
                              <span className="text-stone-700 font-medium text-[11px]">
                                {t.assignees?.[0]?.name || 'Unassigned'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5">
                            <span className="text-[11px] font-semibold text-stone-500 font-mono bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60">
                              ✓ {t.subtasks?.filter(s => s.done).length || 0}/{t.subtasks?.length || 0}
                            </span>
                          </td>

                          <td className="py-3.5 text-stone-500 font-mono text-[11px]">
                            {t.due}
                          </td>

                          <td className="py-3.5 pr-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTask(t)
                              }}
                              className="text-stone-400 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                            >
                              <ArrowUpRightIcon size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 3: INTERACTIVE WORKFLOW PIPELINE VIEW                */}
          {/* ══════════════════════════════════════════════════════════ */}
          {viewMode === 'workflow' && (
            <div className="space-y-6 mb-12">
              <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-stone-100">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif">
                      Sprint 14 <em className="italic font-serif font-normal">Pipeline</em> & Milestones
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">End-to-end design & engineering workflow stages with live completion rates</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-lime-100 text-lime-800 font-mono">
                      Overall Health: 84% on schedule
                    </span>
                  </div>
                </div>

                {/* Workflow Stage Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {workflowStagesWithUser.map((stage, idx) => (
                    <div
                      key={stage.step}
                      className="p-5 rounded-3xl bg-[#FAF8F5] border border-stone-200/80 shadow-2xs flex flex-col justify-between relative group hover:border-stone-400 transition-all"
                    >
                      <div>
                        {/* Step Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-900 text-white">
                            Stage {stage.step}
                          </span>
                          <span className="text-2xl font-bold stat-number text-stone-900">
                            {stage.progress}%
                          </span>
                        </div>

                        {/* Stage Title */}
                        <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                          {stage.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
                          {stage.desc}
                        </p>

                        {/* Progress Meter */}
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${stage.progress}%`, backgroundColor: stage.color }}
                          />
                        </div>

                        {/* Deliverables Sub-List */}
                        <div className="space-y-1.5 mb-4">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Deliverables</div>
                          {stage.tasks.map((taskName, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-stone-700 bg-white p-2 rounded-xl border border-stone-200/50">
                              <span className="text-lime-600 font-bold">✓</span>
                              <span className="truncate">{taskName}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lead */}
                      <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                        <span className="text-stone-400 text-[11px]">Owner</span>
                        <span className="font-bold text-stone-800">{stage.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createModalOpen}
        defaultColumnId={targetColId}
        onClose={() => setCreateModalOpen(false)}
        onAdd={(newTask, columnId) => {
          setColumns(prev => prev.map(col => {
            if (col.id === columnId) {
              return {
                ...col,
                tasks: [
                  {
                    ...newTask,
                    hasMockup: false,
                    commentsCount: 0,
                    attachmentsCount: 0,
                    assignees: [{ initials: newTask.assignee, name: newTask.assigneeName, color: newTask.assigneeColor }]
                  },
                  ...col.tasks
                ],
                count: col.count + 1
              }
            }
            return col
          }))
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
            setColumns(prev => prev.map(col => ({
              ...col,
              tasks: col.tasks.map(t => t.id === updated.id ? { ...t, ...updated } : t)
            })))
          }}
          onDeleteTask={(id) => {
            setColumns(prev => prev.map(col => ({
              ...col,
              tasks: col.tasks.filter(t => t.id !== id),
              count: col.tasks.some(t => t.id === id) ? col.count - 1 : col.count
            })))
          }}
        />
      )}
    </ProtectedRoute>
  )
}