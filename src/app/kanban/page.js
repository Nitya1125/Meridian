"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import CreateTaskModal, { getMemberColor, getMemberInitials, getMemberFullName } from '@/components/CreateTaskModal'
import TaskDetailDrawer from '@/components/TaskDetailDrawer'
import WorkflowGuideModal from '@/components/WorkflowGuideModal'
import MetricCard from '@/components/MetricCard'
import SprintWorkflowCanvas from '@/components/SprintWorkflowCanvas'
import StripedLoader from '@/components/StripedLoader'
import {
  SearchIcon, PlusIcon, FilterIcon, SortIcon, ShareIcon,
  MessageIcon, AttachIcon, CalendarIcon, MoreHorizontalIcon,
  CheckIcon, CheckDoubleIcon, ClockIcon, ArrowUpRightIcon,
  ClipboardIcon, TargetIcon, ZapIcon, GripVerticalIcon,
  ListIcon, KanbanBoardIcon, WorkflowIcon, LayersIcon, CheckCircleIcon,
  RocketIcon,
  IconlyTasks, IconlyCalendar, IconlyActivity, IconlyWorkflow,
  IconlySearch, IconlyPlus, IconlyChat
} from '@/components/Icons'
import {
  CalendarClock, BarChart3, AlarmClock, MoonStar, InboxIcon,
  Play, CheckCircle2, ChevronRight, ChevronLeft, Split, HelpCircle,
  Sparkles, Layers, SlidersHorizontal, ArrowRight, Eye, RefreshCw
} from 'lucide-react'
import {
  PARALLEL_TRACKS, DEFAULT_TRACK, getTaskTrack,
  isTaskParallel, groupTasksByParallelTracks
} from '@/Lib/parallelTracks'
import { PASTEL, taskHealth } from '@/Lib/meridianTheme'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useOrg } from '@/context/OrgContext'
import { useTasks } from '@/context/TaskContext'
import { getTasks, updateTask, deleteTask } from '@/Service/taskService'
import { handleOrganizationUsers } from '@/Service/organization'

const COLUMNS_CONFIG = [
  { id: 'TODO', title: 'To do', tint: 'stone', badge: 'Ready', desc: 'Backlog & Scope Ready' },
  { id: 'IN_PROGRESS', title: 'In progress', tint: 'peach', badge: 'In Flight', desc: 'Active Development' },
  { id: 'REVIEW', title: 'Under review', tint: 'sky', badge: 'Verification', desc: 'QA & Peer Review' },
  { id: 'DONE', title: 'Done', tint: 'mint', badge: 'Shipped', desc: 'Completed & Verified' },
]

const tagPills = {
  Design: 'bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]',
  'Internal Tasks': 'bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]',
  Commercial: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
  Dev: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
  Security: 'bg-[#FFE4E6] text-[#BE123C] border-[#FECDD3]',
  Mobile: 'bg-[#FEF9C3] text-[#A16207] border-[#FEF08A]'
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return 'No date';
  try {
    const d = new Date(dueDateStr);
    if (isNaN(d.getTime())) return dueDateStr;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } catch {
    return dueDateStr;
  }
}

const normalizeStatus = (status) => {
  if (!status) return 'TODO';
  const s = String(status).toUpperCase();
  if (s === 'INPROGRESS' || s === 'IN_PROGRESS') return 'IN_PROGRESS';
  if (s === 'UNDER_REVIEW' || s === 'REVIEW') return 'REVIEW';
  if (s === 'READY' || s === 'DONE') return 'DONE';
  if (s === 'TODO') return 'TODO';
  return 'TODO';
}

