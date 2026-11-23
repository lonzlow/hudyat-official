import { createClient } from '@supabase/supabase-js'
import { createServerClient as createSsrClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// Anonymous client for public reads. RLS only lets it see published articles.
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Client that acts as the logged-in staff member (session read from cookies),
// so Row Level Security applies to their role. Use it for everything under /admin.
export async function createSessionClient() {
  const cookieStore = await cookies()
  return createSsrClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component, which cannot set cookies: proxy.ts refreshes the session instead.
          }
        },
      },
    }
  )
}
