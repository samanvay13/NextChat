// lib/supabase-server.ts - FIXED IMPORTS
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'  // Import from supabase-js, not ssr
import { cookies } from 'next/headers'

// For API routes that need auth (using middleware instead)
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Expected in some server contexts
          }
        },
      },
    }
  )
}

// Admin client for database operations (uses service role key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Alternative name for compatibility
export const supabaseServer = supabaseAdmin