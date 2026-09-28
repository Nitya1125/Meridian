"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import InviteModal from '@/components/InviteModal'
import MetricCard from '@/components/MetricCard'
import TactileSegmentedControl from '@/components/TactileSegmentedControl'
import KineticMemberCard from '@/components/KineticMemberCard'
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
  const [members, setMembers] = useState(() => (
    user ? [{
      id: `mem_${user.id || 'me'}`,
      name: fullName ? `${fullName} (You)` : (user.email || 'You'),
      role: activeOrg?.role || 'Owner / Leader',
      email: email || user.email || '',
      initials: initials || 'U',
      color: '#8b5cf6',
      status: 'online',
      projects: 1,
      tasks: 0,
      timeLogged: 'Active'
    }] : []
  ))
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  const filtered = members.filter(m => {
    const name = (m.name || `${m.first_name || ''} ${m.last_name || ''}`).trim().toLowerCase()
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

      try {
        const res = await handleOrganizationUsers(activeOrg.id)
        if (res.success && Array.isArray(res.members) && res.members.length > 0) {
          const formattedMembers = res.members.map((member) => ({
            ...member,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email || 'Member',
            initials: `${member.first_name?.[0] || member.email?.[0] || 'U'}${member.last_name?.[0] || ''}`.toUpperCase(),
            color: '#8b5cf6',
            status: 'online',
            role: member.role || 'Member',
            timeLogged: 'Active'
          }))
          setMembers(formattedMembers)
        } else if (user) {
          setMembers([{
            id: `mem_${user.id || 'me'}`,
            name: fullName ? `${fullName} (You)` : (user.email || 'You'),
            role: activeOrg?.role || 'Owner / Leader',
            email: email || user.email || '',
            initials: initials || 'U',
            color: '#8b5cf6',
            status: 'online',
            projects: 1,
            tasks: 0,
            timeLogged: 'Active'
          }])
        }
      } catch (err) {
        console.error("Failed to fetch organization members:", err)
      }
    }
    fetchMember()
  }, [activeOrg, user, fullName, initials, email])

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
              <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-stone-900 lg:text-[38px]">
                The <span className="font-serif-italic font-normal text-violet-700">studio</span>
              </h1>
              <p className="mt-1.5 text-[13.5px] font-medium text-stone-500">
                {members.length} members · {members.filter(m => m.status === 'online').length} active now
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

          {/* Bento KPI Summary Row with Live Interactive Scrubbing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon={UsersIcon}
              badge="4 open seats"
              value={String(members.length)}
              label="Total Members"
              theme="purple"
            />
            <MetricCard
              icon={ZapIcon}
              badge="Active live"
              value={String(members.filter(m => m.status === 'online').length)}
              label="Online Now"
              theme="lime"
            />
            <MetricCard
              icon={ClockIcon}
              badge="Standup in 20m"
              value={String(members.filter(m => m.status === 'away').length)}
              label="Away / In Break"
              theme="amber"
            />
            <MetricCard
              icon={BarChartIcon}
              badge="+12% tracked"
              value="184h"
              label="Hours Logged"
              theme="sky"
              series={[
                { day: 'Mon', val: '24h', heightPercent: 45 },
                { day: 'Tue', val: '32h', heightPercent: 68 },
                { day: 'Wed', val: '38h', heightPercent: 82 },
                { day: 'Thu', val: '44h', heightPercent: 95 },
                { day: 'Fri', val: '28h', heightPercent: 60 },
                { day: 'Sat', val: '12h', heightPercent: 28 },
                { day: 'Sun', val: '6h', heightPercent: 18 }
              ]}
            />
          </div>

          {/* Search & Tactile Mechanical Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <SearchIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search member by name, role, email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white rounded-2xl border border-stone-200 shadow-2xs outline-none focus:border-stone-400 font-sans transition-all focus:shadow-sm"
              />
            </div>

            {/* Kinetic Sliding Pill Segmented Switch */}
            <TactileSegmentedControl
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: 'all', label: 'All', badge: members.length },
                { id: 'online', label: 'Online', dotColor: '#10b981', badge: members.filter(m => m.status === 'online').length },
                { id: 'away', label: 'Away', dotColor: '#f59e0b', badge: members.filter(m => m.status === 'away').length },
                { id: 'offline', label: 'Offline', dotColor: '#a8a29e', badge: members.filter(m => m.status === 'offline').length }
              ]}
            />
          </div>

          {/* Bento Member Grid with Kinetic Alive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {filtered.map(member => (
              <KineticMemberCard
                key={member.id}
                member={member}
                onMessage={() => {
                  router.push('/messages')
                  toast.success(`Opening chat with ${member.name}`)
                }}
              />
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