export async function getOverView(organization_id) {
    const response = await fetch(`/api/overview?organization_id=${organization_id}`, {
        method: "GET",
        credentials: "include"
    })
    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch overview data")
    }
    return result
}

export const getDashboardOverview = getOverView

export async function getLineUp(organization_id) {
    const response = await fetch(`/api/overview/line-up?organization_id=${organization_id}`, {
        method: "GET",
        credentials: "include"
    })
    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch line-up data")
    }
    return result
}

export const getActiveLineup = getLineUp
