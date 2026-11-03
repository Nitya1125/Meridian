"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import {
  HashIcon, SearchIcon, PlusIcon, SmileIcon, AttachIcon,
  SendIcon, MoreHorizontalIcon, MicIcon, VideoIcon, PhoneIcon,
  ThumbsUpIcon, HeartIcon, FlameIcon, RocketIcon, ClapIcon,
  PartyIcon, CheckCircleIcon, BulbIcon, EyeIcon, LockIcon,
  UserIcon, ChevronDownIcon, ChevronRightIcon, StarIcon,
  MessageIcon, ClockIcon, CopyIcon, TrashIcon, ZapIcon,
  CheckIcon, FilterIcon
} from '@/components/Icons'
import { X, Menu } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useTasks } from '@/context/TaskContext'
import { PASTELS, PRIORITY_TOKENS, STATUS_TOKENS } from '@/design-system/tokens'
import { Badge, PriorityBadge, TagBadge, StatusBadge } from '@/components/ui'

/* =============================================================================
   REACTIONS CONFIGURATION (7-PASTEL CANDY PALETTE)
============================================================================= */
const CORE_REACTIONS = [
  { id: 'thumbsUp', label: 'Agree', Icon: ThumbsUpIcon, color: 'text-sky-700', bg: 'bg-[#E0F2FE]', border: 'border-[#BAE6FD]' },
  { id: 'heart', label: 'Love', Icon: HeartIcon, color: 'text-rose-700', bg: 'bg-[#FFE4E6]', border: 'border-[#FECDD3]' },
  { id: 'flame', label: 'Fire', Icon: FlameIcon, color: 'text-amber-800', bg: 'bg-[#FFEDD5]', border: 'border-[#FED7AA]' },
  { id: 'rocket', label: 'Ship It', Icon: RocketIcon, color: 'text-purple-800', bg: 'bg-[#F3E8FF]', border: 'border-[#E9D5FF]' },
  { id: 'clap', label: 'Applause', Icon: ClapIcon, color: 'text-yellow-800', bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]' },
  { id: 'party', label: 'Celebrate', Icon: PartyIcon, color: 'text-emerald-800', bg: 'bg-[#D1FAE5]', border: 'border-[#A7F3D0]' },
  { id: 'check', label: 'Done', Icon: CheckCircleIcon, color: 'text-lime-800', bg: 'bg-[#ECFCCB]', border: 'border-[#D9F99D]' },
]

/* =============================================================================
   MOCK DIRECTORY DATA WITH 3-TIER GROUP SEGREGATION
============================================================================= */
const initialSpacesChannels = [
  {
    space: 'Engineering Core',
    color: '#6366F1',
    channels: [
      { id: 'general', name: 'general', unread: 3, pinned: true, desc: 'Company announcements, high-level sprint goals & updates', memberCount: 24, isPrivate: false },
      { id: 'engineering', name: 'engineering', unread: 0, pinned: true, desc: 'Architecture specs, pull requests, and CI/CD pipelines', memberCount: 14, isPrivate: false },
      { id: 'releases', name: 'releases', unread: 0, pinned: false, desc: 'Production deployment logs, changelogs & canary flags', memberCount: 18, isPrivate: false },
      { id: 'incidents', name: 'incidents', unread: 0, pinned: false, desc: 'Real-time incident triage and post-mortems', memberCount: 8, isPrivate: true },
    ]
  },
  {
    space: 'Design Internal',
    color: '#10B981',
    channels: [
      { id: 'design-tokens', name: 'design-tokens', unread: 1, pinned: true, desc: 'Figma token synchronization and Tailwind v4 alignment', memberCount: 9, isPrivate: false },
      { id: 'critique-gallery', name: 'critique-gallery', unread: 0, pinned: false, desc: 'Live visual reviews, component mockups & animations', memberCount: 12, isPrivate: false },
    ]
  },
  {
    space: 'Commercial & Growth',
    color: '#F97316',
    channels: [
      { id: 'sales-sync', name: 'sales-sync', unread: 2, pinned: false, desc: 'Enterprise pilots, deal pipeline & customer interviews', memberCount: 16, isPrivate: false },
      { id: 'stripe-billing', name: 'stripe-billing', unread: 0, pinned: false, desc: 'Subscription webhooks, usage metering & invoicing', memberCount: 7, isPrivate: false },
    ]
  },
  {
    space: 'Publications',
    color: '#F43F5E',
    channels: [
      { id: 'announcements', name: 'announcements', unread: 0, pinned: false, desc: 'Product release notes, press kits & case studies', memberCount: 22, isPrivate: false },
      { id: 'random-banter', name: 'random-banter', unread: 0, pinned: false, desc: 'Watercooler chats, playlists, and coffee runs', memberCount: 24, isPrivate: false },
    ]
  }
]

const initialDMs = [
  { id: 'dm_sarah', name: 'Sarah Chen', initials: 'SC', color: '#6366F1', status: 'online', statusText: 'Online', lastMsg: 'Sounds good, let me push the branch', unread: 1, role: 'Lead Architect', time: '2m' },
  { id: 'dm_marcus', name: 'Marcus Webb', initials: 'MW', color: '#10B981', status: 'flow', statusText: 'In Flow State', lastMsg: 'DB migration ran successfully', unread: 0, role: 'Backend Lead', time: '18m' },
  { id: 'dm_priya', name: 'Priya Nair', initials: 'PN', color: '#F59E0B', status: 'meeting', statusText: 'In Meeting', lastMsg: 'Updated the Figma board', unread: 0, role: 'Product Designer', time: '1h' },
  { id: 'dm_kai', name: 'Kai Okafor', initials: 'KO', color: '#EF4444', status: 'online', statusText: 'Online', lastMsg: 'Deploying hotfix now', unread: 3, role: 'DevOps Specialist', time: '3h' },
  { id: 'dm_jordan', name: 'Jordan Lee', initials: 'JL', color: '#0EA5E9', status: 'away', statusText: 'Away', lastMsg: 'PR merged into main', unread: 0, role: 'Frontend Lead', time: 'Yesterday' },
  { id: 'dm_nadia', name: 'Nadia Kowalski', initials: 'NK', color: '#EC4899', status: 'online', statusText: 'Online', lastMsg: 'QA matrix is 100% green', unread: 0, role: 'QA Lead', time: 'Yesterday' },
]