function TimelineView({ tasks, onOpenTask }) {
  if (tasks.length === 0) {
    return (
      <div className="bento-card p-12 text-center text-stone-400 mb-12">
        <p className="text-sm font-medium">No tasks available for timeline view.</p>
      </div>
    );
  }

  return (
    <div className="bento-card overflow-x-auto p-6 mb-12">
      <div className="min-w-[720px]">
        <div className="mb-3 grid grid-cols-[220px_repeat(7,1fr)] gap-2 border-b border-stone-100 pb-2">
          <span className="tech-badge text-[10px] text-stone-400 font-mono">Task</span>
          {DAYS.map((d) => (
            <span key={d} className="tech-badge text-center text-[10px] text-stone-400 font-mono">
              {d}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {tasks.map((t, i) => {
            const start = i % 5;
            const span = 2 + (i % 3);
            const totalSub = t.subtasks?.length || 0;
            const doneSub = t.subtasks?.filter((s) => s.done).length || 0;
            const pct = totalSub
              ? Math.round((doneSub / totalSub) * 100)
              : t.status === "DONE"
              ? 100
              : t.status === "IN_PROGRESS"
              ? 50
              : 25;
            const c =
              t.priority === "CRITICAL"
                ? PASTEL.rose
                : t.priority === "HIGH"
                ? PASTEL.peach
                : t.priority === "MEDIUM"
                ? PASTEL.sky
                : PASTEL.stone;

            return (
              <div key={t.id} className="grid grid-cols-[220px_repeat(7,1fr)] items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTask(t)}
                  className="tactile flex items-center gap-2 truncate text-left cursor-pointer hover:text-violet-700"
                >
                  <span className="tech-badge text-[9px] text-stone-400 font-mono">
                    {t.taskId || "TSK"}
                  </span>
                  <span className="truncate text-[12.5px] font-bold text-stone-800">
                    {t.title}
                  </span>
                </button>
                <div className="col-span-7 grid grid-cols-7 gap-2">
                  {DAYS.map((_, day) => {
                    const inBar = day >= start && day < start + span;
                    const isStart = day === start;
                    if (!inBar) return <div key={day} className="h-7 rounded-lg bg-stone-50/80" />;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => onOpenTask(t)}
                        className="tactile relative h-7 overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                        style={{ background: c.bg, border: `1px solid ${c.border}` }}
                      >
                        <span
                          className="absolute inset-y-0 left-0 opacity-60"
                          style={{ width: `${pct}%`, background: c.solid }}
                        />
                        {isStart && (
                          <span
                            className="stat-number relative z-10 pl-1.5 text-[9px] font-extrabold leading-7"
                            style={{ color: c.text }}
                          >
                            {pct}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BoardAnalytics({ columns, allTasks }) {
  const total = allTasks.length || 1;
  const prio = [
    { p: "CRITICAL", label: "Critical", count: allTasks.filter((t) => t.priority === "CRITICAL").length, tint: "rose" },
    { p: "HIGH", label: "High", count: allTasks.filter((t) => t.priority === "HIGH").length, tint: "peach" },
    { p: "MEDIUM", label: "Medium", count: allTasks.filter((t) => t.priority === "MEDIUM").length, tint: "sky" },
    { p: "LOW", label: "Low", count: allTasks.filter((t) => t.priority === "LOW").length, tint: "stone" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
      <div className="bento-card p-6">
        <h2 className="mb-4 text-[18px] font-extrabold tracking-tight text-stone-900 font-serif">
          Pipeline <span className="font-serif italic font-normal text-stone-600">Distribution</span>
        </h2>
        <div className="space-y-4">
          {columns.map((col) => {
            const count = col.tasks.length;
            const pct = Math.round((count / total) * 100);
            const c = PASTEL[col.tint] || PASTEL.stone;
            return (
              <div key={col.id}>
                <div className="mb-1.5 flex items-center justify-between text-[12.5px] font-bold">
                  <span className="text-stone-700">{col.title}</span>
                  <span className="stat-number text-stone-500">
                    {count} tasks · {pct}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: c.solid }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bento-card p-6">
        <h2 className="mb-4 text-[18px] font-extrabold tracking-tight text-stone-900 font-serif">
          Priority <span className="font-serif italic font-normal text-stone-600">Mix</span>
        </h2>
        <div className="space-y-4">
          {prio.map(({ p, label, count, tint }) => {
            const pct = Math.round((count / total) * 100);
            const c = PASTEL[tint] || PASTEL.stone;
            return (
              <div key={p} className="flex items-center gap-3">
                <span className="w-20">
                  <span
                    className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                  >
                    {label}
                  </span>
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: c.solid }}
                  />
                </div>
                <span className="stat-number w-8 text-right text-[13px] font-extrabold text-stone-900">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Reusable Interactive Kanban Task Card ──
function KanbanTaskCard({
  task,
  columnId,
  onOpen,
  onMove,
  isBeingDragged,
  onDragStart,
  onDragEnd
}) {
  const isDone = columnId === 'DONE'
  const isReview = columnId === 'REVIEW'
  const isInProgress = columnId === 'IN_PROGRESS'
  const isTodo = columnId === 'TODO'

  const totalSubtasks = task.subtasks?.length || 0
  const doneSubtasks = task.subtasks?.filter(s => s.done).length || 0
  const subtasksPct = totalSubtasks > 0 ? Math.round((doneSubtasks / totalSubtasks) * 100) : 0

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(task)}
      className={`bg-white rounded-3xl p-5 border shadow-xs hover:shadow-md bento-card-interactive cursor-grab active:cursor-grabbing group relative transition-all ${
        isBeingDragged
          ? 'card-dragging shadow-xl rotate-1 opacity-60 ring-2 ring-lime-400/60'
          : isDone
          ? 'border-stone-200/60 bg-stone-50/50'
          : 'border-stone-200/90 hover:border-stone-400'
      }`}
    >
      {/* Drag Handle Indicator */}
      <div
        className="absolute top-4 right-3.5 opacity-40 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-stone-700"
        title="Drag to move card"
      >
        <GripVerticalIcon size={14} />
      </div>

      {/* Top Badges Row: Track Pill, Concurrency Pill, Priority Pill */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3 pr-5">
        {/* Parallel Sprint Track Pill */}
        {task.track && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${task.track.bg || 'bg-stone-100'} ${task.track.text || 'text-stone-700'} ${task.track.border || 'border-stone-200'} font-mono flex items-center gap-1 shadow-2xs`}
            title={task.track.name}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${task.track.dot || 'bg-stone-500'}`} />
            {task.track.code || 'TRK'}
          </span>
        )}

        {/* Parallel Concurrency Tag */}
        {task.isParallel && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5 shadow-2xs"
            title="Non-blocking concurrent task"
          >
            <ZapIcon size={10} className="text-amber-500 fill-amber-500" />
            <span>Parallel</span>
          </span>
        )}

        {/* Priority Badge */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
            task.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-200' :
            task.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-200' :
            task.priority === 'MEDIUM' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
            'bg-stone-100 text-stone-700 border-stone-200'
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Task Code & Title */}
      <div className="mb-2">
        <span className="text-[10px] font-mono font-bold text-stone-400 block mb-0.5">
          {task.taskId}
        </span>
        <h3 className={`text-sm font-bold text-stone-900 group-hover:text-violet-700 tracking-tight leading-snug font-urbanist ${isDone ? 'line-through text-stone-400' : ''}`}>
          {task.title}
        </h3>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3 font-normal">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mb-3.5 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
          <div className="mb-1.5 flex items-center justify-between text-[10.5px] font-bold text-stone-500">
            <span>Subtasks</span>
            <span className="font-mono text-stone-700">
              {doneSubtasks}/{totalSubtasks} ({subtasksPct}%)
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                subtasksPct === 100 ? 'bg-emerald-500' : 'bg-lime-500'
              }`}
              style={{ width: `${subtasksPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Due Date & Assignee Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 text-xs text-stone-500 mb-3">
        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/60 font-mono">
          <IconlyCalendar size={12} className="text-stone-400" />
          <span>{task.due}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Assignee Avatar */}
          <div className="flex -space-x-1.5 overflow-hidden">
            {task.assignees?.map((a, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full ring-2 ring-white text-[9px] font-bold text-white flex items-center justify-center shadow-2xs"
                style={{ backgroundColor: a.color }}
                title={a.name}
              >
                {a.initials}
              </div>
            ))}
            {(!task.assignees || task.assignees.length === 0) && (
              <div className="w-5 h-5 rounded-full ring-2 ring-white text-[9px] font-bold text-stone-400 bg-stone-200 flex items-center justify-center" title="Unassigned">
                ?
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 1-Click Quick Move Tactile Action Bar ── */}
      <div className="pt-2 border-t border-dashed border-stone-200/80" onClick={(e) => e.stopPropagation()}>
        {isTodo && (
          <button
            type="button"
            onClick={() => onMove(task, 'TODO', 'IN_PROGRESS')}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-2xs group/btn"
            title="Start working on this task"
          >
            <Play size={11} className="text-amber-500 fill-amber-500 group-hover/btn:text-white group-hover/btn:fill-white" />
            <span>Start Working</span>
            <ChevronRight size={13} className="text-stone-400 group-hover/btn:text-white" />
          </button>
        )}

        {isInProgress && (
          <div className="flex items-center gap-1.5 w-full">
            <button
              type="button"
              onClick={() => onMove(task, 'IN_PROGRESS', 'TODO')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              title="Move back to To Do"
            >
              <ChevronLeft size={12} />
              <span>To Do</span>
            </button>
            <button
              type="button"
              onClick={() => onMove(task, 'IN_PROGRESS', 'REVIEW')}
              className="flex-[2] py-1.5 px-2 rounded-xl bg-sky-100 hover:bg-sky-600 hover:text-white text-sky-800 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs group/btn"
              title="Submit for QA & Review"
            >
              <CheckDoubleIcon size={12} />
              <span>Submit Review</span>
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {isReview && (
          <div className="flex items-center gap-1.5 w-full">
            <button
              type="button"
              onClick={() => onMove(task, 'REVIEW', 'IN_PROGRESS')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              title="Needs revisions"
            >
              <ChevronLeft size={12} />
              <span>Revise</span>
            </button>
            <button
              type="button"
              onClick={() => onMove(task, 'REVIEW', 'DONE')}
              className="flex-[2] py-1.5 px-2 rounded-xl bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-800 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs group/btn"
              title="Mark as Done"
            >
              <CheckCircle2 size={12} />
              <span>Mark Done</span>
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {isDone && (
          <div className="flex items-center justify-between w-full text-[11px] text-stone-500 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Shipped & Verified</span>
            </span>
            <button
              type="button"
              onClick={() => onMove(task, 'DONE', 'IN_PROGRESS')}
              className="text-[10px] font-bold text-stone-400 hover:text-stone-800 hover:underline cursor-pointer flex items-center gap-0.5"
              title="Reopen task"
            >
              <RefreshCw size={10} />
              <span>Reopen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function KanbanPage() {
  const { fullName, initials } = useCurrentUser()
  const { activeOrg, activeOrgId } = useOrg()

  // Centralized Tasks Context (Shared live across Calendar, Dashboard, Kanban, and DynamicHeader)
  const {
    tasks: rawTasks = [],
    members = [],
    loading: tasksLoading,
    refreshTasks,
    updateTask: updateTaskInContext,
    deleteTask: deleteTaskInContext
  } = useTasks()

  const [viewMode, setViewMode] = useState('board') // 'list' | 'board' | 'timeline' | 'analytics' | 'workflow'
  const [boardLayout, setBoardLayout] = useState('columns') // 'columns' | 'parallel_tracks'
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('ALL')
  const [workflowGuideOpen, setWorkflowGuideOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [targetColId, setTargetColId] = useState('TODO')
  const [targetTrackId, setTargetTrackId] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragSourceColId, setDragSourceColId] = useState(null)
  const [dragOverColId, setDragOverColId] = useState(null)

  // Map raw tasks with real assignees, parallel track resolution, and format
  const mappedTasks = useMemo(() => {
    return rawTasks.map(task => {
      const tid = task.task_id || task.id
      const assignedUser = members.find(m => String(m.id) === String(task.assigned_to))

      const assignees = assignedUser
        ? [
            {
              id: assignedUser.id,
              name: getMemberFullName(assignedUser),
              initials: getMemberInitials(assignedUser),
              color: getMemberColor(assignedUser.id),
              role: assignedUser.role || 'Member'
            }
          ]
        : []

      const normStatus = normalizeStatus(task.status)
      const normPriority = (task.priority || 'MEDIUM').toUpperCase()
      const resolvedTrack = getTaskTrack(task)
      const isParallel = isTaskParallel(task)

      return {
        ...task,
        id: `task-${tid}`,
        task_id: tid,
        taskId: task.task_code || `TSK-${String(tid).padStart(3, '0')}`,
        title: task.title,
        description: task.description || '',
        status: normStatus,
        priority: normPriority,
        track: resolvedTrack,
        track_id: task.track_id || resolvedTrack.id,
        isParallel,
        due: formatDueDate(task.due_date),
        due_date: task.due_date,
        assignees,
        tags: task.tags || [normStatus === 'DONE' ? 'Done' : 'Task', normPriority],
        subtasks: task.subtasks || [],
        commentsCount: task.commentsCount || 0,
        attachmentsCount: task.attachmentsCount || 0,
        hasMockup: Boolean(task.has_mockup)
      }
    })
  }, [rawTasks, members])

  // Group into canonical 4 columns
  const columns = useMemo(() => {
    return COLUMNS_CONFIG.map(col => {
      const colTasks = mappedTasks.filter(t => t.status === col.id)
      return {
        ...col,
        count: colTasks.length,
        tasks: colTasks
      }
    })
  }, [mappedTasks])

  const allTasks = useMemo(() => {
    return columns.flatMap(c => c.tasks.map(t => ({ ...t, columnTitle: c.title, columnId: c.id })))
  }, [columns])

  // Parallel Streams grouping
  const parallelTrackGroups = useMemo(() => {
    return groupTasksByParallelTracks(mappedTasks)
  }, [mappedTasks])

  const activeParallelStreamsCount = useMemo(() => {
    return parallelTrackGroups.filter(g => g.tasks.length > 0).length
  }, [parallelTrackGroups])

  const parallelTasksCount = useMemo(() => {
    return mappedTasks.filter(t => t.isParallel).length
  }, [mappedTasks])

  // Filter tasks helper for column or swimlane views
  const filterTask = useCallback((task) => {
    if (selectedTrackFilter !== 'ALL' && task.track?.id !== selectedTrackFilter) {
      return false
    }
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      task.title?.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q) ||
      task.priority?.toLowerCase().includes(q) ||
      task.track?.name?.toLowerCase().includes(q) ||
      task.track?.code?.toLowerCase().includes(q)
    )
  }, [selectedTrackFilter, searchQuery])

  // ── Task Mutations (Connect to TaskContext for instant cross-app synchronization) ──

  const handleMoveTask = async (taskToMove, fromColId, toColId) => {
    if (fromColId === toColId) return
    const tid = taskToMove.task_id || taskToMove.id

    try {
      await updateTaskInContext({
        task_id: tid,
        status: toColId
      })
      const targetTitle = COLUMNS_CONFIG.find(c => c.id === toColId)?.title || toColId
      toast.success(`Task moved to ${targetTitle}`)
    } catch (err) {
      toast.error(err.message || 'Failed to move task')
    }
  }

  const handleUpdateTask = async (partialData) => {
    try {
      await updateTaskInContext(partialData)
      toast.success('Task updated successfully')
      // Keep selected task in sync
      setSelectedTask(prev => {
        if (!prev) return null
        const currId = prev.task_id || prev.id
        if (String(currId) === String(partialData.task_id)) {
          return { ...prev, ...partialData }
        }
        return prev
      })
      return true
    } catch (err) {
      toast.error(err.message || 'Failed to update task')
      return false
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskInContext(taskId)
      toast.success('Task deleted successfully')
      if (selectedTask && String(selectedTask.task_id || selectedTask.id) === String(taskId)) {
        setSelectedTask(null)
      }
      return true
    } catch (err) {
      toast.error(err.message || 'Failed to delete task')
      return false
    }
  }

  // ── Drag & Drop Handlers ──
  const handleDragStart = (e, task, fromColId) => {
    setDraggedTask(task)
    setDragSourceColId(fromColId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(task.task_id || task.id))
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

  const handleDrop = async (e, targetColId) => {
    e.preventDefault()
    setDragOverColId(null)
    if (!draggedTask || !dragSourceColId) return

    const taskToMove = draggedTask
    const fromCol = dragSourceColId
    setDraggedTask(null)
    setDragSourceColId(null)

    await handleMoveTask(taskToMove, fromCol, targetColId)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragSourceColId(null)
    setDragOverColId(null)
  }

  // Metrics calculation
  const totalTasksCount = allTasks.length
  const completedCount = allTasks.filter(t => t.status === 'DONE').length
  const inProgressCount = allTasks.filter(t => t.status === 'IN_PROGRESS').length
  const highPriorityCount = allTasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length
  const completionPct = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Kanban Content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          {/* Top Dynamic Header */}
          <DynamicHeader
            columns={columns}
            allTasks={allTasks}
            onOpenNewTask={() => {
              setTargetColId('TODO')
              setTargetTrackId(null)
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
              <div>
                <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900 lg:text-[38px] font-urbanist">
                  {viewMode === 'workflow' ? (
                    <>
                      Project <span className="font-serif italic font-normal text-violet-700">architecture</span> & workflow
                    </>
                  ) : (
                    <>
                      Sprint{' '}
                      <span className="font-serif italic font-normal text-violet-700">
                        {viewMode === 'timeline' ? 'timeline' : viewMode === 'analytics' ? 'analytics' : viewMode === 'list' ? 'list' : 'board'}
                      </span>
                    </>
                  )}
                </h1>
                <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">
                  {viewMode === 'workflow'
                    ? 'Structural topology, module dependencies & CI/CD delivery pipelines.'
                    : activeOrg ? `${activeOrg.name} — concurrent parallel streams & 1-click stage transitions.` : 'Select an organization to manage tasks.'}
                </p>
              </div>

              {/* View Switcher Capsule */}
              <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap group ${
                    viewMode === 'board'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <IconlyTasks size={14} active={viewMode === 'board'} />
                  <span>Board</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap group ${
                    viewMode === 'list'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ListIcon size={13} />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap group ${
                    viewMode === 'timeline'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <IconlyCalendar size={14} active={viewMode === 'timeline'} />
                  <span>Timeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap group ${
                    viewMode === 'analytics'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <IconlyActivity size={14} active={viewMode === 'analytics'} />
                  <span>Analytics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('workflow')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap group ${
                    viewMode === 'workflow'
                      ? 'bg-[#111318] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <IconlyWorkflow size={14} active={viewMode === 'workflow'} />
                  <span>Workflow</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse ml-0.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions & Workflow Guide Pill */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWorkflowGuideOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-extrabold text-amber-900 shadow-2xs transition-all cursor-pointer"
                title="View Sprint Stages & Parallel Concurrency Rules"
              >
                <HelpCircle size={14} className="text-amber-600" />
                <span>Workflow Guide</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  toast.success('Link copied to clipboard!')
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-stone-200/80 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
              >
                <ShareIcon size={14} />
                <span>Share</span>
              </button>

              <button
                onClick={() => toast.success('Tasks sorted by priority')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-stone-200/80 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
              >
                <SortIcon size={14} />
                <span>Priority Sort</span>
              </button>
            </div>
          </div>

          {/* ── Search Input & Metric Banners (Hidden in full-flow workflow view) ── */}
          {viewMode !== 'workflow' && (
            <>
              {/* ── Search Input ── */}
              <div className="relative mb-6 group">
                <IconlySearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-stone-700 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tasks by title, description, track (Frontend, Backend), or priority..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-white rounded-2xl border border-stone-200/80 shadow-2xs outline-none focus:border-stone-400 font-sans"
                />
              </div>

              {/* ── Bento KPI Metric Banners ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                <MetricCard
                  icon={ClipboardIcon}
                  badge={`${totalTasksCount} Total Tasks`}
                  value={String(totalTasksCount)}
                  label="Active Tasks"
                  theme="purple"
                />
                <MetricCard
                  icon={ZapIcon}
                  badge={`${inProgressCount} In Flight`}
                  value={String(inProgressCount)}
                  label="In Progress"
                  theme="amber"
                />
                <MetricCard
                  icon={TargetIcon}
                  badge={`${completionPct}% Completed`}
                  value={`${completionPct}%`}
                  label="Sprint Progress"
                  theme="sky"
                />
                <MetricCard
                  icon={RocketIcon}
                  badge={`${activeParallelStreamsCount} Active Streams`}
                  value={`${parallelTasksCount} Parallel`}
                  label="Concurrency Streams"
                  theme="lime"
                />
              </div>
            </>
          )}

          {/* Loading Indicator */}
          {tasksLoading ? (
            <div className="my-16 flex flex-col items-center justify-center gap-4">
              <StripedLoader color="green" size="lg" label="Fetching workspace tasks..." />
            </div>
          ) : allTasks.length === 0 && !searchQuery.trim() ? (
            /* Empty State */
            <div className="my-16 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                <InboxIcon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1 font-urbanist">No tasks in this workspace</h3>
              <p className="text-xs text-stone-500 mb-6 max-w-xs">
                Get started by creating your first deliverable for {activeOrg?.name || 'your workspace'}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTargetColId('TODO')
                  setTargetTrackId(null)
                  setCreateModalOpen(true)
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <IconlyPlus size={14} className="text-stone-400 group-hover:text-stone-800 transition-colors" />
                <span>Create First Task</span>
              </button>
            </div>
          ) : (
            <>
              {/* ══════════════════════════════════════════════════════════ */}
              {/* VIEW 1: KANBAN BOARD                                      */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'board' && (
                <>
                  {/* ── Parallel Concurrency HUD & Layout Bar ── */}
                  <div className="mb-6 p-4 rounded-3xl bg-white border border-stone-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Concurrency Telemetry & Stream Indicators */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-amber-400 text-stone-950 font-bold flex items-center justify-center shadow-xs shrink-0">
                        <ZapIcon size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-stone-900 font-urbanist tracking-tight">
                            Parallel Streams Concurrency Engine
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] text-stone-500 font-medium">Streams:</span>
                          {PARALLEL_TRACKS.map(track => {
                            const count = mappedTasks.filter(t => t.track?.id === track.id).length
                            return (
                              <button
                                key={track.id}
                                type="button"
                                onClick={() => setSelectedTrackFilter(prev => prev === track.id ? 'ALL' : track.id)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                                  selectedTrackFilter === track.id
                                    ? 'bg-stone-900 text-white border-stone-900'
                                    : `${track.bg} ${track.text} ${track.border} hover:opacity-80`
                                }`}
                                title={`Filter by ${track.name}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${selectedTrackFilter === track.id ? 'bg-amber-400' : track.dot}`} />
                                <span>{track.shortName}</span>
                                <span className="opacity-70 font-mono">({count})</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Board Layout Switcher (Canonical Columns vs Parallel Swimlanes) */}
                    <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
                      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200/70">
                        <button
                          type="button"
                          onClick={() => setBoardLayout('columns')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            boardLayout === 'columns'
                              ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/70'
                              : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          <KanbanBoardIcon size={13} />
                          <span>Columns</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBoardLayout('parallel_tracks')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            boardLayout === 'parallel_tracks'
                              ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/70'
                              : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          <LayersIcon size={13} />
                          <span>Parallel Swimlanes</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        </button>
                      </div>

                      {selectedTrackFilter !== 'ALL' && (
                        <button
                          type="button"
                          onClick={() => setSelectedTrackFilter('ALL')}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                          title="Clear stream filter"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ══════════════════════════════════════════════════════════ */}
                  {/* SUB-VIEW A: CANONICAL 4 COLUMNS                            */}
                  {/* ══════════════════════════════════════════════════════════ */}
                  {boardLayout === 'columns' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start mb-12">
                      {columns.map(col => {
                        const isDragOver = dragOverColId === col.id
                        const filteredTasks = col.tasks.filter(filterTask)

                        return (
                          <div
                            key={col.id}
                            onDragOver={(e) => handleDragOver(e, col.id)}
                            onDragLeave={(e) => handleDragLeave(e, col.id)}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className={`flex flex-col gap-3.5 p-2 rounded-3xl transition-all duration-200 ${
                              isDragOver ? 'drag-over-column' : 'bg-transparent'
                            }`}
                          >
                            {/* Column Header Pill */}
                            <div className="flex items-center justify-between px-2.5 mb-1">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[14px] font-extrabold tracking-tight text-stone-900 font-urbanist">
                                    {col.title}
                                  </span>
                                  <span className="tnum rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-stone-500 border border-stone-200/60 shadow-2xs">
                                    {filteredTasks.length}
                                  </span>
                                </div>
                                <span className="text-[10.5px] font-medium text-stone-400 block mt-0.5">
                                  {col.desc}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  setTargetColId(col.id)
                                  setTargetTrackId(selectedTrackFilter !== 'ALL' ? selectedTrackFilter : null)
                                  setCreateModalOpen(true)
                                }}
                                className="p-1.5 rounded-xl hover:bg-stone-200/70 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                                title={`Add task in ${col.title}`}
                              >
                                <PlusIcon size={14} strokeWidth={2.5} />
                              </button>
                            </div>

                            {/* Tasks Container */}
                            <div className="space-y-3.5 min-h-[220px]">
                              {isDragOver && (
                                <div className="p-4 rounded-2xl border-2 border-dashed border-lime-500/60 bg-lime-400/10 text-center text-xs font-mono font-bold text-lime-900 transition-all flex items-center justify-center gap-2 animate-in fade-in duration-150">
                                  <span>Drop to move to {col.title}</span>
                                  <span className="text-lime-600 font-bold">↓</span>
                                </div>
                              )}

                              {filteredTasks.map(task => (
                                <KanbanTaskCard
                                  key={task.id}
                                  task={task}
                                  columnId={col.id}
                                  onOpen={setSelectedTask}
                                  onMove={handleMoveTask}
                                  isBeingDragged={draggedTask?.task_id === task.task_id}
                                  onDragStart={(e) => handleDragStart(e, task, col.id)}
                                  onDragEnd={handleDragEnd}
                                />
                              ))}

                              {/* Quick Add Card Placeholder */}
                              <button
                                onClick={() => {
                                  setTargetColId(col.id)
                                  setTargetTrackId(selectedTrackFilter !== 'ALL' ? selectedTrackFilter : null)
                                  setCreateModalOpen(true)
                                }}
                                className="w-full py-3 rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-400 text-stone-400 hover:text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <IconlyPlus size={14} className="text-stone-400 group-hover:text-stone-700 transition-colors" />
                                <span>Add Task in {col.title}</span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════════ */}
                  {/* SUB-VIEW B: PARALLEL TRACKS SWIMLANES                     */}
                  {/* ══════════════════════════════════════════════════════════ */}
                  {boardLayout === 'parallel_tracks' && (
                    <div className="space-y-6 mb-12">
                      {parallelTrackGroups
                        .filter(group => selectedTrackFilter === 'ALL' || group.track.id === selectedTrackFilter)
                        .map(group => {
                          const track = group.track
                          const trackTasks = group.tasks
                          const trackTotal = trackTasks.length
                          const trackDone = trackTasks.filter(t => t.status === 'DONE').length
                          const trackPct = trackTotal > 0 ? Math.round((trackDone / trackTotal) * 100) : 0

                          return (
                            <div
                              key={track.id}
                              className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden"
                            >
                              {/* Swimlane Header */}
                              <div className={`px-6 py-4 border-b border-stone-100 ${track.bg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs shrink-0"
                                    style={{ backgroundColor: track.accent }}
                                  >
                                    {track.code}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-sm font-extrabold text-stone-900 font-urbanist">
                                        {track.name}
                                      </h3>
                                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700">
                                        {trackTasks.length} tasks
                                      </span>
                                    </div>
                                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                                      {track.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Progress & Add Button */}
                                <div className="flex items-center gap-4 self-start md:self-auto">
                                  <div className="flex flex-col items-end min-w-[120px]">
                                    <span className="text-[11px] font-bold text-stone-600 font-mono">
                                      {trackDone}/{trackTotal} Completed ({trackPct}%)
                                    </span>
                                    <div className="w-28 bg-white/80 h-2 rounded-full overflow-hidden mt-1 border border-stone-200">
                                      <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{ width: `${trackPct}%`, backgroundColor: track.accent }}
                                      />
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTargetColId('TODO')
                                      setTargetTrackId(track.id)
                                      setCreateModalOpen(true)
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                                  >
                                    <PlusIcon size={12} />
                                    <span>Add Task</span>
                                  </button>
                                </div>
                              </div>

                              {/* Swimlane 4-Columns Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-stone-50/40">
                                {COLUMNS_CONFIG.map(col => {
                                  const colTasksInTrack = trackTasks
                                    .filter(t => t.status === col.id)
                                    .filter(filterTask)
                                  const isDragOver = dragOverColId === `${track.id}-${col.id}`

                                  return (
                                    <div
                                      key={col.id}
                                      onDragOver={(e) => handleDragOver(e, `${track.id}-${col.id}`)}
                                      onDragLeave={(e) => handleDragLeave(e, `${track.id}-${col.id}`)}
                                      onDrop={(e) => handleDrop(e, col.id)}
                                      className={`flex flex-col gap-3 p-3 rounded-2xl transition-all ${
                                        isDragOver ? 'bg-lime-50 border-2 border-dashed border-lime-400' : 'bg-white/80 border border-stone-200/70'
                                      }`}
                                    >
                                      {/* Sub-column Header */}
                                      <div className="flex items-center justify-between px-1">
                                        <span className="text-xs font-bold text-stone-700 font-urbanist">
                                          {col.title}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                                          {colTasksInTrack.length}
                                        </span>
                                      </div>

                                      {/* Task Cards in this swimlane column */}
                                      <div className="space-y-3 min-h-[140px]">
                                        {colTasksInTrack.map(task => (
                                          <KanbanTaskCard
                                            key={task.id}
                                            task={task}
                                            columnId={col.id}
                                            onOpen={setSelectedTask}
                                            onMove={handleMoveTask}
                                            isBeingDragged={draggedTask?.task_id === task.task_id}
                                            onDragStart={(e) => handleDragStart(e, task, col.id)}
                                            onDragEnd={handleDragEnd}
                                          />
                                        ))}

                                        {colTasksInTrack.length === 0 && (
                                          <div className="h-28 rounded-2xl border border-dashed border-stone-200 flex flex-col items-center justify-center text-center p-3 text-stone-400">
                                            <span className="text-[11px] font-medium">No tasks in {col.title}</span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setTargetColId(col.id)
                                                setTargetTrackId(track.id)
                                                setCreateModalOpen(true)
                                              }}
                                              className="mt-1.5 text-[10.5px] font-bold text-stone-700 hover:text-stone-900 hover:underline cursor-pointer inline-flex items-center gap-1"
                                            >
                                              <PlusIcon size={10} />
                                              <span>Add</span>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* VIEW 2: LIST VIEW                                         */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'list' && (
                <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-6 mb-12">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-normal text-stone-950 font-serif">
                        Task <em className="italic font-serif font-normal">Inventory</em> List
                      </h2>
                      <span className="text-xs font-bold text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                        {allTasks.length} total
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setTargetColId('TODO')
                        setTargetTrackId(null)
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
                          <th className="pb-3">Stream</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Priority</th>
                          <th className="pb-3">Assignee</th>
                          <th className="pb-3">Due Date</th>
                          <th className="pb-3 pr-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {allTasks
                          .filter(filterTask)
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
                                    <div className="font-bold text-stone-900 group-hover:text-violet-700 text-xs flex items-center gap-1.5">
                                      <span>{t.title}</span>
                                      {t.isParallel && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 inline-flex items-center gap-0.5">
                                          <ZapIcon size={9} className="text-amber-700 fill-amber-700" />
                                          <span>Parallel</span>
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-stone-400 line-clamp-1 max-w-md">
                                      {t.description}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5">
                                {t.track && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.track.bg} ${t.track.text} ${t.track.border} font-mono`}>
                                    {t.track.shortName}
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5">
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                                  {t.columnTitle}
                                </span>
                              </td>

                              <td className="py-3.5">
                                <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${
                                  t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                                  t.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                                  t.priority === 'MEDIUM' ? 'bg-indigo-100 text-indigo-700' :
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

                              <td className="py-3.5 text-stone-500 font-mono text-[11px]">
                                {t.due}
                              </td>

                              <td className="py-3.5 pr-3 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedTask(t)
                                  }}
                                  className="text-stone-400 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
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
              {/* VIEW 3: TIMELINE VIEW                                     */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'timeline' && (
                <TimelineView tasks={allTasks.filter(filterTask)} onOpenTask={setSelectedTask} />
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* VIEW 4: ANALYTICS VIEW                                    */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'analytics' && (
                <BoardAnalytics columns={columns} allTasks={allTasks} />
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/* VIEW 5: WORKFLOW PIPELINE VIEW                            */}
              {/* ══════════════════════════════════════════════════════════ */}
              {viewMode === 'workflow' && (
                <SprintWorkflowCanvas
                  columns={columns}
                  allTasks={allTasks}
                  activeOrg={activeOrg}
                  members={members}
                  onSelectTask={setSelectedTask}
                  onOpenNewTask={(colId = 'TODO') => {
                    setTargetColId(typeof colId === 'string' ? colId : 'TODO')
                    setTargetTrackId(null)
                    setCreateModalOpen(true)
                  }}
                  onBackToBoard={() => setViewMode('board')}
                />
              )}
            </>
          )}

        </main>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createModalOpen}
        defaultColumnId={targetColId}
        defaultTrackId={targetTrackId}
        onClose={() => setCreateModalOpen(false)}
        onAdd={() => {
          refreshTasks()
          setCreateModalOpen(false)
        }}
        members={members}
        organizationId={activeOrgId}
      />

      {/* Task Inspection Modal */}
      {selectedTask && (
        <TaskDetailDrawer
          key={selectedTask.task_id || selectedTask.id}
          task={selectedTask}
          open={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          members={members}
        />
      )}

      {/* Sprint Workflow & Concurrency Guide Modal */}
      <WorkflowGuideModal
        open={workflowGuideOpen}
        onClose={() => setWorkflowGuideOpen(false)}
      />
    </ProtectedRoute>
  )
}
