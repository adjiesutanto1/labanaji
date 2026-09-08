import { Mosque } from '@/lib/supabase/types'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DEMO_MOSQUES } from './demo-data'

export async function getMosques(): Promise<Mosque[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from('mosques')
      .select('*')
      .order('name', { ascending: true })

    if (error || !data) {
      return []
    }

    return data as Mosque[]
  } catch (err) {
    console.error('Error fetching mosques:', err)
    return []
  }
}

export async function getFeaturedMosques(limit: number = 6): Promise<Mosque[]> {
  const mosques = await getMosques()
  return mosques.slice(0, limit)
}

export async function getMosqueBySlug(slug: string): Promise<Mosque | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return null
    }

    const { data, error } = await supabase
      .from('mosques')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return data as Mosque
  } catch (err) {
    console.error('Error fetching mosque by slug:', err)
    return null
  }
}

export async function getMosqueById(id: string): Promise<Mosque | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return null
    }

    const { data, error } = await supabase
      .from('mosques')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return data as Mosque
  } catch (err) {
    console.error('Error fetching mosque by id:', err)
    return null
  }
}
