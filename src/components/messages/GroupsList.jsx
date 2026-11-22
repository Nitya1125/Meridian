"use client"

import React from 'react'
import { PlusIcon, HashIcon, UsersIcon } from '@/components/Icons'

export default function GroupsList({
  groups = [],
  activeConversation = null,
  onSelectGroup,
  onCreateGroupClick,
  searchQuery = '',
  loading = false
}) {
  const filtered = groups.filter(g => {
    if (!searchQuery.trim()) return true
    return (g.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div>
      {/* Header with Create Group Trigger */}
      <div className="flex items-center justify-between px-2 mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Groups ({groups.length})
        </span>
        <button
          onClick={onCreateGroupClick}
          type="button"
          title="Create New Group"
          className="flex items-center gap-1 text-[11px] font-bold text-violet-700 hover:text-violet-900 bg-violet-50 hover:bg-violet-100 px-2 py-0.5 rounded-lg border border-violet-200 transition-colors cursor-pointer"
        >
          <PlusIcon size={11} />
          <span>New Group</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-1.5 p-2">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl animate-pulse bg-stone-100/70">
              <div className="w-7 h-7 rounded-lg bg-stone-200" />
              <div className="flex-1 space-y-1">
                <div className="w-20 h-3 bg-stone-200 rounded" />
                <div className="w-28 h-2 bg-stone-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-5 px-3 text-center bg-stone-50/50 rounded-xl border border-dashed border-stone-200/80">
          <div className="w-7 h-7 mx-auto mb-1.5 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
            <UsersIcon size={14} />
          </div>
          <p className="text-xs font-semibold text-stone-700">
            {searchQuery ? 'No matching groups' : 'No groups created yet'}
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5 mb-2.5">
            {searchQuery ? 'Try a different keyword' : 'Create an organization group to collaborate'}
          </p>
          {!searchQuery && (
            <button
              onClick={onCreateGroupClick}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-black bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs transition-all cursor-pointer"
            >
              <PlusIcon size={12} />
              <span>Create First Group</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-0.5">
          {filtered.map(group => {
            const isActive = activeConversation?.type === 'group' && String(activeConversation.id) === String(group.id)

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                {/* Group Icon Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isActive
                      ? 'bg-stone-800 text-violet-300'
                      : 'bg-stone-100 text-stone-600 border border-stone-200/80'
                  }`}
                >
                  <HashIcon size={13} />
                </div>

                {/* Group Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-stone-900'}`}>
                      {group.name}
                    </span>
                    {group.lastTime && (
                      <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                        {group.lastTime}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className={`text-[11px] truncate ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                      {group.lastMsg || `${group.memberCount || group.memberIds?.length || 0} members`}
                    </span>

                    {Boolean(group.unreadCount && group.unreadCount > 0) && (
                      <span className="shrink-0 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold font-mono">
                        {group.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

