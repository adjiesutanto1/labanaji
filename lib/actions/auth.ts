'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import type { Profile, Mosque } from '@/lib/supabase/types'
import { DEMO_MOSQUES } from '@/lib/data/demo-data'

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
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return null
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          *,
          mosque:mosques(*)
        `)
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Authenticated in Supabase Auth but profile not configured yet
        return {
          authenticated: true,
          user: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || 'Pengguna',
          },
          profile: null,
          role: null,
          mosqueId: null,
          mosque: null,
        }
      }

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

    // Fallback Demo Session for local development without Supabase credentials
    const cookieStore = await cookies()
    const demoCookie = cookieStore.get('labanaji_demo_takmir')
    if (demoCookie?.value === 'true') {
      const defaultMosque = DEMO_MOSQUES[0]
      const demoProfile: Profile = {
        id: 'demo-user-1',
        role: 'takmir',
        mosque_id: defaultMosque.id,
        name: 'H. Ahmad Fauzi (Takmir Demo)',
        phone: '081234567891',
        mosque: defaultMosque,
      }

      return {
        authenticated: true,
        user: {
          id: 'demo-user-1',
          email: 'takmir@banyuwangi.id',
          name: 'Takmir Masjid Baiturrahman',
        },
        profile: demoProfile,
        role: 'takmir',
        mosqueId: defaultMosque.id,
        mosque: defaultMosque,
      }
    }

    const demoSuperadminCookie = cookieStore.get('labanaji_demo_superadmin')
    if (demoSuperadminCookie?.value === 'true') {
      const demoSuperProfile: Profile = {
        id: 'demo-superadmin-1',
        role: 'superadmin',
        mosque_id: null,
        name: 'Superadmin LABANAJI',
        phone: '081299998888',
      }

      return {
        authenticated: true,
        user: {
          id: 'demo-superadmin-1',
          email: 'admin@labanaji.com',
          name: 'Superadmin LABANAJI',
        },
        profile: demoSuperProfile,
        role: 'superadmin',
        mosqueId: null,
        mosque: null,
      }
    }

    return null
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

  let targetRedirect = '/takmir'

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
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

      if (data?.user) {
        // Query user profile
        const { data: rawProfile, error: profileError } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError || !rawProfile) {
          await supabase.auth.signOut()
          return {
            error: 'Akun Anda belum terdaftar dalam sistem hak akses (Profile). Hubungi Administrator LABANAJI.',
          }
        }

        const profile = rawProfile as Profile
        const role = profile.role
        if (role === 'superadmin') {
          targetRedirect = '/superadmin'
        } else if (role === 'takmir') {
          if (!profile.mosque_id) {
            return {
              error: 'Akun Takmir belum terhubung dengan data masjid. Hubungi Administrator.',
            }
          }
          targetRedirect = '/takmir'
        } else {
          await supabase.auth.signOut()
          return { error: 'Role akun tidak valid.' }
        }
      }
    } else {
      // Local development without Supabase env keys
      const cookieStore = await cookies()
      if (email.includes('superadmin') || email.includes('admin@labanaji.com')) {
        cookieStore.set('labanaji_demo_superadmin', 'true', {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24,
        })
        cookieStore.delete('labanaji_demo_takmir')
        targetRedirect = '/superadmin'
      } else {
        cookieStore.set('labanaji_demo_takmir', 'true', {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24,
        })
        cookieStore.delete('labanaji_demo_superadmin')
        targetRedirect = '/takmir'
      }
    }
  } catch (err) {
    console.error('Login action error:', err)
    return { error: 'Terjadi gangguan koneksi atau sistem saat proses login.' }
  }

  redirect(targetRedirect)
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
    const cookieStore = await cookies()
    cookieStore.delete('labanaji_demo_takmir')
    cookieStore.delete('labanaji_demo_superadmin')
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

  let targetMosqueId = existingMosqueId

  if (mosqueType === 'new') {
    if (!newMosqueName || !newMosqueAddress) {
      return { error: 'Nama dan alamat masjid baru wajib diisi.' }
    }
  } else {
    if (!existingMosqueId) {
      return { error: 'Silakan pilih masjid yang Anda kelola.' }
    }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      // Create new mosque if requested
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

        if (mosqueError || !newMosque) {
          return {
            error: `Gagal mendaftarkan masjid: ${mosqueError?.message || 'Terjadi kesalahan'}`,
          }
        }

        targetMosqueId = newMosque.id
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'takmir',
          },
        },
      })

      if (authError) {
        if (authError.message.includes('User already registered')) {
          return { error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' }
        }
        return { error: `Gagal mendaftar: ${authError.message}` }
      }

      if (!authData.user) {
        return { error: 'Gagal membuat akun autentikasi.' }
      }

      // Insert profile with strict role = 'takmir'
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'takmir', // Strictly enforced on server
          mosque_id: targetMosqueId,
          name,
          phone,
        })

      if (profileError) {
        console.error('Profile insert error during register:', profileError)
      }

      // Automatically sign in
      await supabase.auth.signInWithPassword({
        email,
        password,
      })
    } else {
      // Local development fallback
      const cookieStore = await cookies()
      cookieStore.set('labanaji_demo_takmir', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24,
      })
      cookieStore.delete('labanaji_demo_superadmin')
    }
  } catch (err) {
    console.error('Registration error:', err)
    return { error: 'Terjadi gangguan sistem saat proses pendaftaran.' }
  }

  redirect('/takmir')
}

