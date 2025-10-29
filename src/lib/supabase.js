// Temporary Supabase configuration for demo purposes
// This prevents errors when environment variables are not set

let supabase = null

// Only initialize Supabase if environment variables are available
if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  } catch (error) {
    console.log('Supabase not configured - using demo mode')
  }
}

export { supabase }

