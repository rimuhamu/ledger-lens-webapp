'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import type { UserResponse } from '@/lib/api/types'

interface AuthContextType {
  user: UserResponse | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated via cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If the cookie exists and is valid, this will succeed
        const userData = await authAPI.getMe()
        setUser(userData)
      } catch (error) {
        // No valid session cookie
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    setUser(response.user)
    router.push('/')
  }

  const register = async (email: string, password: string) => {
    const response = await authAPI.register({ email, password })
    setUser(response.user)
    router.push('/')
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
