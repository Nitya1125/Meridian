"use client"

import React, { useState, useEffect } from 'react'
import {
  CheckIcon, ClockIcon, UsersIcon, TagIcon, PlusIcon,
  SmileIcon, AttachIcon, SendIcon, TrashIcon, AlertIcon,
  ShareIcon, CheckCircleIcon, TargetIcon, ZapIcon, SparklesIcon,
  ThumbsUpIcon, HeartIcon, RocketIcon, BulbIcon, FlameIcon, CopyIcon
} from './Icons'
import { AlarmClock, MoonStar, Play, Pause, Clock } from 'lucide-react'
import { PASTEL, taskHealth } from '@/Lib/meridianTheme'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { getMemberColor, getMemberInitials, getMemberFullName } from './CreateTaskModal'

const ALL_STATUSES = [
  { id: 'TODO', label: 'To do', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  { id: 'IN_PROGRESS', label: 'In progress', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'REVIEW', label: 'Under review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'DONE', label: 'Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
]

const ALL_PRIORITIES = [
  { id: 'CRITICAL', label: 'Critical', active: 'bg-rose-500 text-white', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'HIGH', label: 'High', active: 'bg-amber-500 text-white', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'MEDIUM', label: 'Medium', active: 'bg-indigo-600 text-white', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'LOW', label: 'Low', active: 'bg-stone-700 text-white', badge: 'bg-stone-100 text-stone-700 border-stone-200' }
]

const REACTION_CONFIG = [
  { id: 'thumbsUp', label: 'Agree', Icon: ThumbsUpIcon, color: 'text-sky-600' },
  { id: 'heart', label: 'Love', Icon: HeartIcon, color: 'text-rose-500' },
  { id: 'rocket', label: 'Launch', Icon: RocketIcon, color: 'text-violet-600' },
  { id: 'bulb', label: 'Idea', Icon: BulbIcon, color: 'text-amber-500' },
  { id: 'flame', label: 'Trending', Icon: FlameIcon, color: 'text-orange-500' }
]

const toDateInputString = (dateVal) => {
  if (!dateVal) return ''
  try {
    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return dateVal
    return d.toISOString().split('T')[0]
  } catch {
    return dateVal
  }
}

export default function TaskDetailDrawer({ task, open, onClose, onUpdateTask, onDeleteTask, members = [] }) {
  const { fullName, initials } = useCurrentUser()
  const taskId = task?.task_id || task?.id

  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState(task?.status || 'TODO')
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM')
  const [due, setDue] = useState(toDateInputString(task?.due_date || task?.due))
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [newSubtask, setNewSubtask] = useState('')
  const [tags, setTags] = useState(task?.tags || ['Design', 'Frontend'])
  const [newTagInput, setNewTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  
  const [showAssigneePicker, setShowAssigneePicker] = useState(false)
  const [timing, setTiming] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Sync state with task prop
  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setStatus(task.status || 'TODO')
      setPriority(task.priority || 'MEDIUM')
      setDue(toDateInputString(task.due_date || task.due))
      setSubtasks(task.subtasks || [])
      setTags(task.tags || ['Design', 'Frontend'])
      setShowDeleteConfirm(false)
    }
  }, [task])

  useEffect(() => {
    if (!timing) return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [timing])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false)
        } else {
          onClose?.()
        }
      }
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose, showDeleteConfirm])

  if (!open || !task) return null

  // Find assigned member
  const currentAssignedId = task.assigned_to
  const assignedMember = members.find(m => String(m.id) === String(currentAssignedId))

  const handleTitleBlur = async () => {
    const trimmed = title.trim()
    if (trimmed && trimmed !== task.title) {
      await onUpdateTask?.({
        task_id: taskId,
        title: trimmed
      })
    }
  }

  const handleDescriptionBlur = async () => {
    const trimmed = description.trim()
    if (trimmed !== (task.description || '')) {
      await onUpdateTask?.({
        task_id: taskId,
        description: trimmed
      })
    }
  }

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus)
    await onUpdateTask?.({
      task_id: taskId,
      status: newStatus
    })
  }

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority)
    await onUpdateTask?.({
      task_id: taskId,
      priority: newPriority
    })
  }

  const handleDueDateChange = async (e) => {
    const newDueDate = e.target.value
    setDue(newDueDate)
    if (newDueDate) {
      await onUpdateTask?.({
        task_id: taskId,
        due_date: newDueDate
      })
    }
  }

  const handleAssigneeSelect = async (memberId) => {
    setShowAssigneePicker(false)
    await onUpdateTask?.({
      task_id: taskId,
      assign_to: Number(memberId)
    })
  }

  const toggleSubtask = (idx) => {
    const updated = [...subtasks]
    updated[idx].done = !updated[idx].done
    setSubtasks(updated)
    toast.success(updated[idx].done ? 'Subtask marked done' : 'Subtask marked pending')
  }

  const deleteSubtask = (idx, e) => {
    e.stopPropagation()
    const updated = subtasks.filter((_, i) => i !== idx)
    setSubtasks(updated)
    toast.success('Subtask removed')
  }

  const addSubtask = (e) => {
    e.preventDefault()
    if (!newSubtask.trim()) return
    const updated = [...subtasks, { text: newSubtask.trim(), done: false }]
    setSubtasks(updated)
    setNewSubtask('')
    toast.success('Subtask added')
  }

  const removeTag = (tagToRemove) => {
    const updated = tags.filter(t => t !== tagToRemove)
    setTags(updated)
  }

  const addTag = (e) => {
    e.preventDefault()
    if (!newTagInput.trim() || tags.includes(newTagInput.trim())) return
    const updated = [...tags, newTagInput.trim()]
    setTags(updated)
    setNewTagInput('')
    setShowTagInput(false)
    toast.success('Tag added')
  }

  const handleSendComment = (e) => {
    e.preventDefault()
    if (!commentInput.trim()) return
    const newComment = {
      id: `c_${Date.now()}`,
      author: fullName ? `${fullName} (You)` : 'You',
      initials: initials || 'ME',
      color: '#111318',
      time: 'Just now',
      text: commentInput.trim(),
      reactions: {}
    }
    setComments(prev => [newComment, ...prev])
    setCommentInput('')
    toast.success('Comment posted')
  }

  const toggleReaction = (commentId, reactionKey) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const reactions = { ...(c.reactions || {}) }
        reactions[reactionKey] = (reactions[reactionKey] || 0) + 1
        return { ...c, reactions }
      }
      return c
    }))
  }

  const copyTaskId = () => {
    navigator.clipboard?.writeText(task.taskId || `TSK-${taskId}`)
    toast.success('Task ID copied to clipboard!')
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const ok = await onDeleteTask?.(taskId)
      if (ok) {
        onClose?.()
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const health = taskHealth(task)
  const completedCount = subtasks.filter(s => s.done).length
  const totalCount = subtasks.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const isAllCompleted = totalCount > 0 && completedCount === totalCount

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Centered Modal Window */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] rounded-[32px] border border-stone-200/90 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200 z-10 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header Navigation Bar ── */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200/80 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Breadcrumb Info */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-400">
              <span>Meridian</span>
              <span>/</span>
              <span className="text-stone-600">Tasks</span>
            </div>

            {/* Task ID chip with CopyIcon */}
            <button
              onClick={copyTaskId}
              className="font-mono text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Click to copy Task ID"
            >
              <span>{task.taskId || `TSK-${taskId}`}</span>
              <CopyIcon size={12} className="text-stone-400" />
            </button>

            {/* Quick Status Pill */}
            <div className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${ALL_STATUSES.find(s => s.id === status)?.color || 'bg-stone-100 text-stone-700'}`}>
              {ALL_STATUSES.find(s => s.id === status)?.label || status}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
                toast.success('Task link copied to clipboard!')
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Share task"
            >
              <ShareIcon size={15} />
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete task"
            >
              <TrashIcon size={15} />
            </button>

            {/* ESC badge */}
            <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold text-stone-400 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-lg select-none">
              ESC
            </kbd>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert Banner */}
        {showDeleteConfirm && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-center justify-between text-xs text-rose-900 animate-in slide-in-from-top duration-150 shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <AlertIcon size={15} className="text-rose-600 shrink-0" />
              <span>Are you sure you want to delete this task? This cannot be undone.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-3 py-1 rounded-xl bg-white border border-stone-200 font-bold hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3.5 py-1 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}

        {/* ── Modal Body (2-Column Grid) ── */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Editorial Content (8 cols) ── */}
            <div className="lg:col-span-8 space-y-6">

              {/* Health Alert Banner if overdue or stale */}
              {(health.kind === 'overdue' || health.stale) && (
                <div
                  className="flex items-center gap-2.5 rounded-2xl px-4 py-3 border animate-in fade-in duration-200"
                  style={{
                    background: health.kind === 'overdue' ? PASTEL.rose.bg : PASTEL.gold.bg,
                    borderColor: health.kind === 'overdue' ? PASTEL.rose.border : PASTEL.gold.border,
                  }}
                >
                  {health.kind === 'overdue' ? (
                    <AlarmClock className="beacon h-5 w-5 shrink-0 rounded-full" style={{ color: PASTEL.rose.text }} strokeWidth={2.2} />
                  ) : (
                    <MoonStar className="h-5 w-5 shrink-0" style={{ color: PASTEL.gold.text }} strokeWidth={2.2} />
                  )}
                  <p className="text-[12.5px] font-bold" style={{ color: health.kind === 'overdue' ? PASTEL.rose.text : PASTEL.gold.text }}>
                    {health.kind === 'overdue'
                      ? `This task is ${health.daysOverdue} day${health.daysOverdue > 1 ? 's' : ''} overdue.`
                      : `No update in ${health.daysSinceUpdate} days — is this still moving?`}
                  </p>
                </div>
              )}
              
              {/* Inline Editable Title */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Task Title (Click to edit, blur to save)
                </label>
                <textarea
                  rows={2}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  placeholder="Enter task title..."
                  className="w-full text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-snug bg-transparent border-b border-transparent focus:border-stone-300 focus:bg-white/60 rounded-xl px-2 py-1 -ml-2 transition-all outline-none resize-none font-sans"
                />
              </div>

              {/* Inline Editable Description */}
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="Add detailed description, context, or requirements..."
                  className="w-full text-xs sm:text-sm text-stone-700 leading-relaxed bg-white/70 hover:bg-white focus:bg-white border border-stone-200/80 focus:border-stone-400 rounded-2xl p-4 transition-all outline-none resize-none font-sans"
                />
              </div>

              {/* ── Subtasks Checklist Section ── */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">Subtasks</span>
                    <span className="tnum text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {completedCount}/{totalCount}
                    </span>
                  </div>

                  <span className={`tnum text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isAllCompleted ? 'bg-lime-100 text-lime-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {progressPct}% Completed
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isAllCompleted ? 'bg-lime-500' : 'striped-bar-green striped-anim'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Subtask Items */}
                <div className="space-y-2 mb-3.5">
                  {subtasks.map((st, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleSubtask(idx)}
                      className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        st.done
                          ? 'bg-lime-50/50 border-lime-200/80 text-stone-400'
                          : 'bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] border-stone-200/70 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 select-none">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            st.done ? 'bg-lime-500 border-lime-600 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {st.done && <CheckIcon size={11} strokeWidth={3} />}
                        </div>
                        <span className={`text-xs font-medium ${st.done ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {st.text}
                        </span>
                      </div>

                      <button
                        onClick={(e) => deleteSubtask(idx, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                        title="Delete subtask"
                      >
                        <TrashIcon size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Subtask Input */}
                <form onSubmit={addSubtask} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a new deliverable or subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-stone-200/80 focus:outline-none focus:border-stone-400 font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#111318] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <PlusIcon size={13} strokeWidth={2.5} />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* ── Activity & Comments Hub ── */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-stone-900">Activity & Comments</span>
                  <span className="text-xs text-stone-400 font-mono">{comments.length} updates</span>
                </div>

                {/* Comments List */}
                <div className="space-y-3 mb-4">
                  {comments.length === 0 ? (
                    <div className="text-xs text-stone-400 py-3 text-center">No comments yet. Start a discussion below.</div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-2xs"
                              style={{ backgroundColor: c.color }}
                            >
                              {c.initials}
                            </div>
                            <span className="text-xs font-bold text-stone-800">{c.author}</span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">{c.time}</span>
                        </div>

                        <p className="text-xs text-stone-600 pl-7 leading-relaxed mb-2.5">
                          {c.text}
                        </p>

                        <div className="pl-7 flex items-center gap-1.5 flex-wrap">
                          {REACTION_CONFIG.map(({ id, label, Icon, color }) => {
                            const count = c.reactions?.[id] || 0
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => toggleReaction(c.id, id)}
                                title={label}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs border transition-all cursor-pointer select-none ${
                                  count > 0
                                    ? `bg-stone-100 border-stone-300 font-bold ${color}`
                                    : 'bg-white/80 border-stone-200/80 text-stone-400 hover:text-stone-700 hover:border-stone-300'
                                }`}
                              >
                                <Icon size={12} strokeWidth={2} />
                                {count > 0 && <span className="text-[10.5px] font-mono">{count}</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Box */}
                <form onSubmit={handleSendComment} className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded-2xl border border-stone-200/80">
                  <input
                    type="text"
                    placeholder="Write a response or note..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs text-stone-800 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#111318] text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    <SendIcon size={13} />
                  </button>
                </form>
              </div>

            </div>

            {/* ── Right Column: Bento Properties Panel (4 cols) ── */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-5 text-xs">
                
                {/* Live Stopwatch Time Tracker */}
                <div className="flex items-center justify-between rounded-2xl bg-[#111318] p-3.5 text-white shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lime-400">
                      <Clock className={`h-4 w-4 ${timing ? 'beacon rounded-full' : ''}`} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-stone-400">Stopwatch</div>
                      <div className="font-mono text-sm font-bold text-white tracking-wide">{fmt(elapsed)}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTiming((t) => !t)}
                    className="tactile flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border border-white/15 select-none"
                  >
                    {timing ? (
                      <>
                        <Pause className="h-3.5 w-3.5" strokeWidth={2.4} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" strokeWidth={2.4} fill="currentColor" />
                        <span>Start</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 1. Status Selector */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ALL_STATUSES.map((s) => {
                      const active = status === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleStatusChange(s.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            active
                              ? 'bg-[#111318] text-white border-stone-900 shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200/80'
                          }`}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Priority Matrix */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ALL_PRIORITIES.map((p) => {
                      const active = priority === p.id
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePriorityChange(p.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            active
                              ? p.active + ' shadow-xs'
                              : p.badge
                          }`}
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Assignee */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                      Assignee
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAssigneePicker(!showAssigneePicker)}
                      className="text-[10px] font-bold text-violet-700 hover:text-violet-900 cursor-pointer"
                    >
                      {showAssigneePicker ? 'Done' : 'Change'}
                    </button>
                  </div>

                  {/* Current assignee display */}
                  <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex items-center justify-between">
                    {assignedMember ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-2xs"
                          style={{ backgroundColor: getMemberColor(assignedMember.id) }}
                        >
                          {getMemberInitials(assignedMember)}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-800 text-xs">
                            {getMemberFullName(assignedMember)}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {assignedMember.role || 'Member'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-stone-400 text-xs italic">Unassigned</span>
                    )}
                  </div>

                  {/* Assignee Selection List */}
                  {showAssigneePicker && (
                    <div className="mt-2.5 p-2 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-48 overflow-y-auto">
                      <div className="text-[10px] font-bold text-stone-400 px-1 mb-1">Select member:</div>
                      {members.map((m) => {
                        const isAssigned = String(m.id) === String(currentAssignedId)
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleAssigneeSelect(m.id)}
                            className={`flex items-center justify-between p-1.5 rounded-xl cursor-pointer transition-colors ${
                              isAssigned ? 'bg-violet-100/70 text-violet-900' : 'hover:bg-white text-stone-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-2xs"
                                style={{ backgroundColor: getMemberColor(m.id) }}
                              >
                                {getMemberInitials(m)}
                              </div>
                              <span className="text-xs font-medium">{getMemberFullName(m)}</span>
                            </div>
                            {isAssigned && <CheckIcon size={12} className="text-violet-700" strokeWidth={2.5} />}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Due Date */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF8F5] border border-stone-200/70">
                    <ClockIcon size={13} className="text-stone-400" />
                    <input
                      type="date"
                      value={due}
                      onChange={handleDueDateChange}
                      className="bg-transparent text-xs font-semibold text-stone-800 outline-none w-full font-mono cursor-pointer"
                    />
                  </div>
                </div>

                {/* 5. Estimated Time Info */}
                {(task.estimated_time_value || task.estimate_time_value) && (
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Estimated Time
                    </label>
                    <div className="text-xs font-bold text-stone-700 bg-stone-50 border border-stone-200/60 px-3 py-2 rounded-xl">
                      {task.estimated_time_value || task.estimate_time_value} {task.estimated_time_unit || task.estimate_time_unit || 'HOURS'}
                    </div>
                  </div>
                )}

                {/* 6. Tags */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                      Tags
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowTagInput(!showTagInput)}
                      className="text-[10px] font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
                    >
                      + Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100/70 text-violet-800 border border-violet-200/60"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="hover:text-rose-600 transition-colors ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {showTagInput && (
                    <form onSubmit={addTag} className="mt-2 flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="New tag..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-[#FAF8F5] border border-stone-200 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </form>
                  )}
                </div>

                {/* 7. Quick Complete Toggle */}
                <div className="pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus = status === 'DONE' ? 'TODO' : 'DONE'
                      handleStatusChange(nextStatus)
                    }}
                    className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      status === 'DONE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#111318] text-white hover:bg-black shadow-xs'
                    }`}
                  >
                    <CheckCircleIcon size={14} strokeWidth={2.5} />
                    <span>{status === 'DONE' ? 'Completed' : 'Mark as Complete'}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

