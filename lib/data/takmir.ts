import { Profile, Mosque } from '@/lib/supabase/types'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DEMO_MOSQUES } from './demo-data'

export type TakmirWithMosque = Profile & {
  email?: string
  mosque?: Mosque | null
  studiesCount?: number
}

export async function getTakmirProfiles(): Promise<TakmirWithMosque[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return getDemoTakmirProfiles()
    }

    const { data: profiles, error } = await (supabase as any)
      .from('profiles')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .eq('role', 'takmir')
      .order('created_at', { ascending: false })

    if (error || !profiles || profiles.length === 0) {
      return getDemoTakmirProfiles()
    }

    return profiles as TakmirWithMosque[]
  } catch (err) {
    console.error('Error fetching takmir profiles:', err)
    return getDemoTakmirProfiles()
  }
}

export async function getTakmirProfileById(id: string): Promise<TakmirWithMosque | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      const demo = getDemoTakmirProfiles()
      return demo.find((t) => t.id === id) || null
    }

    const { data: profile, error } = await (supabase as any)
      .from('profiles')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .eq('id', id)
      .single()

    if (error || !profile) {
      const demo = getDemoTakmirProfiles()
      return demo.find((t) => t.id === id) || null
    }

    return profile as TakmirWithMosque
  } catch (err) {
    console.error('Error fetching takmir profile by id:', err)
    const demo = getDemoTakmirProfiles()
    return demo.find((t) => t.id === id) || null
  }
}

function getDemoTakmirProfiles(): TakmirWithMosque[] {
  return DEMO_MOSQUES.map((mosque, idx) => ({
    id: `takmir-${idx + 1}`,
    role: 'takmir',
    mosque_id: mosque.id,
    name: mosque.takmir_name,
    phone: mosque.takmir_phone,
    email: `takmir.${mosque.slug.substring(0, 15)}@banyuwangi.id`,
    created_at: new Date(Date.now() - idx * 86400000 * 7).toISOString(),
    mosque,
  }))
}
