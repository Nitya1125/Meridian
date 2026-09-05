"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon, GridIcon, BarChartIcon, UsersIcon, MessageIcon,
  CreditCardIcon, SettingsIcon, BellIcon, SearchIcon, ChevronDownIcon,
  ChevronRightIcon, ZapIcon, FolderIcon, CalendarIcon, PlusIcon,
  SparklesIcon, BuildingIcon
} from './Icons'
import toast from 'react-hot-toast'
import CommandPalette from './CommandPalette'
import { useAuth } from '@/context/AuthContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import OrgSwitcher from './OrgSwitcher'

const CollapseIcon = ({ collapsed }) => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
    <polyline points="15,18 9,12 15,6" />
  </svg>
)

const MenuIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const navItems = [
  { id: 'dashboard', label: 'Overview', href: '/dashboard', icon: <HomeIcon size={17} /> },
  { id: 'organization', label: 'Organization', href: '/organization', icon: <BuildingIcon size={17} /> },
  { id: 'kanban', label: 'Tasks Board', href: '/kanban', icon: <GridIcon size={17} /> },
  { id: 'calendar', label: 'Schedule', href: '/calendar', icon: <CalendarIcon size={17} /> },
  { id: 'analytics', label: 'Activity', href: '/Analytics', icon: <BarChartIcon size={17} /> },
  { id: 'team', label: 'Members', href: '/team', icon: <UsersIcon size={17} /> },
  { id: 'chat', label: 'Chat', href: '/messages', icon: <MessageIcon size={17} /> },
  { id: 'billing', label: 'Billing', href: '/billing', icon: <CreditCardIcon size={17} /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <SettingsIcon size={17} /> },
]

