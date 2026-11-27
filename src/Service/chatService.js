// Get all conversations
export const getConversations = async () => {
    const response = await fetch("/api/conversation/list", {
        method: "GET",
        credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch conversations");
    }

    return result;
};


// Create a group
export const createGroup = async (organizationId, name, memberIds) => {
    const response = await fetch("/api/conversation/create-group", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            organizationId,
            name,
            memberIds
        })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to create group");
    }

    return result;
};


// Get all messages for a conversation
export const getMessages = async (conversationId) => {
    const response = await fetch(`/api/message/list?conversationId=${encodeURIComponent(conversationId)}`, {
        method: "GET",
        credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch messages");
    }

    return result;
};


// Send a message to a conversation
export const sendMessage = async (conversationId, content) => {
    const response = await fetch("/api/message/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            conversationId,
            content
        })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to send message");
    }

    return result;
};