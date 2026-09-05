"use client"

import React, { useState, useRef } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import {
  HashIcon, SearchIcon, PlusIcon, SmileIcon, AttachIcon,
  SendIcon, MoreHorizontalIcon, MicIcon, VideoIcon, PhoneIcon,
  ThumbsUpIcon, HeartIcon, FlameIcon, RocketIcon, ClapIcon,
  PartyIcon, CheckCircleIcon, BulbIcon, EyeIcon
} from '@/components/Icons'
import { toast } from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const CORE_REACTIONS = [
  { id: 'thumbsUp', label: 'Agree', Icon: ThumbsUpIcon, color: 'text-sky-600' },
  { id: 'heart', label: 'Love', Icon: HeartIcon, color: 'text-rose-500' },
  { id: 'flame', label: 'Fire', Icon: FlameIcon, color: 'text-orange-500' },
  { id: 'rocket', label: 'Launch', Icon: RocketIcon, color: 'text-violet-600' },
  { id: 'clap', label: 'Applause', Icon: ClapIcon, color: 'text-amber-500' },
  { id: 'party', label: 'Celebrate', Icon: PartyIcon, color: 'text-pink-500' },
  { id: 'check', label: 'Done', Icon: CheckCircleIcon, color: 'text-emerald-600' },
  { id: 'bulb', label: 'Idea', Icon: BulbIcon, color: 'text-yellow-500' },
  { id: 'eye', label: 'Watching', Icon: EyeIcon, color: 'text-stone-600' }
]

const initialChannels = [
  { id: 'general', name: 'general', unread: 3, pinned: true, desc: 'Company announcements and team standup' },
  { id: 'engineering', name: 'engineering', unread: 0, desc: 'Architecture, PR reviews, and releases' },
  { id: 'design', name: 'design', unread: 1, desc: 'Figma specs, mockups, and visual critique' },
  { id: 'product', name: 'product', unread: 7, desc: 'Sprint roadmaps and user journey specs' },
  { id: 'releases', name: 'releases', unread: 0, desc: 'Changelogs and deployment alerts' },
]

const initialMessages = {
  general: [
    { id: 'm1', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '9:02 AM', text: 'Morning everyone. Quick reminder that Sprint 14 review is this Friday at 3pm. Please make sure your tasks are updated on the board before then.' },
    { id: 'm2', author: 'Sarah Chen', initials: 'SC', color: '#6366f1', time: '9:08 AM', text: "On it! OAuth2 integration is almost wrapped up. Just finishing the GitHub provider — should be done by EOD today.", reactions: [{ type: 'flame', count: 4 }, { type: 'clap', count: 2 }] },
    { id: 'm3', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '9:15 AM', text: 'Stripe webhook handlers are deployed to staging. Need someone from QA to run through the payment flows. @Nadia can you pick this up today?' },
    { id: 'm4', author: 'Nadia Kowalski', initials: 'NK', color: '#ec4899', time: '9:17 AM', text: "Sure! I'll get to it after standup. Should have a report ready by 2pm.", reactions: [{ type: 'check', count: 1 }] },
    { id: 'm5', author: 'Priya Nair', initials: 'PN', color: '#f59e0b', time: '9:31 AM', text: 'Just pushed the updated design specs for the Customer Portal dashboard to Figma. Would love some feedback before I start handoff. Link in #design.' },
    { id: 'm6', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '9:44 AM', text: 'Heads up — deployed a fix for the auth service memory leak we spotted yesterday. Monitor is green. Tagging this for the post-mortem doc.' },
    { id: 'm7', author: 'Jordan Lee', initials: 'JL', color: '#0ea5e9', time: '10:03 AM', text: 'The new landing page is live on staging! Can everyone take a quick look? Performance scores are looking really solid — 97 on Lighthouse.', reactions: [{ type: 'rocket', count: 6 }, { type: 'heart', count: 3 }] },
    { id: 'm8', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '10:11 AM', text: "Fantastic work Jordan. That's a big jump from where we were last week. Let's use this as the benchmark going forward." },
  ],
  engineering: [
    { id: 'me1', author: 'Marcus Webb', initials: 'MW', color: '#10b981', time: '11:00 AM', text: 'Database indexes have been applied to MySQL production replica.' },
    { id: 'me2', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '11:05 AM', text: 'Great! Latency down by 42% on task queries.' }
  ],
  design: [
    { id: 'md1', author: 'Priya Nair', initials: 'PN', color: '#f59e0b', time: '11:30 AM', text: 'New color token tokens exported for warm stone canvas!' }
  ],
  product: [
    { id: 'mp1', author: 'Alex Johnson', initials: 'AJ', color: '#8b5cf6', time: '12:00 PM', text: 'Sprint 15 backlog grooming starts at 4pm.' }
  ],
  releases: [
    { id: 'mr1', author: 'Kai Okafor', initials: 'KO', color: '#ef4444', time: '12:30 PM', text: 'v1.8.4 zero-downtime release successfully deployed to production cluster.' }
  ]
}

