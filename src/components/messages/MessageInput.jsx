"use client"

import React, { useState, useRef } from 'react'
import { SendIcon } from '@/components/Icons'

export default function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...'
}) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!text.trim() || disabled) return
    onSendMessage(text.trim())
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleChange = (e) => {
    setText(e.target.value)
    // Auto-expand textarea up to max 120px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="p-3 sm:p-4 bg-white border-t border-stone-200/80 shrink-0">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative bg-stone-50 border border-stone-200/90 rounded-2xl focus-within:border-stone-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-100 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full py-2.5 px-3.5 text-xs text-stone-900 bg-transparent resize-none outline-none leading-relaxed max-h-32"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="p-2.5 rounded-2xl bg-stone-900 hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 text-white transition-all shadow-xs cursor-pointer active:scale-95 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
          title="Send message (Enter)"
        >
          <SendIcon size={15} />
        </button>
      </form>
    </div>
  )
}

