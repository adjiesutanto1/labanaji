import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('your-project-id') ||
    supabaseKey.includes('your-supabase-anon-key')
  ) {
    return null
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
