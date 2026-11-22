"use client"

import React from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { UserIcon } from '@/components/Icons'

export default function DirectMessagesList({
  members = [],
  activeConversation = null,
  onSelectMember,
  searchQuery = '',
  loading = false,
  currentUserId = null
}) {
  if (loading) {
    return (
      <div className="space-y-1.5 p-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl animate-pulse bg-stone-100/70">
            <div className="w-8 h-8 rounded-full bg-stone-200" />
            <div className="flex-1 space-y-1">
              <div className="w-24 h-3 bg-stone-200 rounded" />
              <div className="w-32 h-2 bg-stone-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Filter out current user from DMs or clearly mark "(You)"
  const filtered = members.filter(m => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q)
    )
  })

  if (filtered.length === 0) {
    return (
      <div className="py-6 px-3 text-center">
        <div className="w-7 h-7 mx-auto mb-1.5 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
          <UserIcon size={14} />
        </div>
        <p className="text-xs font-semibold text-stone-600">
          {searchQuery ? 'No matching members found' : 'No organization members yet'}
        </p>
        <p className="text-[10px] text-stone-400 mt-0.5">
          {searchQuery ? 'Try another search term' : 'Invite team members to start chatting'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {filtered.map(member => {
        const isSelf = currentUserId && (String(member.id) === String(currentUserId) || String(member.userId) === String(currentUserId))
        const isActive = activeConversation?.type === 'dm' && String(activeConversation.id) === String(member.id)

        return (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelectMember(member)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
              isActive
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'hover:bg-stone-100 text-stone-700'
            }`}
          >
            {/* Avatar with status indicator */}
            <div className="relative shrink-0">
              <Avatar
                name={member.name || 'Member'}
                size="sm"
                status={member.status === 'online' ? 'online' : null}
              />
            </div>

            {/* Member Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-stone-900'}`}>
                  {member.name} {isSelf && <span className={`text-[10px] font-normal ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>(You)</span>}
                </span>
                {member.lastTime && (
                  <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                    {member.lastTime}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-1 mt-0.5">
                <span className={`text-[11px] truncate ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                  {member.lastMsg || member.role || member.email || 'Click to message'}
                </span>

                {Boolean(member.unreadCount && member.unreadCount > 0) && (
                  <span className="shrink-0 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold font-mono">
                    {member.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

