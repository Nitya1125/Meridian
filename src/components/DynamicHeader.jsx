"use client"

import React, { useState, useEffect, useRef } from 'react'
import {
  SearchIcon, BellIcon, PlusIcon, ClockIcon, ZapIcon, CheckIcon
} from './Icons'
import { toast } from 'react-hot-toast'
import OrgSwitcher from './OrgSwitcher'
import { useOrg } from '@/context/OrgContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { acceptJoinRequest, rejectJoinRequest } from '@/Service/organization'

export default function DynamicHeader({ onOpenNewTask, onOpenSearch, title = "Workspace" }) {
  // Notifications popover state
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)
  const {
    notifications = [],
    notificationsLoading = false,
    fetchNotifications = () => {},
    pendingJoinRequests = [],
    fetchPendingJoinRequests = () => {},
    activeOrg
  } = useOrg() || {}
  const { fullName, initials } = useCurrentUser()
  const [processingRequestId, setProcessingRequestId] = useState(null)
  const [requestStatuses, setRequestStatuses] = useState({})

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAcceptRequest = async (requestId) => {
  try {
    setProcessingRequestId(requestId)

    const res = await acceptJoinRequest(requestId)

    if (res && res.success) {
      setRequestStatuses((prev) => ({
        ...prev,
        [requestId]: "ACCEPTED"
      }))

      toast.success(res.message || "Request accepted successfully")

      fetchNotifications()
      fetchPendingJoinRequests()
    } else {
      toast.error(res?.message || "Failed to accept request")
    }
  } catch (err) {
    toast.error(err.message || "Error accepting join request")
  } finally {
    setProcessingRequestId(null)
  }
}

  const handleRejectRequest = async (requestId) => {
  try {
    setProcessingRequestId(requestId)

    const res = await rejectJoinRequest(requestId)

    if (res && res.success) {
      setRequestStatuses((prev) => ({
        ...prev,
        [requestId]: "REJECTED"
      }))

      toast.success(res.message || "Request rejected successfully")

      fetchNotifications()
      fetchPendingJoinRequests()
    } else {
      toast.error(res?.message || "Failed to reject request")
    }
  } catch (err) {
    toast.error(err.message || "Error rejecting join request")
  } finally {
    setProcessingRequestId(null)
  }
}

  const handleMarkAsReadNotice = () => {
    toast('Mark-as-read API is currently unavailable on the backend.', { icon: 'ℹ️' })
  }

  const totalBadges = (notifications?.length || 0) + (pendingJoinRequests?.length || 0)

  return (
    <header className="w-full mb-6">
      {/* Top Dynamic Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">

        {/* Dynamic Island Capsule */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#111318] text-white rounded-full shadow-xl shadow-black/15 border border-white/12 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
              <span className="text-lime-400 uppercase text-[9px] font-sans font-bold bg-lime-950/90 px-2 py-0.5 rounded-full border border-lime-500/30">
                {activeOrg?.name ? activeOrg.name : 'Workspace'}
              </span>
              <span className="text-stone-200 text-xs hidden sm:inline font-medium">
                {activeOrg?.company_name || activeOrg?.description || 'Active Workspace'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dynamic User Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-[#111318]">
                {initials || 'U'}
              </div>
              <span className="text-[11px] font-medium text-stone-300 hidden md:inline truncate max-w-[120px]">
                {fullName || 'User'}
              </span>
            </div>

            {/* Sync Badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-300 font-sans bg-white/10 px-2.5 py-0.5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 inline-block animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Global Search & Organization Switcher & Quick Actions */}
        <div className="flex items-center gap-2.5 justify-end">
          {/* Organization Switcher Dropdown */}
          <OrgSwitcher />

          {/* Notifications & Requests Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen(!notifOpen)
                if (!notifOpen) {
                  fetchNotifications()
                  fetchPendingJoinRequests()
                }
              }}
              className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:border-stone-300 shadow-2xs transition-all cursor-pointer"
              title="Notifications & Join Requests"
            >
              <BellIcon size={16} />
              {totalBadges > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
                  {totalBadges}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-stone-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">Notifications</h3>
                    <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      {totalBadges} New
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      fetchNotifications()
                      fetchPendingJoinRequests()
                    }}
                    disabled={notificationsLoading}
                    className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 cursor-pointer disabled:opacity-50"
                  >
                    {notificationsLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                <div className="my-2 max-h-80 overflow-y-auto space-y-2.5">
                  {/* Pending Join Requests section for Organization Leader */}
                  {pendingJoinRequests.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                        Incoming Join Requests ({pendingJoinRequests.length})
                      </div>
                      {pendingJoinRequests.map(req => (
                        <div
                          key={`req-${req.id}`}
                          className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-stone-900">
                                {req.first_name ? `${req.first_name} ${req.last_name || ''}`.trim() : req.email}
                              </div>
                              <div className="text-[11px] text-stone-500">
                                {req.email} · Wants to join <strong className="text-stone-800">{req.organization_name}</strong>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md shrink-0">
                              Pending
                            </span>
                          </div>

                          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-stone-400">
                              Request #{req.id}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRejectRequest(req.id)}
                                disabled={processingRequestId === req.id}
                                className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAcceptRequest(req.id)}
                                disabled={processingRequestId === req.id}
                                className="px-2.5 py-1 rounded-xl bg-[#111318] hover:bg-black text-white text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Standard Notifications */}
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-stone-800 leading-snug">
                              {n.message}
                            </p>

                          {n.first_name && (
                            <p className="text-[11px] text-stone-500 mt-1">
                              {n.first_name} {n.last_name || ""}
                            </p>
                          )}
                        </div>
                          <button
                            type="button"
                            onClick={handleMarkAsReadNotice}
                            className="text-[10px] text-stone-400 hover:text-stone-600 shrink-0 cursor-pointer"
                            title="Mark as read"
                          >
                            Mark Read
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-400 font-mono">
                          {n.id && <span>ID: #{n.id}</span>}
                          {n.organization_id && (
                            <span>Org ID: {n.organization_id}</span>
                          )}
                          {n.created_at && (
                            <span>{new Date(n.created_at).toLocaleDateString()}</span>
                          )}
                        </div>

                        {/* Action buttons if notification references a join_request_id */}
                        {/* Action buttons if notification references a join_request_id */}
                        {n.join_request_id &&
  n.message === "A new user has requested to join your organization" &&
  !requestStatuses[n.join_request_id] && (
    <div className="pt-2 border-t border-stone-200/50 flex items-center justify-end gap-2">
      
      <div className="mr-auto">
        <p className="text-[11px] font-semibold text-stone-700">
          {n.first_name} {n.last_name || ""}
        </p>

        <span className="text-[10px] font-mono text-stone-500">
          Request #{n.join_request_id}
        </span>
      </div>

      <button
        type="button"
        onClick={() => handleRejectRequest(n.join_request_id)}
        disabled={processingRequestId === n.join_request_id}
        className="px-2.5 py-1 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-[11px] font-bold"
      >
        Reject
      </button>

      <button
        type="button"
        onClick={() => handleAcceptRequest(n.join_request_id)}
        disabled={processingRequestId === n.join_request_id}
        className="px-2.5 py-1 rounded-xl bg-[#111318] hover:bg-black text-white text-[11px] font-bold"
      >
        Accept
      </button>
    </div>
  )}
                      </div>
                    ))
                  ) : (
                    pendingJoinRequests.length === 0 && (
                      <div className="py-6 text-center text-xs text-stone-400 font-medium">
                        No unread notifications or pending requests
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-stone-200/80 text-stone-500 hover:text-stone-900 hover:border-stone-300 shadow-2xs transition-all cursor-pointer text-xs font-medium"
          >
            <SearchIcon size={14} className="text-stone-400" />
            <span className="hidden sm:inline">Search workspace...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-sans font-semibold text-stone-500 bg-stone-100 rounded-lg border border-stone-200">
              ⌘K
            </kbd>
          </button>

          {/* New Task Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#111318] text-white hover:bg-stone-900 font-semibold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            <PlusIcon size={14} strokeWidth={2.5} className="text-lime-400" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  )
}
