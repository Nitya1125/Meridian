"use client"

import React, { useState } from 'react'
import { SearchIcon, UsersIcon, MessageIcon } from '@/components/Icons'
import { X } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import DirectMessagesList from './DirectMessagesList'
import GroupsList from './GroupsList'

export default function MessagesSidebar({
  members = [],
  groups = [],
  activeConversation = null,
  onSelectConversation,
  onCreateGroupClick,
  loading = false,
  groupsError = null,
  onRetryGroups = null,
  currentUser = null,
  orgName = '',
  isMobileOpen = false,
  onCloseMobile
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'direct' | 'groups'

  const directCount = members.length
  const groupsCount = groups.length

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-80 shrink-0 border-r border-stone-200/80 bg-white flex flex-col h-full z-40 transition-transform duration-200 md:static md:translate-x-0 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl'
            : 'fixed inset-y-0 left-0 -translate-x-full md:translate-x-0'
        }`}
      >
        {/* Workspace Context & Mobile Close Header */}
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Workspace Messaging
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-extrabold text-stone-900 truncate">
                {orgName || 'Active Organization'}
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            type="button"
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 md:hidden cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-stone-100">
          <div className="relative">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search members or groups..."
              className="w-full pl-9 pr-3 py-2 text-xs text-stone-900 bg-stone-50 hover:bg-stone-100/70 focus:bg-white rounded-xl border border-stone-200/80 focus:border-stone-400 outline-none transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Segregation Tabs */}
          <div className="grid grid-cols-3 gap-1 mt-2.5 bg-stone-100/80 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('direct')}
              className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'direct'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Direct ({directCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('groups')}
              className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'groups'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Groups ({groupsCount})
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Lists */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
          {/* Groups Section */}
          {(activeTab === 'all' || activeTab === 'groups') && (
            <GroupsList
              groups={groups}
              activeConversation={activeConversation}
              onSelectGroup={(grp) => {
                onSelectConversation({ ...grp, type: 'group' })
                if (onCloseMobile) onCloseMobile()
              }}
              onCreateGroupClick={onCreateGroupClick}
              searchQuery={searchQuery}
              loading={loading}
              error={groupsError}
              onRetry={onRetryGroups}
            />
          )}

          {/* Direct Messages Section */}
          {(activeTab === 'all' || activeTab === 'direct') && (
            <div>
              <div className="px-2 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Direct Messages ({members.length})
                </span>
              </div>
              <DirectMessagesList
                members={members}
                activeConversation={activeConversation}
                onSelectMember={(mem) => {
                  onSelectConversation({ ...mem, type: 'dm' })
                  if (onCloseMobile) onCloseMobile()
                }}
                searchQuery={searchQuery}
                loading={loading}
                currentUserId={currentUser?.id || currentUser?.userId}
              />
            </div>
          )}
        </div>

        {/* Current Authenticated User Presence Footer */}
        {currentUser && (
          <div className="p-3 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                name={currentUser.fullName || currentUser.name || 'You'}
                size="sm"
                status="online"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate leading-tight">
                  {currentUser.fullName || currentUser.name || 'You'}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">Online</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

