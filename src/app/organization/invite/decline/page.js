"use client"

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { declineOrganizationInvitation } from '@/Service/organization'
import { ZapIcon, BuildingIcon, CheckIcon, ShieldIcon } from '@/components/Icons'

function DeclineContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [declining, setDeclining] = useState(false)
  const [declinedSuccess, setDeclinedSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loginRequired, setLoginRequired] = useState(false)

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
          <span className="text-2xl font-bold">✕</span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-normal font-serif text-stone-950 tracking-tight">
            Invalid <em className="italic font-serif font-normal text-stone-800">Invitation</em>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-2 leading-relaxed">
            This invitation link is invalid or incomplete.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Go to Meridian Home
          </Link>
        </div>
      </div>
    )
  }

  const handleDecline = async () => {
    if (declining) return
    setDeclining(true)
    setErrorMessage('')
    setLoginRequired(false)

    try {
      const response = await declineOrganizationInvitation(token)

      if (response && response.status === 401) {
        setLoginRequired(true)
        toast.error('Please log in to your Meridian account to continue.')
        return
      }

      if (response && response.success) {
        setDeclinedSuccess(true)
        toast.success(response.message || 'Invitation declined successfully')
      } else {
        const msg = response?.message || 'Unable to decline invitation'
        setErrorMessage(msg)
        toast.error(msg)
      }
    } catch (err) {
      const fallbackMsg = 'Network error while declining invitation'
      setErrorMessage(fallbackMsg)
      toast.error(fallbackMsg)
    } finally {
      setDeclining(false)
    }
  }

  if (declinedSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckIcon size={24} strokeWidth={2.5} />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-normal font-serif text-stone-950 tracking-tight">
            Invitation <em className="italic font-serif font-normal text-stone-800">Declined</em>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-2 leading-relaxed">
            You have declined this organization invitation. You can now safely close this page.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 rounded-2xl border border-stone-200 text-stone-800 hover:bg-stone-50 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            Return to Meridian
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-10 border border-stone-200/80 shadow-2xl relative animate-in zoom-in-95 duration-200">
      
      {/* Brand Capsule */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-[#111318] flex items-center justify-center text-white shadow-xs">
          <ZapIcon size={16} strokeWidth={2.5} className="text-lime-400" />
        </div>
        <span className="font-extrabold text-stone-900 tracking-tight text-lg">
          Meridian <em className="font-serif italic font-normal text-stone-700">Workspace</em>
        </span>
      </div>

      {/* Header Content */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <BuildingIcon size={22} strokeWidth={2} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-normal font-serif text-stone-950 tracking-tight leading-snug">
          Decline <em className="italic font-serif font-normal text-stone-900">Invitation</em>
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-2 leading-relaxed">
          Are you sure you want to decline this organization invitation? You will not be added as a member.
        </p>
      </div>

      {/* Error / Feedback */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <span>⚠</span>
            <span>Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-rose-600">{errorMessage}</p>
        </div>
      )}

      {/* Login Prompt if 401 */}
      {loginRequired && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2.5">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span>🔒</span>
            <span>Authentication Required</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            Please sign in to your Meridian account to confirm declining this invitation.
          </p>
          <Link
            href={`/?redirect=${encodeURIComponent(`/organization/invite/decline?token=${token}`)}`}
            className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-[#111318] hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
          >
            Sign In to Meridian
          </Link>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleDecline}
          disabled={declining}
          className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
        >
          {declining ? <span>Declining invitation...</span> : <span>Confirm Decline Invitation</span>}
        </button>

        <Link
          href={`/organization/invite?token=${token}`}
          className="w-full py-3.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center"
        >
          View Full Invitation Instead
        </Link>
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
        <div className="flex items-center gap-1">
          <ShieldIcon size={12} />
          <span>Secure invite token</span>
        </div>
        <span className="font-mono text-[10px]">Expires in 48h</span>
      </div>

    </div>
  )
}

export default function DeclineInvitePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 selection:bg-lime-200 selection:text-stone-900">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-stone-200/80 shadow-xl text-center space-y-3 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 mx-auto" />
            <div className="h-4 bg-stone-100 rounded-full w-2/3 mx-auto" />
            <div className="h-3 bg-stone-100 rounded-full w-1/2 mx-auto" />
          </div>
        }
      >
        <DeclineContent />
      </Suspense>
    </div>
  )
}