const initialTaskThreads = [
  { id: 'task_mrd001', taskId: 'MRD-001', title: 'Design Token Migration & Tailwind v4', tag: '#Dev', progress: 85, priority: 'CRITICAL', status: 'IN_PROGRESS', repliesCount: 7, unread: 2, lastActivity: '5m' },
  { id: 'task_mrd002', taskId: 'MRD-002', title: 'API Gateway Multi-Tenant Routing Engine', tag: '#Backend', progress: 60, priority: 'HIGH', status: 'IN_REVIEW', repliesCount: 4, unread: 0, lastActivity: '42m' },
  { id: 'task_mrd008', taskId: 'MRD-008', title: 'React 19 Compiler Upgrade & Optimization', tag: '#Dev', progress: 100, priority: 'CRITICAL', status: 'DONE', repliesCount: 12, unread: 0, lastActivity: '2h' },
]

const initialMessages = {
  general: [
    {
      id: 'm1', author: 'Alex Johnson', initials: 'AJ', color: '#8B5CF6', role: 'Engineering Lead',
      time: '9:02 AM', date: 'Today',
      text: 'Morning everyone! Quick reminder — Sprint 24 review is this Friday at 3:00 PM. Please ensure your deliverables are updated on the board before standup.',
      reactions: [], threadCount: 2, threadPreview: 'Sarah Chen replied'
    },
    {
      id: 'm2', author: 'Sarah Chen', initials: 'SC', color: '#6366F1', role: 'Lead Architect',
      time: '9:08 AM', date: 'Today',
      text: 'On it! OAuth2 GitHub SSO and refresh token rotation are fully wrapped up. Linked to deliverable #MRD-001.',
      taskEmbed: { taskId: 'MRD-001', title: 'Design Token Migration & Tailwind v4', progress: 85, priority: 'CRITICAL', status: 'IN_PROGRESS' },
      reactions: [{ type: 'flame', count: 4, users: ['AJ', 'MW', 'KO'] }, { type: 'clap', count: 2, users: ['AJ', 'PN'] }],
      threadCount: 0
    },
    {
      id: 'm3', author: 'Marcus Webb', initials: 'MW', color: '#10B981', role: 'Backend Lead',
      time: '9:15 AM', date: 'Today',
      text: 'Stripe webhook idempotency middleware has been applied to staging. Query latency dropped 42% on task queries.',
      codeSnippet: { language: 'bash', code: 'curl -X POST https://api.meridian.io/v1/billing/webhook -H "Stripe-Signature: t=17000..."' },
      reactions: [{ type: 'check', count: 3, users: ['AJ', 'KO'] }], threadCount: 0
    },
    {
      id: 'm_divider', isDivider: true, label: 'New messages'
    },
    {
      id: 'm4', author: 'Priya Nair', initials: 'PN', color: '#F59E0B', role: 'Product Designer',
      time: '10:04 AM', date: 'Today',
      text: 'Just pushed the updated design tokens to Figma. All 7 candy pastels now pass WCAG AA >= 4.5:1 contrast requirements.',
      reactions: [{ type: 'party', count: 5, users: ['AJ', 'SC', 'MW', 'NK', 'JL'] }, { type: 'heart', count: 4, users: ['SC', 'JL'] }],
      threadCount: 3, threadPreview: 'Jordan Lee, Kai Okafor replied'
    },
    {
      id: 'm5', author: 'Kai Okafor', initials: 'KO', color: '#EF4444', role: 'DevOps Specialist',
      time: '10:18 AM', date: 'Today',
      text: 'Next.js 16.3.0 production build is compiling in 2.2s on Turbopack across all 60 static and dynamic routes. Pipeline is completely green.',
      reactions: [{ type: 'rocket', count: 6, users: ['AJ', 'MW', 'SC', 'PN', 'NK', 'JL'] }],
      threadCount: 0
    }
  ],
  engineering: [
    {
      id: 'me1', author: 'Marcus Webb', initials: 'MW', color: '#10B981', role: 'Backend Lead',
      time: '11:00 AM', date: 'Today',
      text: 'PostgreSQL indexes applied to production replica. Query latency benchmark report incoming.',
      reactions: [{ type: 'check', count: 2, users: ['AJ', 'KO'] }], threadCount: 1, threadPreview: 'Alex Johnson replied'
    },
    {
      id: 'me2', author: 'Sarah Chen', initials: 'SC', color: '#6366F1', role: 'Lead Architect',
      time: '11:22 AM', date: 'Today',
      text: 'Opened PR #847 for the OAuth2 GitHub provider. Verified that Next.js client redirects cleanly without full page reloads.',
      reactions: [{ type: 'rocket', count: 2, users: ['MW', 'AJ'] }]
    }
  ],
  'design-tokens': [
    {
      id: 'md1', author: 'Priya Nair', initials: 'PN', color: '#F59E0B', role: 'Product Designer',
      time: '11:30 AM', date: 'Today',
      text: 'Our 7-pastel candy system has been standardized across all badging and priority tokens. Check the specs in the right drawer.',
      reactions: [{ type: 'heart', count: 3, users: ['AJ', 'JL', 'SC'] }]
    }
  ],
  dm_sarah: [
    { id: 'ds1', author: 'Sarah Chen', initials: 'SC', color: '#6366F1', role: 'Lead Architect', time: '2:15 PM', date: 'Today', text: 'Hey Alex, I pushed the OAuth branch with the token refresh rotation. Mind taking a look at line 140?' },
    { id: 'ds2', author: 'You', initials: 'AJ', color: '#8B5CF6', role: 'Engineering Lead', time: '2:18 PM', date: 'Today', text: "Pulling it now! The memoization structure looks much cleaner with the new ESLint rules." },
    { id: 'ds3', author: 'Sarah Chen', initials: 'SC', color: '#6366F1', role: 'Lead Architect', time: '2:20 PM', date: 'Today', text: 'Sounds good, let me push the branch tests to CI.' }
  ],
  dm_marcus: [
    { id: 'dm1', author: 'Marcus Webb', initials: 'MW', color: '#10B981', role: 'Backend Lead', time: '11:30 AM', date: 'Today', text: 'DB migration ran successfully with 0 downtime.' }
  ],
  task_mrd001: [
    { id: 'tm1', author: 'Alex Johnson', initials: 'AJ', color: '#8B5CF6', role: 'Engineering Lead', time: '9:30 AM', date: 'Today', text: 'Task #MRD-001: Design Token Migration has completed 4 of 5 subtasks. Final PR pending review.' },
    { id: 'tm2', author: 'Sarah Chen', initials: 'SC', color: '#6366F1', role: 'Lead Architect', time: '9:45 AM', date: 'Today', text: 'Reviewed the tokens file. The contrast values for Lavender and Peach look crisp.' }
  ]
}

