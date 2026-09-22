"use client"

import React, { createContext, useContext, useState, useSyncExternalStore, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {getCurrentUser} from "../Service/authService";

const AuthContext = createContext(null)

const emptySubscribe = () => () => {}

function getInitialToken() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('meridian_token')
  } catch {
    return null
  }
}

function getInitialUser() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('meridian_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)
  const [token, setToken] = useState(getInitialToken)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // React 19 hydrated check
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false)
  
  useEffect(() => {
    if (!isHydrated) return 
    const checkUser = async () => {
      try {
        const localToken = getInitialToken()
        const localUser = getInitialUser()
        if (localToken && localToken.startsWith('demo_') && localUser) {
          setUser(localUser)
          setToken(localToken)
          setLoading(false)
          return
        }

        const result = await getCurrentUser()
        if (result && result.user) {
          setUser(result.user)
          setToken("authenticated")
        } else {
          setUser(null)
          setToken(null)
          try {
            localStorage.removeItem('meridian_token')
            localStorage.removeItem('meridian_user')
          } catch {}
        }
      } catch (error) {
        setUser(null)
        setToken(null)
        try {
          localStorage.removeItem('meridian_token')
          localStorage.removeItem('meridian_user')
        } catch {}
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [isHydrated])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    try {
      localStorage.setItem('meridian_token', jwtToken)
      localStorage.setItem('meridian_user', JSON.stringify(userData))
    } catch (e) {
      console.error('Storage write error', e)
    }
  }

  const demoLogin = () => {
    const demoUser = {
      id: 'usr_demo_01',
      name: 'Alex Johnson',
      email: 'alex.johnson@meridian.io',
      role: 'Product Lead',
      avatar: '#8b5cf6',
      initials: 'AJ',
      workspace: 'Meridian Core Workspace'
    }
    const demoToken = 'demo_jwt_token_meridian_prod'
    login(demoUser, demoToken)
    router.push('/dashboard')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('meridian_token')
      localStorage.removeItem('meridian_user')
    } catch (e) {
      console.error('Storage clear error', e)
    }
    router.push('/')
  }

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
