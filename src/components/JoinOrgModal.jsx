"use client"

import React, { useState, useRef } from 'react'
import { useOrg } from '@/context/OrgContext'
import { verifyOrganizationCode, joinOrganization } from '@/Service/organization'
import { BuildingIcon, CheckIcon, ShieldIcon } from '@/components/Icons'
import { toast } from 'react-hot-toast'

export default function JoinOrgModal() {
  const { isJoinModalOpen, closeJoinModal } = useOrg()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orgFound, setOrgFound] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const inputRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null)
  ]

  if (!isJoinModalOpen) return null

  const handleDigitChange = (index, val) => {
    setErrorMsg('')
    if (val.length > 1) {
      const pasted = val.replace(/\D/g, '').slice(0, 6)
      if (pasted.length === 6) {
        const next = pasted.split('')
        setDigits(next)
        inputRefs[5].current?.focus()
        return
      }
    }
    const char = val.slice(-1)
    if (char && !/^\d$/.test(char)) return

    const next = [...digits]
    next[index] = char
    setDigits(next)

    if (char && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleVerify = async (e) => {
    e?.preventDefault()
    if (verifying) return
    const fullCode = digits.join('')
    if (fullCode.length < 6) {
      setErrorMsg('Please enter all 6 digits of the organization code.')
      return
    }

    setVerifying(true)
    setErrorMsg('')

    try {
      const res = await verifyOrganizationCode(fullCode)
      if (res && res.success && res.organization) {
        setOrgFound(res.organization)
      } else {
        setErrorMsg(res?.message || 'Invalid organization code. Please check and try again.')
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Verification failed. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleSendJoinRequest = async () => {
    if (submitting) return
    if (!orgFound || !orgFound.id) return

    setSubmitting(true)
    try {
      const res = await joinOrganization(orgFound.id)
      if (res && res.success) {
        setSuccessMessage(res.message || 'Request has been sent to organization admin')
        setRequestSent(true)
        toast.success(res.message || 'Join request sent successfully!')
      } else {
        toast.error(res?.message || 'Failed to send join request')
      }
    } catch (err) {
      toast.error(err?.message || 'Error sending join request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setDigits(['', '', '', '', '', ''])
    setOrgFound(null)
    setErrorMsg('')
    setRequestSent(false)
    setSuccessMessage('')
    closeJoinModal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 z-10">

        {/* ── Step 1: Enter Code ────────────────────────────────── */}
        {!orgFound && !requestSent && (
          <>
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#111318] text-lime-400 flex items-center justify-center shadow-md">
                <BuildingIcon size={22} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight">
                  Join an <em className="italic font-serif font-normal text-stone-800">Organization</em>
                </h2>
                <p className="text-xs text-stone-500 font-medium">Enter your 6-digit code to connect with your team</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-3 text-center">
                  Enter the 6-digit organization code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-2xl border outline-none transition-all ${
                        errorMsg
                          ? 'border-rose-400 bg-rose-50/50 text-rose-900 ring-2 ring-rose-200'
                          : digit
                            ? 'border-stone-900 bg-stone-900 text-lime-400 shadow-sm'
                            : 'border-stone-200 bg-[#FAF8F5] text-stone-900 focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                      }`}
                    />
                  ))}
                </div>
                {errorMsg && (
                  <div className="mt-3 text-center text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                    ⚠ {errorMsg}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-2xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying || digits.join('').length < 6}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#111318] hover:bg-stone-900 text-xs font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {verifying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ── Step 2: Org Found — Confirm ──────────────────────── */}
        {orgFound && !requestSent && (
          <div className="py-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 font-mono">
                ✓ Code Verified
              </span>
            </div>

            <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight mb-1">
              Organization <em className="italic font-serif font-normal text-stone-800">Found</em>
            </h2>
            <p className="text-xs text-stone-500 font-medium mb-6">Review the details before sending your request</p>

            <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-5 mb-6">
              <div className="text-xl font-bold text-stone-950 mb-1">{orgFound.name}</div>
              <div className="text-xs text-stone-600 font-semibold mb-3">
                {orgFound.company_name || orgFound.companyName || ''}
              </div>
              {orgFound.description && (
                <p className="text-xs text-stone-500 mb-4">{orgFound.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500 bg-white p-2.5 rounded-xl border border-stone-200/60">
                <ShieldIcon size={14} className="text-lime-600" />
                <span>Requires organization leader approval</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
              <span className="text-amber-500 text-sm mt-0.5">⏳</span>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                After sending your request, it will remain <strong>Pending</strong> until the organization leader accepts it.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOrgFound(null)}
                className="flex-1 py-3 rounded-2xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSendJoinRequest}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : 'Send Join Request'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Request Sent ─────────────────────────────── */}
        {requestSent && (
          <div className="text-center py-4">
            <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
              <CheckIcon size={30} strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-normal text-stone-950 font-serif tracking-tight mb-2">
              Request <em className="italic font-serif font-normal text-stone-800">Sent!</em>
            </h2>
            <p className="text-xs text-stone-600 font-medium mb-2 max-w-sm mx-auto">
              {successMessage || 'Your join request has been sent to the organization admin.'}
            </p>
            <p className="text-xs text-stone-400 font-medium mb-7 max-w-sm mx-auto">
              You will be notified once your access is approved.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-6 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                <span className="text-xs font-bold text-amber-900">Status: Pending Approval</span>
              </div>
              <p className="text-[11px] text-amber-700 font-medium pl-4">
                {orgFound?.name} · Waiting for leader review
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
