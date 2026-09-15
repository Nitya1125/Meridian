"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { getNotifications, getAllOrganization, getPendingJoinRequests } from "@/Service/organization"
import { useAuth } from "@/context/AuthContext"

const OrgContext = createContext(null)

export function OrgProvider({ children }) {
    const { user, isAuthenticated, loading: authLoading } = useAuth()

    // Real organization data directly from backend API
    const [approvedOrgs, setApprovedOrgs] = useState([])
    const [orgsLoading, setOrgsLoading] = useState(true)

    // Currently selected organization
    const [activeOrgId, setActiveOrgId] = useState(null)

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

    // Real notifications & join requests state
    const [notifications, setNotifications] = useState([])
    const [notificationsLoading, setNotificationsLoading] = useState(false)
    const [pendingJoinRequests, setPendingJoinRequests] = useState([])

    // Ref to avoid dependency cycle between approvedOrgs and fetchNotifications
    const approvedOrgsRef = useRef(approvedOrgs)
    approvedOrgsRef.current = approvedOrgs

    // Fetch real organizations from backend
    const fetchOrganizations = useCallback(async () => {
        if (!isAuthenticated && !user) {
            setOrgsLoading(false)
            return
        }
        try {
            setOrgsLoading(true)
            const res = await getAllOrganization()
            if (res && res.success && Array.isArray(res.organizations)) {
                setApprovedOrgs(res.organizations)
                setActiveOrgId(prev => {
                    if (prev && res.organizations.some(o => o.id === prev || String(o.id) === String(prev))) {
                        return prev
                    }
                    return res.organizations[0]?.id || null
                })
            } else {
                setApprovedOrgs([])
                setActiveOrgId(null)
            }
        } catch (err) {
            console.error("Failed to fetch organizations:", err)
            setApprovedOrgs([])
            setActiveOrgId(null)
        } finally {
            setOrgsLoading(false)
        }
    }, [isAuthenticated, user])

    // Fetch real notifications from backend & derive incoming join requests
    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated && !user) {
            setNotificationsLoading(false)
            return
        }
        try {
            setNotificationsLoading(true)
            const res = await getNotifications()
            if (res && res.success && Array.isArray(res.notification)) {
                setNotifications(res.notification)

                const incomingRequests = res.notification
                    .filter(n => n.join_request_id && (
                        n.message?.toLowerCase().includes('requested to join') ||
                        n.message?.toLowerCase().includes('new user')
                    ))
                    .map(n => ({
                        id: n.join_request_id,
                        notification_id: n.id,
                        first_name: n.first_name,
                        last_name: n.last_name,
                        email: n.email,
                        organization_id: n.organization_id,
                        organization_name: approvedOrgsRef.current.find(o => o.id === n.organization_id)?.name || 'Workspace',
                        message: n.message,
                        created_at: n.created_at
                    }))

                setPendingJoinRequests(incomingRequests)
            } else {
                setNotifications([])
                setPendingJoinRequests([])
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err)
            setNotifications([])
            setPendingJoinRequests([])
        } finally {
            setNotificationsLoading(false)
        }
    }, [isAuthenticated, user])

    // Refresh pending join requests by syncing notifications
    const fetchPendingJoinRequests = useCallback(async () => {
        await fetchNotifications()
    }, [fetchNotifications])

    useEffect(() => {
        if (authLoading) return

        if (!isAuthenticated || !user) {
            setApprovedOrgs([])
            setActiveOrgId(null)
            setNotifications([])
            setPendingJoinRequests([])
            setOrgsLoading(false)
            return
        }

        let isMounted = true
        const init = async () => {
            if (!isMounted) return
            await fetchOrganizations()
            await fetchNotifications()
        }
        init()
        return () => {
            isMounted = false
        }
    }, [authLoading, isAuthenticated, user, fetchOrganizations, fetchNotifications])

    // Active organization
    const activeOrg =
        approvedOrgs.find((org) => org.id === activeOrgId || String(org.id) === String(activeOrgId)) ||
        approvedOrgs[0] ||
        null

    // Organization state
    const hasApprovedOrg = approvedOrgs.length > 0
    const userState = hasApprovedOrg ? "active" : "new"
    const isNewUser = !hasApprovedOrg
    const hasPendingOnly = false

    // Switch organization
    const switchOrg = (id) => {
        const target = approvedOrgs.find((org) => org.id === id || String(org.id) === String(id))
        if (target) {
            setActiveOrgId(target.id)
        }
    }

    // Add a real organization created via API
    const addRealOrg = (org) => {
        if (!org || !org.id) return
        setApprovedOrgs((prev) => {
            const exists = prev.some((o) => o.id === org.id || String(o.id) === String(org.id))
            if (exists) {
                return prev.map((o) => (o.id === org.id || String(o.id) === String(org.id) ? org : o))
            }
            return [org, ...prev]
        })
        setActiveOrgId(org.id)
        fetchOrganizations()
    }

    // Create modal
    const openCreateModal = () => setIsCreateModalOpen(true)
    const closeCreateModal = () => setIsCreateModalOpen(false)

    // Join modal
    const openJoinModal = () => setIsJoinModalOpen(true)
    const closeJoinModal = () => setIsJoinModalOpen(false)

    return (
        <OrgContext.Provider
            value={{
                // Organization state
                approvedOrgs,
                setApprovedOrgs,
                orgsLoading,
                fetchOrganizations,
                activeOrg,
                activeOrgId,
                setActiveOrgId,
                addRealOrg,

                // User state
                userState,
                isNewUser,
                hasPendingOnly,
                hasApprovedOrg,
                pendingRequests: pendingJoinRequests,
                pendingJoinRequests,
                fetchPendingJoinRequests,

                // Notifications
                notifications,
                notificationsLoading,
                fetchNotifications,

                // Organization actions
                switchOrg,

                // Create modal
                isCreateModalOpen,
                openCreateModal,
                closeCreateModal,

                // Join modal
                isJoinModalOpen,
                openJoinModal,
                closeJoinModal,
            }}
        >
            {children}
        </OrgContext.Provider>
    )
}

export function useOrg() {
    const context = useContext(OrgContext)

    if (!context) {
        throw new Error("useOrg must be used within an OrgProvider")
    }

    return context
}