"use client"

import React, { useState } from 'react'
import { X, Search } from 'lucide-react'
import { UsersIcon, CheckIcon } from '@/components/Icons'
import { Avatar } from '@/components/ui/Avatar'
import { toast } from 'react-hot-toast'

export default function CreateGroupModal({
  isOpen,
  onClose,
  members = [],
  onCreateGroup,
  currentUserId = null,
  orgName = ''
}) {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [searchMember, setSearchMember] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  // Eligible members from current organization (excluding current user since creator is added automatically)
  const eligibleMembers = members.filter(m => {
    if (currentUserId && (String(m.id) === String(currentUserId) || String(m.userId) === String(currentUserId))) {
      return false
    }
    return true
  })

  const filteredMembers = eligibleMembers.filter(m => {
    if (!searchMember.trim()) return true
    const q = searchMember.toLowerCase()
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q)
    )
  })

  const toggleMember = (memberId) => {
    const sId = String(memberId)
    setSelectedMemberIds(prev =>
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    )
  }

  const removeSelectedMember = (memberId) => {
    const sId = String(memberId)
    setSelectedMemberIds(prev => prev.filter(id => id !== sId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!groupName.trim()) {
      toast.error('Please enter a group name')
      return
    }

    try {
      setIsSubmitting(true)
      await onCreateGroup({
        name: groupName.trim(),
        description: description.trim(),
        memberIds: selectedMemberIds
      })
      toast.success(`Group "${groupName.trim()}" created!`)
      // Reset & close
      setGroupName('')
      setDescription('')
      setSelectedMemberIds([])
      setSearchMember('')
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to create group')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <UsersIcon size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">Create Group Conversation</h3>
              <p className="text-[11px] text-stone-500 font-medium">
                {orgName ? `Members in ${orgName}` : 'Add members from active workspace'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Group Name Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Group Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="e.g. Design Critique, Core Engineering"
              className="w-full px-3.5 py-2.5 text-xs text-stone-900 bg-white rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none transition-all"
              required
              autoFocus
            />
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Description <span className="text-stone-400 text-[10px] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief topic or purpose of this group"
              className="w-full px-3.5 py-2 text-xs text-stone-900 bg-white rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none transition-all"
            />
          </div>

          {/* Selected Members Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700">
                Selected Members ({selectedMemberIds.length})
              </label>
              {selectedMemberIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedMemberIds([])}
                  className="text-[10px] font-semibold text-stone-400 hover:text-rose-600"
                >
                  Clear all
                </button>
              )}
            </div>

            {selectedMemberIds.length === 0 ? (
              <div className="py-2.5 px-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-400">
                No members selected yet. Select members below to add them to this group.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-xl bg-stone-50 border border-stone-200">
                {selectedMemberIds.map(id => {
                  const m = members.find(mem => String(mem.id) === id)
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-800 shadow-2xs font-medium"
                    >
                      <span className="truncate max-w-[120px]">{m?.name || 'Member'}</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedMember(id)}
                        className="w-4 h-4 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Organization Members Multi-select List */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Add Organization Members
            </label>

            {/* Search Filter */}
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchMember}
                onChange={e => setSearchMember(e.target.value)}
                placeholder="Search team members by name or email..."
                className="w-full pl-9 pr-3 py-1.5 text-xs text-stone-900 bg-white rounded-xl border border-stone-200 focus:border-stone-400 outline-none"
              />
            </div>

            {/* Member Scroll List */}
            <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-xl divide-y divide-stone-100">
              {filteredMembers.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400">
                  {searchMember ? 'No members match search' : 'No other members in this organization'}
                </div>
              ) : (
                filteredMembers.map(m => {
                  const isSelected = selectedMemberIds.includes(String(m.id))
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMember(m.id)}
                      className={`w-full flex items-center justify-between p-2.5 text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-violet-50/60' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar name={m.name || 'Member'} size="xs" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate leading-tight">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {m.role || m.email}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-violet-600 border-violet-600 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckIcon size={12} />}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !groupName.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-black disabled:opacity-50 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

