import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Helper function to get user profile with role
  const getUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('id, email, role, full_name, username, phone')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setUser(null)
          setToken(null)
        } else if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          const fullUser = profile || { 
            id: session.user.id, 
            email: session.user.email, 
            role: 'user' 
          }
          
          if (mounted) {
            setUser(fullUser)
            setToken(session.access_token)
            console.log('✅ User logged in:', fullUser.email, 'Role:', fullUser.role)
          }
        } else {
          if (mounted) {
            setUser(null)
            setToken(null)
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (mounted) {
          setAuthChecked(true)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event)
        
        if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          const fullUser = profile || { 
            id: session.user.id, 
            email: session.user.email, 
            role: 'user' 
          }
          
          setUser(fullUser)
          setToken(session.access_token)
          console.log('✅ User state updated:', fullUser.email, 'Role:', fullUser.role)
        } else {
          setUser(null)
          setToken(null)
        }
        
        setAuthChecked(true)
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  // Login function
  const login = async ({ email, password }) => {
    try {
      console.log('🔐 Attempting login for:', email)
      const cleanEmail = email.trim()
      
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

      console.log('✅ Auth login successful, user ID:', data.user.id)
      
      // Wait a moment for the auth state change to propagate
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Get user profile with role
      const profile = await getUserProfile(data.user.id)
      
      if (!profile) {
        console.warn('⚠️ No profile found in database')
        // Return basic user info if profile doesn't exist
        const basicUser = {
          id: data.user.id,
          email: cleanEmail,
          role: 'user'
        }
        setToken(data.session.access_token)
        setUser(basicUser)
        console.log('✅ Login complete with basic user - Role:', basicUser.role)
        return basicUser
      }

      const fullUser = {
        id: profile.id,
        email: profile.email,
        role: profile.role || 'user',
        full_name: profile.full_name,
        username: profile.username,
        phone: profile.phone
      }

      setToken(data.session.access_token)
      setUser(fullUser)
      
      console.log('✅ Login complete - Role:', fullUser.role)
      return fullUser
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    }
  }

  // Signup function - relies on database trigger to create profile
  const signup = async ({ email, password }) => {
    try {
      console.log('📝 Starting signup for:', email)
      const cleanEmail = email.trim()
      
      // Create auth user - trigger will auto-create profile
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
      
      // IMPORTANT: Sign out immediately to prevent auto-login
      await supabase.auth.signOut()
      setUser(null)
      setToken(null)
      
      console.log('✅ Signed out after signup - user must login manually')
      
      return { data, error: null }
    } catch (error) {
      console.error('❌ Signup error:', error)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      console.log('👋 Logging out...')
      setLoading(true)
      
      // Update state FIRST for instant UI feedback
      setUser(null)
      setToken(null)
      
      // Then call Supabase signOut
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('⚠️ Logout error:', error)
      } else {
        console.log('✅ User signed out successfully')
      }
    } catch (error) {
      console.error('❌ Error signing out:', error)
    } finally {
      // Ensure state is cleared regardless of errors
      setUser(null)
      setToken(null)
      setLoading(false)
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