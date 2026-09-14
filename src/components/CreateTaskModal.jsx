"use client"

import React, { useState, useEffect } from 'react'
import { PlusIcon } from './Icons'
import { useOrg } from '@/context/OrgContext'
import { addTask } from '@/Service/taskService'
import { handleOrganizationUsers } from '@/Service/organization'
import { toast } from 'react-hot-toast'
import StripedLoader from './StripedLoader'

const COLUMNS = [
  { id: 'TODO', title: 'To do' },
  { id: 'IN_PROGRESS', title: 'In progress' },
  { id: 'REVIEW', title: 'Under review' },
  { id: 'DONE', title: 'Done' },
]

const PRIORITIES = [
  { id: 'CRITICAL', label: 'Critical' },
  { id: 'HIGH', label: 'High' },
  { id: 'MEDIUM', label: 'Medium' },
  { id: 'LOW', label: 'Low' },
]

const PRIORITY_STYLES = {
  CRITICAL: { bg: 'bg-rose-50 border-rose-200 text-rose-700', active: 'bg-rose-500 text-white' },
  HIGH:     { bg: 'bg-amber-50 border-amber-200 text-amber-800', active: 'bg-amber-500 text-white' },
  MEDIUM:   { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', active: 'bg-indigo-600 text-white' },
  LOW:      { bg: 'bg-stone-100 border-stone-200 text-stone-700', active: 'bg-stone-700 text-white' },
}

const TIME_UNITS = [
  { id: 'HOURS', label: 'Hours' },
  { id: 'DAYS', label: 'Days' },
  { id: 'MINUTES', label: 'Minutes' },
]

const AVATAR_COLORS = [
  '#8b5cf6', '#f43f5e', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899', '#14b8a6'
]

export const getMemberColor = (id) => {
  if (!id) return AVATAR_COLORS[0]
  const num = typeof id === 'number' ? id : String(id).charCodeAt(0) || 0
  return AVATAR_COLORS[Math.abs(num) % AVATAR_COLORS.length]
}

export const getMemberInitials = (member) => {
  if (!member) return 'U'
  const first = member.first_name?.[0] || ''
  const last = member.last_name?.[0] || ''
  if (first || last) return `${first}${last}`.toUpperCase()
  return (member.email?.[0] || 'U').toUpperCase()
}

export const getMemberFullName = (member) => {
  if (!member) return 'Unknown Member'
  const name = `${member.first_name || ''} ${member.last_name || ''}`.trim()
  return name || member.email || 'Member'
}

export default function CreateTaskModal({
  open,
  defaultColumnId = 'TODO',
  onClose,
  onAdd,
  members: propMembers = [],
  organizationId: propOrgId
}) {
  const { activeOrg, activeOrgId } = useOrg()
  const currentOrgId = propOrgId || activeOrgId || activeOrg?.id

  const [members, setMembers] = useState(propMembers)
  const [membersLoading, setMembersLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [columnId, setColumnId] = useState(defaultColumnId)
  const [assigneeId, setAssigneeId] = useState('')
  
  // Format today + 3 days as default due date YYYY-MM-DD
  const getDefaultDueDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  }

  const [due, setDue] = useState(getDefaultDueDate())
  const [estimateValue, setEstimateValue] = useState(2)
  const [estimateUnit, setEstimateUnit] = useState('HOURS')
  const [titleErr, setTitleErr] = useState(false)
  const [loading, setLoading] = useState(false)

  // Sync default column when opened
  useEffect(() => {
    if (open) {
      const normalized = (defaultColumnId || 'TODO').toUpperCase()
      const valid = COLUMNS.some(c => c.id === normalized) ? normalized : 'TODO'
      setColumnId(valid)
      setTitleErr(false)
    }
  }, [open, defaultColumnId])

  // Sync members from props or fetch if missing
  useEffect(() => {
    if (propMembers && propMembers.length > 0) {
      setMembers(propMembers)
      if (!assigneeId) {
        setAssigneeId(propMembers[0].id)
      }
    } else if (open && currentOrgId) {
      let isMounted = true
      setMembersLoading(true)
      handleOrganizationUsers(currentOrgId)
        .then(res => {
          if (isMounted && res?.success && Array.isArray(res.members)) {
            setMembers(res.members)
            if (res.members.length > 0) {
              setAssigneeId(prev => prev || res.members[0].id)
            }
          }
        })
        .catch(err => {
          console.error("Failed to load members for task assignment:", err)
        })
        .finally(() => {
          if (isMounted) setMembersLoading(false)
        })

      return () => {
        isMounted = false
      }
    }
  }, [open, propMembers, currentOrgId])

  // If members change and assigneeId is not in list, default to first member
  useEffect(() => {
    if (members.length > 0) {
      const exists = members.some(m => String(m.id) === String(assigneeId))
      if (!exists) {
        setAssigneeId(members[0].id)
      }
    }
  }, [members, assigneeId])

  const handleAdd = async () => {
    if (!title.trim()) {
      setTitleErr(true)
      return
    }

    if (!currentOrgId) {
      toast.error('No organization selected. Please select a workspace first.')
      return
    }

    if (!assigneeId) {
      toast.error('Please select an assignee from the organization.')
      return
    }

    if (!due) {
      toast.error('Please specify a due date.')
      return
    }

    if (!estimateValue || Number(estimateValue) <= 0) {
      toast.error('Please enter a valid estimated time value.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || 'Deliverable for workspace sprint milestone.',
        status: columnId,
        priority: priority,
        due_date: due,
        estimate_time_value: Number(estimateValue),
        estimate_time_unit: estimateUnit,
        assign_to: Number(assigneeId),
        organization_id: Number(currentOrgId)
      }

      const result = await addTask(payload)

      if (result && result.success !== false) {
        toast.success(result.message || 'Task created successfully!')
        
        // Reset form
        setTitle('')
        setDescription('')
        setPriority('MEDIUM')
        setDue(getDefaultDueDate())
        setEstimateValue(2)
        setEstimateUnit('HOURS')
        setTitleErr(false)

        onAdd?.(result, columnId)
        onClose?.()
      } else {
        toast.error(result?.message || 'Failed to create task')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={loading ? undefined : onClose}
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF8F5] p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
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
            disabled={loading}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors disabled:opacity-50"
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
              placeholder="e.g. Implement OAuth2 Authentication"
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
              placeholder="Describe requirements, deliverables, acceptance criteria..."
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
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                      priority === p.id
                        ? PRIORITY_STYLES[p.id].active
                        : PRIORITY_STYLES[p.id].bg
                    }`}
                  >
                    {p.label}
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

          {/* Estimated Time (Value & Unit) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Estimated Time *</label>
              <input
                type="number"
                min="1"
                step="1"
                value={estimateValue}
                onChange={e => setEstimateValue(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs font-medium rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Time Unit</label>
              <select
                value={estimateUnit}
                onChange={e => setEstimateUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none cursor-pointer"
              >
                {TIME_UNITS.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Assignee *</label>
              {membersLoading ? (
                <div className="text-xs text-stone-400 py-2">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  No members found in this workspace. Invite members first.
                </div>
              ) : (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {members.map(m => {
                    const isSelected = String(assigneeId) === String(m.id)
                    const color = getMemberColor(m.id)
                    const initials = getMemberInitials(m)
                    const name = getMemberFullName(m)

                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setAssigneeId(m.id)}
                        className={`w-7 h-7 shrink-0 rounded-full text-[10px] font-bold flex items-center justify-center text-white transition-transform cursor-pointer ${
                          isSelected ? 'ring-2 ring-stone-900 ring-offset-2 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                        title={`${name} (${m.role || 'Member'})`}
                      >
                        {initials}
                      </button>
                    )
                  })}
                </div>
              )}
              {members.length > 0 && (
                <div className="mt-1 text-[10.5px] font-medium text-stone-500 truncate">
                  Selected: {getMemberFullName(members.find(m => String(m.id) === String(assigneeId)))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Due Date *</label>
              <input
                type="date"
                value={due}
                onChange={e => setDue(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-2xl bg-white border border-stone-200 focus:border-stone-400 outline-none"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-4 animate-in fade-in duration-200">
            <StripedLoader color="green" size="md" label="Creating task in workspace..." />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-stone-200/80">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-200/60 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading || members.length === 0}
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