/* =============================================================================
   HELPER BADGES & PRESENCE INDICATORS
============================================================================= */
function PresenceHalo({ status, size = 'sm' }) {
  const sizeClasses = size === 'sm' ? 'w-2.5 h-2.5 -bottom-0.5 -right-0.5' : 'w-3 h-3 -bottom-0.5 -right-0.5'
  
  if (status === 'online') {
    return (
      <span className={`absolute ${sizeClasses} rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20`} title="Online" />
    )
  }
  if (status === 'flow') {
    return (
      <span className={`absolute ${sizeClasses} rounded-full bg-purple-500 border-2 border-white ring-1 ring-purple-500/30 animate-pulse`} title="In Flow State" />
    )
  }
  if (status === 'meeting') {
    return (
      <span className={`absolute ${sizeClasses} rounded-full bg-amber-500 border-2 border-white ring-1 ring-amber-500/20`} title="In Meeting" />
    )
  }
  return (
    <span className={`absolute ${sizeClasses} rounded-full bg-stone-300 border-2 border-white`} title="Away" />
  )
}

/* =============================================================================
   SAFE RICH MESSAGE PARSER (XSS-Immune, Markdown, Code, & Deliverable Tags)
============================================================================= */
function RichMessageText({ text = '', onDeliverableClick }) {
  if (!text) return null

  // 1. Detect multiline code blocks ```lang\ncode\n```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const segments = []
  let lastIdx = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      segments.push({ type: 'text', val: text.substring(lastIdx, match.index) })
    }
    segments.push({ type: 'code', lang: match[1] || 'bash', code: match[2].trim() })
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < text.length) {
    segments.push({ type: 'text', val: text.substring(lastIdx) })
  }

  const renderInline = (str) => {
    // Split by deliverable tags #MRD-xxx, inline code `...`, bold **...**, and URLs
    const tokens = str.split(/(#MRD-\d+|`[^`]+`|\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g)

    return tokens.map((token, i) => {
      if (!token) return null

      // Deliverable tag: #MRD-001
      if (/^#MRD-\d+$/i.test(token)) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onDeliverableClick && onDeliverableClick(token)}
            className="inline-flex items-center gap-1 mx-1 font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded hover:bg-indigo-100 transition-colors cursor-pointer"
            title={`View Deliverable ${token}`}
          >
            <span>{token}</span>
          </button>
        )
      }

      // Inline code: `npm test`
      if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
        return (
          <code
            key={i}
            className="font-mono text-xs bg-stone-100 text-stone-800 border border-stone-200/60 px-1.5 py-0.5 rounded mx-0.5"
          >
            {token.slice(1, -1)}
          </code>
        )
      }

      // Bold: **text**
      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        return <strong key={i} className="font-bold text-stone-900">{token.slice(2, -2)}</strong>
      }

      // Safe URL
      if (/^https?:\/\//i.test(token)) {
        return (
          <a
            key={i}
            href={token}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline hover:text-indigo-800 break-all"
          >
            {token}
          </a>
        )
      }

      return <span key={i}>{token}</span>
    })
  }

  return (
    <div className="space-y-1.5">
      {segments.map((seg, sIdx) => {
        if (seg.type === 'code') {
          return (
            <div key={sIdx} className="my-2 p-3 rounded-xl bg-stone-900 text-emerald-400 font-mono text-xs overflow-x-auto relative group shadow-xs">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(seg.code)
                  toast.success('Snippet copied!')
                }}
                className="absolute right-2 top-2 p-1 rounded bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Code"
              >
                <CopyIcon size={12} />
              </button>
              <pre className="m-0 font-mono text-[12px] leading-relaxed">
                <code>{seg.code}</code>
              </pre>
            </div>
          )
        }
        return (
          <p key={sIdx} className="text-[13px] text-stone-800 leading-relaxed break-words">
            {renderInline(seg.val)}
          </p>
        )
      })}
    </div>
  )
}

