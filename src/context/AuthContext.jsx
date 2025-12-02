import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Get user profile with better error handling
  const getUserProfile = async (userId) => {
    try {
      console.log('🔍 Fetching profile for user:', userId)
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('id, email, role, full_name, username, phone, avatar_url')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('❌ Profile fetch error:', error.code, error.message)
        return null
      }

      if (!profile) {
        console.warn('⚠️ No profile found in database')
        return null
      }

      console.log('✅ Profile fetched:', profile)
      return profile
    } catch (error) {
      console.error('❌ Exception in getUserProfile:', error)
      return null
    }
  }

  // Check if email is admin (TEMPORARY WORKAROUND for RLS issues)
  const isAdminEmail = (email) => {
    const adminEmails = ['admin@gmail.com', 'admin@pawfect.com']
    return adminEmails.includes(email.toLowerCase())
  }

  useEffect(() => {
    let mounted = true
    let isInitialized = false

    const getInitialSession = async () => {
      try {
        console.log('🔄 Checking initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
          if (mounted && !session) {
            setUser(null)
            setToken(null)
          }
        } else if (session?.user) {
          console.log('✅ Session found for:', session.user.email)
          
          const profile = await getUserProfile(session.user.id)
          
          const fullUser = profile || {
            id: session.user.id,
            email: session.user.email,
            role: isAdminEmail(session.user.email) ? 'admin' : 'user'
          }
          
          if (mounted) {
            setUser(fullUser)
            setToken(session.access_token)
            console.log('✅ User restored from session:', fullUser.email, 'Role:', fullUser.role)
          }
        } else {
          console.log('ℹ️ No active session')
          if (mounted) {
            setUser(null)
            setToken(null)
          }
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error)
      } finally {
        if (mounted) {
          setAuthChecked(true)
          isInitialized = true
          console.log('✅ Auth check complete')
        }
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isInitialized) return
        
        console.log('🔄 Auth state changed:', event)
        
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setToken(null)
          setAuthChecked(true)
          console.log('✅ User signed out')
          return
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session?.user) {
            const profile = await getUserProfile(session.user.id)
            
            const fullUser = profile || {
              id: session.user.id,
              email: session.user.email,
              role: isAdminEmail(session.user.email) ? 'admin' : 'user'
            }
            
            setUser(fullUser)
            setToken(session.access_token)
            console.log('✅ User state updated:', fullUser.email, 'Role:', fullUser.role)
          }
        }
        
        setAuthChecked(true)
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const login = async ({ email, password }) => {
    try {
      console.log('🔐 Attempting login for:', email)
      setLoading(true)
      const cleanEmail = email.trim().toLowerCase()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })
      
      if (error) {
        console.error('❌ Login error:', error.message)
        throw error
      }

      if (!data.user || !data.session) {
        throw new Error('No user or session returned from login')
      }

      console.log('✅ Auth login successful for user:', data.user.id)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const profile = await getUserProfile(data.user.id)
      
      const fullUser = profile || {
        id: data.user.id,
        email: data.user.email,
        role: isAdminEmail(data.user.email) ? 'admin' : 'user'
      }

      setToken(data.session.access_token)
      setUser(fullUser)
      
      console.log('✅ Login complete - User:', fullUser.email)
      console.log('✅ User role:', fullUser.role)
      
      return fullUser
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async ({ email, password }) => {
    try {
      console.log('🔐 Starting signup for:', email)
      setLoading(true)
      const cleanEmail = email.trim().toLowerCase()
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      })
      
      if (error) {
        console.error('❌ Signup error:', error.message)
        throw error
      }

      if (!data.user) {
        throw new Error('No user returned from signup')
      }
      
      console.log('✅ Auth user created:', data.user.id)
      
      await supabase.auth.signOut()
      setUser(null)
      setToken(null)
      
      console.log('✅ Signed out after signup')
      
      return { data, error: null }
    } catch (error) {
      console.error('❌ Signup error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      console.log('👋 EXPLICIT LOGOUT called...')
      setLoading(true)
      
      setUser(null)
      setToken(null)
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('⚠️ Logout error:', error)
      } else {
        console.log('✅ User signed out successfully from Supabase')
      }
    } catch (error) {
      console.error('❌ Error signing out:', error)
      setUser(null)
      setToken(null)
    } finally {
      setUser(null)
      setToken(null)
      setLoading(false)
      console.log('✅ Logout complete')
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')

      console.log('📝 Updating profile:', updates)

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      // Update local state
      setUser(prev => ({ ...prev, ...data }))
      console.log('✅ Profile updated successfully')
      
      return data
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      throw error
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!user) return
    const profile = await getUserProfile(user.id)
    if (profile) {
      setUser(profile)
    }
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    authChecked,
    isAuthenticated: Boolean(token && user),
    role: user?.role || 'user',
    login,
    signup,
    logout,
    updateProfile,
    refreshUser
  }), [user, token, loading, authChecked])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}