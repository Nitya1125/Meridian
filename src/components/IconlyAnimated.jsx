"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Home, Category, Chart, Calendar, TwoUsers, Chat,
  Setting, Notification, Search, Plus, ShieldDone,
  Buy, Bookmark, Discovery, Folder, Work, Activity,
  TickSquare, Star, Heart, Swap, Send, Lock
} from 'react-iconly'

/**
 * IconlyLottie - Premium Lottie player for Iconly Pro animated icons
 * Supports hover-play, click-play, and ambient loop.
 */
export function IconlyLottie({
  name,
  src,
  size = 20,
  trigger = 'hover', // 'hover' | 'loop' | 'click' | 'none'
  speed = 1,
  className = '',
  loop = false,
  autoplay = false,
  color,
  title,
}) {
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  // Map friendly names to local Iconly Pro JSON files
  const resolvedSrc = src || (name ? getIconlyJsonPath(name) : '/icons/iconly/02_clap_1396.json')

  useEffect(() => {
    let animInstance = null
    let isCancelled = false

    // Dynamically load lottie-web only on client
    import('lottie-web').then((lottieModule) => {
      if (isCancelled || !containerRef.current) return
      const lottie = lottieModule.default || lottieModule

      // Clear previous animations if any
      containerRef.current.innerHTML = ''

      animInstance = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: trigger === 'loop' || loop,
        autoplay: trigger === 'loop' || autoplay,
        path: resolvedSrc,
      })

      animInstance.setSpeed(speed)
      animRef.current = animInstance

      animInstance.addEventListener('DOMLoaded', () => {
        if (!isCancelled) {
          setIsReady(true)
        }
      })
    }).catch(err => console.warn('IconlyLottie load failed:', err))

    return () => {
      isCancelled = true
      if (animInstance) {
        animInstance.destroy()
      }
    }
  }, [resolvedSrc, trigger, loop, autoplay, speed])

  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover' && animRef.current) {
      animRef.current.goToAndPlay(0)
    }
  }, [trigger])

  const handleClick = useCallback(() => {
    if (trigger === 'click' && animRef.current) {
      animRef.current.goToAndPlay(0)
    }
  }, [trigger])

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      title={title}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        color: color || 'inherit',
      }}
      className={`inline-flex items-center justify-center shrink-0 select-none overflow-hidden transition-opacity duration-200 ${
        isReady ? 'opacity-100' : 'opacity-80'
      } ${className}`}
    />
  )
}

/**
 * Mapping helper for Iconly Pro animation JSONs
 */
function getIconlyJsonPath(key) {
  const map = {
    clap: '/icons/iconly/02_clap_1396.json',
    repeat: '/icons/iconly/1_repeat_3151.json',
    users: '/icons/iconly/2_users_ai_2503.json',
    warranty: '/icons/iconly/24_days_warranty_1634.json',
    gift: '/icons/iconly/add_gift_1651.json',
    like: '/icons/iconly/add_like_2127.json',
    tag: '/icons/iconly/add_tag_1636.json',
    bookmark: '/icons/iconly/bookmark_1637.json',
    growth: '/icons/iconly/dollar_up_603.json',
    down: '/icons/iconly/down_2495.json',
    up: '/icons/iconly/up_2502.json',
    left: '/icons/iconly/left_2498.json',
    right: '/icons/iconly/right_2501.json',
    heart: '/icons/iconly/heart_2196.json',
    party: '/icons/iconly/party_1655.json',
    deploy: '/icons/iconly/plane_fly_3480.json',
    plane: '/icons/iconly/plane_fly_3480.json',
    receipt: '/icons/iconly/receipt_bill_check_1656.json',
    billing: '/icons/iconly/receipt_bill_check_1656.json',
    star: '/icons/iconly/star_medal_1662.json',
    close: '/icons/iconly/x_3653.json',
  }
  return map[key.toLowerCase()] || `/icons/iconly/${key}.json`
}

/**
 * ──────────────────────────────────────────────────────────────────────────
 * Bespoke Iconly Pro Animated Icons Suite
 * Crafted for subtle luxury, crisp geometry, and smooth hover physics.
 * ──────────────────────────────────────────────────────────────────────────
 */

// 1. Overview / Home
export function IconlyHome({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 ${className}`}>
      <Home set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 2. Tasks Board / Category
export function IconlyTasks({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:rotate-3 ${className}`}>
      <Category set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 3. Schedule / Calendar
export function IconlyCalendar({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:rotate-[-2deg] ${className}`}>
      <Calendar set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 4. Activity / Analytics (Chart)
export function IconlyActivity({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${className}`}>
      <Chart set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 5. Members / Team (TwoUsers with subtle tilt)
export function IconlyMembers({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:translate-x-0.5 ${className}`}>
      <TwoUsers set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 6. Chat / Messages
export function IconlyChat({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:scale-105 ${className}`}>
      <Chat set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 7. Billing / Wallet
export function IconlyBilling({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:-rotate-2 ${className}`}>
      <Buy set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 8. Settings (Smooth dampened 45° rotation on hover)
export function IconlySettings({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-45 ${className}`}>
      <Setting set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 9. Notification Bell (Subtle luxury pendulum swing)
export function IconlyBell({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', hasUnread = true, active = false }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span className="iconly-bell-swing inline-flex items-center justify-center">
        <Notification set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
      </span>
      {hasUnread && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 border border-white animate-pulse" />
      )}
    </span>
  )
}

// 10. Search (Subtle zoom & 6° tilt)
export function IconlySearch({ size = 17, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-[-6deg] ${className}`}>
      <Search set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 11. Plus / New Task (Subtle 90° dampened twist)
export function IconlyPlus({ size = 16, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90 group-hover:scale-110 ${className}`}>
      <Plus set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 12. Security / Shield
export function IconlyShield({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${className}`}>
      <ShieldDone set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 13. Organization / Building (Work)
export function IconlyBuilding({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 ${className}`}>
      <Work set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 14. Discovery / Workflow
export function IconlyWorkflow({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 group-hover:scale-105 ${className}`}>
      <Discovery set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 15. Bookmark / Save
export function IconlyBookmark({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 ${className}`}>
      <Bookmark set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 16. Star / Milestone
export function IconlyStar({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-115 group-hover:rotate-12 ${className}`}>
      <Star set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 17. Heart / Like
export function IconlyHeart({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-120 ${className}`}>
      <Heart set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 18. Sync / Repeat
export function IconlyRepeat({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-180 ${className}`}>
      <Swap set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

// 19. Done / Check
export function IconlyCheck({ size = 18, set = 'curved', primaryColor = 'currentColor', className = '', active = false }) {
  return (
    <span className={`inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${className}`}>
      <TickSquare set={active ? 'bold' : set} primaryColor={primaryColor} size={size} stroke="bold" />
    </span>
  )
}

const IconlyAnimatedSuite = {
  Lottie: IconlyLottie,
  Home: IconlyHome,
  Tasks: IconlyTasks,
  Calendar: IconlyCalendar,
  Activity: IconlyActivity,
  Members: IconlyMembers,
  Chat: IconlyChat,
  Billing: IconlyBilling,
  Settings: IconlySettings,
  Bell: IconlyBell,
  Search: IconlySearch,
  Plus: IconlyPlus,
  Shield: IconlyShield,
  Building: IconlyBuilding,
  Workflow: IconlyWorkflow,
  Bookmark: IconlyBookmark,
  Star: IconlyStar,
  Heart: IconlyHeart,
  Repeat: IconlyRepeat,
  Check: IconlyCheck,
}

export default IconlyAnimatedSuite
