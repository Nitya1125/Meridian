const API_URL = "/api/organizations";

export const createOrganization = async (data) => {
    const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return response.json();
};

export const verifyOrganizationCode = async (code) => {
    const response = await fetch(`${API_URL}/create/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            otp: code
        })
    });

    return response.json();
};

export const joinOrganization = async (organization_id) => {
    const response = await fetch(`${API_URL}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            organization_id
        })
    });

    return response.json();
};

export const acceptJoinRequest = async (join_request) => {
    const response = await fetch(`${API_URL}/join/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            join_request
        })
    });

    return response.json();
};


export const rejectJoinRequest = async (join_request) => {
    const response = await fetch(`${API_URL}/join/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            join_request
        })
    });

    return response.json();
};

export const getNotifications = async() =>{
    const response = await fetch("/api/notification",{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })

    return response.json()
}

export const getAllOrganization = async() =>{
    const response = await fetch(`${API_URL}`,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })

    return response.json()
}

export const getPendingJoinRequests = async() => {
    const response = await fetch("/api/organizations", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    return response.json()
}


export const handleOrganizationUsers = async (organization_id) =>{
    const response = await fetch(`${API_URL}/member?organization_id=${organization_id}`,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    }) 
    
    return response.json()
}

export const inviteOrganizationUser = async (email, organizationId) => {
    try {
        const response = await fetch("/api/organizations/invite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                organizationId
            })
        });

        const data = await response.json().catch(() => ({}));
        return {
            ...data,
            status: response.status,
            success: response.ok && (data.success !== false)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error while sending invitation",
            status: 500
        };
    }
};

export const acceptOrganizationInvitation = async (token) => {
    try {
        let response = await fetch("/api/organizations/invite/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token
            })
        });

        if (response.status === 405) {
            response = await fetch("/api/organizations/invite/accept", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token
                })
            });
        }

        const data = await response.json().catch(() => ({}));
        return {
            ...data,
            status: response.status,
            success: response.ok && (data.success !== false)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error while accepting invitation",
            status: 500
        };
    }
};

export const declineOrganizationInvitation = async (token) => {
    try {
        let response = await fetch("/api/organizations/invite/decline", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token
            })
        });

        if (response.status === 404) {
            response = await fetch("/api/organizations/invite/reject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token
                })
            });
        }

        const data = await response.json().catch(() => ({}));
        return {
            ...data,
            status: response.status,
            success: response.ok && (data.success !== false)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error while declining invitation",
            status: 500
        };
    }
};

export const deleteOrganization = async (organizationId) =>{
    const response = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            organizationId
        })
    });

    return response.json();
}