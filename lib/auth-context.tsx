'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type User = { userId: string; email: string; role: string; name: string; phone?: string } | null

const AUTH_USER_KEY = 'cybershield-auth-user'
const AUTH_STATE_KEY = 'cybershield-auth-state'

interface AuthContextType {
  user: User
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  logout: async () => {}, refresh: async () => {},
})

function getCachedUser(): User {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTH_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function cacheUser(user: User) {
  if (typeof window === 'undefined') return
  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    window.localStorage.setItem(AUTH_STATE_KEY, 'authenticated')
  } else {
    window.localStorage.removeItem(AUTH_USER_KEY)
    window.localStorage.setItem(AUTH_STATE_KEY, 'guest')
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => getCachedUser())
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        cacheUser(data.user)
      } else {
        setUser(null)
        cacheUser(null)
      }
    } catch {
      setUser(null)
      cacheUser(null)
    }
    finally { setLoading(false) }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    cacheUser(null)
    router.replace('/login')
    router.refresh()
  }

  useEffect(() => { refresh() }, [])

  return <AuthContext.Provider value={{ user, loading, logout, refresh }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
