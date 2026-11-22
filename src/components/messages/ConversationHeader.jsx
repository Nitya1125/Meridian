"use client"

import React from 'react'
import { Menu } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { HashIcon, UsersIcon } from '@/components/Icons'

export default function ConversationHeader({
  activeConversation = null,
  onOpenMobileSidebar
}) {
  if (!activeConversation) return null

  const isGroup = activeConversation.type === 'group'

  return (
    <div className="px-5 py-3.5 border-b border-stone-200/80 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          type="button"
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 md:hidden cursor-pointer"
          title="Open Conversation List"
        >
          <Menu size={16} />
        </button>

        {/* Avatar or Group Icon */}
        <div className="shrink-0">
          {isGroup ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-100 to-indigo-100 border border-violet-200 text-violet-700 flex items-center justify-center font-bold text-sm shadow-2xs">
              <HashIcon size={16} />
            </div>
          ) : (
            <Avatar
              name={activeConversation.name || 'Member'}
              size="md"
              status={activeConversation.status === 'online' ? 'online' : null}
            />
          )}
        </div>

        {/* Conversation Title & Meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900 tracking-tight truncate leading-tight">
              {activeConversation.name || (isGroup ? 'Group Chat' : 'Direct Message')}
            </h3>
            {isGroup && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 font-bold uppercase tracking-wider shrink-0">
                Group
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {isGroup ? (
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <UsersIcon size={11} className="text-stone-400" />
                <span>{activeConversation.memberCount || activeConversation.memberIds?.length || 0} organization members</span>
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px]">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeConversation.status === 'online' ? 'bg-emerald-500' : 'bg-stone-300'
                  }`}
                />
                <span className={activeConversation.status === 'online' ? 'text-emerald-700 font-medium' : 'text-stone-400'}>
                  {activeConversation.status === 'online' ? 'Online' : 'Offline'}
                </span>
                {activeConversation.role && (
                  <>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-500 truncate">{activeConversation.role}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

