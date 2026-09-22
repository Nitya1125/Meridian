"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { getTasks, addTask as apiAddTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from "@/Service/taskService"
import { handleOrganizationUsers } from "@/Service/organization"
import { useOrg } from "@/context/OrgContext"

/**
 * Formats a Date object or date string into a local YYYY-MM-DD string,
 * preventing UTC day-drift across positive/negative timezone offsets.
 */
export function formatLocalDate(dateInput) {
  if (!dateInput) return ''
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput
  }
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (!d || isNaN(d.getTime())) return String(dateInput || '')
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Normalizes backend task entity discrepancies:
 * - Unifies id and task_id
 * - Unifies estimated_time_value and estimate_time_value
 * - Unifies assigned_to and assign_to
 * - Ensures due_date is in clean YYYY-MM-DD format
 */
export function normalizeTask(raw) {
  if (!raw || typeof raw !== 'object') return raw
  const id = raw.task_id || raw.id
  const estimate = raw.estimated_time_value || raw.estimate_time_value || ''
  const assignee = raw.assigned_to || raw.assign_to || raw.assignee || ''
  const dueDate = raw.due_date ? formatLocalDate(raw.due_date) : ''

  return {
    ...raw,
    id,
    task_id: id,
    estimated_time_value: estimate,
    estimate_time_value: estimate,
    assigned_to: assignee,
    assign_to: assignee,
    due_date: dueDate
  }
}

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const { activeOrgId } = useOrg() || {}

  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch tasks and members for the currently active organization
  const fetchTasks = useCallback(async (showLoading = false) => {
    if (!activeOrgId) {
      setTasks([])
      setMembers([])
      setLoading(false)
      return
    }

    if (showLoading) setLoading(true)
    setError(null)

    try {
      const [tasksRes, membersRes] = await Promise.all([
        getTasks({ organization_id: activeOrgId }).catch(err => {
          console.warn("Tasks API fetch error:", err)
          return { success: false, result: [] }
        }),
        handleOrganizationUsers(activeOrgId).catch(err => {
          console.warn("Members API fetch error:", err)
          return { success: false, members: [] }
        })
      ])

      if (tasksRes && tasksRes.success && Array.isArray(tasksRes.result)) {
        setTasks(tasksRes.result.map(normalizeTask))
      } else {
        setTasks([])
      }

      if (membersRes && membersRes.success && Array.isArray(membersRes.members)) {
        setMembers(membersRes.members)
      } else {
        setMembers([])
      }
    } catch (err) {
      console.error("TaskProvider fetchTasks failed:", err)
      setError(err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [activeOrgId])

  // Initial and reactive load on activeOrgId change via promise to comply with React 19 hooks
  useEffect(() => {
    let isMounted = true
    if (!activeOrgId) {
      return
    }

    Promise.resolve().then(async () => {
      try {
        const [tasksRes, membersRes] = await Promise.all([
          getTasks({ organization_id: activeOrgId }).catch(err => {
            console.warn("Tasks API fetch error:", err)
            return { success: false, result: [] }
          }),
          handleOrganizationUsers(activeOrgId).catch(err => {
            console.warn("Members API fetch error:", err)
            return { success: false, members: [] }
          })
        ])

        if (!isMounted) return

        if (tasksRes && tasksRes.success && Array.isArray(tasksRes.result)) {
          setTasks(tasksRes.result.map(normalizeTask))
        } else {
          setTasks([])
        }

        if (membersRes && membersRes.success && Array.isArray(membersRes.members)) {
          setMembers(membersRes.members)
        } else {
          setMembers([])
        }
      } catch (err) {
        if (!isMounted) return
        setError(err)
      }
    })

    return () => {
      isMounted = false
    }
  }, [activeOrgId])

  // ─── ADD TASK (Optimistic + Backend API) ───
  const addTask = useCallback(async (taskData) => {
    const tempId = `temp-${Date.now()}`
    const orgId = taskData.organization_id || activeOrgId

    const optimisticTask = normalizeTask({
      ...taskData,
      id: tempId,
      task_id: tempId,
      organization_id: orgId,
      created_at: new Date().toISOString()
    })

    // Optimistic UI update
    setTasks(prev => [optimisticTask, ...prev])

    try {
      const res = await apiAddTask({ ...taskData, organization_id: orgId })
      if (res && res.success) {
        // Re-fetch in background
        fetchTasks(false)
        return res
      } else {
        // Rollback
        setTasks(prev => prev.filter(t => t.id !== tempId && t.task_id !== tempId))
        throw new Error(res?.message || "Failed to create task")
      }
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== tempId && t.task_id !== tempId))
      throw err
    }
  }, [activeOrgId, fetchTasks])

  // ─── UPDATE TASK (Optimistic + Backend API + Rollback Snapshot) ───
  const updateTask = useCallback(async (updateData) => {
    const targetId = updateData.task_id || updateData.id
    if (!targetId) return null

    // Snapshot previous tasks for rollback
    const prevTasks = [...tasks]

    // Optimistic UI update with normalization
    setTasks(prev => prev.map(t => {
      const tid = t.task_id || t.id
      if (String(tid) === String(targetId)) {
        return normalizeTask({ ...t, ...updateData })
      }
      return t
    }))

    try {
      const res = await apiUpdateTask(updateData)
      if (res && res.success) {
        fetchTasks(false)
        return res
      } else {
        // Rollback to snapshot
        setTasks(prevTasks)
        throw new Error(res?.message || "Failed to update task")
      }
    } catch (err) {
      setTasks(prevTasks)
      throw err
    }
  }, [tasks, fetchTasks])

  // ─── DELETE TASK (Optimistic + Backend API + Rollback Snapshot) ───
  const deleteTask = useCallback(async (taskId) => {
    if (!taskId) return null

    const prevTasks = [...tasks]
    // Optimistic removal
    setTasks(prev => prev.filter(t => {
      const tid = t.task_id || t.id
      return String(tid) !== String(taskId)
    }))

    try {
      const res = await apiDeleteTask({ task_id: taskId })
      if (res && res.success) {
        fetchTasks(false)
        return res
      } else {
        setTasks(prevTasks)
        throw new Error(res?.message || "Failed to delete task")
      }
    } catch (err) {
      setTasks(prevTasks)
      throw err
    }
  }, [tasks, fetchTasks])

  // ─── DERIVED SPRINT & KPI METRICS (Dynamic & Always in Sync) ───
  const sprintMetrics = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.status === 'DONE').length
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'INPROGRESS').length
    const review = tasks.filter(t => t.status === 'REVIEW' || t.status === 'UNDER_REVIEW').length
    const todo = tasks.filter(t => t.status === 'TODO' || !t.status).length

    const completionPct = total > 0 ? Math.round((done / total) * 100) : 0
    const confidenceScore = total > 0 ? Math.min(99, Math.max(85, completionPct + 14)) : 92

    return {
      totalTasks: total,
      doneTasks: done,
      inProgressTasks: inProgress,
      reviewTasks: review,
      todoTasks: todo,
      completionPct,
      confidenceScore
    }
  }, [tasks])

  const value = useMemo(() => ({
    tasks,
    members,
    loading,
    error,
    refreshTasks: fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    sprintMetrics,
    activeOrgId,
    formatLocalDate,
    normalizeTask
  }), [tasks, members, loading, error, fetchTasks, addTask, updateTask, deleteTask, sprintMetrics, activeOrgId])

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    return {
      tasks: [],
      members: [],
      loading: false,
      error: null,
      refreshTasks: () => {},
      addTask: async () => {},
      updateTask: async () => {},
      deleteTask: async () => {},
      sprintMetrics: {
        totalTasks: 0,
        doneTasks: 0,
        inProgressTasks: 0,
        reviewTasks: 0,
        todoTasks: 0,
        completionPct: 0,
        confidenceScore: 90
      },
      activeOrgId: null,
      formatLocalDate: (d) => String(d || ''),
      normalizeTask: (t) => t
    }
  }
  return context
}