const spaces = [
  { id: 'pub', name: 'Publications', color: '#f43f5e', expanded: false, sub: ['Dribbble Shots', 'Behance Case Study', 'Articles'] },
  { id: 'comm', name: 'Commercial', color: '#8b5cf6', expanded: false, sub: ['Client Portals', 'Pitch Decks'] },
  { id: 'int', name: 'Design Internal', color: '#10b981', expanded: false, sub: ['Design System 2.0', 'Brand Assets'] },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const { fullName, initials, user } = useCurrentUser()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [spaceList, setSpaceList] = useState(spaces)
  const [selectedSpace, setSelectedSpace] = useState('Publications')

  const dynamicLiveMembers = user ? [
    {
      name: fullName || user.email?.split('@')[0] || 'User',
      initials: initials || 'U',
      color: '#8b5cf6',
      time: 'Online',
      online: true
    }
  ] : []

  // Global shortcut (Cmd+K / Ctrl+K) listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = (href) => {
    router.push(href)
    setMobileOpen(false)
  }

  const toggleSpaceExpand = (id) => {
    setSpaceList(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s))
  }

  const sidebarWidth = collapsed ? 'w-[76px]' : 'w-[260px]'

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FAF8F5] border-r border-stone-200/80 select-none">
      {/* ── Brand Header ── */}
      <div className="p-4 border-b border-stone-200/60 flex items-center justify-between">
        {!collapsed ? (
          <div
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111318] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <ZapIcon size={16} strokeWidth={2.5} className="text-lime-400" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-stone-900 leading-none">
                Meridian <em className="font-serif italic font-normal text-stone-700">Clarity</em> <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-lime-200 text-lime-900 ml-1">PRO</span>
              </div>
              <div className="text-[11px] text-stone-400 font-medium mt-0.5">Workspace System</div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => router.push('/dashboard')}
            className="w-9 h-9 mx-auto rounded-xl bg-[#111318] text-white flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
          >
            <ZapIcon size={16} strokeWidth={2.5} className="text-lime-400" />
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>

      {/* ── Search Bar Trigger ── */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-stone-200/80 text-stone-400 hover:text-stone-800 hover:border-stone-300 shadow-2xs text-xs transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <SearchIcon size={14} className="text-stone-400" />
              <span className="font-medium text-stone-500">Quick Search...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-semibold text-stone-400 bg-stone-100 rounded-md border border-stone-200">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* ── Main Navigation List ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
          {!collapsed ? 'Main Menu' : '•••'}
        </div>

        {navItems.map(item => {
          const active = pathname.toLowerCase() === item.href.toLowerCase() || (item.href === '/dashboard' && pathname === '/')

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${active
                ? 'bg-[#111318] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                } ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
              title={collapsed ? item.label : ''}
            >
              <div className="flex items-center gap-2.5">
                <span className={active ? 'text-lime-400' : 'text-stone-500'}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        {/* ── Collapsible Spaces / Projects Tree ── */}
        {!collapsed && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <span>Spaces</span>
              <button
                onClick={() => toast.success('New Project Space creation dialog')}
                className="hover:text-stone-800 p-0.5 rounded hover:bg-stone-200 transition-colors"
                title="Add new space"
              >
                <PlusIcon size={12} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-1 space-y-0.5">
              {spaceList.map(s => (
                <div key={s.id}>
                  <div
                    onClick={() => {
                      setSelectedSpace(s.name)
                      router.push('/kanban')
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${selectedSpace === s.name
                      ? 'bg-rose-50 text-rose-800 font-semibold'
                      : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="truncate">{s.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSpaceExpand(s.id)
                        }}
                        className="text-stone-400 hover:text-stone-700 p-0.5"
                      >
                        <ChevronRightIcon size={12} className={`transition-transform ${s.expanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Sub-branches */}
                  {s.expanded && (
                    <div className="ml-5 pl-2 border-l border-stone-200 my-1 space-y-1">
                      {s.sub.map(subItem => (
                        <div
                          key={subItem}
                          onClick={() => {
                            toast.success(`Filtered to ${subItem}`)
                            router.push('/kanban')
                          }}
                          className="text-[11px] text-stone-500 hover:text-stone-900 py-1 px-2 rounded-md hover:bg-stone-200/50 cursor-pointer transition-colors"
                        >
                          {subItem}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Live Members with Tracked Time ── */}
        {!collapsed && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <span>Presence</span>
              <button
                onClick={() => router.push('/team')}
                className="hover:text-stone-800 p-0.5 rounded hover:bg-stone-200 transition-colors"
              >
                <PlusIcon size={12} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-1 space-y-1">
              {dynamicLiveMembers.map(m => (
                <div
                  key={m.name}
                  onClick={() => router.push('/team')}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-stone-200/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div
                        className="w-5 h-5 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.initials}
                      </div>
                      {m.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-stone-700 group-hover:text-stone-900 truncate">
                      {m.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-sans text-stone-400 group-hover:text-stone-600">
                    {m.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── User Footer & Logout ── */}
      <div className="p-3 border-t border-stone-200/60 bg-white/60">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                {initials || 'AJ'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-800 leading-tight group-hover:text-violet-600 transition-colors truncate">
                  {fullName || 'My Account'}
                </div>
                <div className="text-[10px] text-stone-400 font-sans truncate">{user?.email || 'alex@meridian.io'}</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout()
                toast.success('Signed out successfully')
              }}
              className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Log out"
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            onClick={() => router.push('/profile')}
            className="w-8 h-8 mx-auto rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
          >
            {initials?.[0] || 'A'}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* ── Mobile Top Bar (< lg) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 shadow-2xs cursor-pointer"
          >
            <MenuIcon size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#111318] text-white flex items-center justify-center shadow-xs">
              <ZapIcon size={14} strokeWidth={2.5} className="text-lime-400" />
            </div>
            <span className="font-bold text-base text-stone-900 tracking-tight">
              Meridian <em className="font-serif italic font-normal text-stone-600">Clarity</em>
            </span>
          </div>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 shadow-2xs cursor-pointer"
        >
          <SearchIcon size={16} />
        </button>
      </div>

      {/* ── Mobile Slide-Over Drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#FAF8F5] shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* ── Desktop Fixed Sidebar ── */}
      <aside className={`hidden lg:block shrink-0 ${sidebarWidth} transition-all duration-300 h-screen sticky top-0 z-30`}>
        {sidebarContent}
      </aside>

      {/* ── Command Palette (Cmd+K) ── */}
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}