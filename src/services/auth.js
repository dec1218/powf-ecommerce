import { supabase } from '../lib/supabase'

export const login = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // Return basic user info if profile doesn't exist
      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: 'user' // default role
        }
      }
    }

    return {
      token: data.session.access_token,
      user: profile
    }
  } catch (error) {
    throw error
  }
}

export const signup = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // Note: The user profile will be automatically created by the trigger
    // we defined in the database schema
    
    return {
      token: data.session?.access_token || null,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: 'user'
      }
    }
  } catch (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('No user logged in')
    }

    // Get user profile from users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      // Return basic user info if profile doesn't exist
      return {
        id: user.id,
        email: user.email,
        role: 'user'
      }
    }

    return profile
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const updateProfile = async (profileData) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No user logged in')

  const { data, error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error

  return data
}