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
        .select('id, email, role, full_name, username, phone')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('❌ Profile fetch error:', error.code, error.message)
        // Don't throw - just return null
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
      // Don't throw - just return null
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
          // Only clear state if we're sure there's no session
          if (mounted && !session) {
            setUser(null)
            setToken(null)
          }
        } else if (session?.user) {
          console.log('✅ Session found for:', session.user.email)
          
          // Try to get profile from database
          const profile = await getUserProfile(session.user.id)
          
          // Create user object with fallback role detection
          const fullUser = profile || {
            id: session.user.id,
            email: session.user.email,
            // 🔥 Check if admin by email if profile fetch fails
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
        // DON'T clear user state on error - keep existing session
      } finally {
        if (mounted) {
          setAuthChecked(true)
          isInitialized = true
          console.log('✅ Auth check complete')
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignore initial events during setup
        if (!isInitialized) return
        
        console.log('🔄 Auth state changed:', event)
        
        // Only clear state on explicit sign out
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setToken(null)
          setAuthChecked(true)
          console.log('✅ User signed out')
          return
        }
        
        // Only update state on actual auth events
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
      
      // Wait for auth to propagate
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Try to get profile
      const profile = await getUserProfile(data.user.id)
      
      // Create user with fallback role detection
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
      
      // Sign out to prevent auto-login
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
      
      // Clear state FIRST for instant UI feedback
      setUser(null)
      setToken(null)
      
      // Then call Supabase signOut (this will trigger SIGNED_OUT event)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('⚠️ Logout error:', error)
        // Still consider it logged out even if Supabase errors
      } else {
        console.log('✅ User signed out successfully from Supabase')
      }
    } catch (error) {
      console.error('❌ Error signing out:', error)
      // Force logout anyway
      setUser(null)
      setToken(null)
    } finally {
      // Ensure state is cleared no matter what
      setUser(null)
      setToken(null)
      setLoading(false)
      console.log('✅ Logout complete')
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
    logout
  }), [user, token, loading, authChecked])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}