const onlineUsers = [
  { initials: 'AJ', color: '#8b5cf6', name: 'Alex Johnson', role: 'Engineering Lead' },
  { initials: 'KV', color: '#f43f5e', name: 'Kacie Velasquez', role: 'Product Designer' },
  { initials: 'SC', color: '#6366f1', name: 'Sarah Chen', role: 'Full-Stack' },
  { initials: 'MW', color: '#10b981', name: 'Marcus Webb', role: 'Backend' },
  { initials: 'JL', color: '#0ea5e9', name: 'Jordan Lee', role: 'Frontend' },
]

export default function MessagesPage() {
  const [channels, setChannels] = useState(initialChannels)
  const [activeChannel, setActiveChannel] = useState('general')
  const [draft, setDraft] = useState('')
  const [msgs, setMsgs] = useState(initialMessages)
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [searchChannel, setSearchChannel] = useState('')
  const { fullName, initials } = useCurrentUser()

  const dynamicOnlineUsers = onlineUsers.map((u, i) =>
    i === 0
      ? {
          ...u,
          name: fullName ? `${fullName} (You)` : u.name,
          initials: initials || u.initials,
        }
      : u
  )

  const currentMsgs = msgs[activeChannel] || []
  const activeChanObj = channels.find(c => c.id === activeChannel) || channels[0]

  const send = (e) => {
    e.preventDefault()
    if (!draft.trim()) return

    const newM = {
      id: `m_${Date.now()}`,
      author: `${fullName || 'You'} (You)`,
      initials: initials || '?',
      color: '#111318',
      time: 'Just now',
      text: draft.trim(),
      reactions: []
    }

    setMsgs(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newM]
    }))
    setDraft('')
    setShowReactionPicker(false)
    toast.success('Message sent')
  }

  const addReaction = (msgId, reactionType) => {
    setMsgs(prev => {
      const channelMsgs = prev[activeChannel] || []
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const reactions = m.reactions ? [...m.reactions] : []
          const existing = reactions.find(r => r.type === reactionType)
          if (existing) {
            existing.count += 1
          } else {
            reactions.push({ type: reactionType, count: 1 })
          }
          return { ...m, reactions }
        }
        return m
      })
      return { ...prev, [activeChannel]: updated }
    })
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-[#FAF8F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Chat Canvas */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto pt-16 lg:pt-6">

          <DynamicHeader
            onOpenNewTask={() => toast.success('Creating new channel discussion')}
            onOpenSearch={() => {
              const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(evt)
            }}
          />

          {/* Main Dual-Pane Chat Hub */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col md:flex-row h-[calc(100vh-160px)] mb-6">

            {/* Channels Sidebar (Left 280px) */}
            <div className="w-full md:w-72 bg-[#FAF8F5] border-r border-stone-200/80 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-normal text-stone-950 font-serif">
                    Channels & <em className="italic font-serif font-normal text-stone-900">Discussions</em>
                  </h2>
                  <button
                    onClick={() => toast.success('New channel modal')}
                    className="p-1 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 cursor-pointer"
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>

                {/* Channel Search */}
                <div className="relative mb-4">
                  <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Filter channels..."
                    value={searchChannel}
                    onChange={e => setSearchChannel(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-stone-200 outline-none"
                  />
                </div>

                {/* Channel List */}
                <div className="space-y-1">
                  {channels
                    .filter(c => c.name.includes(searchChannel.toLowerCase()))
                    .map(c => {
                      const isActive = activeChannel === c.id
                      return (
                        <button
                          key={c.id}
                          onClick={() => setActiveChannel(c.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                              ? 'bg-[#111318] text-white shadow-xs'
                              : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={isActive ? 'text-lime-400' : 'text-stone-400'}>#</span>
                            <span>{c.name}</span>
                          </div>

                          {c.unread > 0 && !isActive && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                              {c.unread}
                            </span>
                          )}
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Online Teammates in Channel */}
              <div className="pt-4 border-t border-stone-200/60">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Active in #{activeChannel}
                </div>
                <div className="flex -space-x-1.5 overflow-hidden">
                  {dynamicOnlineUsers.map((u, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                      style={{ backgroundColor: u.color }}
                      title={u.name}
                    >
                      {u.initials}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Chat Messages Feed & Floating Composer (Right) */}
            <div className="flex-1 flex flex-col bg-white">

              {/* Channel Header Bar */}
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-stone-900 font-mono">
                      #{activeChanObj.name}
                    </span>
                    <span className="text-xs text-stone-400 hidden sm:inline">— {activeChanObj.desc}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.success('Starting channel audio room...')}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="Start voice huddle"
                  >
                    <PhoneIcon size={14} />
                  </button>
                  <button
                    onClick={() => toast.success('Starting channel video meeting...')}
                    className="p-2 rounded-xl bg-[#111318] text-white hover:bg-black transition-colors cursor-pointer"
                    title="Start video room"
                  >
                    <VideoIcon size={14} />
                  </button>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentMsgs.map(m => (
                  <div key={m.id} className="flex items-start gap-3 group">
                    <div
                      className="w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-extrabold text-stone-900">{m.author}</span>
                        <span className="text-[10px] font-mono text-stone-400">{m.time}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 text-xs text-stone-800 leading-relaxed max-w-2xl">
                        {m.text}
                      </div>

                      {/* Streamline Core Pop Reaction Badges */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {m.reactions?.map((r, ri) => {
                          const config = CORE_REACTIONS.find(cr => cr.id === r.type)
                          const IconComp = config?.Icon || ThumbsUpIcon
                          return (
                            <button
                              key={ri}
                              onClick={() => addReaction(m.id, r.type)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                                config ? config.color + ' bg-white border-stone-200 hover:border-stone-300 shadow-2xs' : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              <IconComp size={12} strokeWidth={2} />
                              <span className="text-[10.5px] font-mono font-bold text-stone-700">{r.count}</span>
                            </button>
                          )
                        })}

                        <button
                          onClick={() => addReaction(m.id, 'heart')}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-500 text-xs transition-opacity p-1 rounded-lg hover:bg-white"
                          title="Add reaction"
                        >
                          <HeartIcon size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Composer Bar */}
              <div className="p-4 border-t border-stone-100 bg-[#FAF8F5]/80 relative">
                {/* Streamline Core Pop Quick Reaction Picker Bar */}
                {showReactionPicker && (
                  <div className="absolute bottom-16 left-4 bg-white p-2 rounded-2xl border border-stone-200 shadow-xl flex items-center gap-1.5 z-20 animate-in zoom-in-95">
                    {CORE_REACTIONS.map(({ id, label, Icon, color }) => (
                      <button
                        key={id}
                        onClick={() => {
                          setShowReactionPicker(false)
                        }}
                        title={label}
                        className={`p-2 rounded-xl hover:bg-stone-100 transition-all cursor-pointer ${color}`}
                      >
                        <Icon size={16} strokeWidth={2} />
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={send} className="flex items-center gap-2 bg-white rounded-2xl border border-stone-200/80 p-2 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Add reaction"
                  >
                    <SmileIcon size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => toast.success('Attachment selected')}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                  >
                    <AttachIcon size={16} />
                  </button>

                  <input
                    type="text"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder={`Message #${activeChanObj.name}...`}
                    className="flex-1 px-2 py-1 text-xs font-medium text-stone-900 bg-transparent outline-none font-sans"
                  />

                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#111318] hover:bg-black text-white transition-all cursor-pointer shadow-xs"
                  >
                    <SendIcon size={14} />
                  </button>
                </form>
              </div>

            </div>

          </div>

        </main>
      </div>
    </ProtectedRoute>
  )
}