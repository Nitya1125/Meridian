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
  MessageIcon, ClockIcon, CopyIcon, TrashIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useTasks } from '@/context/TaskContext'

/* ---- REACTIONS CONFIG ---- */
const CORE_REACTIONS = [
  { id: 'thumbsUp', label: 'Agree', Icon: ThumbsUpIcon, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'heart', label: 'Love', Icon: HeartIcon, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'flame', label: 'Fire', Icon: FlameIcon, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'rocket', label: 'Ship it', Icon: RocketIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
  { id: 'clap', label: 'Applause', Icon: ClapIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'party', label: 'Celebrate', Icon: PartyIcon, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'check', label: 'Done', Icon: CheckCircleIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'bulb', label: 'Idea', Icon: BulbIcon, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'eye', label: 'Seen', Icon: EyeIcon, color: 'text-stone-500', bg: 'bg-stone-50' }
]

/* ---- MOCK CHANNELS ---- */
const initialChannels = [
  { id: 'general', name: 'general', unread: 3, pinned: true, desc: 'Company-wide announcements & team standup', memberCount: 24, isPrivate: false },
  { id: 'engineering', name: 'engineering', unread: 0, pinned: true, desc: 'Architecture, PR reviews, and release pipeline', memberCount: 12, isPrivate: false },
  { id: 'design', name: 'design', unread: 1, pinned: false, desc: 'Figma specs, mockups, and visual critique', memberCount: 8, isPrivate: false },
  { id: 'product', name: 'product', unread: 7, pinned: false, desc: 'Sprint roadmaps and user journey specs', memberCount: 10, isPrivate: false },
  { id: 'releases', name: 'releases', unread: 0, pinned: false, desc: 'Changelogs, deployment alerts, and hotfixes', memberCount: 18, isPrivate: false },
  { id: 'random', name: 'random', unread: 2, pinned: false, desc: 'Watercooler vibes - memes, music, and banter', memberCount: 24, isPrivate: false },
  { id: 'incidents', name: 'incidents', unread: 0, pinned: false, desc: 'Incident response & post-mortem coordination', memberCount: 6, isPrivate: true },
]

/* ---- MOCK DMs ---- */
const initialDMs = [
  { id: 'dm_sarah', name: 'Sarah Chen', initials: 'SC', color: '#6366f1', online: true, lastMsg: 'Sounds good, let me push the branch', unread: 1, role: 'Full-Stack' },
  { id: 'dm_marcus', name: 'Marcus Webb', initials: 'MW', color: '#10b981', online: true, lastMsg: 'DB migration ran successfully', unread: 0, role: 'Backend' },
  { id: 'dm_priya', name: 'Priya Nair', initials: 'PN', color: '#f59e0b', online: false, lastMsg: 'Updated the Figma board', unread: 0, role: 'Product Designer' },
  { id: 'dm_kai', name: 'Kai Okafor', initials: 'KO', color: '#ef4444', online: true, lastMsg: 'Deploying hotfix now', unread: 3, role: 'DevOps' },
  { id: 'dm_jordan', name: 'Jordan Lee', initials: 'JL', color: '#0ea5e9', online: false, lastMsg: 'PR merged into main', unread: 0, role: 'Frontend' },
]

/* ---- MOCK MESSAGES ---- */
const initialMessages = {
  general: [
    { id: 'm1', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '9:02 AM', date: 'Today', text: 'Morning everyone. Quick reminder - Sprint 14 review is this Friday at 3pm. Please make sure your tasks are updated on the board before then.', reactions: [], threadCount: 2, threadPreview: 'Sarah Chen replied' },
    { id: 'm2', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '9:08 AM', date: 'Today', text: 'On it! OAuth2 integration is almost wrapped up. Just finishing the GitHub provider - should be done by EOD today.', reactions: [{ type: 'flame', count: 4, users: ['AJ','MW','KO','JL'] }, { type: 'clap', count: 2, users: ['AJ','PN'] }] },
    { id: 'm3', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '9:15 AM', date: 'Today', text: 'Stripe webhook handlers are deployed to staging. Need someone from QA to run through the payment flows. @Nadia can you pick this up today?', reactions: [], threadCount: 0 },
    { id: 'm4', author: 'Nadia Kowalski', initials: 'NK', color: '#ec4899', time: '9:17 AM', date: 'Today', text: "Sure! I'll get to it after standup. Should have a report ready by 2pm.", reactions: [{ type: 'check', count: 1, users: ['MW'] }] },
    { id: 'm5', author: 'Priya Nair', initials: 'PN', color: '#f59e0b', time: '9:31 AM', date: 'Today', text: 'Just pushed the updated design specs for the Customer Portal dashboard to Figma. Would love some feedback before I start handoff. Link in #design.', reactions: [], threadCount: 4, threadPreview: 'Jordan Lee, Kai Okafor replied' },
    { id: 'm6', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '9:44 AM', date: 'Today', text: 'Heads up - deployed a fix for the auth service memory leak we spotted yesterday. Monitor is green. Tagging this for the post-mortem doc.', reactions: [{ type: 'rocket', count: 2, users: ['AJ','MW'] }] },
    { id: 'm_divider', isDivider: true, label: 'New messages' },
    { id: 'm7', author: 'Jordan Lee', initials: 'JL', color: '#0ea5e9', time: '10:03 AM', date: 'Today', text: 'The new landing page is live on staging! Can everyone take a quick look? Performance scores are looking really solid - 97 on Lighthouse.', reactions: [{ type: 'rocket', count: 6, users: ['AJ','MW','SC','PN','NK','KO'] }, { type: 'heart', count: 3, users: ['PN','NK','SC'] }] },
    { id: 'm8', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '10:11 AM', date: 'Today', text: "Fantastic work Jordan. That's a big jump from where we were last week. Let's use this as the benchmark going forward.", reactions: [{ type: 'thumbsUp', count: 5, users: ['SC','MW','JL','PN','KO'] }] },
  ],
  engineering: [
    { id: 'me1', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '11:00 AM', date: 'Today', text: 'Database indexes have been applied to MySQL production replica. Query performance report incoming.', reactions: [{ type: 'check', count: 2, users: ['AJ','KO'] }], threadCount: 3, threadPreview: 'Alex Johnson replied' },
    { id: 'me2', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '11:05 AM', date: 'Today', text: 'Great! Latency down by 42% on task queries. Huge win for the dashboard load times.', reactions: [{ type: 'flame', count: 3, users: ['MW','SC','JL'] }] },
    { id: 'me3', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '11:22 AM', date: 'Today', text: 'Opened PR #847 for the OAuth2 GitHub provider. It adds the callback route, token exchange, and user profile mapping. Review appreciated!', reactions: [{ type: 'eye', count: 1, users: ['MW'] }], threadCount: 1, threadPreview: 'Marcus Webb replied' },
    { id: 'me4', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '11:41 AM', date: 'Today', text: "CI pipeline is green across all environments. I've added a canary deployment step for the next release.", reactions: [] },
  ],
  design: [
    { id: 'md1', author: 'Priya Nair', initials: 'PN', color: '#f59e0b', time: '11:30 AM', date: 'Today', text: 'New color token system exported for warm stone canvas. Design tokens are in the shared Figma library now.', reactions: [{ type: 'heart', count: 2, users: ['AJ','JL'] }], threadCount: 2, threadPreview: 'Jordan Lee replied' },
    { id: 'md2', author: 'Jordan Lee', initials: 'JL', color: '#0ea5e9', time: '11:45 AM', date: 'Today', text: "Love the new token system Priya. The stone-50 through stone-900 gradation feels much more cohesive.", reactions: [{ type: 'thumbsUp', count: 1, users: ['PN'] }] },
  ],
  product: [
    { id: 'mp1', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '12:00 PM', date: 'Today', text: "Sprint 15 backlog grooming starts at 4pm. Please review the board and flag any blockers.", reactions: [] },
    { id: 'mp2', author: 'Nadia Kowalski', initials: 'NK', color: '#ec4899', time: '12:15 PM', date: 'Today', text: "QA report for the payment flows is ready. 2 minor issues found - neither are blockers.", reactions: [{ type: 'check', count: 1, users: ['AJ'] }] },
  ],
  releases: [
    { id: 'mr1', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '12:30 PM', date: 'Today', text: 'v1.8.4 zero-downtime release successfully deployed to production cluster.', reactions: [{ type: 'rocket', count: 4, users: ['AJ','MW','SC','JL'] }, { type: 'party', count: 3, users: ['PN','NK','AJ'] }] },
  ],
  random: [
    { id: 'mrand1', author: 'Jordan Lee', initials: 'JL', color: '#0ea5e9', time: '1:00 PM', date: 'Today', text: 'Anyone up for a coffee run? The new place on 5th has single-origin pour-overs.', reactions: [{ type: 'heart', count: 3, users: ['SC','PN','NK'] }] },
    { id: 'mrand2', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '1:03 PM', date: 'Today', text: 'Count me in! Need the caffeine after that debugging session', reactions: [] },
  ],
  incidents: [
    { id: 'minc1', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '2:00 PM', date: 'Today', text: 'All systems nominal. Last incident (auth memory leak) resolved 18h ago. Post-mortem doc is in the shared drive.', reactions: [{ type: 'check', count: 2, users: ['AJ','MW'] }] },
  ],
  dm_sarah: [
    { id: 'dms1', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '2:15 PM', date: 'Today', text: 'Hey, I pushed the OAuth branch. Can you take a look at the token refresh logic?', reactions: [] },
    { id: 'dms2', author: 'You', initials: 'AJ', color: '#8b5cf6', time: '2:18 PM', date: 'Today', text: "Sure, pulling it now. I'll check the refresh token rotation too.", reactions: [] },
    { id: 'dms3', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '2:20 PM', date: 'Today', text: 'Sounds good, let me push the branch', reactions: [] },
  ],
  dm_marcus: [
    { id: 'dmm1', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '11:30 AM', date: 'Today', text: 'The index migration is queued for production. Estimated downtime: zero.', reactions: [] },
    { id: 'dmm2', author: 'You', initials: 'AJ', color: '#8b5cf6', time: '11:32 AM', date: 'Today', text: "Perfect. Let me know when it is done.", reactions: [] },
    { id: 'dmm3', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '11:50 AM', date: 'Today', text: 'DB migration ran successfully', reactions: [{ type: 'check', count: 1, users: ['AJ'] }] },
  ],
  dm_priya: [
    { id: 'dmp1', author: 'Priya Nair', initials: 'PN', color: '#f59e0b', time: '10:00 AM', date: 'Today', text: 'Updated the Figma board with the new dashboard layout.', reactions: [] },
  ],
  dm_kai: [
    { id: 'dmk1', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '3:00 PM', date: 'Today', text: 'Found a regression in the staging deploy. Rolling back now.', reactions: [] },
    { id: 'dmk2', author: 'You', initials: 'AJ', color: '#8b5cf6', time: '3:02 PM', date: 'Today', text: 'What broke? Need me to jump in?', reactions: [] },
    { id: 'dmk3', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '3:05 PM', date: 'Today', text: 'Deploying hotfix now. Wrong env variable on staging.', reactions: [] },
  ],
  dm_jordan: [
    { id: 'dmj1', author: 'Jordan Lee', initials: 'JL', color: '#0ea5e9', time: '4:00 PM', date: 'Yesterday', text: 'PR merged into main. Lighthouse score is holding at 97.', reactions: [{ type: 'rocket', count: 1, users: ['AJ'] }] },
  ],
}

/* ---- ONLINE USERS ---- */
const onlineUsers = [
  { initials: 'AJ', color: '#8b5cf6', name: 'Alex Johnson', role: 'Engineering Lead', online: true },
  { initials: 'SC', color: '#6366f1', name: 'Sarah Chen', role: 'Full-Stack', online: true },
  { initials: 'MW', color: '#10b981', name: 'Marcus Webb', role: 'Backend', online: true },
  { initials: 'KO', color: '#ef4444', name: 'Kai Okafor', role: 'DevOps', online: true },
  { initials: 'JL', color: '#0ea5e9', name: 'Jordan Lee', role: 'Frontend', online: false },
  { initials: 'PN', color: '#f59e0b', name: 'Priya Nair', role: 'Product Designer', online: false },
  { initials: 'NK', color: '#ec4899', name: 'Nadia Kowalski', role: 'QA Engineer', online: true },
]

/* ---- TYPING INDICATOR ---- */
function TypingIndicator({ names }) {
  if (!names || names.length === 0) return null
  const label = names.length === 1
    ? `${names[0]} is typing`
    : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]} and ${names.length - 1} others are typing`
  return (
    <div className="flex items-center gap-2 px-6 py-2 text-[11px] text-stone-500">
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="font-medium">{label}</span>
    </div>
  )
}

/* ---- MESSAGE HOVER TOOLBAR ---- */
function MessageToolbar({ onReaction, onThread, onMore }) {
  return (
    <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-all duration-150 z-10">
      <div className="flex items-center bg-white border border-stone-200 rounded-xl shadow-lg p-0.5 gap-0.5">
        {CORE_REACTIONS.slice(0, 4).map(({ id, Icon, color, label }) => (
          <button key={id} onClick={() => onReaction(id)} title={label} className={`p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer ${color}`}>
            <Icon size={14} strokeWidth={2} />
          </button>
        ))}
        <div className="w-px h-5 bg-stone-200 mx-0.5" />
        <button onClick={onThread} title="Reply in thread" className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer text-stone-500 hover:text-stone-800">
          <MessageIcon size={14} />
        </button>
        <button onClick={onMore} title="More actions" className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer text-stone-500 hover:text-stone-800">
          <MoreHorizontalIcon size={14} />
        </button>
      </div>
    </div>
  )
}

/* ---- THREAD PANEL ---- */
function ThreadPanel({ message, onClose, userInitials, userColor, fullName }) {
  const [threadDraft, setThreadDraft] = useState('')
  const [threadReplies, setThreadReplies] = useState([
    { id: 'tr1', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '9:12 AM', text: "I'll have the PR ready for review by noon." },
    { id: 'tr2', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '9:18 AM', text: 'Let me know if you need help with the database session store.' },
  ])
  const sendReply = (e) => {
    e.preventDefault()
    if (!threadDraft.trim()) return
    setThreadReplies(prev => [...prev, { id: `tr_${Date.now()}`, author: fullName || 'You', initials: userInitials || '?', color: userColor || '#111318', time: 'Just now', text: threadDraft.trim() }])
    setThreadDraft('')
    toast.success('Reply sent')
  }
  return (
    <div className="w-full md:w-96 border-l border-stone-200/80 bg-white flex flex-col">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-stone-900">Thread</h3>
          <p className="text-[10px] text-stone-400 font-mono mt-0.5">{threadReplies.length + 1} replies</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      {message && (
        <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: message.color }}>{message.initials}</div>
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
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {threadReplies.map(r => (
          <div key={r.id} className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: r.color }}>{r.initials}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-[11px] font-bold text-stone-900">{r.author}</span>
                <span className="text-[10px] text-stone-400 font-mono">{r.time}</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-stone-100">
        <form onSubmit={sendReply} className="flex items-center gap-2 bg-stone-50 rounded-xl border border-stone-200/80 p-2">
          <input type="text" value={threadDraft} onChange={e => setThreadDraft(e.target.value)} placeholder="Reply..." className="flex-1 px-2 py-1 text-xs text-stone-900 bg-transparent outline-none" />
          <button type="submit" disabled={!threadDraft.trim()} className="p-1.5 rounded-lg bg-stone-900 text-white disabled:opacity-30 hover:bg-black transition-all cursor-pointer shadow-sm">
            <SendIcon size={12} />
          </button>
        </form>
      </div>
    </div>
  )
}


/* ============= MAIN COMPONENT ============= */
export default function MessagesPage() {
  const [channels] = useState(initialChannels)
  const [dms] = useState(initialDMs)
  const [activeChannel, setActiveChannel] = useState('general')
  const [isDM, setIsDM] = useState(false)
  const [draft, setDraft] = useState('')
  const [msgs, setMsgs] = useState(initialMessages)
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const [searchChannel, setSearchChannel] = useState('')
  const [threadMessage, setThreadMessage] = useState(null)
  const [showChannelInfo, setShowChannelInfo] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [expandedSections, setExpandedSections] = useState({ pinned: true, channels: true, dms: true })
  const [moreMenuId, setMoreMenuId] = useState(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const { fullName, initials } = useCurrentUser()
  const messagesEndRef = useRef(null)
  const composerRef = useRef(null)

  const userColor = '#8b5cf6'
  const userInitials = initials || 'AJ'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChannel, msgs])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        const typists = ['Sarah Chen', 'Marcus Webb', 'Kai Okafor']
        const count = Math.random() < 0.7 ? 1 : 2
        setTypingUsers(typists.slice(0, count))
        setTimeout(() => setTypingUsers([]), 3000 + Math.random() * 2000)
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const currentMsgs = msgs[activeChannel] || []
  const activeChanObj = channels.find(c => c.id === activeChannel)
  const activeDMObj = dms.find(d => d.id === activeChannel)

  const channelDisplayName = isDM ? (activeDMObj?.name || 'Direct Message') : (activeChanObj?.name || 'general')
  const channelDesc = isDM ? (activeDMObj?.role || '') : (activeChanObj?.desc || '')

  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchChannel.toLowerCase()))
  const pinnedChannels = filteredChannels.filter(c => c.pinned)
  const regularChannels = filteredChannels.filter(c => !c.pinned)
  const filteredDMs = dms.filter(d => d.name.toLowerCase().includes(searchChannel.toLowerCase()))

  const send = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    const newM = {
      id: `m_${Date.now()}`, author: fullName || 'You', initials: userInitials, color: userColor,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      date: 'Today', text: draft.trim(), reactions: []
    }
    setMsgs(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), newM] }))
    setDraft('')
    setShowReactionPicker(null)
  }

  const addReaction = useCallback((msgId, reactionType) => {
    setMsgs(prev => {
      const channelMsgs = prev[activeChannel] || []
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const reactions = m.reactions ? [...m.reactions] : []
          const existing = reactions.find(r => r.type === reactionType)
          if (existing) { existing.count += 1; existing.users = [...(existing.users || []), userInitials] }
          else { reactions.push({ type: reactionType, count: 1, users: [userInitials] }) }
          return { ...m, reactions }
        }
        return m
      })
      return { ...prev, [activeChannel]: updated }
    })
    setShowReactionPicker(null)
  }, [activeChannel, userInitials])

  const toggleSection = (section) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  const switchToChannel = (channelId) => { setActiveChannel(channelId); setIsDM(false); setThreadMessage(null); setMobileSidebarOpen(false) }
  const switchToDM = (dmId) => { setActiveChannel(dmId); setIsDM(true); setThreadMessage(null); setMobileSidebarOpen(false) }

  const totalUnread = useMemo(() => {
    return channels.reduce((sum, c) => sum + (c.unread || 0), 0) + dms.reduce((sum, d) => sum + (d.unread || 0), 0)
  }, [channels, dms])


  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">
          <DynamicHeader onOpenNewTask={() => toast.success('Creating new channel')} onOpenSearch={() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })) }} />

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col md:flex-row h-[calc(100vh-160px)] mb-6">

            {/* LEFT: Channel Sidebar */}
            <div className={`${mobileSidebarOpen ? 'fixed inset-0 z-50 bg-white' : 'hidden'} md:relative md:block md:w-72 lg:w-80 bg-[#FAFAF9] border-r border-stone-200/80 flex flex-col`}>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 tracking-tight">Messages</h2>
                    {totalUnread > 0 && <p className="text-[10px] text-stone-400 font-mono mt-0.5">{totalUnread} unread</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toast.success('Create channel modal')} className="p-2 rounded-xl hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer" title="New channel"><PlusIcon size={14} /></button>
                    <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-xl hover:bg-stone-200/70 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer md:hidden">
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>

                <div className="relative mb-5">
                  <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input type="text" placeholder="Search conversations..." value={searchChannel} onChange={e => setSearchChannel(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all text-stone-700 placeholder:text-stone-400" />
                </div>

                {/* Pinned */}
                {pinnedChannels.length > 0 && (
                  <div className="mb-4">
                    <button onClick={() => toggleSection('pinned')} className="flex items-center gap-1.5 px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-600 cursor-pointer w-full transition-colors">
                      <ChevronRightIcon size={10} className={`transition-transform duration-200 ${expandedSections.pinned ? 'rotate-90' : ''}`} />
                      <StarIcon size={10} /><span>Starred</span><span className="text-stone-300 ml-auto">{pinnedChannels.length}</span>
                    </button>
                    {expandedSections.pinned && <div className="mt-1.5 space-y-0.5">{pinnedChannels.map(c => <ChannelButton key={c.id} channel={c} isActive={activeChannel === c.id && !isDM} onClick={() => switchToChannel(c.id)} />)}</div>}
                  </div>
                )}

                {/* Channels */}
                <div className="mb-4">
                  <button onClick={() => toggleSection('channels')} className="flex items-center gap-1.5 px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-600 cursor-pointer w-full transition-colors">
                    <ChevronRightIcon size={10} className={`transition-transform duration-200 ${expandedSections.channels ? 'rotate-90' : ''}`} />
                    <HashIcon size={10} /><span>Channels</span><span className="text-stone-300 ml-auto">{regularChannels.length}</span>
                  </button>
                  {expandedSections.channels && <div className="mt-1.5 space-y-0.5">{regularChannels.map(c => <ChannelButton key={c.id} channel={c} isActive={activeChannel === c.id && !isDM} onClick={() => switchToChannel(c.id)} />)}</div>}
                </div>

                {/* DMs */}
                <div className="mb-4">
                  <button onClick={() => toggleSection('dms')} className="flex items-center gap-1.5 px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-600 cursor-pointer w-full transition-colors">
                    <ChevronRightIcon size={10} className={`transition-transform duration-200 ${expandedSections.dms ? 'rotate-90' : ''}`} />
                    <MessageIcon size={10} /><span>Direct Messages</span><span className="text-stone-300 ml-auto">{filteredDMs.length}</span>
                  </button>
                  {expandedSections.dms && (
                    <div className="mt-1.5 space-y-0.5">
                      {filteredDMs.map(dm => (
                        <button key={dm.id} onClick={() => switchToDM(dm.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${activeChannel === dm.id && isDM ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'}`}>
                          <div className="relative shrink-0">
                            <div className="w-7 h-7 rounded-lg text-white text-[9px] font-bold flex items-center justify-center shadow-sm" style={{ backgroundColor: dm.color }}>{dm.initials}</div>
                            {dm.online && <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${activeChannel === dm.id && isDM ? 'bg-emerald-400 border-stone-900' : 'bg-emerald-500 border-[#FAFAF9]'}`} />}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-semibold truncate">{dm.name}</div>
                            <div className="text-[10px] truncate mt-0.5 text-stone-400">{dm.lastMsg}</div>
                          </div>
                          {dm.unread > 0 && <span className={`shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-bold ${activeChannel === dm.id && isDM ? 'bg-white text-stone-900' : 'bg-violet-600 text-white'}`}>{dm.unread}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Online Now */}
              <div className="p-4 border-t border-stone-200/60">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">Online - {onlineUsers.filter(u => u.online).length}</div>
                <div className="flex flex-wrap gap-1">
                  {onlineUsers.filter(u => u.online).map((u, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg text-white text-[9px] font-bold flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: u.color }} title={`${u.name} - ${u.role}`}>{u.initials}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER: Message Feed */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Channel Header */}
              <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 md:hidden cursor-pointer">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isDM ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg text-white text-[8px] font-bold flex items-center justify-center shadow-sm" style={{ backgroundColor: activeDMObj?.color || '#666' }}>{activeDMObj?.initials || '?'}</div>
                          <span className="text-sm font-bold text-stone-900">{channelDisplayName}</span>
                          {activeDMObj?.online && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-bold text-stone-900"><span className="text-stone-400 mr-0.5">#</span>{channelDisplayName}</span>
                          {activeChanObj?.memberCount && <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1"><UserIcon size={10} /> {activeChanObj.memberCount}</span>}
                        </>
                      )}
                    </div>
                    {channelDesc && <p className="text-[11px] text-stone-400 mt-0.5 truncate max-w-md">{channelDesc}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toast.success('Voice huddle starting...')} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer" title="Voice huddle"><PhoneIcon size={14} /></button>
                  <button onClick={() => toast.success('Video call starting...')} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer" title="Video call"><VideoIcon size={14} /></button>
                  {!isDM && <button onClick={() => setShowChannelInfo(!showChannelInfo)} className={`p-2 rounded-xl transition-colors cursor-pointer ${showChannelInfo ? 'bg-stone-900 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'}`} title="Channel details"><MoreHorizontalIcon size={14} /></button>}
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-5 py-5 space-y-1">
                  {currentMsgs.length > 0 && !isDM && (
                    <div className="pb-6 mb-4 border-b border-stone-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white text-sm font-bold flex items-center justify-center shadow-md">#</div>
                        <div>
                          <h3 className="text-base font-bold text-stone-900">{channelDisplayName}</h3>
                          <p className="text-[11px] text-stone-400">{channelDesc}</p>
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">This is the start of <span className="font-bold text-stone-700">#{channelDisplayName}</span>.</p>
                    </div>
                  )}

                  {currentMsgs.map((m, idx) => {
                    if (m.isDivider) {
                      return (
                        <div key={m.id} className="flex items-center gap-3 py-3">
                          <div className="flex-1 h-px bg-rose-200" />
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200">{m.label}</span>
                          <div className="flex-1 h-px bg-rose-200" />
                        </div>
                      )
                    }
                    const prev = currentMsgs[idx - 1]
                    const isGrouped = prev && !prev.isDivider && prev.author === m.author && prev.date === m.date

                    return (
                      <div key={m.id} className={`group relative flex items-start gap-3 px-2 py-1.5 rounded-xl hover:bg-stone-50/80 transition-colors ${isGrouped ? '-mt-1' : 'mt-2'}`}>
                        {isGrouped ? (
                          <div className="w-8 shrink-0 flex items-center justify-center">
                            <span className="text-[9px] text-stone-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{m.time?.replace(/ [AP]M/, '')}</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm mt-0.5 cursor-pointer hover:shadow-md transition-shadow" style={{ backgroundColor: m.color }} title={m.author}>{m.initials}</div>
                        )}
                        <div className="flex-1 min-w-0">
                          {!isGrouped && (
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="text-[13px] font-bold text-stone-900 hover:underline cursor-pointer">{m.author}</span>
                              <span className="text-[10px] text-stone-400 font-mono">{m.time}</span>
                            </div>
                          )}
                          <div className="text-[13px] text-stone-800 leading-relaxed">
                            {m.text.split(/(@\w+)/g).map((part, pi) =>
                              part.startsWith('@') ? <span key={pi} className="text-violet-600 font-semibold bg-violet-50 px-1 rounded cursor-pointer hover:bg-violet-100 transition-colors">{part}</span> : <span key={pi}>{part}</span>
                            )}
                          </div>
                          {m.reactions && m.reactions.length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              {m.reactions.map((r, ri) => {
                                const config = CORE_REACTIONS.find(cr => cr.id === r.type)
                                const IconComp = config?.Icon || ThumbsUpIcon
                                const isOwn = r.users?.includes(userInitials)
                                return (
                                  <button key={ri} onClick={() => addReaction(m.id, r.type)} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all cursor-pointer hover:scale-105 ${isOwn ? `${config?.bg || 'bg-stone-100'} ${config?.color || 'text-stone-600'} border-current/20 shadow-sm` : `bg-white ${config?.color || 'text-stone-600'} border-stone-200 hover:border-stone-300`}`} title={`${r.users?.join(', ') || 'Someone'} reacted`}>
                                    <IconComp size={12} strokeWidth={2} /><span className="text-[10px] font-bold text-stone-700">{r.count}</span>
                                  </button>
                                )
                              })}
                              <button onClick={() => setShowReactionPicker(showReactionPicker === m.id ? null : m.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-full border border-dashed border-stone-300 text-stone-400 hover:text-stone-600 hover:border-stone-400 transition-all cursor-pointer"><SmileIcon size={12} /></button>
                            </div>
                          )}
                          {showReactionPicker === m.id && (
                            <div className="mt-2 bg-white p-1.5 rounded-2xl border border-stone-200 shadow-xl inline-flex items-center gap-0.5 z-20">
                              {CORE_REACTIONS.map(({ id, label, Icon, color }) => (
                                <button key={id} onClick={() => addReaction(m.id, id)} title={label} className={`p-2 rounded-xl hover:bg-stone-100 transition-all cursor-pointer hover:scale-110 ${color}`}><Icon size={15} strokeWidth={2} /></button>
                              ))}
                            </div>
                          )}
                          {m.threadCount > 0 && (
                            <button onClick={() => setThreadMessage(m)} className="mt-2 flex items-center gap-2 text-[11px] text-violet-600 font-semibold hover:text-violet-800 cursor-pointer group/thread">
                              <MessageIcon size={12} /><span>{m.threadCount} {m.threadCount === 1 ? 'reply' : 'replies'}</span>
                              {m.threadPreview && <span className="text-stone-400 font-normal group-hover/thread:text-stone-600 transition-colors">- {m.threadPreview}</span>}
                              <ChevronRightIcon size={10} className="text-stone-400 group-hover/thread:text-violet-600 transition-colors" />
                            </button>
                          )}
                        </div>
                        <MessageToolbar onReaction={(type) => addReaction(m.id, type)} onThread={() => setThreadMessage(m)} onMore={() => setMoreMenuId(moreMenuId === m.id ? null : m.id)} />
                        {moreMenuId === m.id && (
                          <div className="absolute right-2 top-8 z-20 bg-white rounded-xl border border-stone-200 shadow-xl py-1.5 min-w-[160px]">
                            {[
                              { label: 'Reply in thread', icon: MessageIcon, action: () => { setThreadMessage(m); setMoreMenuId(null) } },
                              { label: 'Copy text', icon: CopyIcon, action: () => { navigator.clipboard.writeText(m.text); toast.success('Copied!'); setMoreMenuId(null) } },
                              { label: 'Pin message', icon: StarIcon, action: () => { toast.success('Message pinned'); setMoreMenuId(null) } },
                              { label: 'Mark unread', icon: EyeIcon, action: () => { toast.success('Marked as unread'); setMoreMenuId(null) } },
                              { label: 'Delete', icon: TrashIcon, action: () => { toast.success('Message deleted'); setMoreMenuId(null) }, danger: true },
                            ].map(item => (
                              <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer ${item.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-stone-700 hover:bg-stone-50'}`}>
                                <item.icon size={13} />{item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <TypingIndicator names={typingUsers} />
              </div>

              {/* Message Composer */}
              <div className="p-3 border-t border-stone-100 bg-white relative">
                <form onSubmit={send} className="bg-stone-50 rounded-2xl border border-stone-200/80 shadow-sm focus-within:border-stone-400 focus-within:shadow-md transition-all">
                  <div className="flex items-center gap-0.5 px-3 pt-2">
                    <button type="button" onClick={() => toast.success('Bold')} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer" title="Bold">
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/></svg>
                    </button>
                    <button type="button" onClick={() => toast.success('Italic')} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer" title="Italic">
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                    </button>
                    <button type="button" onClick={() => toast.success('Code block')} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer" title="Code">
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    </button>
                    <div className="w-px h-4 bg-stone-200 mx-1" />
                    <button type="button" onClick={() => toast.success('Attachment selected')} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer" title="Attach file"><AttachIcon size={14} /></button>
                    <button type="button" onClick={() => toast.success('Mention someone')} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer" title="@mention">
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0V12a10 10 0 1 0-4 8"/></svg>
                    </button>
                  </div>
                  <div className="px-3 py-2">
                    <input ref={composerRef} type="text" value={draft} onChange={e => setDraft(e.target.value)} placeholder={isDM ? `Message ${channelDisplayName}...` : `Message #${channelDisplayName}...`} className="w-full text-[13px] text-stone-900 bg-transparent outline-none placeholder:text-stone-400" onKeyDown={e => { if (e.key === 'Escape') { setDraft(''); composerRef.current?.blur() } }} />
                  </div>
                  <div className="flex items-center justify-between px-3 pb-2">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => setShowReactionPicker(showReactionPicker === 'composer' ? null : 'composer')} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer" title="Emoji"><SmileIcon size={14} /></button>
                      <button type="button" onClick={() => toast.success('Voice note recording...')} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer" title="Voice note"><MicIcon size={14} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      {draft.trim() && <span className="text-[10px] text-stone-400 font-mono hidden sm:block">Enter to send</span>}
                      <button type="submit" disabled={!draft.trim()} className={`p-2 rounded-xl transition-all cursor-pointer shadow-sm ${draft.trim() ? 'bg-stone-900 text-white hover:bg-black hover:shadow-md' : 'bg-stone-200 text-stone-400'}`}><SendIcon size={14} /></button>
                    </div>
                  </div>
                  {showReactionPicker === 'composer' && (
                    <div className="absolute bottom-full left-3 mb-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-xl flex items-center gap-1 z-20">
                      {CORE_REACTIONS.map(({ id, label, Icon, color }) => (
                        <button key={id} onClick={() => { setDraft(prev => prev + ` :${id}: `); setShowReactionPicker(null); composerRef.current?.focus() }} title={label} className={`p-2 rounded-xl hover:bg-stone-100 transition-all cursor-pointer hover:scale-110 ${color}`}><Icon size={16} strokeWidth={2} /></button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* RIGHT: Thread Panel */}
            {threadMessage && <ThreadPanel message={threadMessage} onClose={() => setThreadMessage(null)} userInitials={userInitials} userColor={userColor} fullName={fullName} />}

            {/* RIGHT: Channel Info Panel */}
            {showChannelInfo && !threadMessage && !isDM && (
              <div className="w-full md:w-80 border-l border-stone-200/80 bg-white flex flex-col overflow-y-auto">
                <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900">Channel Details</h3>
                  <button onClick={() => setShowChannelInfo(false)} className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="p-5 space-y-5">
                  <div>
                    <h4 className="text-base font-bold text-stone-900 mb-1">#{activeChanObj?.name}</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">{activeChanObj?.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: 'Members', value: activeChanObj?.memberCount || 0, icon: UserIcon }, { label: 'Messages', value: currentMsgs.filter(m => !m.isDivider).length, icon: MessageIcon }].map(stat => (
                      <div key={stat.label} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                        <div className="flex items-center gap-1.5 text-stone-400 mb-1"><stat.icon size={12} /><span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span></div>
                        <span className="text-lg font-bold text-stone-900">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">Members</h5>
                    <div className="space-y-2">
                      {onlineUsers.map((u, i) => (
                        <div key={i} className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer">
                          <div className="relative">
                            <div className="w-7 h-7 rounded-lg text-white text-[9px] font-bold flex items-center justify-center shadow-sm" style={{ backgroundColor: u.color }}>{u.initials}</div>
                            {u.online && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-stone-800 truncate">{u.name}</div>
                            <div className="text-[10px] text-stone-400">{u.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-stone-100 space-y-1.5">
                    {[{ label: 'Notification preferences', action: () => toast.success('Notification settings') }, { label: 'Edit channel details', action: () => toast.success('Editing channel') }, { label: 'Leave channel', action: () => toast.success('Left channel'), danger: true }].map(item => (
                      <button key={item.label} onClick={item.action} className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${item.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}>{item.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {(moreMenuId || showReactionPicker) && <div className="fixed inset-0 z-[5]" onClick={() => { setMoreMenuId(null); setShowReactionPicker(null) }} />}
    </ProtectedRoute>
  )
}


/* ---- CHANNEL BUTTON COMPONENT ---- */
function ChannelButton({ channel, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${isActive ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`shrink-0 ${isActive ? 'text-lime-400' : 'text-stone-400'}`}>{channel.isPrivate ? <LockIcon size={12} /> : '#'}</span>
        <span className="font-semibold truncate">{channel.name}</span>
      </div>
      {channel.unread > 0 && <span className={`shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-bold ${isActive ? 'bg-white text-stone-900' : 'bg-violet-600 text-white'}`}>{channel.unread}</span>}
    </button>
  )
}
