import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, signup as apiSignup, getCurrentUser } from '../services/auth'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const session = sessionData?.session || null
        const { data: userData } = await supabase.auth.getUser()
        const authUser = userData?.user || null

        if (!mounted) return
        if (session) setToken(session.access_token)
        if (authUser) {
          // ✅ Fetch user profile from users table to include 'role'
          const { data: profile } = await supabase
            .from('users')
            .select('id, email, role, full_name')
            .eq('id', authUser.id)
            .single()

          const fullUser = profile || { id: authUser.id, email: authUser.email, role: 'user' }
          setUser(fullUser)
          saveAuth({ token: session?.access_token || null, user: fullUser })
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user || null
      if (!authUser) {
        setUser(null)
        setToken(null)
        localStorage.removeItem('auth')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('id', authUser.id)
        .single()

      const fullUser = profile || { id: authUser.id, email: authUser.email, role: 'user' }
      setUser(fullUser)
      setToken(session.access_token)
      saveAuth({ token: session.access_token, user: fullUser })
    })

    return () => {
      mounted = false
      subscription?.unsubscribe?.()
    }
  }, [])

  const saveAuth = (next) => {
    localStorage.setItem('auth', JSON.stringify(next))
  }

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const authUser = data?.user
    const { data: profile } = await supabase
      .from('users')
      .select('id, email, role, full_name')
      .eq('id', authUser.id)
      .single()

    const fullUser = profile || { id: authUser.id, email: authUser.email, role: 'user' }

    setToken(data.session.access_token)
    setUser(fullUser)
    saveAuth({ token: data.session.access_token, user: fullUser })
    return fullUser
  }

  const signup = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth')
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    role: user?.role || 'user',
    login,
    signup,
    logout
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
