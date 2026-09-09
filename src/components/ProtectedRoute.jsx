"use client"

import React, { useEffect, useSyncExternalStore } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ShieldLockIcon, ZapIcon } from './Icons'
import StripedLoader from './StripedLoader'

if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("meridian_token", token);
    window.history.replaceState({}, "", window.location.pathname);
  }
}

const emptySubscribe = () => () => {}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, demoLogin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tokenFromUrl = params.get('token')
      if (tokenFromUrl) {
        localStorage.setItem('meridian_token', tokenFromUrl)
        window.history.replaceState({}, '', pathname || '/dashboard')
      }
    }
    if (!loading && isHydrated && !isAuthenticated) {

    
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('meridian_redirect_after_login', pathname)
        } catch {
          // ignore
        }
      }
      router.push('/')
    }
  }, [isAuthenticated, loading, isHydrated, router, pathname])

  if (loading || !isHydrated) {
    return (
      <StripedLoader
        variant="page"
        color="green"
        size="md"
        label="Syncing workspace session..."
      />
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#FAF8F5] p-4 text-center">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-2xl border border-stone-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
            <ShieldLockIcon size={24} className="text-amber-700" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-normal text-stone-900 mb-2 font-serif">
            Protected <em className="italic font-serif font-normal text-stone-900">Workspace</em>
          </h2>
          <p className="text-xs text-stone-500 mb-6 font-medium">
            You need to be signed in to view and interact with this workspace.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-2xl bg-[#111318] hover:bg-black px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
            >
              Go to Sign In
            </button>
            <button
              onClick={demoLogin}
              className="w-full rounded-2xl bg-lime-400 hover:bg-lime-300 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ZapIcon size={14} strokeWidth={2.5} />
              <span>Continue as Demo Alex Johnson</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
