'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/actions/auth'
import { slugify } from '@/lib/utils'

export interface StudyFormState {
  error?: string
  success?: boolean
  redirectUrl?: string
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function resolveValidMosqueId(
  supabase: any,
  candidateId: string | null | undefined,
  sessionProfileId?: string | null
): Promise<string | null> {
  if (!supabase) return candidateId && UUID_REGEX.test(candidateId) ? candidateId : null

  // 1. If candidate is a valid UUID, check if it exists in mosques table
  if (candidateId && UUID_REGEX.test(candidateId)) {
    try {
      const { data: existing } = await supabase
        .from('mosques')
        .select('id')
        .eq('id', candidateId)
        .maybeSingle()
      if (existing?.id) {
        return existing.id
      }
    } catch {
      // ignore
    }
  }

  // 2. Fetch the first existing mosque from the database
  try {
    const { data: firstMosque } = await supabase
      .from('mosques')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (firstMosque?.id) {
      if (sessionProfileId) {
        await supabase
          .from('profiles')
          .update({ mosque_id: firstMosque.id })
          .eq('id', sessionProfileId)
      }
      return firstMosque.id
    }

    // 3. If no mosque exists at all in the DB, create a default one
    const { data: newMosque } = await supabase
      .from('mosques')
      .insert({
        name: 'Masjid Agung Baiturrahman',
        slug: `masjid-agung-baiturrahman-${Date.now().toString(36)}`,
        address: 'Jl. Jenderal Sudirman No. 1, Kepatihan, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68411',
        latitude: -8.219233,
        longitude: 114.369226,
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      })
      .select('id')
      .single()

    if (newMosque?.id) {
      if (sessionProfileId) {
        await supabase
          .from('profiles')
          .update({ mosque_id: newMosque.id })
          .eq('id', sessionProfileId)
      }
      return newMosque.id
    }
  } catch (err) {
    console.error('Error in resolveValidMosqueId:', err)
  }

  return candidateId && UUID_REGEX.test(candidateId) ? candidateId : null
}

export async function createStudyAction(
  prevState: StudyFormState,
  formData: FormData
): Promise<StudyFormState> {
  const session = await getCurrentUserAndProfile()
  if (!session || !session.authenticated) {
    return { error: 'Silakan masuk untuk mempublikasikan kajian.' }
  }

  const title = ((formData.get('title') as string) || '').trim()
  const rawMosqueId = (formData.get('mosque_id') as string) || ''
  const speaker = ((formData.get('speaker') as string) || '').trim()
  const studyDate = (formData.get('study_date') as string) || ''
  const startTime = ((formData.get('start_time') as string) || '').trim()
  const description = ((formData.get('description') as string) || '').trim()
  const posterFile = formData.get('poster') as File | null
  const posterUrlInput = ((formData.get('poster_url_input') as string) || '').trim()

  // Enforce Mosque Ownership: Takmir uses assigned mosque, Superadmin can choose
  let candidateMosqueId = rawMosqueId
  if (session.role === 'takmir') {
    candidateMosqueId = session.mosqueId || rawMosqueId
  }

  if (!title || !studyDate || !startTime) {
    return { error: 'Mohon lengkapi judul, tanggal, dan waktu kajian.' }
  }

  let finalPosterUrl = posterUrlInput

  try {
    const supabase = await createServerSupabaseClient()
    const validMosqueId = await resolveValidMosqueId(supabase, candidateMosqueId, session.user?.id)

    if (!validMosqueId) {
      return { error: 'Masjid tidak valid atau belum terdaftar di database.' }
    }

    // Handle poster file upload if provided
    if (posterFile && posterFile.size > 0) {
      if (!posterFile.type.startsWith('image/')) {
        return { error: 'File poster harus berformat gambar (JPG, PNG, WebP).' }
      }

      if (posterFile.size > 5 * 1024 * 1024) {
        return { error: 'Ukuran file poster maksimal 5MB.' }
      }

      if (supabase) {
        const ext = posterFile.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
        const filePath = `posters/${fileName}`

        const buffer = await posterFile.arrayBuffer()
        const { error: uploadError } = await supabase.storage
          .from('study-posters')
          .upload(filePath, buffer, {
            contentType: posterFile.type,
            upsert: true,
          })

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('study-posters')
            .getPublicUrl(filePath)
          finalPosterUrl = publicUrlData.publicUrl
        }
      }
    }

    if (!finalPosterUrl) {
      finalPosterUrl =
        'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80'
    }

    const baseSlug = slugify(title)
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36).substring(4)}`

    if (supabase) {
      const { error: insertError } = await (supabase as any).from('studies').insert({
        title,
        slug: uniqueSlug,
        mosque_id: validMosqueId,
        speaker: speaker || 'Pemateri',
        poster_url: finalPosterUrl,
        description: description || null,
        study_date: studyDate,
        start_time: startTime,
      })

      if (insertError) {
        console.error('Insert study error:', insertError)
        return { error: `Gagal menyimpan kajian: ${insertError.message}` }
      }
    }

    revalidatePath('/')
    revalidatePath('/kajian')
    revalidatePath('/takmir')
    revalidatePath('/takmir/kajian')
    revalidatePath('/superadmin')
    revalidatePath('/superadmin/kajian')

    const targetUrl = session.role === 'superadmin' ? '/superadmin/kajian' : '/takmir/kajian'
    return { success: true, redirectUrl: targetUrl }
  } catch (err) {
    console.error('Error creating study:', err)
    return { error: 'Terjadi kesalahan sistem saat menyimpan kajian.' }
  }
}

export async function updateStudyAction(
  studyId: string,
  prevState: StudyFormState,
  formData: FormData
): Promise<StudyFormState> {
  const session = await getCurrentUserAndProfile()
  if (!session || !session.authenticated) {
    return { error: 'Silakan masuk untuk mengedit kajian.' }
  }

  const title = ((formData.get('title') as string) || '').trim()
  const rawMosqueId = (formData.get('mosque_id') as string) || ''
  const speaker = ((formData.get('speaker') as string) || '').trim()
  const studyDate = (formData.get('study_date') as string) || ''
  const startTime = ((formData.get('start_time') as string) || '').trim()
  const description = ((formData.get('description') as string) || '').trim()
  const posterFile = formData.get('poster') as File | null
  const posterUrlInput = ((formData.get('poster_url_input') as string) || '').trim()

  if (!title || !studyDate || !startTime) {
    return { error: 'Mohon lengkapi judul, tanggal, dan waktu kajian.' }
  }

  try {
    const supabase = await createServerSupabaseClient()

    let finalPosterUrl = posterUrlInput

    if (posterFile && posterFile.size > 0) {
      if (!posterFile.type.startsWith('image/')) {
        return { error: 'File poster harus berupa format gambar.' }
      }

      if (posterFile.size > 5 * 1024 * 1024) {
        return { error: 'Ukuran file poster maksimal 5MB.' }
      }

      if (supabase) {
        const ext = posterFile.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
        const filePath = `posters/${fileName}`

        const buffer = await posterFile.arrayBuffer()
        const { error: uploadError } = await supabase.storage
          .from('study-posters')
          .upload(filePath, buffer, {
            contentType: posterFile.type,
            upsert: true,
          })

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('study-posters')
            .getPublicUrl(filePath)
          finalPosterUrl = publicUrlData.publicUrl
        }
      }
    }

    if (supabase) {
      const updatePayload: Record<string, unknown> = {
        title,
        speaker: speaker || 'Pemateri',
        description: description || null,
        study_date: studyDate,
        start_time: startTime,
        updated_at: new Date().toISOString(),
      }

      if (rawMosqueId) {
        const validMosqueId = await resolveValidMosqueId(supabase, rawMosqueId)
        if (validMosqueId) {
          updatePayload.mosque_id = validMosqueId
        }
      }

      if (finalPosterUrl) {
        updatePayload.poster_url = finalPosterUrl
      }

      if (UUID_REGEX.test(studyId)) {
        const { error: updateError } = await (supabase as any)
          .from('studies')
          .update(updatePayload)
          .eq('id', studyId)

        if (updateError) {
          return { error: `Gagal memperbarui kajian: ${updateError.message}` }
        }
      }
    }

    revalidatePath('/')
    revalidatePath('/kajian')
    revalidatePath('/takmir')
    revalidatePath('/takmir/kajian')
    revalidatePath('/superadmin')
    revalidatePath('/superadmin/kajian')

    const targetUrl = session.role === 'superadmin' ? '/superadmin/kajian' : '/takmir/kajian'
    return { success: true, redirectUrl: targetUrl }
  } catch (err) {
    console.error('Error updating study:', err)
    return { error: 'Terjadi kesalahan sistem saat memperbarui kajian.' }
  }
}

export async function deleteStudyAction(studyId: string) {
  const session = await getCurrentUserAndProfile()
  if (!session || !session.authenticated) {
    return { error: 'Silakan masuk untuk menghapus kajian.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase && UUID_REGEX.test(studyId)) {
      const { error: deleteError } = await (supabase as any)
        .from('studies')
        .delete()
        .eq('id', studyId)

      if (deleteError) {
        console.error('Delete study error:', deleteError)
      }
    }

    revalidatePath('/')
    revalidatePath('/kajian')
    revalidatePath('/takmir')
    revalidatePath('/takmir/kajian')
    revalidatePath('/superadmin')
    revalidatePath('/superadmin/kajian')
    return { success: true }
  } catch (err) {
    console.error('Error deleting study:', err)
    return { error: 'Gagal menghapus kajian.' }
  }
}
