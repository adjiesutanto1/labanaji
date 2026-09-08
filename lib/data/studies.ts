import { Study } from '@/lib/supabase/types'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getTodayDateString } from '@/lib/utils'

export async function getTodayStudies(limit: number = 6): Promise<Study[]> {
  const today = getTodayDateString()

  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from('studies')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .eq('study_date', today)
      .order('start_time', { ascending: true })
      .limit(limit)

    if (error || !data) {
      return []
    }

    return data as Study[]
  } catch (err) {
    console.error('Error fetching today studies:', err)
    return []
  }
}

export async function getUpcomingStudies(limit: number = 6): Promise<Study[]> {
  const today = getTodayDateString()

  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from('studies')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .gt('study_date', today)
      .order('study_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit)

    if (error || !data) {
      return []
    }

    return data as Study[]
  } catch (err) {
    console.error('Error fetching upcoming studies:', err)
    return []
  }
}

export interface GetStudiesParams {
  query?: string
  date?: string
  mosqueSlug?: string
  mosqueId?: string
  page?: number
  pageSize?: number
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getStudies(params: GetStudiesParams = {}): Promise<{
  studies: Study[]
  totalCount: number
  page: number
  totalPages: number
}> {
  const {
    query = '',
    date = '',
    mosqueSlug = '',
    mosqueId = '',
    page = 1,
    pageSize = 9,
  } = params

  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return {
        studies: [],
        totalCount: 0,
        page: 1,
        totalPages: 1,
      }
    }

    let baseQuery = supabase
      .from('studies')
      .select(
        `
        *,
        mosque:mosques(*)
      `,
        { count: 'exact' }
      )

    if (date) {
      baseQuery = baseQuery.eq('study_date', date)
    }

    if (mosqueId) {
      if (UUID_REGEX.test(mosqueId)) {
        baseQuery = baseQuery.eq('mosque_id', mosqueId)
      } else {
        return {
          studies: [],
          totalCount: 0,
          page: 1,
          totalPages: 1,
        }
      }
    }

    if (query) {
      baseQuery = baseQuery.or(`title.ilike.%${query}%,speaker.ilike.%${query}%`)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await baseQuery
      .order('study_date', { ascending: true })
      .order('start_time', { ascending: true })
      .range(from, to)

    if (error || !data) {
      return {
        studies: [],
        totalCount: 0,
        page: 1,
        totalPages: 1,
      }
    }

    // Filter by mosqueSlug if requested and not matched by mosqueId
    let filteredData = data as Study[]
    if (mosqueSlug) {
      filteredData = filteredData.filter((s) => s.mosque?.slug === mosqueSlug)
    }

    const total = count ?? filteredData.length
    return {
      studies: filteredData,
      totalCount: total,
      page,
      totalPages: Math.ceil(total / pageSize) || 1,
    }
  } catch (err) {
    console.error('Error in getStudies:', err)
    return {
      studies: [],
      totalCount: 0,
      page: 1,
      totalPages: 1,
    }
  }
}

export async function getStudyBySlug(slug: string): Promise<Study | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return null
    }

    const { data, error } = await supabase
      .from('studies')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .eq('slug', slug)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return data as Study
  } catch (err) {
    console.error('Error in getStudyBySlug:', err)
    return null
  }
}

export async function getStudiesByMosque(mosqueId: string): Promise<Study[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase || !UUID_REGEX.test(mosqueId)) {
      return []
    }

    const { data, error } = await supabase
      .from('studies')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .eq('mosque_id', mosqueId)
      .order('study_date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error || !data) {
      return []
    }

    return data as Study[]
  } catch (err) {
    console.error('Error in getStudiesByMosque:', err)
    return []
  }
}
