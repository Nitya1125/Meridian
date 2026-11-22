"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import { useAuth } from '@/context/AuthContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useTasks } from '@/context/TaskContext'
import { getProfile } from '@/Service/profileService'
import {
  UsersIcon, CheckIcon, ZapIcon, ClockIcon, PackageIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import StripedLoader from '@/components/StripedLoader'

export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()
  const { firstName, lastName, initials, email, user } = useCurrentUser()
  const { tasks = [] } = useTasks() || {}

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const res = await getProfile()
        if (isMounted && res && res.success && res.profile) {
          setProfile(res.profile)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUserProfile()
    return () => {
      isMounted = false
    }
  }, [])

  // Derive user assigned tasks from live TaskContext
  const userTasks = tasks.filter(t => user?.id && String(t.assigned_to) === String(user.id))
  const completedTasks = userTasks.filter(t => t.status === 'DONE')

  const displayName = profile?.first_name || firstName || 'Workspace'
  const displayLastName = profile?.last_name || lastName || 'Member'
  const displayEmail = profile?.email || email || ''
  const displayJobTitle = profile?.job_title || 'Workspace Contributor'
  const displayLocation = profile?.location || null
  const displayBio = profile?.bio || null
  const displaySkills = Array.isArray(profile?.skills) ? profile.skills : []

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

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <StripedLoader size="md" color="green" label="Loading user profile..." />
            </div>
          ) : (
            <>
              {/* Header Banner Bento */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-3xl bg-[#8B5CF6] text-white text-2xl font-extrabold flex items-center justify-center shadow-md shrink-0 font-serif">
                    {initials || 'ME'}
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-950 tracking-tight font-serif">
                        {displayName} <em className="italic font-serif font-normal text-stone-900">{displayLastName}</em>
                      </h1>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-800 font-mono">
                        ● Active
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {displayJobTitle} {displayEmail && `· ${displayEmail}`}
                    </p>
                    {displayLocation && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-stone-400 font-mono">
                        <span>{displayLocation}</span>
                      </div>
                    )}
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
                  {/* About Me */}
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                    <h2 className="text-xl sm:text-2xl font-normal text-stone-900 mb-2 font-serif">
                      About <em className="italic font-serif font-normal text-stone-800">Me</em>
                    </h2>
                    {displayBio ? (
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium whitespace-pre-line">
                        {displayBio}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 italic">
                        No bio provided yet. Click &quot;Edit Profile&quot; to write a bio.
                      </p>
                    )}

                    {/* Core Skills */}
                    <h3 className="text-lg sm:text-xl font-normal text-stone-900 mt-5 mb-2 font-serif">
                      Core <em className="italic font-serif font-normal text-stone-800">Skills</em>
                    </h3>
                    {displaySkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {displaySkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">
                        No skills listed yet. Add skills in Settings.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right 2 Cols: Assigned Projects & Activity */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Assigned Deliverables / Tasks */}
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl sm:text-2xl font-normal text-stone-900 font-serif">
                        Assigned <em className="italic font-serif font-normal text-stone-800">Deliverables</em>
                      </h2>
                      <span className="text-xs font-mono text-stone-400 stat-number">
                        {userTasks.length} assigned
                      </span>
                    </div>

                    {userTasks.length > 0 ? (
                      <div className="space-y-3">
                        {userTasks.map((t, idx) => (
                          <div
                            key={t.id || idx}
                            onClick={() => router.push('/kanban')}
                            className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex flex-col gap-2 hover:bg-stone-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                                <span className="font-bold text-stone-800 truncate max-w-sm">{t.title}</span>
                                <span className="text-[10px] text-stone-400 font-mono">({t.priority || 'MEDIUM'})</span>
                              </div>
                              <span className="stat-number text-stone-600 font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-white border border-stone-200">
                                {t.status || 'TODO'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 px-4 text-center rounded-2xl bg-[#FAF8F5] border border-dashed border-stone-200">
                        <PackageIcon size={20} className="mx-auto text-stone-400 mb-1.5" />
                        <p className="text-xs font-semibold text-stone-600">No deliverables currently assigned</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">Assigned sprint deliverables will appear here.</p>
                      </div>
                    )}
                  </div>

                  {/* Recent Contributions */}
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
                    <h2 className="text-xl sm:text-2xl font-normal text-stone-900 mb-4 font-serif">
                      Completed <em className="italic font-serif font-normal text-stone-800">Contributions</em>
                    </h2>

                    {completedTasks.length > 0 ? (
                      <div className="space-y-2.5">
                        {completedTasks.map((t, idx) => (
                          <div
                            key={t.id || idx}
                            className="flex items-start gap-3 p-3 rounded-2xl hover:bg-stone-50 transition-colors"
                          >
                            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 flex items-center justify-center">
                              <CheckIcon size={14} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-stone-900 truncate">{t.title}</span>
                                {t.due_date && (
                                  <span className="text-[10px] font-mono text-stone-400">{t.due_date}</span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500 truncate mt-0.5">
                                {t.description || 'Completed sprint task'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 px-4 text-center rounded-2xl bg-[#FAF8F5] border border-dashed border-stone-200">
                        <ClockIcon size={20} className="mx-auto text-stone-400 mb-1.5" />
                        <p className="text-xs font-semibold text-stone-600">No completed contributions yet</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">Tasks you mark as done will be listed here.</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </>
          )}

        </main>
      </div>
    </ProtectedRoute>
  )
}
