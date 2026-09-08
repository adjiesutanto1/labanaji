import { Mosque } from '@/lib/supabase/types'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DEMO_MOSQUES } from './demo-data'

export async function getMosques(): Promise<Mosque[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return DEMO_MOSQUES
    }

    const { data, error } = await supabase
      .from('mosques')
      .select('*')
      .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
      return DEMO_MOSQUES
    }

    return data as Mosque[]
  } catch (err) {
    console.error('Error fetching mosques:', err)
    return DEMO_MOSQUES
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
      return DEMO_MOSQUES.find((m) => m.slug === slug) || null
    }

    const { data, error } = await supabase
      .from('mosques')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return DEMO_MOSQUES.find((m) => m.slug === slug) || null
    }

    return data as Mosque
  } catch (err) {
    console.error('Error fetching mosque by slug:', err)
    return DEMO_MOSQUES.find((m) => m.slug === slug) || null
  }
}

export async function getMosqueById(id: string): Promise<Mosque | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return DEMO_MOSQUES.find((m) => m.id === id) || null
    }

    const { data, error } = await supabase
      .from('mosques')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return DEMO_MOSQUES.find((m) => m.id === id) || null
    }

    return data as Mosque
  } catch (err) {
    console.error('Error fetching mosque by id:', err)
    return DEMO_MOSQUES.find((m) => m.id === id) || null
  }
}
