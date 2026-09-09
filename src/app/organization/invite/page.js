"use client"

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { acceptOrganizationInvitation, declineOrganizationInvitation } from '@/Service/organization'
import { ZapIcon, BuildingIcon, CheckIcon, ShieldIcon } from '@/components/Icons'

function InvitationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [accepting, setAccepting] = useState(false)
  const [declining, setDeclining] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declinedSuccess, setDeclinedSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loginRequired, setLoginRequired] = useState(false)

  // If no token is provided in the URL
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
            This invitation link is invalid or incomplete. Please check the link sent to your email and try again.
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

  // Handle Accept Flow
  const handleAccept = async () => {
    if (accepting || declining) return
    setAccepting(true)
    setErrorMessage('')
    setLoginRequired(false)

    try {
      const response = await acceptOrganizationInvitation(token)

      if (response && response.status === 401) {
        setLoginRequired(true)
        toast.error('Please log in to your Meridian account to continue.')
        return
      }

      if (response && response.success) {
        toast.success(response.message || 'Invitation accepted successfully')
        router.push('/dashboard')
      } else {
        const msg = response?.message || 'Unable to accept invitation'
        setErrorMessage(msg)
        toast.error(msg)
      }
    } catch (err) {
      const fallbackMsg = err?.message || 'Network error while accepting invitation'
      setErrorMessage(fallbackMsg)
      toast.error(fallbackMsg)
    } finally {
      setAccepting(false)
    }
  }

  // Handle Decline Flow (Confirmed)
  const handleConfirmDecline = async () => {
    if (accepting || declining) return
    setDeclining(true)
    setErrorMessage('')
    setLoginRequired(false)

    try {
      const response = await declineOrganizationInvitation(token)

      if (response && response.status === 401) {
        setShowDeclineModal(false)
        setLoginRequired(true)
        toast.error('Please log in to your Meridian account to continue.')
        return
      }

      if (response && response.success) {
        setShowDeclineModal(false)
        setDeclinedSuccess(true)
        toast.success(response.message || 'Invitation declined successfully')
      } else {
        const msg = response?.message || 'Unable to decline invitation'
        setErrorMessage(msg)
        toast.error(msg)
        setShowDeclineModal(false)
      }
    } catch (err) {
      const fallbackMsg = err?.message || 'Network error while declining invitation'
      setErrorMessage(fallbackMsg)
      toast.error(fallbackMsg)
      setShowDeclineModal(false)
    } finally {
      setDeclining(false)
    }
  }

  if (declinedSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mx-auto shadow-xs">
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
    <>
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
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE] flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <BuildingIcon size={22} strokeWidth={2} />
          </div>

          <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-[#6D28D9] bg-[#EDE9FE] px-3 py-0.5 rounded-full mb-2">
            Team Invitation
          </span>

          <h1 className="text-2xl sm:text-3xl font-normal font-serif text-stone-950 tracking-tight leading-snug">
            Organization <em className="italic font-serif font-normal text-stone-900">Invitation</em>
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-2 leading-relaxed">
            You&apos;ve been invited to join an organization workspace on Meridian. You can accept or decline this invitation below.
          </p>
        </div>

        {/* Error / Feedback Card if any */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>⚠</span>
              <span>Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-600">{errorMessage}</p>
          </div>
        )}

        {/* Login Prompt if 401 was returned */}
        {loginRequired && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2.5">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <span>🔒</span>
              <span>Authentication Required</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              Please sign in with your Meridian account to process this invitation.
            </p>
            <Link
              href={`/?redirect=${encodeURIComponent(`/organization/invite?token=${token}`)}`}
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
            onClick={handleAccept}
            disabled={accepting || declining}
            className="w-full py-3.5 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {accepting ? (
              <span>Accepting invitation...</span>
            ) : (
              <span>Accept Invitation</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowDeclineModal(true)}
            disabled={accepting || declining}
            className="w-full py-3.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Decline Invitation</span>
          </button>
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

      {/* Decline Confirmation Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center p-4">
          <div
            onClick={() => !declining && setShowDeclineModal(false)}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          <div className="relative w-full max-w-sm rounded-3xl bg-[#FAF8F5] p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 text-center space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
              <span className="text-xl">✕</span>
            </div>

            <div>
              <h3 className="text-xl font-normal font-serif text-stone-950">
                Decline <em className="italic font-serif font-normal text-stone-800">Invitation?</em>
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                Are you sure you want to decline this invitation? You will not be added to this workspace.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                disabled={declining}
                className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={declining}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {declining ? 'Declining...' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function OrganizationInvitePage() {
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
        <InvitationContent />
      </Suspense>
    </div>
  )
}
