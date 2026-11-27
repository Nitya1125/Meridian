/**
 * Frontend Service Layer for Organization-Based Messaging
 * 
 * Provides clearly named, decoupled functions for:
 * - Organization member retrieval
 * - Group conversation management
 * - Direct conversation management
 * - Message retrieval & sending
 * 
 * NOTE: Backend API endpoints and Socket.IO events will be connected here
 * when backend messaging tables and controllers are deployed.
 */

import { handleOrganizationUsers } from '@/Service/organization';

/**
 * Fetch all members belonging strictly to the specified organization.
 * Uses existing backend endpoint: GET /api/organizations/member?organization_id={id}
 *
 * @param {string|number} organizationId
 * @returns {Promise<{ success: boolean, members: Array }>}
 */
export async function getOrganizationMembers(organizationId) {
  if (!organizationId) {
    return { success: false, members: [], message: 'Organization ID is required' };
  }

  try {
    const res = await handleOrganizationUsers(organizationId);
    if (res && res.success && Array.isArray(res.members)) {
      const formatted = res.members.map(m => {
        const fullName = `${m.first_name || ''} ${m.last_name || ''}`.trim() || m.email || 'Member';
        const initials = `${m.first_name?.[0] || ''}${m.last_name?.[0] || ''}`.toUpperCase() || (fullName[0] || 'M').toUpperCase();
        return {
          id: String(m.id),
          userId: m.id,
          name: fullName,
          first_name: m.first_name,
          last_name: m.last_name,
          email: m.email,
          role: m.role || 'Member',
          initials,
          status: 'online', // Ready for live socket presence integration
          statusText: 'Available',
          lastMsg: '',
          lastTime: '',
          unreadCount: 0,
          joinedAt: m.joined_at
        };
      });
      return { success: true, members: formatted };
    }
    return { success: false, members: [], message: res?.message || 'Failed to fetch members' };
  } catch (error) {
    console.error('getOrganizationMembers error:', error);
    return { success: false, members: [], error: error.message };
  }
}

/**
 * Fetch all group channels belonging to the specified organization.
 * 
 * @param {string|number} organizationId
 * @returns {Promise<{ success: boolean, groups: Array }>}
 * 
 * BACKEND INTEGRATION POINT:
 * Connect to: GET /api/organizations/:id/groups or GET /api/messages/groups?organization_id=:id
 */
export async function getOrganizationGroups(organizationId) {
  if (!organizationId) return { success: false, groups: [] };

  try {
    // BACKEND INTEGRATION TODO:
    // const res = await fetch(`/api/messages/groups?organization_id=${organizationId}`);
    // return await res.json();
    return { success: true, groups: [] };
  } catch (error) {
    console.error('getOrganizationGroups error:', error);
    return { success: false, groups: [], error: error.message };
  }
}

/**
 * Fetch direct message conversation summaries for the active organization.
 * 
 * @param {string|number} organizationId
 * @returns {Promise<{ success: boolean, conversations: Array }>}
 * 
 * BACKEND INTEGRATION POINT:
 * Connect to: GET /api/messages/conversations/direct?organization_id=:id
 */
export async function getDirectConversations(organizationId) {
  if (!organizationId) return { success: false, conversations: [] };

  try {
    // BACKEND INTEGRATION TODO:
    // const res = await fetch(`/api/messages/conversations/direct?organization_id=${organizationId}`);
    // return await res.json();
    return { success: true, conversations: [] };
  } catch (error) {
    console.error('getDirectConversations error:', error);
    return { success: false, conversations: [], error: error.message };
  }
}

/**
 * Fetch group conversation summaries for the active organization.
 * 
 * @param {string|number} organizationId
 * @returns {Promise<{ success: boolean, groups: Array }>}
 * 
 * BACKEND INTEGRATION POINT:
 * Connect to: GET /api/messages/conversations/groups?organization_id=:id
 */
export async function getGroupConversations(organizationId) {
  if (!organizationId) return { success: false, groups: [] };

  try {
    // BACKEND INTEGRATION TODO:
    // const res = await fetch(`/api/messages/conversations/groups?organization_id=${organizationId}`);
    // return await res.json();
    return { success: true, groups: [] };
  } catch (error) {
    console.error('getGroupConversations error:', error);
    return { success: false, groups: [], error: error.message };
  }
}

/**
 * Fetch message history for a specific conversation (Direct or Group).
 * Uses backend endpoint: GET /api/message/list?conversationId=:id
 * 
 * @param {string|number} conversationId
 * @returns {Promise<{ success: boolean, data: Array, message?: string }>}
 */
export async function getMessages(conversationId) {
  if (!conversationId) return { success: false, data: [] };

  try {
    const res = await fetch(`/api/message/list?conversationId=${encodeURIComponent(conversationId)}`, {
      method: 'GET',
      credentials: 'include'
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch messages');
    }
    return result;
  } catch (error) {
    console.error('getMessages error:', error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Create a new messaging group restricted to members of the given organization.
 * 
 * @param {string|number} organizationId
 * @param {{ name: string, memberIds: Array<string|number>, description?: string }} groupData
 * @returns {Promise<{ success: boolean, group: object }>}
 */
export async function createGroup(organizationId, groupData) {
  if (!organizationId || !groupData?.name) {
    return { success: false, message: 'Organization ID and Group Name are required' };
  }

  try {
    const newGroup = {
      id: `grp_${Date.now()}`,
      organization_id: organizationId,
      name: groupData.name.trim(),
      description: groupData.description?.trim() || '',
      memberIds: groupData.memberIds || [],
      memberCount: (groupData.memberIds?.length || 0) + 1, // members + creator
      createdAt: new Date().toISOString(),
      lastMsg: 'Group created',
      lastTime: 'Just now',
      unreadCount: 0
    };
    return { success: true, group: newGroup };
  } catch (error) {
    console.error('createGroup error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send a message within a conversation (Direct or Group).
 * Uses backend endpoint: POST /api/message/send
 * 
 * @param {string|number} conversationId
 * @param {string} content
 * @returns {Promise<{ success: boolean, data?: object, message?: string }>}
 */
export async function sendMessage(conversationId, content) {
  if (!conversationId || !(typeof content === 'string' ? content.trim() : content?.text?.trim())) {
    return { success: false, message: 'Message content is required' };
  }

  const messageText = typeof content === 'string' ? content.trim() : content.text.trim();

  try {
    const res = await fetch('/api/message/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        conversationId,
        content: messageText
      })
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to send message');
    }
    return result;
  } catch (error) {
    console.error('sendMessage error:', error);
    return { success: false, message: error.message };
  }
}

