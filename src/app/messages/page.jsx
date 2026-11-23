"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import DynamicHeader from '@/components/DynamicHeader'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useOrg } from '@/context/OrgContext'
import { toast } from 'react-hot-toast'

// Frontend Service Layer
import {
  getOrganizationMembers,
  getMessages,
  sendMessage as apiSendMessage
} from '@/Service/messageService'
import {
  getConversations,
  createGroup as apiCreateGroup
} from '@/Service/chatService'

// Modular Message Components
import MessagesSidebar from '@/components/messages/MessagesSidebar'
import ConversationHeader from '@/components/messages/ConversationHeader'
import MessageList from '@/components/messages/MessageList'
import MessageInput from '@/components/messages/MessageInput'
import CreateGroupModal from '@/components/messages/CreateGroupModal'
import ConversationEmptyState from '@/components/messages/ConversationEmptyState'

export default function MessagesPage() {
  const { user, fullName, initials } = useCurrentUser()
  const { activeOrg, activeOrgId, orgsLoading } = useOrg() || {}

  // Organization-scoped state
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [groupsError, setGroupsError] = useState(null)

  // Active conversation state
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  // UI Modals & Drawers
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // 1. Fetch conversations from API and extract group channels
  const loadConversations = useCallback(async (currentOrgId) => {
    try {
      setLoadingGroups(true)
      setGroupsError(null)

      const res = await getConversations()
      if (res && res.success && Array.isArray(res.data)) {
        // Filter conversations for the active organization if currentOrgId is present
        const orgConversations = currentOrgId
          ? res.data.filter(c => String(c.organization_id) === String(currentOrgId))
          : res.data

        const formattedGroups = orgConversations
          .filter(c => c.type === 'group')
          .map(c => ({
            id: String(c.conversation_id),
            conversationId: c.conversation_id,
            name: c.name || 'Unnamed Group',
            type: 'group',
            organization_id: c.organization_id,
            created_by: c.created_by,
            user_role: c.user_role,
            last_message_id: c.last_message_id,
            last_message_at: c.last_message_at,
            lastTime: c.last_message_at
              ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
            lastMsg: c.last_message_id ? 'Latest message' : 'No messages yet',
            unreadCount: 0
          }))

        setGroups(formattedGroups)
        return formattedGroups
      } else {
        setGroups([])
        return []
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
      setGroups([])
      // Gracefully ignore missing organization error during initial account load
      if (!err.message?.includes('No organization Found')) {
        setGroupsError(err.message || 'Failed to load conversations')
      }
      return []
    } finally {
      setLoadingGroups(false)
    }
  }, [])

  // 2. Fetch organization members & conversations whenever activeOrgId changes
  const fetchOrgData = useCallback(async (orgId) => {
    if (!orgId) {
      setMembers([])
      setGroups([])
      setActiveConversation(null)
      setMessages([])
      return
    }

    try {
      setLoadingMembers(true)
      // Reset active conversation when switching organizations
      setActiveConversation(null)
      setMessages([])

      // Load organization members and conversations in parallel
      await Promise.all([
        (async () => {
          const membersRes = await getOrganizationMembers(orgId)
          if (membersRes && membersRes.success) {
            setMembers(membersRes.members || [])
          } else {
            setMembers([])
          }
        })(),
        loadConversations(orgId)
      ])
    } catch (err) {
      console.error('Failed to load organization messaging data:', err)
      toast.error('Failed to load organization data')
    } finally {
      setLoadingMembers(false)
    }
  }, [loadConversations])

  useEffect(() => {
    if (activeOrgId) {
      fetchOrgData(activeOrgId)
    } else {
      // Fetch conversations when component loads even if activeOrgId is resolving
      loadConversations(null)
    }
  }, [activeOrgId, fetchOrgData, loadConversations])

  // 2. Fetch messages whenever active conversation changes
  const activeConversationId = activeConversation?.id
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([])
      return
    }

    let isMounted = true
    const loadConversationMessages = async () => {
      try {
        setLoadingMessages(true)
        const res = await getMessages(activeConversationId)
        if (isMounted && res.success) {
          setMessages(res.messages || [])
        }
      } catch (err) {
        console.error('Error loading conversation messages:', err)
      } finally {
        if (isMounted) setLoadingMessages(false)
      }
    }

    loadConversationMessages()
    return () => {
      isMounted = false
    }
  }, [activeConversationId])

  // 3. Handle Send Message
  const handleSendMessage = async (text) => {
    if (!activeConversation || !text?.trim()) return

    const senderPayload = {
      text,
      senderId: user?.id || 'me',
      senderName: fullName || 'You',
      senderInitials: initials || 'ME',
      conversationType: activeConversation.type
    }

    // Optimistic UI update
    const optimisticMsg = {
      id: `msg_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: user?.id || 'me',
      senderName: fullName || 'You',
      senderInitials: initials || 'ME',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      isSelf: true
    }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      const res = await apiSendMessage(activeConversation.id, senderPayload)
      if (res.success && res.message) {
        // Update with server returned message if different
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? res.message : m))
      }
    } catch (err) {
      console.error('Send message failed:', err)
      toast.error('Failed to send message')
    }
  }

  // 4. Handle Create Group
  const handleCreateGroup = async (groupData) => {
    if (!activeOrgId) {
      toast.error('No active organization selected')
      throw new Error('No active organization selected')
    }

    const res = await apiCreateGroup(activeOrgId, groupData.name, groupData.memberIds)
    if (res && res.success) {
      // Refresh conversations list from the API
      const updatedGroups = await loadConversations(activeOrgId)

      // Auto-select the newly created group conversation
      const newConvId = res.data?.conversationId
      if (newConvId) {
        const foundGroup = updatedGroups?.find(g => String(g.id) === String(newConvId))
        setActiveConversation(foundGroup || {
          id: String(newConvId),
          conversationId: newConvId,
          name: groupData.name.trim(),
          type: 'group',
          organization_id: activeOrgId,
          user_role: 'owner',
          memberCount: (groupData.memberIds?.length || 0) + 1,
          lastMsg: 'Group created',
          lastTime: 'Just now',
          unreadCount: 0
        })
        setMessages([])
      }
      return res
    } else {
      throw new Error(res?.message || 'Failed to create group')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#FAF8F5] overflow-hidden">
        {/* Main Application Left Sidebar */}
        <Sidebar activeTab="messages" />

        {/* Messaging Layout Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Dynamic Top Header with Active Organization Context */}
          <DynamicHeader
            title="Unified Team Communications"
            subtitle={
              activeOrg?.name
                ? `${activeOrg.name} • Workspace direct chats & group channels`
                : 'Select an organization to access team messaging'
            }
          />

          {/* Main Messaging Interface Panel */}
          <main className="flex-1 p-3 sm:p-5 flex overflow-hidden">
            <div className="w-full flex bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              {!activeOrgId && !orgsLoading ? (
                /* No Organization Selected State */
                <ConversationEmptyState type="no-org" />
              ) : (
                <>
                  {/* Left Column: Organization Messaging Sidebar */}
                  <MessagesSidebar
                    members={members}
                    groups={groups}
                    activeConversation={activeConversation}
                    onSelectConversation={setActiveConversation}
                    onCreateGroupClick={() => setIsCreateGroupOpen(true)}
                    loading={loadingMembers || loadingGroups || orgsLoading}
                    groupsError={groupsError}
                    onRetryGroups={() => loadConversations(activeOrgId)}
                    currentUser={{ id: user?.id, fullName, name: fullName, initials }}
                    orgName={activeOrg?.name}
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                  />

                  {/* Right Column: Active Conversation Stream or Empty State */}
                  <section className="flex-1 flex flex-col min-w-0 bg-white relative">
                    {activeConversation ? (
                      <>
                        <ConversationHeader
                          activeConversation={activeConversation}
                          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                        />

                        {loadingMessages ? (
                          <div className="flex-1 flex items-center justify-center p-8 text-xs text-stone-400">
                            Loading conversation...
                          </div>
                        ) : (
                          <MessageList
                            messages={messages}
                            activeConversation={activeConversation}
                            currentUserId={user?.id}
                          />
                        )}

                        <MessageInput
                          onSendMessage={handleSendMessage}
                          placeholder={
                            activeConversation.type === 'group'
                              ? `Message #${activeConversation.name}...`
                              : `Message ${activeConversation.name}...`
                          }
                        />
                      </>
                    ) : (
                      <ConversationEmptyState
                        type="select"
                        orgName={activeOrg?.name}
                        onCreateGroup={() => setIsCreateGroupOpen(true)}
                      />
                    )}
                  </section>
                </>
              )}
            </div>
          </main>
        </div>

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={isCreateGroupOpen}
          onClose={() => setIsCreateGroupOpen(false)}
          members={members}
          onCreateGroup={handleCreateGroup}
          currentUserId={user?.id}
          orgName={activeOrg?.name}
        />
      </div>
    </ProtectedRoute>
  )
}
