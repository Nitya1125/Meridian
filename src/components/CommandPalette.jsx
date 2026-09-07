"use client"

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  SearchIcon, HomeIcon, GridIcon, CalendarIcon, BarChartIcon,
  UsersIcon, MessageIcon, SettingsIcon, ZapIcon,
  CheckIcon
} from './Icons'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const searchItems = [
  // Navigation
  { id: 'nav-dashboard', category: 'Navigation', title: 'Overview', sub: 'Velocity, sprint progress, metrics & lineup', href: '/dashboard', icon: <HomeIcon size={16} /> },
  { id: 'nav-kanban', category: 'Navigation', title: 'Tasks Board', sub: 'To do, In Progress, Under Review, Ready', href: '/kanban', icon: <GridIcon size={16} /> },
  { id: 'nav-calendar', category: 'Navigation', title: 'Schedule & Calendar', sub: 'Week, month, deadlines & live meet rooms', href: '/calendar', icon: <CalendarIcon size={16} /> },
  { id: 'nav-analytics', category: 'Navigation', title: 'Analytics & Activity', sub: 'Throughput burn-up, speedometer & distribution', href: '/Analytics', icon: <BarChartIcon size={16} /> },
  { id: 'nav-team', category: 'Navigation', title: 'Members Directory', sub: 'Live presence, tracked time & roles', href: '/team', icon: <UsersIcon size={16} /> },
  { id: 'nav-messages', category: 'Navigation', title: 'Chat & Channels', sub: '#general, #engineering, #design, #product', href: '/messages', icon: <MessageIcon size={16} /> },
  { id: 'nav-settings', category: 'Navigation', title: 'Workspace Settings', sub: 'Profile, security 2FA & notifications', href: '/settings', icon: <SettingsIcon size={16} /> },
  { id: 'nav-profile', category: 'Navigation', title: 'My Profile', sub: 'Bio, skills, assigned projects & stats', href: '/profile', icon: <UsersIcon size={16} /> },

  // Projects
  { id: 'proj-1', category: 'Projects', title: 'Publications & Shots', sub: 'Dribbble, Behance case studies & articles', href: '/kanban', icon: <ZapIcon size={16} color="#f43f5e" /> },
  { id: 'proj-2', category: 'Projects', title: 'Commercial Work', sub: 'Client portals, pitch decks & enterprise apps', href: '/kanban', icon: <ZapIcon size={16} color="#8b5cf6" /> },
  { id: 'proj-3', category: 'Projects', title: 'Design Internal', sub: 'Design system 2.0 & token architecture', href: '/kanban', icon: <ZapIcon size={16} color="#10b981" /> },

  // Tasks
  { id: 'task-1', category: 'Tasks', title: 'MRD-032: Fitness App UI Concept', sub: 'To do · Assigned to Kacie Velasquez', href: '/kanban', icon: <CheckIcon size={16} /> },
  { id: 'task-2', category: 'Tasks', title: 'MRD-033: Analytics Dashboard Design', sub: 'In Progress · Assigned to Alex Johnson', href: '/kanban', icon: <CheckIcon size={16} /> },
  { id: 'task-3', category: 'Tasks', title: 'MRD-041: Meditation App Concept', sub: 'Under Review · Priority High', href: '/kanban', icon: <CheckIcon size={16} /> },
  { id: 'task-4', category: 'Tasks', title: 'MRD-028: CI/CD Setup with GitHub Actions', sub: 'Ready · Assigned to Kai Okafor', href: '/kanban', icon: <CheckIcon size={16} /> },
]

export default function CommandPalette({ open, onClose }) {
  const { fullName } = useCurrentUser()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef(null)

  const dynamicSearchItems = searchItems.map(item =>
    item.id === 'task-2'
      ? { ...item, sub: `In Progress · Assigned to ${fullName || 'Team Lead'}` }
      : item
  )

  if (!open) return null

  const filteredItems = dynamicSearchItems.filter(item => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  const handleSelect = (item) => {
    if (item && item.href) {
      router.push(item.href)
      setQuery('')
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex])
      }
    }
  }

  const categories = Array.from(new Set(filteredItems.map(i => i.category)))

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/40 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => {
        setQuery('')
        onClose()
      }}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-[#FAF8F5] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200/80 bg-white">
          <SearchIcon size={18} className="text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search pages, tasks, projects, or team members..."
            className="w-full bg-transparent text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400 font-sans"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSelectedIndex(0)
              }}
              className="text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5 rounded-md hover:bg-stone-200"
            >
              Clear
            </button>
          )}
          <span className="text-[10px] font-mono text-stone-400 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded-md shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <div className="text-2xl mb-1">🔍</div>
              <p className="text-xs font-medium">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            categories.map(cat => {
              const catItems = filteredItems.filter(i => i.category === cat)
              return (
                <div key={cat} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {cat}
                  </div>
                  {catItems.map(item => {
                    const globalIdx = filteredItems.indexOf(item)
                    const isSelected = globalIdx === selectedIndex
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#111318] text-white shadow-sm'
                            : 'text-stone-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white border border-stone-200 text-stone-600 shadow-2xs'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate leading-tight">
                              {item.title}
                            </div>
                            <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                              {item.sub}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[11px] font-mono shrink-0 ml-2 ${isSelected ? 'text-lime-400 font-bold' : 'text-stone-400'}`}>
                          ↵ Jump
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-stone-200/80 bg-white/80 text-[11px] text-stone-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">↑</kbd> <kbd className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">↓</kbd></span>
            <span>Select: <kbd className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">↵</kbd></span>
          </div>
          <span>Meridian Quick Command</span>
        </div>
      </div>
    </div>
  )
}
