'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/actions/auth'
import { slugify } from '@/lib/utils'

export interface MosqueFormState {
  error?: string
  success?: boolean
}

export async function createMosqueAction(
  prevState: MosqueFormState,
  formData: FormData
): Promise<MosqueFormState> {
  const session = await getCurrentUserAndProfile()
  if (!session || session.role !== 'superadmin') {
    return { error: 'Akses ditolak: Hanya Superadmin yang dapat menambahkan data masjid baru.' }
  }

  const name = ((formData.get('name') as string) || '').trim()
  const address = ((formData.get('address') as string) || '').trim()
  const takmirName = ((formData.get('takmir_name') as string) || '').trim()
  const takmirPhone = ((formData.get('takmir_phone') as string) || '').trim()
  const routineInfo = ((formData.get('routine_info') as string) || '').trim()
  const imageFile = formData.get('image') as File | null
  const imageUrlInput = ((formData.get('image_url_input') as string) || '').trim()

  if (!name || !address || !takmirPhone) {
    return { error: 'Mohon lengkapi nama masjid, alamat, dan kontak takmir.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    let finalImageUrl = imageUrlInput

    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return { error: 'File foto harus berformat gambar (JPG, PNG, WebP).' }
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: 'Ukuran foto masjid maksimal 5MB.' }
      }

      if (supabase) {
        const ext = imageFile.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
        const filePath = `mosques/${fileName}`

        const buffer = await imageFile.arrayBuffer()
        const { error: uploadError } = await supabase.storage
          .from('study-posters')
          .upload(filePath, buffer, {
            contentType: imageFile.type,
            upsert: true,
          })

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('study-posters')
            .getPublicUrl(filePath)
          finalImageUrl = publicUrlData.publicUrl
        }
      }
    }

    if (!finalImageUrl) {
      finalImageUrl =
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
    }

    const baseSlug = slugify(name)
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36).substring(4)}`

    if (supabase) {
      const { error: insertError } = await (supabase as any).from('mosques').insert({
        name,
        slug: uniqueSlug,
        address,
        takmir_name: takmirName || 'Takmir Masjid',
        takmir_phone: takmirPhone,
        routine_info: routineInfo || null,
        image_url: finalImageUrl,
      })

      if (insertError) {
        return { error: `Gagal menambahkan masjid: ${insertError.message}` }
      }
    }

    revalidatePath('/')
    revalidatePath('/masjid')
    revalidatePath('/superadmin')
    revalidatePath('/superadmin/masjid')
    return { success: true }
  } catch (err) {
    console.error('Error creating mosque:', err)
    return { error: 'Terjadi kesalahan sistem saat membuat masjid.' }
  }
}

export async function updateMosqueAction(
  mosqueId: string,
  prevState: MosqueFormState,
  formData: FormData
): Promise<MosqueFormState> {
  const session = await getCurrentUserAndProfile()
  if (!session || !session.authenticated) {
    return { error: 'Silakan masuk untuk mengedit profil masjid.' }
  }

  // Enforce Ownership: Takmir can ONLY update their assigned mosque
  if (session.role === 'takmir') {
    if (session.mosqueId !== mosqueId) {
      return { error: 'Akses ditolak: Anda hanya dapat mengubah data profil masjid Anda sendiri.' }
    }
  } else if (session.role !== 'superadmin') {
    return { error: 'Anda tidak memiliki hak akses untuk mengubah data masjid.' }
  }

  const name = ((formData.get('name') as string) || '').trim()
  const address = ((formData.get('address') as string) || '').trim()
  const takmirName = ((formData.get('takmir_name') as string) || '').trim()
  const takmirPhone = ((formData.get('takmir_phone') as string) || '').trim()
  const routineInfo = ((formData.get('routine_info') as string) || '').trim()
  const imageFile = formData.get('image') as File | null
  const imageUrlInput = ((formData.get('image_url_input') as string) || '').trim()

  if (!name || !address || !takmirPhone) {
    return { error: 'Mohon lengkapi nama masjid, alamat, dan nomor takmir.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    let finalImageUrl = imageUrlInput

    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return { error: 'File foto harus berformat gambar (JPG, PNG, WebP).' }
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: 'Ukuran foto masjid maksimal 5MB.' }
      }

      if (supabase) {
        const ext = imageFile.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
        const filePath = `mosques/${fileName}`

        const buffer = await imageFile.arrayBuffer()
        const { error: uploadError } = await supabase.storage
          .from('study-posters')
          .upload(filePath, buffer, {
            contentType: imageFile.type,
            upsert: true,
          })

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('study-posters')
            .getPublicUrl(filePath)
          finalImageUrl = publicUrlData.publicUrl
        }
      }
    }

    if (supabase) {
      const updatePayload: Record<string, unknown> = {
        name,
        address,
        takmir_name: takmirName || 'Takmir Masjid',
        takmir_phone: takmirPhone,
        routine_info: routineInfo || null,
        updated_at: new Date().toISOString(),
      }

      if (finalImageUrl) {
        updatePayload.image_url = finalImageUrl
      }

      const { error: updateError } = await (supabase as any)
        .from('mosques')
        .update(updatePayload)
        .eq('id', mosqueId)

      if (updateError) {
        return { error: `Gagal memperbarui profil masjid: ${updateError.message}` }
      }
    }

    revalidatePath('/')
    revalidatePath('/masjid')
    revalidatePath('/takmir')
    revalidatePath('/takmir/masjid')
    revalidatePath('/superadmin')
    revalidatePath('/superadmin/masjid')
    return { success: true }
  } catch (err) {
    console.error('Error updating mosque:', err)
    return { error: 'Terjadi kesalahan sistem saat memperbarui masjid.' }
  }
}

export async function deleteMosqueAction(mosqueId: string) {
  const session = await getCurrentUserAndProfile()
  if (!session || session.role !== 'superadmin') {
    return { error: 'Akses ditolak: Hanya Superadmin yang dapat menghapus masjid.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await (supabase as any).from('mosques').delete().eq('id', mosqueId)
      if (error) {
        return { error: `Gagal menghapus masjid: ${error.message}` }
      }
    }

    revalidatePath('/')
    revalidatePath('/masjid')
    revalidatePath('/superadmin')
    revalidatePath('/superadmin/masjid')
    return { success: true }
  } catch (err) {
    console.error('Error deleting mosque:', err)
    return { error: 'Terjadi kesalahan sistem saat menghapus masjid.' }
  }
}
