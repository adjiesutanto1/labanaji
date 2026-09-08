import { Study } from '@/lib/supabase/types'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getInitialDemoStudies, DEMO_MOSQUES } from './demo-data'
import { getTodayDateString } from '@/lib/utils'

export async function getTodayStudies(limit: number = 6): Promise<Study[]> {
  const today = getTodayDateString()

  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      const demoList = getInitialDemoStudies()
      return demoList.filter((s) => s.study_date === today).slice(0, limit)
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

    if (error || !data || data.length === 0) {
      const demoList = getInitialDemoStudies()
      return demoList.filter((s) => s.study_date === today).slice(0, limit)
    }

    return data as Study[]
  } catch (err) {
    console.error('Error fetching today studies:', err)
    const demoList = getInitialDemoStudies()
    return demoList.filter((s) => s.study_date === today).slice(0, limit)
  }
}

export async function getUpcomingStudies(limit: number = 6): Promise<Study[]> {
  const today = getTodayDateString()

  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      const demoList = getInitialDemoStudies()
      return demoList.filter((s) => s.study_date > today).slice(0, limit)
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

    if (error || !data || data.length === 0) {
      const demoList = getInitialDemoStudies()
      return demoList.filter((s) => s.study_date > today).slice(0, limit)
    }

    return data as Study[]
  } catch (err) {
    console.error('Error fetching upcoming studies:', err)
    const demoList = getInitialDemoStudies()
    return demoList.filter((s) => s.study_date > today).slice(0, limit)
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
      return getDemoStudiesFiltered(params)
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
      baseQuery = baseQuery.eq('mosque_id', mosqueId)
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
      return getDemoStudiesFiltered(params)
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
    return getDemoStudiesFiltered(params)
  }
}

function getDemoStudiesFiltered(params: GetStudiesParams) {
  const {
    query = '',
    date = '',
    mosqueSlug = '',
    mosqueId = '',
    page = 1,
    pageSize = 9,
  } = params

  let list = getInitialDemoStudies()

  if (date) {
    list = list.filter((s) => s.study_date === date)
  }

  if (mosqueId) {
    list = list.filter((s) => s.mosque_id === mosqueId)
  }

  if (mosqueSlug) {
    list = list.filter((s) => s.mosque?.slug === mosqueSlug)
  }

  if (query) {
    const q = query.toLowerCase()
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        s.mosque?.name.toLowerCase().includes(q)
    )
  }

  const total = list.length
  const from = (page - 1) * pageSize
  const paged = list.slice(from, from + pageSize)

  return {
    studies: paged,
    totalCount: total,
    page,
    totalPages: Math.ceil(total / pageSize) || 1,
  }
}

export async function getStudyBySlug(slug: string): Promise<Study | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      const demoList = getInitialDemoStudies()
      return demoList.find((s) => s.slug === slug) || null
    }

    const { data, error } = await supabase
      .from('studies')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .eq('slug', slug)
      .single()

    if (error || !data) {
      const demoList = getInitialDemoStudies()
      return demoList.find((s) => s.slug === slug) || null
    }

    return data as Study
  } catch (err) {
    console.error('Error in getStudyBySlug:', err)
    const demoList = getInitialDemoStudies()
    return demoList.find((s) => s.slug === slug) || null
  }
}

export async function getStudiesByMosque(mosqueId: string): Promise<Study[]> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      const demoList = getInitialDemoStudies()
      return demoList.filter((s) => s.mosque_id === mosqueId)
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
      const demoList = getInitialDemoStudies()
      return demoList.filter((s) => s.mosque_id === mosqueId)
    }

    return data as Study[]
  } catch (err) {
    console.error('Error in getStudiesByMosque:', err)
    const demoList = getInitialDemoStudies()
    return demoList.filter((s) => s.mosque_id === mosqueId)
  }
}
