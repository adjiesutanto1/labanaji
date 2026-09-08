'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/lib/actions/auth'

export interface SuperadminActionState {
  error?: string
  success?: boolean
  credentials?: {
    name: string
    email: string
    mosqueName: string
    tempPassword?: string
  }
}

/**
 * Superadmin action to generate a new Takmir account and link to a mosque.
 */
export async function createTakmirAccountAction(
  prevState: SuperadminActionState | undefined,
  formData: FormData
): Promise<SuperadminActionState> {
  const session = await getCurrentUserAndProfile()
  if (!session || session.role !== 'superadmin') {
    return { error: 'Akses ditolak: Hanya Superadmin yang dapat membuat akun Takmir.' }
  }

  const name = ((formData.get('name') as string) || '').trim()
  const email = ((formData.get('email') as string) || '').trim()
  const phone = ((formData.get('phone') as string) || '').trim()
  const mosqueId = (formData.get('mosque_id') as string) || ''
  const tempPassword = ((formData.get('password') as string) || '').trim()

  if (!name || !email || !phone || !mosqueId || !tempPassword) {
    return { error: 'Semua kolom wajib diisi untuk membuat akun Takmir.' }
  }

  if (tempPassword.length < 6) {
    return { error: 'Password minimal 6 karakter.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    let mosqueName = 'Masjid Terkait'

    if (supabase) {
      // 1. Get Mosque name
      const { data: mosqueData } = await (supabase as any)
        .from('mosques')
        .select('name')
        .eq('id', mosqueId)
        .single()

      if (mosqueData?.name) {
        mosqueName = mosqueData.name
      }

      // 2. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            name,
            role: 'takmir',
          },
        },
      })

      if (authError) {
        if (authError.message.includes('User already registered')) {
          return { error: 'Email tersebut sudah terdaftar di sistem.' }
        }
        return { error: `Gagal mendaftarkan autentikasi: ${authError.message}` }
      }

      if (!authData.user) {
        return { error: 'Gagal membuat user autentikasi.' }
      }

      // 3. Insert Profile
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'takmir',
          mosque_id: mosqueId,
          name,
          phone,
        })

      if (profileError) {
        return { error: `Gagal menyimpan profil: ${profileError.message}` }
      }
    }

    revalidatePath('/superadmin')
    revalidatePath('/superadmin/takmir')
    revalidatePath('/superadmin/masjid')

    return {
      success: true,
      credentials: {
        name,
        email,
        mosqueName,
        tempPassword,
      },
    }
  } catch (err) {
    console.error('Error creating takmir account:', err)
    return { error: 'Terjadi kesalahan sistem saat membuat akun Takmir.' }
  }
}

/**
 * Superadmin action to update a Takmir profile (name, phone, assigned mosque).
 */
export async function updateTakmirAction(
  takmirId: string,
  prevState: SuperadminActionState | undefined,
  formData: FormData
): Promise<SuperadminActionState> {
  const session = await getCurrentUserAndProfile()
  if (!session || session.role !== 'superadmin') {
    return { error: 'Akses ditolak: Hanya Superadmin yang dapat mengubah akun Takmir.' }
  }

  const name = ((formData.get('name') as string) || '').trim()
  const phone = ((formData.get('phone') as string) || '').trim()
  const mosqueId = (formData.get('mosque_id') as string) || ''

  if (!name || !phone || !mosqueId) {
    return { error: 'Mohon lengkapi nama, nomor telepon, dan masjid yang ditugaskan.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          name,
          phone,
          mosque_id: mosqueId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', takmirId)

      if (error) {
        return { error: `Gagal memperbarui takmir: ${error.message}` }
      }
    }

    revalidatePath('/superadmin')
    revalidatePath('/superadmin/takmir')
    return { success: true }
  } catch (err) {
    console.error('Error updating takmir:', err)
    return { error: 'Terjadi kesalahan sistem saat memperbarui akun Takmir.' }
  }
}

/**
 * Superadmin action to delete a Takmir profile.
 */
export async function deleteTakmirAction(takmirId: string) {
  const session = await getCurrentUserAndProfile()
  if (!session || session.role !== 'superadmin') {
    return { error: 'Akses ditolak: Hanya Superadmin yang dapat menghapus Takmir.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await (supabase as any)
        .from('profiles')
        .delete()
        .eq('id', takmirId)

      if (error) {
        return { error: `Gagal menghapus profil takmir: ${error.message}` }
      }
    }

    revalidatePath('/superadmin')
    revalidatePath('/superadmin/takmir')
    return { success: true }
  } catch (err) {
    console.error('Error deleting takmir:', err)
    return { error: 'Terjadi kesalahan saat menghapus Takmir.' }
  }
}
