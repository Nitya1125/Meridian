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