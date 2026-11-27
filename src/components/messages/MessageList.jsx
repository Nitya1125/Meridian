"use client"

import React, { useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { MessageIcon } from '@/components/Icons'

export default function MessageList({
  messages = [],
  activeConversation = null,
  currentUserId = null
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-400">
        <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-2">
          <MessageIcon size={18} />
        </div>
        <p className="text-xs font-bold text-stone-700">No messages yet</p>
        <p className="text-[11px] text-stone-400 mt-0.5">
          Send the first message to start this {activeConversation?.type === 'group' ? 'group' : 'direct'} conversation.
        </p>
      </div>
    )
  }

  const isGroup = activeConversation?.type === 'group'

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-stone-50/30">
      {messages.map((msg, idx) => {
        const isSelf = msg.isSelf || (currentUserId && String(msg.senderId) === String(currentUserId))
        const showDateDivider = idx === 0 || (msg.date && msg.date !== messages[idx - 1]?.date)

        return (
          <React.Fragment key={msg.id || idx}>
            {/* Optional Date Divider */}
            {showDateDivider && msg.date && (
              <div className="flex items-center justify-center my-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 bg-stone-100/90 px-3 py-0.5 rounded-full border border-stone-200/60">
                  {msg.date}
                </span>
              </div>
            )}

            {/* Message Bubble Container */}
            <div className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
              {/* Other User Avatar in Group or DM */}
              {!isSelf && (
                <div className="shrink-0 mb-0.5">
                  <Avatar name={msg.senderName || 'Member'} size="xs" />
                </div>
              )}

              <div className={`max-w-[82%] sm:max-w-[70%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                {/* Sender Name in Group Conversations */}
                {!isSelf && isGroup && (
                  <span className="text-[10px] font-bold text-stone-600 mb-1 ml-1">
                    {msg.senderName || 'Member'}
                  </span>
                )}

                {/* Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed transition-shadow shadow-2xs ${
                    isSelf
                      ? 'bg-stone-900 text-white rounded-br-xs'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text || msg.content}</p>
                </div>

                {/* Timestamp */}
                <span
                  className={`text-[9.5px] font-mono mt-0.5 px-1 ${
                    isSelf ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp || 'Just now'}
                </span>
              </div>
            </div>
          </React.Fragment>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

