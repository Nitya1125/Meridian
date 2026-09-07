"use client"

import React, { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import InviteModal from '@/components/InviteModal'
import { handleOrganizationUsers } from '@/Service/organization'
import {
  PlusIcon, SearchIcon, MoreHorizontalIcon, UsersIcon,
  MessageIcon, CheckIcon, SettingsIcon, ClockIcon, ZapIcon, BarChartIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'

import { useOrg } from '@/context/OrgContext'
import { useAuth } from '@/context/AuthContext'

export default function TeamPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { activeOrg } = useOrg()
  const { fullName, initials, email } = useCurrentUser()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [members, setMembers] = useState([])
  const [inviteModalOpen, setInviteModalOpen] = useState(false)


  const filtered = members.filter(m => {
    const name = `${m.first_name || ''} ${m.last_name || ''}`.toLowerCase()
    const role = (m.role || '').toLowerCase()
    const memberEmail = (m.email || '').toLowerCase()

    const matchSearch =
        name.includes(search.toLowerCase()) ||
        role.includes(search.toLowerCase()) ||
        memberEmail.includes(search.toLowerCase())

    if (statusFilter === 'all') return matchSearch

    return matchSearch && m.status === statusFilter
})

  useEffect(() => {
    const fetchMember = async () => {
        if (!activeOrg || !activeOrg.id) return

        const res = await handleOrganizationUsers(activeOrg.id)
        if (res.success) {
            const formattedMembers = res.members.map((member) => ({
        ...member,
        name: `${member.first_name || ''} ${member.last_name || ''}`.trim(),
        initials: `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`.toUpperCase(),
        color: '#8b5cf6',
        status: 'online',
        timeLogged: 'Active'
    }))

    setMembers(formattedMembers)
  }
    }
    fetchMember()
}, [activeOrg])

  const isOwner = Boolean(
    activeOrg && (
      (activeOrg.created_by && user?.id && String(activeOrg.created_by) === String(user.id)) ||
      activeOrg.role?.toUpperCase() === 'OWNER' ||
      activeOrg.role?.toLowerCase().includes('owner') ||
      activeOrg.role?.toLowerCase().includes('leader')
    )
  )

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={isOwner ? () => setInviteModalOpen(true) : undefined}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif">
                Team <em className="italic font-serif font-normal text-stone-900">Members & Presence</em>
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
                Manage team directory, live availability, tracked hours, and workspace invitations
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => setInviteModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <PlusIcon size={15} strokeWidth={2.5} />
                <span>Invite Member</span>
              </button>
            )}
          </div>

          {/* Bento KPI Summary Row (Ref Image 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Members */}
            <div className="p-5 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-2xs hover:shadow-xs transition-all bento-card-interactive">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#6D28D9]">Total Members</span>
                <span className="p-1.5 rounded-xl bg-white/80 text-[#6D28D9] shadow-2xs">
                  <UsersIcon size={14} />
                </span>
              </div>
              <div className="text-4xl font-extrabold text-stone-950 stat-number mb-1">
                {members.length}
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#6D28D9]">
                <span>12 seats limit</span>
                <span className="font-mono text-[10px] bg-white/60 px-2 py-0.5 rounded-full">4 open</span>
              </div>
            </div>

            {/* Online Now */}
            <div className="p-5 rounded-3xl bg-[#ECFCCB] border border-[#D9F99D] shadow-2xs hover:shadow-xs transition-all bento-card-interactive">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#3F6212]">Online Now</span>
                <span className="p-1.5 rounded-xl bg-white/80 text-[#3F6212] shadow-2xs">
                  <ZapIcon size={14} />
                </span>
              </div>
              <div className="text-4xl font-extrabold text-stone-950 stat-number mb-1">
                {members.filter(m => m.status === 'online').length}
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#3F6212]">
                <span>Active collaboration</span>
                <span className="font-mono text-[10px] bg-white/60 px-2 py-0.5 rounded-full">● Live</span>
              </div>
            </div>

            {/* Away / Break */}
            <div className="p-5 rounded-3xl bg-[#FFEDD5] border border-[#FDBA74] shadow-2xs hover:shadow-xs transition-all bento-card-interactive">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#C2410C]">Away / Break</span>
                <span className="p-1.5 rounded-xl bg-white/80 text-[#C2410C] shadow-2xs">
                  <ClockIcon size={14} />
                </span>
              </div>
              <div className="text-4xl font-extrabold text-stone-950 stat-number mb-1">
                {members.filter(m => m.status === 'away').length}
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#C2410C]">
                <span>Standup in 20m</span>
                <span className="font-mono text-[10px] bg-white/60 px-2 py-0.5 rounded-full">Sync</span>
              </div>
            </div>

            {/* Hours Logged */}
            <div className="p-5 rounded-3xl bg-[#E0F2FE] border border-[#BAE6FD] shadow-2xs hover:shadow-xs transition-all bento-card-interactive">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0369A1]">Hours Logged</span>
                <span className="p-1.5 rounded-xl bg-white/80 text-[#0369A1] shadow-2xs">
                  <BarChartIcon size={14} />
                </span>
              </div>
              <div className="text-4xl font-extrabold text-stone-950 stat-number mb-1">
                184h
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#0369A1]">
                <span>Sprint 14 total</span>
                <span className="font-mono text-[10px] bg-white/60 px-2 py-0.5 rounded-full">+12%</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <SearchIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search member by name, role, email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white rounded-2xl border border-stone-200 shadow-2xs outline-none focus:border-stone-400 font-sans"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl">
              {['all', 'online', 'away', 'offline'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${statusFilter === s ? 'bg-[#111318] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Member Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {filtered.map(member => (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-md bento-card-interactive flex flex-col justify-between"
              >
                <div>
                  {/* Top Avatar & Presence */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.initials}
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${member.status === 'online'
                            ? 'bg-emerald-500'
                            : member.status === 'away'
                              ? 'bg-amber-500'
                              : 'bg-stone-400'
                          }`}
                      />
                    </div>

                    <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/60">
                      {member.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-sm font-bold text-stone-900 leading-snug">
                    {member.name}
                  </h3>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">{member.role}</div>
                  <div className="text-[11px] text-stone-400 font-mono mt-1">{member.email}</div>
                </div>

                {/* Footer Stats & Message CTA */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-stone-500">
                    <ClockIcon size={12} />
                    <span>{member.timeLogged}</span>
                  </div>

                  <button
                    onClick={() => {
                      router.push('/messages')
                      toast.success(`Opening chat with ${member.name}`)
                    }}
                    className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="Send message"
                  >
                    <MessageIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* Invite Modal */}
      <InviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </ProtectedRoute>
  )
}