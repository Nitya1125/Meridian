"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import { useAuth } from '@/context/AuthContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  UsersIcon, SettingsIcon, CreditCardIcon, MessageIcon,
  CheckIcon, GridIcon, CalendarIcon, ZapIcon, ShieldIcon,
  BellIcon, ClockIcon, ArrowUpRightIcon, RocketIcon,
  PaletteIcon, PackageIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const skills = [
  'Design Systems', 'Next.js 16', 'React 19', 'Figma', 'Tailwind CSS v4',
  'UI Micro-interactions', 'System Architecture', 'Product Strategy'
]

const recentActivity = [
  { action: 'Merged PR #142', title: 'OAuth2 Authentication Flow with Google & GitHub', time: '2 hours ago', icon: <RocketIcon size={14} className="text-violet-600" />, tag: 'Publications' },
  { action: 'Completed task', title: 'Configure Redis session cache for fast lookup', time: 'Yesterday at 4:15 PM', icon: <CheckIcon size={14} className="text-emerald-600" />, tag: 'Commercial' },
  { action: 'Reviewed design tokens', title: 'Meridian Warm Stone Design System 2.0 Tokens', time: 'Aug 6, 2026', icon: <PaletteIcon size={14} className="text-rose-600" />, tag: 'Design Internal' },
  { action: 'Deployed release', title: 'Staging release v1.8.4 zero-downtime cluster', time: 'Aug 5, 2026', icon: <PackageIcon size={14} className="text-sky-600" />, tag: 'DevOps' },
]

const assignedProjects = [
  { name: 'Publications & Shots', role: 'Design Lead', color: '#f43f5e', progress: 82, tasks: '14/18 done' },
  { name: 'Commercial Portals', role: 'Reviewer', color: '#8b5cf6', progress: 61, tasks: '8/12 done' },
  { name: 'Design Internal', role: 'Contributor', color: '#10b981', progress: 45, tasks: '5/11 done' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()
  const { firstName, lastName, initials, email } = useCurrentUser()
  const [bio, setBio] = useState('Lead Product Engineer & Designer crafting high-performance workspace software at Meridian.')

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={() => router.push('/settings')}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Header Banner Bento */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-[#8B5CF6] text-white text-2xl font-extrabold flex items-center justify-center shadow-md shrink-0 font-serif">
                {initials || 'ME'}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-950 tracking-tight font-serif">
                    {firstName || 'Workspace'} <em className="italic font-serif font-normal text-stone-900">{lastName || 'Member'}</em>
                  </h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-800 font-mono">
                    ● Active Now
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Engineering Lead & UI Architect · {email || 'user@meridian.io'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-stone-400 font-mono">
                  <span>San Francisco, CA</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon size={12} />
                    <span className="stat-number font-bold text-stone-600">18.4h</span> tracked this week
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/settings')}
                className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  logout()
                  toast.success('Signed out')
                }}
                className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Grid: Bio & Skills + Projects + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

            {/* Left 1 Col: Bio & Skills */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                <h2 className="text-xl sm:text-2xl font-normal text-stone-900 mb-2 font-serif">
                  About <em className="italic font-serif font-normal text-stone-800">Me</em>
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  {bio}
                </p>

                <h3 className="text-lg sm:text-xl font-normal text-stone-900 mt-5 mb-2 font-serif">
                  Core <em className="italic font-serif font-normal text-stone-800">Skills</em>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 2 Cols: Assigned Projects & Activity */}
            <div className="lg:col-span-2 space-y-6">

              {/* Assigned Projects */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-normal text-stone-900 font-serif">
                    Assigned <em className="italic font-serif font-normal text-stone-800">Project Spaces</em>
                  </h2>
                  <span className="text-xs font-mono text-stone-400 stat-number">3 active</span>
                </div>

                <div className="space-y-3">
                  {assignedProjects.map(proj => (
                    <div key={proj.name} className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.color }} />
                          <span className="font-bold text-stone-800">{proj.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono">({proj.role})</span>
                        </div>
                        <span className="stat-number text-stone-600 font-bold">{proj.tasks}</span>
                      </div>

                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${proj.progress}%`, backgroundColor: proj.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                <h2 className="text-xl sm:text-2xl font-normal text-stone-900 mb-4 font-serif">
                  Recent <em className="italic font-serif font-normal text-stone-800">Contributions</em>
                </h2>

                <div className="space-y-3">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-stone-50 transition-colors">
                      <span className="p-2 rounded-xl bg-stone-100 shrink-0 flex items-center justify-center">
                        {act.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{act.action}</span>
                          <span className="text-[10px] font-mono text-stone-400">{act.time}</span>
                        </div>
                        <div className="text-xs text-stone-600 truncate mt-0.5">{act.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </ProtectedRoute>
  )
}