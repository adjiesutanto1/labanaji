'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/actions/auth'
import { slugify } from '@/lib/utils'

export interface StudyFormState {
  error?: string
  success?: boolean
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

  // Enforce Mosque Ownership: Takmir can ONLY create studies for their assigned mosque
  let targetMosqueId = rawMosqueId
  if (session.role === 'takmir') {
    if (!session.mosqueId) {
      return { error: 'Akun Takmir Anda belum terhubung dengan data masjid.' }
    }
    targetMosqueId = session.mosqueId
  } else if (session.role !== 'superadmin') {
    return { error: 'Anda tidak memiliki hak akses untuk menambahkan kajian.' }
  }

  if (!title || !targetMosqueId || !studyDate || !startTime) {
    return { error: 'Mohon lengkapi judul, tanggal, dan waktu kajian.' }
  }

  let finalPosterUrl = posterUrlInput

  try {
    const supabase = await createServerSupabaseClient()

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
        mosque_id: targetMosqueId,
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
  } catch (err) {
    console.error('Error creating study:', err)
    return { error: 'Terjadi kesalahan sistem saat menyimpan kajian.' }
  }

  redirect('/takmir/kajian')
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

    // Authorization & Ownership Verification
    if (supabase) {
      const { data: existingStudy, error: fetchError } = await (supabase as any)
        .from('studies')
        .select('mosque_id')
        .eq('id', studyId)
        .single()

      if (fetchError || !existingStudy) {
        return { error: 'Data kajian tidak ditemukan.' }
      }

      if (session.role === 'takmir') {
        if (existingStudy.mosque_id !== session.mosqueId) {
          return { error: 'Akses ditolak: Anda hanya dapat mengubah kajian masjid Anda sendiri.' }
        }
      } else if (session.role !== 'superadmin') {
        return { error: 'Anda tidak memiliki hak akses untuk mengubah kajian ini.' }
      }
    }

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

      // If superadmin, allow changing mosque assignment
      if (session.role === 'superadmin' && rawMosqueId) {
        updatePayload.mosque_id = rawMosqueId
      }

      if (finalPosterUrl) {
        updatePayload.poster_url = finalPosterUrl
      }

      const { error: updateError } = await (supabase as any)
        .from('studies')
        .update(updatePayload)
        .eq('id', studyId)

      if (updateError) {
        return { error: `Gagal memperbarui kajian: ${updateError.message}` }
      }
    }

    revalidatePath('/')
    revalidatePath('/kajian')
    revalidatePath('/takmir')
    revalidatePath('/takmir/kajian')
  } catch (err) {
    console.error('Error updating study:', err)
    return { error: 'Terjadi kesalahan sistem saat memperbarui kajian.' }
  }

  redirect('/takmir/kajian')
}

export async function deleteStudyAction(studyId: string) {
  const session = await getCurrentUserAndProfile()
  if (!session || !session.authenticated) {
    return { error: 'Silakan masuk untuk menghapus kajian.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      // Check ownership before deleting
      const { data: existingStudy, error: fetchError } = await (supabase as any)
        .from('studies')
        .select('mosque_id')
        .eq('id', studyId)
        .single()

      if (fetchError || !existingStudy) {
        return { error: 'Kajian tidak ditemukan.' }
      }

      if (session.role === 'takmir') {
        if (existingStudy.mosque_id !== session.mosqueId) {
          return { error: 'Akses ditolak: Anda hanya dapat menghapus kajian masjid Anda sendiri.' }
        }
      } else if (session.role !== 'superadmin') {
        return { error: 'Akses ditolak.' }
      }

      const { error: deleteError } = await (supabase as any)
        .from('studies')
        .delete()
        .eq('id', studyId)

      if (deleteError) {
        return { error: `Gagal menghapus kajian: ${deleteError.message}` }
      }
    }

    revalidatePath('/')
    revalidatePath('/kajian')
    revalidatePath('/takmir')
    revalidatePath('/takmir/kajian')
    return { success: true }
  } catch (err) {
    console.error('Error deleting study:', err)
    return { error: 'Gagal menghapus kajian.' }
  }
}
