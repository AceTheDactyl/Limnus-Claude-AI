import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (token: string) => {
    try {
      localStorage.setItem('auth_token', token)
      
      // Decode JWT to get user info (simplified - in production use proper JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      // Mock user data - in production, fetch from API
      const userData: User = {
        id: payload.sub,
        sub: payload.sub,
        email: payload.email || 'user@example.com',
        name: payload.name || 'User',
        groups: payload['cognito:groups'] || ['member'],

      }
      
      setUser(userData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const refreshToken = async () => {
    // In production, implement token refresh logic
    console.log('Token refresh not implemented yet')
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          await login(token)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const value = {
    user,
    isLoading,
    login,
    logout,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
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