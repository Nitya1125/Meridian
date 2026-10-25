"use client"

import React, { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import { useAuth } from '@/context/AuthContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  UsersIcon, SettingsIcon, CreditCardIcon, MessageIcon,
  CheckIcon, ZapIcon, ShieldIcon, BellIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'My Profile', icon: <UsersIcon size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon size={16} /> },
  { id: 'security', label: 'Security & 2FA', icon: <ShieldIcon size={16} /> },
  { id: 'workspace', label: 'Workspace', icon: <ZapIcon size={16} /> },
]

export default function SettingsPage() {
  const { firstName: currentFirstName, lastName: currentLastName, email: currentEmail, initials: currentInitials } = useCurrentUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('Lead Product Engineer')
  const [customInitials, setCustomInitials] = useState('')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [slackNotifs, setSlackNotifs] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [language, setLanguage] = useState('English (US)')
  const [timezone, setTimezone] = useState('PST (UTC-8)')
  const [saving, setSaving] = useState(false)

  const valFirstName = firstName !== '' ? firstName : (currentFirstName || '')
  const valLastName = lastName !== '' ? lastName : (currentLastName || '')
  const valEmail = email !== '' ? email : (currentEmail || '')
  const valInitials = customInitials || currentInitials || 'AJ'

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setCustomInitials(`${valFirstName[0] || ''}${valLastName[0] || ''}`.toUpperCase() || 'AJ')
      toast.success('Changes saved successfully')
      setSaving(false)
    }, 400)
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={() => toast.success('Workspace action triggered')}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-950 font-serif">
              Account <em className="italic font-serif font-normal text-stone-900">Preferences & Security</em>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
              Manage your personal credentials, security keys, notification preferences, and team defaults
            </p>
          </div>

          {/* Settings Tabs Capsule */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-2xl max-w-xl mb-6 overflow-x-auto">
            {tabs.map(t => {
              const active = activeTab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${active ? 'bg-[#111318] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs max-w-2xl">
              <form onSubmit={handleSaveProfile} className="space-y-5">

                {/* Avatar Banner */}
                <div className="flex items-center gap-4 pb-5 border-b border-stone-100">
                  <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6] text-white text-xl font-bold flex items-center justify-center shadow-xs">
                    {valInitials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{valFirstName || 'Workspace'} {valLastName || 'User'}</h3>
                    <p className="text-xs text-stone-400 font-mono">{valEmail}</p>
                    <button
                      type="button"
                      onClick={() => toast.success('Avatar updated!')}
                      className="mt-2 text-xs font-bold text-violet-700 hover:text-violet-900 cursor-pointer"
                    >
                      Change avatar photo →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={valFirstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-[#FAF8F5] border border-stone-200 focus:border-stone-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={valLastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-[#FAF8F5] border border-stone-200 focus:border-stone-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={valEmail}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-[#FAF8F5] border border-stone-200 focus:border-stone-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-[#FAF8F5] border border-stone-200 focus:border-stone-400 outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-2xl bg-[#111318] hover:bg-black text-white text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Tab 2: Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs max-w-2xl space-y-4">
              <h3 className="text-sm font-bold text-stone-900 mb-4">Notification Channels</h3>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                <div>
                  <div className="text-xs font-bold text-stone-800">Email Digest Notifications</div>
                  <div className="text-[11px] text-stone-400">Receive summary reports on task assignments and mentions</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailNotifs(!emailNotifs)
                    toast.success('Email preference updated')
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${emailNotifs ? 'bg-lime-500' : 'bg-stone-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${emailNotifs ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                <div>
                  <div className="text-xs font-bold text-stone-800">Slack & Webhook Integrations</div>
                  <div className="text-[11px] text-stone-400">Real-time alerts in #engineering and #releases channels</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSlackNotifs(!slackNotifs)
                    toast.success('Slack preference updated')
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${slackNotifs ? 'bg-lime-500' : 'bg-stone-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${slackNotifs ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Security */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs max-w-2xl space-y-4">
              <h3 className="text-sm font-bold text-stone-900 mb-4">Two-Factor Authentication & Security</h3>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                <div>
                  <div className="text-xs font-bold text-stone-800">Authenticator App (2FA)</div>
                  <div className="text-[11px] text-stone-400">Require an authenticator TOTP token during login</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactor(!twoFactor)
                    toast.success(twoFactor ? '2FA disabled' : '2FA activated with Google Authenticator!')
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${twoFactor ? 'bg-lime-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                    }`}
                >
                  {twoFactor ? 'Enabled' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Workspace */}
          {activeTab === 'workspace' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs max-w-2xl space-y-4">
              <h3 className="text-sm font-bold text-stone-900 mb-4">Workspace Preferences</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-[#FAF8F5] border border-stone-200 outline-none"
                  >
                    <option>PST (UTC-8)</option>
                    <option>EST (UTC-5)</option>
                    <option>UTC (GMT+0)</option>
                    <option>IST (UTC+5:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-2xl bg-[#FAF8F5] border border-stone-200 outline-none"
                  >
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </ProtectedRoute>
  )
}