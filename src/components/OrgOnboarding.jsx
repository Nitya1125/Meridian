"use client"

import React from 'react'
import { useOrg } from '@/context/OrgContext'
import { BuildingIcon, UserPlusIcon, ZapIcon, ArrowRightIcon, ClockIcon } from '@/components/Icons'
import StripedLoader from './StripedLoader'

// ─── Date Helper ───────────────────────────────────────────────────────────
function formatDaysAgo(isoDate) {
  if (!isoDate) return 'Recently'
  const now = new Date()
  const then = new Date(isoDate)
  const diff = Math.floor((now.getTime() - then.getTime()) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return '1 day ago'
  return `${diff} days ago`
}

// ─── Pending-Only Screen ───────────────────────────────────────────────────
function PendingScreen() {
  const { pendingRequests = [], openCreateModal, openJoinModal } = useOrg()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 select-none">
      <div className="max-w-xl w-full space-y-8">

        {/* Brand Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-2xs">
            <div className="w-5 h-5 rounded-lg bg-[#111318] text-lime-400 flex items-center justify-center">
              <ZapIcon size={12} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-stone-800">
              Meridian <em className="font-serif italic font-normal text-stone-600">Workspace</em>
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-normal text-stone-950 tracking-tight font-serif">
            Welcome <em className="italic font-serif font-normal text-stone-800">back!</em>
          </h1>
          <p className="text-sm text-stone-500 font-medium">
            Your organization request is pending leader approval.
          </p>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-3">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 font-mono px-1">
              Pending Requests
            </div>
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-base font-bold text-stone-900 mb-0.5">{req.name}</div>
                    <div className="text-xs text-stone-500 font-medium">{req.company_name || req.companyName}</div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                    Pending
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                    <ClockIcon size={13} className="text-stone-400" />
                    <span>Requested {formatDaysAgo(req.requestedAt)}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-medium italic">
                    Waiting for leader approval
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions while waiting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={openCreateModal}
            className="group flex items-center justify-between bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-stone-400 transition-all cursor-pointer text-left"
          >
            <div>
              <div className="text-sm font-bold text-stone-900 mb-0.5">+ Create Organization</div>
              <div className="text-xs text-stone-500 font-medium">Start your own workspace</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#111318] group-hover:text-lime-400 flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRightIcon size={14} strokeWidth={2.5} />
            </div>
          </button>

          <button
            onClick={openJoinModal}
            className="group flex items-center justify-between bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-stone-400 transition-all cursor-pointer text-left"
          >
            <div>
              <div className="text-sm font-bold text-stone-900 mb-0.5">+ Join Another Organization</div>
              <div className="text-xs text-stone-500 font-medium">Use an invite code</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#111318] group-hover:text-lime-400 flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowRightIcon size={14} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── First-Time / New User Screen ──────────────────────────────────────────
function NewUserScreen() {
  const { openCreateModal, openJoinModal } = useOrg()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 select-none">
      <div className="max-w-2xl w-full text-center space-y-8">

        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-2xs">
          <div className="w-5 h-5 rounded-lg bg-[#111318] text-lime-400 flex items-center justify-center">
            <ZapIcon size={12} strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-stone-800">
            Meridian <em className="font-serif italic font-normal text-stone-600">Onboarding</em>
          </span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 tracking-tight font-serif">
            Welcome to <em className="italic font-serif font-normal text-stone-900">Meridian</em>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-medium max-w-md mx-auto leading-relaxed">
            Create or join an organization to start collaborating with your team.
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-left">

          {/* Create */}
          <div
            onClick={openCreateModal}
            className="group relative bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-stone-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#111318] text-lime-400 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform duration-200">
                <BuildingIcon size={26} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight mb-2">
                Create <em className="italic font-serif font-normal text-stone-800">Organization</em>
              </h2>
              <p className="text-xs text-stone-500 font-medium leading-relaxed mb-6">
                Create a workspace for your company or team.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs font-bold text-stone-900">
              <span>Start from scratch</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#111318] group-hover:text-lime-400 flex items-center justify-center transition-all duration-200">
                <ArrowRightIcon size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Join */}
          <div
            onClick={openJoinModal}
            className="group relative bg-white rounded-3xl p-7 border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-stone-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center mb-6 shadow-2xs group-hover:bg-[#111318] group-hover:text-lime-400 group-hover:scale-105 transition-all duration-200">
                <UserPlusIcon size={26} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight mb-2">
                Join <em className="italic font-serif font-normal text-stone-800">Organization</em>
              </h2>
              <p className="text-xs text-stone-500 font-medium leading-relaxed mb-6">
                Join an existing team using a 6-digit invite code.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs font-bold text-stone-900">
              <span>Enter 6-digit code</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#111318] group-hover:text-lime-400 flex items-center justify-center transition-all duration-200">
                <ArrowRightIcon size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Export ────────────────────────────────────────────────────────────
export default function OrgOnboarding() {
  const { userState, orgsLoading } = useOrg()
  if (orgsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <StripedLoader color="green" size="md" label="Loading workspace organizations..." className="max-w-md" />
      </div>
    )
  }
  if (userState === 'pending') return <PendingScreen />
  return <NewUserScreen />
}
