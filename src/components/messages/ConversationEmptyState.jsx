"use client"

import React from 'react'
import { MessageIcon, UsersIcon } from '@/components/Icons'

export default function ConversationEmptyState({
  type = 'select', // 'select' | 'no-org'
  orgName = '',
  onCreateGroup = null
}) {
  if (type === 'no-org') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F5]/60">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 mb-4 shadow-2xs">
          <UsersIcon size={24} />
        </div>
        <h3 className="text-base font-bold text-stone-900 tracking-tight mb-1.5">
          No Organization Selected
        </h3>
        <p className="text-xs text-stone-500 max-w-sm leading-relaxed mb-4">
          Please select or join an organization from the top workspace switcher to view channels, group chats, and message team members.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F5]/40">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-100 via-indigo-50 to-emerald-50 border border-violet-200/70 flex items-center justify-center text-violet-700 mb-4 shadow-xs">
        <MessageIcon size={26} />
      </div>
      <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-1">
        Select a conversation to start messaging
      </h3>
      <p className="text-xs text-stone-500 max-w-sm leading-relaxed mb-5">
        Choose a direct message with an organization member or select a group from the left sidebar.
        {orgName && <span className="block mt-1 font-medium text-stone-600">Currently in <strong className="text-stone-900">{orgName}</strong></span>}
      </p>
      {onCreateGroup && (
        <button
          onClick={onCreateGroup}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
        >
          <span>Create New Group</span>
          <span>→</span>
        </button>
      )}
    </div>
  )
}

