"use client"

import React, { useState } from 'react'
import { PlusIcon, ClockIcon, CheckIcon, TagIcon, UsersIcon } from './Icons'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { addTask } from '@/Service/taskService'
import { toast } from 'react-hot-toast'
import StripedLoader from './StripedLoader'

const ASSIGNEES = [
  { initials: 'AJ', name: 'Alex Johnson', color: '#8b5cf6' },
  { initials: 'KV', name: 'Kacie Velasquez', color: '#f43f5e' },
  { initials: 'SC', name: 'Sarah Chen', color: '#6366f1' },
  { initials: 'MW', name: 'Marcus Webb', color: '#10b981' },
  { initials: 'PN', name: 'Priya Nair', color: '#f59e0b' },
  { initials: 'KO', name: 'Kai Okafor', color: '#ef4444' },
  { initials: 'JL', name: 'Jordan Lee', color: '#0ea5e9' },
]

const ALL_TAGS = ['Design', 'Internal Tasks', 'Commercial', 'Dev', 'Auth', 'Backend', 'Payments', 'Mobile', 'Testing']

const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'inprogress', title: 'In progress' },
  { id: 'review', title: 'Under review' },
  { id: 'ready', title: 'Ready' },
]

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const PRIORITY_STYLES = {
  Critical: { bg: 'bg-rose-50 border-rose-200 text-rose-700', active: 'bg-rose-500 text-white' },
  High:     { bg: 'bg-amber-50 border-amber-200 text-amber-800', active: 'bg-amber-500 text-white' },
  Medium:   { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', active: 'bg-indigo-600 text-white' },
  Low:      { bg: 'bg-stone-100 border-stone-200 text-stone-700', active: 'bg-stone-700 text-white' },
}

const generateId = () => `task-${Date.now()}`
const generateTaskId = () => `MRD-0${Math.floor(Math.random() * 80) + 20}`

export default function CreateTaskModal({ open, defaultColumnId = 'todo', onClose, onAdd }) {
  const { fullName, initials } = useCurrentUser()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [columnId, setColumnId] = useState(defaultColumnId)
  const [assigneeIdx, setAssigneeIdx] = useState(0)
  const [due, setDue] = useState('25 Sep')
  const [tags, setTags] = useState(['Design', 'Internal Tasks'])
  const [titleErr, setTitleErr] = useState(false)
  const [loading, setLoading] = useState(false)

  const dynamicAssignees = ASSIGNEES.map((a, i) =>
    i === 0
      ? {
          ...a,
          name: fullName ? `${fullName} (You)` : a.name,
          initials: initials || a.initials,
        }
      : a
  )

  const handleAdd = async () => {
    if (!title.trim()) {
      setTitleErr(true)
      return
    }

    const a = dynamicAssignees[assigneeIdx]
    setLoading(true)
    let backendResult = null

    try {
      backendResult = await addTask({
        title: title.trim(),
        description: description.trim() || 'Prepare and review deliverables for sprint milestones.',
        status: columnId,
        priority,
        due_date: due || '25 Sep',
        assigned_to: a.name || 'Team Member'
      })
      if (backendResult?.success) {
        toast.success(backendResult.message || 'Task saved to workspace!')
      }
    } catch (err) {
      console.warn('Backend task sync notice:', err?.message)
    } finally {
      setLoading(false)
    }

    const dbId = backendResult?.result?.insertId
    const task = {
      id: dbId ? `task-${dbId}` : generateId(),
      taskId: dbId ? `MRD-${String(dbId).padStart(3, '0')}` : generateTaskId(),
      title: title.trim(),
      description: description.trim() || 'Prepare and review deliverables for sprint milestones.',
      priority,
      status: columnId,
      tags,
      assignee: a.initials,
      assigneeName: a.name,
      assigneeColor: a.color,
      due: due || '25 Sep',
      subtasks: [
        { text: 'Initial design review', done: false },
        { text: 'Figma prototype sync', done: false }
      ]
    }

    onAdd?.(task, columnId)

    // Reset
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setAssigneeIdx(0)
    setTags(['Design', 'Internal Tasks'])
    setTitleErr(false)
    onClose?.()
  }

  if (!open) return null

  const toggleTag = (t) => {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF8F5] p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111318] text-white flex items-center justify-center shadow-xs">
              <PlusIcon size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold tracking-tight text-stone-900 leading-none">
                New <span className="font-serif-italic font-normal text-violet-700">task</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-medium">Add deliverables to your workspace kanban</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Task Title *</label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Fitness App UI Concept"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                if (titleErr) setTitleErr(false)
              }}
              className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-2xl bg-white border outline-none font-sans transition-all ${
                titleErr
                  ? 'border-rose-400 ring-2 ring-rose-200'
                  : 'border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
              }`}
            />
            {titleErr && <span className="text-[10px] text-rose-500 font-semibold mt-1 block">Title is required</span>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Describe requirements, acceptance criteria..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-white border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 outline-none font-sans resize-none"
            />
          </div>

          {/* Priority & Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Priority</label>
              <div className="flex flex-wrap gap-1.5">
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                      priority === p
                        ? PRIORITY_STYLES[p].active
                        : PRIORITY_STYLES[p].bg
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Status Column</label>
              <select
                value={columnId}
                onChange={e => setColumnId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none cursor-pointer"
              >
                {COLUMNS.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Assignee</label>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {dynamicAssignees.map((a, i) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => setAssigneeIdx(i)}
                    className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center text-white transition-transform cursor-pointer ${
                      assigneeIdx === i ? 'ring-2 ring-stone-900 ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: a.color }}
                    title={a.name}
                  >
                    {a.initials}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Due Date</label>
              <input
                type="text"
                value={due}
                onChange={e => setDue(e.target.value)}
                placeholder="e.g. 25 Sep"
                className="w-full px-3 py-2 text-xs font-medium rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map(t => {
                const selected = tags.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#111318] text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-3 animate-in fade-in duration-200">
            <StripedLoader color="green" size="md" label="Syncing task with workspace..." />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-stone-200/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading}
            className="px-5 py-2 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <PlusIcon size={14} strokeWidth={2.5} />
            <span>{loading ? 'Creating...' : 'Create Task'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}