/* =============================================================================
   AUDIO HUDDLE FLOATING STATUS CAPSULE
============================================================================= */
function AudioHuddleBar({ isActive, onLeave, channelName }) {
  const [seconds, setSeconds] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setSeconds(0)
      return
    }
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [isActive])

  if (!isActive) return null

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="mx-5 my-2 p-2.5 rounded-2xl bg-stone-900 text-white flex items-center justify-between shadow-md border border-stone-800">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold">Audio Huddle #{channelName}</span>
          <span className="text-[11px] font-mono text-stone-400">({formatTime(seconds)})</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsMuted(prev => !prev)
            toast.success(isMuted ? 'Microphone unmuted' : 'Microphone muted')
          }}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isMuted ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
          }`}
        >
          <MicIcon size={12} />
          <span>{isMuted ? 'Muted' : 'Mute'}</span>
        </button>
        <button
          onClick={onLeave}
          className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
        >
          Leave
        </button>
      </div>
    </div>
  )
}

/* =============================================================================
   NEW CONVERSATION / CHANNEL CREATION MODAL
============================================================================= */
function NewConversationModal({ isOpen, onClose, onAddChannel, onSelectDM, spacesList, dmsList }) {
  const [tab, setTab] = useState('channel') // 'channel' | 'dm'
  const [channelName, setChannelName] = useState('')
  const [channelDesc, setChannelDesc] = useState('')
  const [selectedSpace, setSelectedSpace] = useState(spacesList[0]?.space || 'Engineering Core')
  const [isPrivate, setIsPrivate] = useState(false)
  const [dmSearch, setDmSearch] = useState('')

  if (!isOpen) return null

  const handleCreate = (e) => {
    e.preventDefault()
    const rawClean = channelName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
    const cleanSlug = rawClean.slice(0, 48)
    const RESERVED_SLUGS = ['__proto__', 'prototype', 'constructor', 'null', 'undefined', 'admin', 'root']

    if (!cleanSlug || cleanSlug.length < 2) {
      toast.error('Channel name must be at least 2 alphanumeric characters')
      return
    }
    if (RESERVED_SLUGS.includes(cleanSlug)) {
      toast.error(`"${cleanSlug}" is a reserved system identifier`)
      return
    }
    const alreadyExists = spacesList.some(s => s.channels.some(c => c.id === cleanSlug || c.name === cleanSlug))
    if (alreadyExists) {
      toast.error(`Channel #${cleanSlug} already exists`)
      return
    }
    onAddChannel({
      id: cleanSlug,
      name: cleanSlug,
      desc: channelDesc.trim() || 'New collaborative space',
      space: selectedSpace,
      isPrivate,
      unread: 0,
      memberCount: 1,
    })
    onClose()
  }

  const filteredDMs = dmsList.filter(d => 
    d.name.toLowerCase().includes(dmSearch.toLowerCase().trim()) || 
    d.role.toLowerCase().includes(dmSearch.toLowerCase().trim())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-stone-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-[#FAFAF9]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('channel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'channel' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              New Channel
            </button>
            <button
              onClick={() => setTab('dm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'dm' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Direct Message
            </button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 cursor-pointer">
            <X size={15} />
          </button>
        </div>

        {tab === 'channel' ? (
          <form onSubmit={handleCreate} className="p-5 space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Channel Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm">#</span>
                <input
                  type="text"
                  placeholder="e.g. security-audit"
                  value={channelName}
                  onChange={e => setChannelName(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Space Category
              </label>
              <select
                value={selectedSpace}
                onChange={e => setSelectedSpace(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all text-stone-800"
              >
                {spacesList.map(s => (
                  <option key={s.space} value={s.space}>{s.space}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Topic & Description
              </label>
              <input
                type="text"
                placeholder="What is this channel for?"
                value={channelDesc}
                onChange={e => setChannelDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <div>
                <div className="text-xs font-bold text-stone-900">Make Private</div>
                <div className="text-[11px] text-stone-400">Only invited members can view discussions</div>
              </div>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
                className="rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Create Channel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 space-y-3">
            <input
              type="text"
              placeholder="Search team members..."
              value={dmSearch}
              onChange={e => setDmSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all"
              autoFocus
            />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredDMs.map(dm => (
                <button
                  key={dm.id}
                  onClick={() => {
                    onSelectDM(dm.id)
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-all cursor-pointer text-left"
                >
                  <div
                    className="w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: dm.color }}
                  >
                    {dm.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-900">{dm.name}</div>
                    <div className="text-[10px] text-stone-400">{dm.role}</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">{dm.statusText}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* =============================================================================
   THREAD & CONTEXT DRAWER COMPONENT
============================================================================= */
function ContextDrawer({
  mode,
  setMode,
  message,
  channelObj,
  onClose,
  userInitials,
  userColor,
  fullName,
  onAddReply,
}) {
  const [threadDraft, setThreadDraft] = useState('')
  const [localReplies, setLocalReplies] = useState([
    { id: 'tr1', author: 'Sarah Chen', initials: 'SC', color: '#6366F1', role: 'Lead Architect', time: '9:12 AM', text: "I'll have the PR review finished by noon." },
    { id: 'tr2', author: 'Marcus Webb', initials: 'MW', color: '#10B981', role: 'Backend Lead', time: '9:18 AM', text: "Let me know if you need help verifying the Postgres replica connection." },
  ])

  const displayedReplies = (message?.replies && message.replies.length > 0)
    ? message.replies
    : localReplies

  const sendReply = (e) => {
    e.preventDefault()
    if (!threadDraft.trim()) return
    if (onAddReply && message) {
      onAddReply(message.id, threadDraft.trim())
    } else {
      const newReply = {
        id: `tr_${Date.now()}`,
        author: fullName || 'You',
        initials: userInitials || 'AJ',
        color: userColor || '#8B5CF6',
        role: 'Core Team',
        time: 'Just now',
        text: threadDraft.trim()
      }
      setLocalReplies(prev => [...prev, newReply])
      toast.success('Reply added to thread')
    }
    setThreadDraft('')
  }

  return (
    <aside className="w-full md:w-[350px] lg:w-[380px] border-l border-stone-200/80 bg-white flex flex-col shrink-0 z-20">
      {/* Top Drawer Navigation Tabs */}
      <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('thread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'thread'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            Thread {displayedReplies.length > 0 && `(${displayedReplies.length})`}
          </button>
          <button
            onClick={() => setMode('canvas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'canvas'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            Canvas & Assets
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          title="Close Drawer"
        >
          <X size={16} />
        </button>
      </div>

      {mode === 'thread' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Root Message Card */}
          {message && (
            <div className="p-4 border-b border-stone-100 bg-stone-50/40">
              <div className="flex items-start gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: message.color }}
                >
                  {message.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-stone-900">{message.author}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{message.time}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Replies Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {displayedReplies.map(r => (
              <div key={r.id} className="flex items-start gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: r.color }}
                >
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-xs font-bold text-stone-900">{r.author}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{r.time}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input Box */}
          <div className="p-3 border-t border-stone-100 bg-white">
            <form onSubmit={sendReply} className="flex items-center gap-2 bg-stone-50 rounded-xl border border-stone-200/80 p-2">
              <input
                type="text"
                value={threadDraft}
                onChange={e => setThreadDraft(e.target.value)}
                placeholder="Reply in thread..."
                className="flex-1 px-2 py-1 text-xs text-stone-900 bg-transparent outline-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={!threadDraft.trim()}
                className="p-1.5 rounded-lg bg-stone-900 text-white disabled:opacity-30 hover:bg-black transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <SendIcon size={12} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Channel Canvas & Pinned Assets View */
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-stone-900 mb-1">Channel Overview</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              {channelObj?.desc || 'Collaborative project space for deliverables, code reviews, and discussions.'}
            </p>
          </div>

          {/* Pinned Deliverables */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
              Pinned Deliverables ({initialTaskThreads.length})
            </h5>
            <div className="space-y-2">
              {initialTaskThreads.map(t => (
                <div key={t.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-stone-300 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {t.taskId}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {t.progress}% Done
                    </span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 leading-snug truncate">{t.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Assets & Links */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
              Shared Assets & Prototypes
            </h5>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center">
                  FIG
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-stone-800 truncate">Meridian_Foundations_v2.fig</div>
                  <div className="text-[10px] text-stone-400">Shared by Priya Nair · 4.2 MB</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                  API
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-stone-800 truncate">openapi_spec_v1.yaml</div>
                  <div className="text-[10px] text-stone-400">Shared by Marcus Webb · 18 KB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={() => toast.success('Notifications configured')}
              className="w-full text-center py-2 px-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all cursor-pointer"
            >
              Configure Channel Notifications
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}

/* =============================================================================
   MAIN MESSAGING PAGE
============================================================================= */
export default function MessagesPage() {
  const [spacesList, setSpacesList] = useState(initialSpacesChannels)
  const [dmsList, setDmsList] = useState(initialDMs)
  const [taskThreads, setTaskThreads] = useState(initialTaskThreads)

  // Directory Segregation Mode: 'all' | 'channels' | 'direct' | 'tasks'
  const [segregationTab, setSegregationTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Active Chat State
  const [activeId, setActiveId] = useState('general')
  const [activeType, setActiveType] = useState('channel') // 'channel' | 'dm' | 'task'

  // Messages State
  const [msgs, setMsgs] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeTaskEmbed, setActiveTaskEmbed] = useState(null)
  const [showTaskPicker, setShowTaskPicker] = useState(false)

  // Right Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('canvas') // 'thread' | 'canvas'
  const [selectedThreadMsg, setSelectedThreadMsg] = useState(null)

  // Modals and Dynamic Controls
  const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false)
  const [isHuddleActive, setIsHuddleActive] = useState(false)
  const [mobileDirectoryOpen, setMobileDirectoryOpen] = useState(false)

  const { fullName, initials } = useCurrentUser()
  const messagesEndRef = useRef(null)
  const composerInputRef = useRef(null)
  const searchInputRef = useRef(null)

  const userColor = '#8B5CF6'
  const userInitials = initials || 'AJ'

  const currentMsgCount = msgs[activeId]?.length || 0
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, currentMsgCount])

  // Global Keyboard Shortcuts (Escape to close modals/drawers, Cmd/Ctrl+K to focus search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsNewConvModalOpen(false)
        setShowEmojiPicker(false)
        setMobileDirectoryOpen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Flattened channel list for easy lookup
  const allChannels = useMemo(() => {
    return spacesList.flatMap(s => s.channels)
  }, [spacesList])

  const currentChannelObj = useMemo(() => {
    return allChannels.find(c => c.id === activeId)
  }, [allChannels, activeId])

  const currentDMObj = useMemo(() => {
    return dmsList.find(d => d.id === activeId)
  }, [dmsList, activeId])

  const currentTaskObj = useMemo(() => {
    return taskThreads.find(t => t.id === activeId)
  }, [taskThreads, activeId])

  const currentMessages = msgs[activeId] || []

  // Total Unread Count
  const totalUnread = useMemo(() => {
    const chanUnread = allChannels.reduce((sum, c) => sum + (c.unread || 0), 0)
    const dmUnread = dmsList.reduce((sum, d) => sum + (d.unread || 0), 0)
    const taskUnread = taskThreads.reduce((sum, t) => sum + (t.unread || 0), 0)
    return chanUnread + dmUnread + taskUnread
  }, [allChannels, dmsList, taskThreads])

  // Send Message Handler
  const handleSendMessage = (e) => {
    e?.preventDefault()
    if (!draft.trim() && !activeTaskEmbed) return

    const newMsg = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author: fullName || 'You',
      initials: userInitials,
      color: userColor,
      role: 'Engineering Lead',
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      date: 'Today',
      text: draft.trim(),
      taskEmbed: activeTaskEmbed || null,
      reactions: [],
      threadCount: 0,
      replies: []
    }

    setMsgs(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg]
    }))

    setDraft('')
    setActiveTaskEmbed(null)
    setShowEmojiPicker(false)
    setShowTaskPicker(false)
  }

  // Resilient Reaction Toggle (toggles off when already reacted, eliminates spam pumping)
  const handleAddReaction = useCallback((msgId, reactionType) => {
    setMsgs(prev => {
      const channelMsgs = prev[activeId] || []
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const reactions = m.reactions ? [...m.reactions] : []
          const existingIdx = reactions.findIndex(r => r.type === reactionType)

          if (existingIdx > -1) {
            const existing = { ...reactions[existingIdx] }
            const users = existing.users ? [...existing.users] : []
            const userIdx = users.indexOf(userInitials)

            if (userIdx > -1) {
              // User already reacted -> Toggle OFF
              users.splice(userIdx, 1)
              const newCount = existing.count - 1
              if (newCount <= 0 || users.length === 0) {
                reactions.splice(existingIdx, 1)
              } else {
                reactions[existingIdx] = { ...existing, count: newCount, users }
              }
            } else {
              // User hasn't reacted yet -> Increment & add user
              users.push(userInitials)
              reactions[existingIdx] = { ...existing, count: existing.count + 1, users }
            }
          } else {
            // New reaction type
            reactions.push({ type: reactionType, count: 1, users: [userInitials] })
          }
          return { ...m, reactions }
        }
        return m
      })
      return { ...prev, [activeId]: updated }
    })
  }, [activeId, userInitials])

  // Thread reply callback that directly syncs with parent message
  const handleAddThreadReply = useCallback((msgId, replyText) => {
    if (!replyText || !replyText.trim()) return

    const newReply = {
      id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author: fullName || 'You',
      initials: userInitials,
      color: userColor,
      role: 'Core Team',
      time: 'Just now',
      text: replyText.trim()
    }

    setMsgs(prev => {
      const channelMsgs = prev[activeId] || []
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const replies = [...(m.replies || []), newReply]
          return {
            ...m,
            replies,
            threadCount: Math.max((m.threadCount || 0) + 1, replies.length),
            threadPreview: `${newReply.author} replied`
          }
        }
        return m
      })
      return { ...prev, [activeId]: updated }
    })

    setSelectedThreadMsg(prev => {
      if (prev && prev.id === msgId) {
        const replies = [...(prev.replies || []), newReply]
        return {
          ...prev,
          replies,
          threadCount: Math.max((prev.threadCount || 0) + 1, replies.length),
          threadPreview: `${newReply.author} replied`
        }
      }
      return prev
    })

    toast.success('Reply added to thread')
  }, [activeId, fullName, userInitials, userColor])

  // Switch Conversation & Clear Unread Pill
  const switchConversation = (id, type) => {
    setActiveId(id)
    setActiveType(type)
    setMobileDirectoryOpen(false)

    // Clear unread count for the active channel, DM or task
    if (type === 'channel') {
      setSpacesList(prev => prev.map(s => ({
        ...s,
        channels: s.channels.map(c => c.id === id ? { ...c, unread: 0 } : c)
      })))
    } else if (type === 'dm') {
      setDmsList(prev => prev.map(d => d.id === id ? { ...d, unread: 0 } : d))
    } else if (type === 'task') {
      setTaskThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t))
    }
  }

  // Create Channel Handler
  const handleCreateChannel = ({ id, name, desc, space, isPrivate }) => {
    const newChan = {
      id,
      name,
      desc,
      unread: 0,
      pinned: false,
      memberCount: 1,
      isPrivate
    }

    setSpacesList(prev => {
      let spaceFound = false
      const updated = prev.map(s => {
        if (s.space === space) {
          spaceFound = true
          return { ...s, channels: [...s.channels, newChan] }
        }
        return s
      })
      if (!spaceFound) {
        return [...updated, { space, color: '#6366F1', channels: [newChan] }]
      }
      return updated
    })

    // Initialize empty message feed for the new channel
    setMsgs(prev => ({
      ...prev,
      [id]: [
        {
          id: `sys_${Date.now()}`,
          author: 'System',
          initials: 'SY',
          color: '#10B981',
          role: 'Workspace',
          time: 'Just now',
          date: 'Today',
          text: `Welcome to #${name}! This channel was created for: ${desc}.`
        }
      ]
    }))

    switchConversation(id, 'channel')
    toast.success(`Channel #${name} created!`)
  }

  // Select DM from Modal
  const handleSelectDM = (dmId) => {
    switchConversation(dmId, 'dm')
  }

  // Interactive Deliverable Click Handler
  const handleDeliverableClick = useCallback((taskId) => {
    const clean = taskId.toLowerCase().replace('-', '')
    const target = taskThreads.find(t => t.taskId.toLowerCase() === taskId.toLowerCase() || t.id.includes(clean))
    if (target) {
      switchConversation(target.id, 'task')
      toast.success(`Switched to ${target.taskId} discussion`)
    } else {
      toast.success(`Viewing deliverable ${taskId}`)
    }
  }, [taskThreads])

  const openThread = (message) => {
    setSelectedThreadMsg(message)
    setDrawerMode('thread')
    setDrawerOpen(true)
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        <Sidebar />

        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          <DynamicHeader
            onOpenNewTask={() => toast.success('Creating new channel')}
            onOpenSearch={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
            }}
          />

          {/* Main 3-Column Messaging Suite Container */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] mb-6">
            
            {/* =================================================================
                COLUMN 1: DIRECTORY & 3-TIER GROUP SEGREGATION RAIL (300px)
            ================================================================= */}
            <div
              className={`${
                mobileDirectoryOpen ? 'fixed inset-0 z-50 bg-white' : 'hidden'
              } md:relative md:flex md:w-[290px] lg:w-[320px] bg-[#FAFAF9] border-r border-stone-200/80 flex-col shrink-0`}
            >
              {/* Directory Header */}
              <div className="p-4 border-b border-stone-200/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900 tracking-tight">Messages</h2>
                    {totalUnread > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-600 text-white shadow-2xs">
                        {totalUnread} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsNewConvModalOpen(true)}
                      className="p-1.5 rounded-lg bg-stone-900 text-white hover:bg-black transition-all cursor-pointer shadow-xs active:scale-95"
                      title="New Conversation"
                    >
                      <PlusIcon size={13} />
                    </button>
                    <button
                      onClick={() => setMobileDirectoryOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 md:hidden cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                  <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search conversations... ⌘K"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all text-stone-800 placeholder:text-stone-400 font-medium"
                  />
                </div>

                {/* 3-Tier Filter Pills */}
                <div className="flex items-center gap-1 p-0.5 bg-stone-200/60 rounded-xl">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'channels', label: 'Channels' },
                    { id: 'dms', label: 'Direct' },
                    { id: 'tasks', label: 'Tasks' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSegregationTab(tab.id)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        segregationTab === tab.id
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Directory Scrollable List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                
                {/* 1. Space Channels Section */}
                {(segregationTab === 'all' || segregationTab === 'channels') && (
                  <div className="space-y-3">
                    {spacesList.map(sp => {
                      const matchingChannels = sp.channels.filter(c =>
                        c.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      if (matchingChannels.length === 0) return null

                      return (
                        <div key={sp.space} className="space-y-1">
                          <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sp.color }} />
                            <span>{sp.space}</span>
                          </div>
                          {matchingChannels.map(chan => {
                            const isActive = activeId === chan.id && activeType === 'channel'
                            return (
                              <button
                                key={chan.id}
                                onClick={() => switchConversation(chan.id, 'channel')}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-stone-900 text-white shadow-xs'
                                    : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`text-xs ${isActive ? 'text-lime-400 font-bold' : 'text-stone-400'}`}>
                                    {chan.isPrivate ? <LockIcon size={11} /> : '#'}
                                  </span>
                                  <span className="font-semibold truncate">{chan.name}</span>
                                </div>
                                {chan.unread > 0 && (
                                  <span
                                    className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                      isActive ? 'bg-white text-stone-900' : 'bg-violet-600 text-white'
                                    }`}
                                  >
                                    {chan.unread}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 2. Direct Messages Section */}
                {(segregationTab === 'all' || segregationTab === 'dms') && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Direct Messages
                    </div>
                    {dmsList
                      .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(dm => {
                        const isActive = activeId === dm.id && activeType === 'dm'
                        return (
                          <button
                            key={dm.id}
                            onClick={() => switchConversation(dm.id, 'dm')}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              isActive
                                ? 'bg-stone-900 text-white shadow-xs'
                                : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
                            }`}
                          >
                            <div className="relative shrink-0">
                              <div
                                className="w-7 h-7 rounded-lg text-white text-[9px] font-bold flex items-center justify-center shadow-xs"
                                style={{ backgroundColor: dm.color }}
                              >
                                {dm.initials}
                              </div>
                              <PresenceHalo status={dm.status} size="sm" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center justify-between">
                                <span className="font-bold truncate">{dm.name}</span>
                                <span className={`text-[9px] font-mono ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                                  {dm.time}
                                </span>
                              </div>
                              <div className={`text-[10px] truncate ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                                {dm.role} · {dm.lastMsg}
                              </div>
                            </div>
                            {dm.unread > 0 && (
                              <span
                                className={`shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold ${
                                  isActive ? 'bg-white text-stone-900' : 'bg-violet-600 text-white'
                                }`}
                              >
                                {dm.unread}
                              </span>
                            )}
                          </button>
                        )
                      })}
                  </div>
                )}

                {/* 3. Task-Bound Discussions Section */}
                {(segregationTab === 'all' || segregationTab === 'tasks') && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Task Discussions (MRD)
                    </div>
                    {taskThreads.map(task => {
                      const isActive = activeId === task.id && activeType === 'task'
                      return (
                        <button
                          key={task.id}
                          onClick={() => switchConversation(task.id, 'task')}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-stone-900 text-white border-stone-800 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                isActive ? 'bg-stone-800 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                              }`}
                            >
                              {task.taskId}
                            </span>
                            <span
                              className={`text-[9px] font-bold ${
                                isActive ? 'text-emerald-300' : 'text-emerald-700'
                              }`}
                            >
                              {task.progress}% done
                            </span>
                          </div>
                          <div className="text-xs font-bold truncate leading-tight mb-1">
                            {task.title}
                          </div>
                          <div className={`text-[10px] font-mono flex items-center gap-1.5 ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                            <span className="inline-flex items-center gap-1">
                              <MessageIcon size={11} className="text-stone-400" />
                              <span>{task.repliesCount} notes</span>
                            </span>
                            <span>•</span>
                            <span>{task.lastActivity} ago</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Empty State when Search or Filter has 0 items */}
                {((segregationTab === 'channels' && !spacesList.some(sp => sp.channels.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())))) ||
                  (segregationTab === 'dms' && !dmsList.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                  (segregationTab === 'tasks' && !taskThreads.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.taskId.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                  (segregationTab === 'all' && searchQuery.trim() &&
                    !spacesList.some(sp => sp.channels.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))) &&
                    !dmsList.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                    !taskThreads.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.taskId.toLowerCase().includes(searchQuery.toLowerCase()))
                  )) && (
                  <div className="py-8 text-center px-4">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-stone-200/60 flex items-center justify-center text-stone-400">
                      <SearchIcon size={14} />
                    </div>
                    <p className="text-xs font-bold text-stone-700">No conversations found</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Try searching with a different keyword</p>
                  </div>
                )}
              </div>

              {/* Presence Bar Footer */}
              <div className="p-3 border-t border-stone-200/60 bg-white/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                      {userInitials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 leading-tight">Alex Johnson</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Available (Flow State)</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsHuddleActive(prev => {
                      const next = !prev
                      if (next) toast.success('Voice huddle started')
                      return next
                    })
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isHuddleActive ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'border-stone-200 hover:bg-stone-100 text-stone-600'
                  }`}
                  title={isHuddleActive ? 'Huddle Active (Click to toggle)' : 'Instant Voice Huddle'}
                >
                  <PhoneIcon size={12} />
                </button>
              </div>
            </div>

            {/* =================================================================
                COLUMN 2: ACTIVE CONVERSATION STREAM (FLEX-1)
            ================================================================= */}
            <div className="flex-1 flex flex-col min-w-0 bg-white relative">
              
              {/* Conversation Top Header */}
              <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileDirectoryOpen(true)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 md:hidden cursor-pointer"
                  >
                    <Menu size={16} />
                  </button>

                  {/* Header Title based on type */}
                  <div className="min-w-0">
                    {activeType === 'channel' && (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 font-bold text-base">#</span>
                          <h3 className="text-base font-bold text-stone-900 tracking-tight">
                            {currentChannelObj?.name || 'general'}
                          </h3>
                          {currentChannelObj?.isPrivate && <LockIcon size={12} className="text-stone-400" />}
                          <span className="text-[10px] font-mono text-stone-400 ml-1">
                            {currentChannelObj?.memberCount || 24} members
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 truncate max-w-xl">
                          {currentChannelObj?.desc || 'Project channel discussions & updates'}
                        </p>
                      </div>
                    )}

                    {activeType === 'dm' && (
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div
                            className="w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: currentDMObj?.color || '#6366F1' }}
                          >
                            {currentDMObj?.initials || 'DM'}
                          </div>
                          <PresenceHalo status={currentDMObj?.status || 'online'} size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">{currentDMObj?.name}</span>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                              {currentDMObj?.role}
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-600 font-medium">
                            {currentDMObj?.statusText || 'Active now'}
                          </span>
                        </div>
                      </div>
                    )}

                    {activeType === 'task' && (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {currentTaskObj?.taskId}
                          </span>
                          <h3 className="text-sm font-bold text-stone-900 truncate">
                            {currentTaskObj?.title}
                          </h3>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold">
                          Sprint Deliverable · {currentTaskObj?.progress}% Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setIsHuddleActive(prev => {
                        const next = !prev
                        if (next) toast.success('Voice huddle started')
                        return next
                      })
                    }}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isHuddleActive ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                    title={isHuddleActive ? 'Audio Huddle Active (Click to toggle)' : 'Audio Huddle'}
                  >
                    <PhoneIcon size={13} />
                  </button>
                  <button
                    onClick={() => toast.success('Video session started')}
                    className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
                    title="Video Call"
                  >
                    <VideoIcon size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setDrawerMode('canvas')
                      setDrawerOpen(prev => !prev)
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      drawerOpen
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                    title="Toggle Canvas & Drawer"
                  >
                    <MoreHorizontalIcon size={14} />
                  </button>
                </div>
              </div>

              {/* Audio Huddle Live Capsule */}
              <AudioHuddleBar
                isActive={isHuddleActive}
                onLeave={() => setIsHuddleActive(false)}
                channelName={currentChannelObj?.name || currentDMObj?.name || 'discussion'}
              />

              {/* Message Feed Scrollable Stream */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {currentMessages.map((m, idx) => {
                  if (m.isDivider) {
                    return (
                      <div key={m.id} className="flex items-center gap-3 py-3">
                        <div className="flex-1 h-px bg-rose-200" />
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200">
                          {m.label}
                        </span>
                        <div className="flex-1 h-px bg-rose-200" />
                      </div>
                    )
                  }

                  const isOwn = m.author === (fullName || 'You') || m.author === 'Alex Johnson'

                  return (
                    <div
                      key={m.id}
                      className="group relative flex items-start gap-3.5 p-2 rounded-2xl hover:bg-stone-50/80 transition-colors"
                    >
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-xl text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs mt-0.5"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.initials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-bold text-stone-900">{m.author}</span>
                          {m.role && (
                            <span className="text-[10px] font-medium text-stone-400">
                              {m.role}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400 font-mono">{m.time}</span>
                        </div>

                        {/* Rich Text / Markdown / Code / Deliverable Tags */}
                        <RichMessageText
                          text={m.text}
                          onDeliverableClick={handleDeliverableClick}
                        />

                        {/* Inline Task Card Embed */}
                        {m.taskEmbed && (
                          <div className="mt-2 p-3 rounded-2xl bg-stone-50 border border-stone-200 max-w-md shadow-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                                {m.taskEmbed.taskId}
                              </span>
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                {m.taskEmbed.priority}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-stone-900 mb-2">
                              {m.taskEmbed.title}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${m.taskEmbed.progress}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono font-bold text-emerald-700">
                                {m.taskEmbed.progress}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Code Snippet Embed */}
                        {m.codeSnippet && (
                          <div className="mt-2 p-3 rounded-xl bg-stone-900 text-emerald-400 font-mono text-xs overflow-x-auto relative group/code shadow-xs">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(m.codeSnippet.code)
                                toast.success('Snippet copied!')
                              }}
                              className="absolute right-2 top-2 p-1 rounded bg-stone-800 text-stone-400 hover:text-white transition-colors"
                              title="Copy Code"
                            >
                              <CopyIcon size={12} />
                            </button>
                            <code>{m.codeSnippet.code}</code>
                          </div>
                        )}

                        {/* Reaction Badges */}
                        {m.reactions && m.reactions.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {m.reactions.map((r, ri) => {
                              const config = CORE_REACTIONS.find(cr => cr.id === r.type)
                              const IconComp = config?.Icon || ThumbsUpIcon
                              const hasReacted = r.users?.includes(userInitials)
                              return (
                                <button
                                  key={ri}
                                  onClick={() => handleAddReaction(m.id, r.type)}
                                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border transition-all cursor-pointer hover:scale-105 ${config?.bg} ${config?.color} ${config?.border} ${
                                    hasReacted ? 'ring-1.5 ring-stone-900 font-bold shadow-xs' : ''
                                  } shadow-2xs`}
                                  title={`${r.count} reaction${r.count > 1 ? 's' : ''}${hasReacted ? ' (Click to toggle off)' : ''}`}
                                >
                                  <IconComp size={11} strokeWidth={2} />
                                  <span className="text-[10px] font-bold">{r.count}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {/* Thread Replies Preview */}
                        {m.threadCount > 0 && (
                          <button
                            onClick={() => openThread(m)}
                            className="mt-2 flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group/th"
                          >
                            <MessageIcon size={12} />
                            <span>{m.threadCount} replies</span>
                            {m.threadPreview && (
                              <span className="text-stone-400 font-normal">· {m.threadPreview}</span>
                            )}
                            <ChevronRightIcon size={10} className="text-stone-400 group-hover/th:translate-x-0.5 transition-transform" />
                          </button>
                        )}
                      </div>

                      {/* Floating Message Hover Quick-Bar */}
                      <div className="absolute right-3 -top-3 opacity-0 group-hover:opacity-100 transition-all z-10">
                        <div className="flex items-center bg-white border border-stone-200/90 rounded-xl shadow-md p-0.5 gap-0.5">
                          {CORE_REACTIONS.slice(0, 4).map(cr => (
                            <button
                              key={cr.id}
                              onClick={() => handleAddReaction(m.id, cr.id)}
                              className={`p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer ${cr.color}`}
                              title={cr.label}
                            >
                              <cr.Icon size={13} />
                            </button>
                          ))}
                          <div className="w-px h-4 bg-stone-200 mx-0.5" />
                          <button
                            onClick={() => openThread(m)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                            title="Reply in thread"
                          >
                            <MessageIcon size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* ===============================================================
                  FLOATING TACTILE COMPOSER
              =============================================================== */}
              <div className="p-4 border-t border-stone-100 bg-white">
                {/* Active Embed Attachment Banner */}
                {activeTaskEmbed && (
                  <div className="mb-2 p-2 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-900">
                      Linking deliverable: {activeTaskEmbed.taskId} · {activeTaskEmbed.title}
                    </span>
                    <button
                      onClick={() => setActiveTaskEmbed(null)}
                      className="text-indigo-600 hover:text-indigo-900 font-bold px-2 py-0.5 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="bg-stone-50/90 rounded-2xl border border-stone-200/80 shadow-xs focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200 focus-within:bg-white transition-all"
                >
                  <div className="p-3">
                    <textarea
                      ref={composerInputRef}
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder={`Message in #${currentChannelObj?.name || currentDMObj?.name || 'discussion'}...`}
                      rows={2}
                      className="w-full text-xs text-stone-900 bg-transparent outline-none resize-none placeholder:text-stone-400 leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 border-t border-stone-100/80">
                    {/* Quick Tools */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toast.success('File attachment dialog')}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
                        title="Attach File"
                      >
                        <AttachIcon size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const sample = initialTaskThreads[0]
                          setActiveTaskEmbed(sample)
                          toast.success(`Attached ${sample.taskId}`)
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
                        title="Link Sprint Deliverable"
                      >
                        <span className="font-mono text-xs font-bold">#</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDraft(prev => prev + '\n```javascript\n// write code here\n```\n')
                          composerInputRef.current?.focus()
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer font-mono text-xs"
                        title="Insert Code Snippet"
                      >
                        {'{ }'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
                        title="Add Reaction"
                      >
                        <SmileIcon size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success('Recording audio note...')}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
                        title="Record Voice Note"
                      >
                        <MicIcon size={14} />
                      </button>
                    </div>

                    {/* Send Button & Helper */}
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                        Press ↵ to send
                      </span>
                      <button
                        type="submit"
                        disabled={!draft.trim() && !activeTaskEmbed}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                          draft.trim() || activeTaskEmbed
                            ? 'bg-stone-900 text-white hover:bg-black hover:shadow-md'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Send</span>
                        <SendIcon size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Emoji Quick Picker Popover */}
                  {showEmojiPicker && (
                    <div className="p-2 border-t border-stone-100 flex items-center gap-1 flex-wrap bg-white rounded-b-2xl">
                      {CORE_REACTIONS.map(cr => (
                        <button
                          key={cr.id}
                          type="button"
                          onClick={() => {
                            setDraft(prev => prev + ` :${cr.id}: `)
                            setShowEmojiPicker(false)
                            composerInputRef.current?.focus()
                          }}
                          className={`p-1.5 rounded-lg hover:bg-stone-100 text-xs font-bold ${cr.color} flex items-center gap-1`}
                        >
                          <cr.Icon size={13} />
                          <span className="text-[10px]">{cr.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* =================================================================
                COLUMN 3: COLLAPSIBLE THREAD & CANVAS DRAWER (360px)
            ================================================================= */}
            {drawerOpen && (
              <ContextDrawer
                mode={drawerMode}
                setMode={setDrawerMode}
                message={selectedThreadMsg}
                channelObj={currentChannelObj}
                onClose={() => setDrawerOpen(false)}
                userInitials={userInitials}
                userColor={userColor}
                fullName={fullName}
                onAddReply={handleAddThreadReply}
              />
            )}
          </div>
        </main>

        {/* Modal for Creating New Channels & Direct Messages */}
        <NewConversationModal
          isOpen={isNewConvModalOpen}
          onClose={() => setIsNewConvModalOpen(false)}
          onAddChannel={handleCreateChannel}
          onSelectDM={handleSelectDM}
          spacesList={spacesList}
          dmsList={dmsList}
        />
      </div>
    </ProtectedRoute>
  )
}
