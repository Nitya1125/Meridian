"use client"

import React, { useState } from 'react'
import { PlusIcon, UsersIcon } from './Icons'
import { toast } from 'react-hot-toast'
import { useOrg } from '@/context/OrgContext'
import { inviteOrganizationUser } from '@/Service/organization'

export default function InviteModal({ open, onClose, onInvite }) {
  const { activeOrg } = useOrg()
  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const validate = () => {
    let valid = true
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setEmailErr('Email is required')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailErr('Please enter a valid email address')
      valid = false
    } else {
      setEmailErr('')
    }
    return valid
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return

    if (!activeOrg || !activeOrg.id) {
      toast.error('Please select an active organization first')
      return
    }

    setLoading(true)
    try {
      const response = await inviteOrganizationUser(email.trim(), activeOrg.id)

      if (response && response.success) {
        toast.success(response.message || 'Invitation sent successfully')
        setEmail('')
        setEmailErr('')
        if (onInvite) onInvite({ email: email.trim() })
        onClose()
      } else {
        toast.error(response?.message || 'Failed to send invitation')
      }
    } catch (err) {
      toast.error('Unable to send invitation. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setEmail('')
    setEmailErr('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF8F5] p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111318] text-white flex items-center justify-center shadow-xs">
              <UsersIcon size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-normal font-serif text-stone-900 leading-none">
                Invite <em className="italic font-serif font-normal text-stone-800">Teammate</em>
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Send email invitation to join <strong className="text-stone-800">{activeOrg?.name || 'organization'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
            <input
              type="email"
              autoFocus
              disabled={loading}
              placeholder="e.g. teammate@company.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (emailErr) setEmailErr('')
              }}
              className={`w-full px-3.5 py-2.5 text-xs font-medium rounded-2xl bg-white border outline-none transition-all ${
                emailErr
                  ? 'border-rose-400 ring-2 ring-rose-200'
                  : 'border-stone-200 focus:border-stone-400'
              } disabled:opacity-60`}
            />
            {emailErr && <span className="text-[10px] text-rose-500 font-semibold mt-1 block">⚠ {emailErr}</span>}
          </div>

          {activeOrg?.invite_code && (
            <div className="p-3 rounded-2xl bg-white border border-stone-200/60 flex items-center justify-between text-xs">
              <span className="text-stone-500 text-[11px]">
                Org Code: <strong className="font-mono text-stone-900">{activeOrg.invite_code}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(String(activeOrg.invite_code))
                  toast.success('Org code copied!')
                }}
                className="font-bold text-violet-700 hover:text-violet-900 shrink-0 ml-2 cursor-pointer"
              >
                Copy Code
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-stone-200/80">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-200/60 transition-colors disabled:opacity-40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="px-5 py-2 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon size={14} strokeWidth={2.5} />
              <span>{loading ? 'Sending invitation...' : 'Send Invitation'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
