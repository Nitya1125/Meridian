export async function getAnalytics(organization_id) {
    const response = await fetch(`/api/analytics?organization_id=${organization_id}`, {
        method: "GET",
        credentials: "include"
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch analytics data")
    }
    return result
}