'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Profile, Mosque } from '@/lib/supabase/types'

export interface AuthSessionData {
  authenticated: boolean
  user: {
    id: string
    email: string
    name?: string
  }
  profile: Profile | null
  role: 'superadmin' | 'takmir' | null
  mosqueId: string | null
  mosque: Mosque | null
}

export interface AuthFormState {
  error?: string
  success?: boolean
  redirectUrl?: string
}

/**
 * Get current authenticated user, profile, and associated mosque safely on the server.
 */
export async function getCurrentUserAndProfile(): Promise<AuthSessionData | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) return null

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch user profile joined with mosque
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        *,
        mosque:mosques(*)
      `)
      .eq('id', user.id)
      .maybeSingle()

    if (profile) {
      const profileData = profile as Profile & { mosque?: Mosque }

      return {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email || '',
          name: profileData.name || user.user_metadata?.name || 'Takmir',
        },
        profile: profileData,
        role: profileData.role,
        mosqueId: profileData.mosque_id,
        mosque: profileData.mosque || null,
      }
    }

    // If auth user exists but profile row is missing, check metadata
    const userRole = (user.user_metadata?.role as 'superadmin' | 'takmir') || 'takmir'
    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'Pengguna',
      },
      profile: null,
      role: userRole,
      mosqueId: null,
      mosque: null,
    }
  } catch (err) {
    console.error('Error in getCurrentUserAndProfile:', err)
    return null
  }
}

/**
 * Backward compatibility alias for existing components
 */
export async function getTakmirSession() {
  return getCurrentUserAndProfile()
}

/**
 * Server action for logging in users with email and password.
 * Checks profile role and redirects accordingly:
 * - 'superadmin' -> /superadmin
 * - 'takmir' -> /takmir
 */
export async function loginAction(
  prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const email = ((formData.get('email') as string) || '').trim()
  const password = ((formData.get('password') as string) || '').trim()

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return { error: 'Konfigurasi server database Supabase belum tersedia.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.' }
      }
      return { error: `Gagal masuk: ${error.message}` }
    }

    if (!data?.user) {
      return { error: 'Gagal memverifikasi identitas pengguna.' }
    }

    // Query user profile
    const { data: rawProfile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    const role = rawProfile?.role || data.user.user_metadata?.role || 'takmir'
    const targetRedirect = role === 'superadmin' ? '/superadmin' : '/takmir'

    return { success: true, redirectUrl: targetRedirect }
  } catch (err) {
    console.error('Login action error:', err)
    return { error: 'Terjadi gangguan sistem saat proses login.' }
  }
}

/**
 * Backward compatibility alias for existing forms
 */
export async function loginTakmirAction(formData: FormData) {
  return loginAction(undefined, formData)
}

/**
 * Server action for logging out
 */
export async function logoutTakmirAction() {
  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
  } catch (err) {
    console.error('Logout error:', err)
  }

  redirect('/login')
}

/**
 * Server action for Public Takmir Registration.
 * Strictly assigns role = 'takmir' on the server.
 */
export async function registerTakmirAction(
  prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const name = ((formData.get('name') as string) || '').trim()
  const email = ((formData.get('email') as string) || '').trim()
  const phone = ((formData.get('phone') as string) || '').trim()
  const mosqueType = (formData.get('mosque_selection_type') as string) || 'new'
  const existingMosqueId = (formData.get('existing_mosque_id') as string) || ''
  const newMosqueName = ((formData.get('new_mosque_name') as string) || '').trim()
  const newMosqueAddress = ((formData.get('new_mosque_address') as string) || '').trim()
  const password = ((formData.get('password') as string) || '').trim()
  const confirmPassword = ((formData.get('confirm_password') as string) || '').trim()

  // 1. Validation
  if (!name || !email || !phone || !password || !confirmPassword) {
    return { error: 'Semua kolom wajib diisi.' }
  }

  if (password.length < 6) {
    return { error: 'Kata sandi minimal 6 karakter.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Konfirmasi kata sandi tidak cocok.' }
  }

  if (mosqueType === 'new' && (!newMosqueName || !newMosqueAddress)) {
    return { error: 'Nama dan alamat masjid baru wajib diisi.' }
  }

  let targetMosqueId = existingMosqueId || null

  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return { error: 'Konfigurasi database belum tersedia.' }
    }

    // 1. Create new mosque if requested
    if (mosqueType === 'new') {
      const baseSlug = newMosqueName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36).substring(4)}`

      const { data: newMosque, error: mosqueError } = await (supabase as any)
        .from('mosques')
        .insert({
          name: newMosqueName,
          slug: uniqueSlug,
          address: newMosqueAddress,
          takmir_name: name,
          takmir_phone: phone,
          image_url:
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        })
        .select('id')
        .single()

      if (mosqueError) {
        return { error: `Gagal mendaftarkan masjid: ${mosqueError.message}` }
      }

      if (newMosque) {
        targetMosqueId = newMosque.id
      }
    }

    // 2. Create user in Supabase Auth with complete metadata for auto-trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'takmir',
          phone,
          mosque_id: targetMosqueId,
        },
      },
    })

    if (authError) {
      if (authError.message.includes('User already registered')) {
        return { error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk di halaman login.' }
      }
      return { error: `Gagal mendaftar: ${authError.message}` }
    }

    if (!authData.user) {
      return { error: 'Gagal membuat akun autentikasi pengguna.' }
    }

    // 3. Sign in to establish active session
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // 4. Ensure profile row is created / updated
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .upsert(
        {
          id: authData.user.id,
          role: 'takmir',
          mosque_id: targetMosqueId,
          name,
          phone,
        },
        { onConflict: 'id' }
      )

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      return { error: `Gagal menyimpan data profil: ${profileError.message}` }
    }

    return { success: true, redirectUrl: '/takmir' }
  } catch (err) {
    console.error('Registration error:', err)
    return { error: 'Terjadi gangguan sistem saat proses pendaftaran.' }
  }
}
