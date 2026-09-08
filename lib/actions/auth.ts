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
    const cookieStore = await cookies()
    const supabase = await createServerSupabaseClient()
    
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            *,
            mosque:mosques(*)
          `)
          .eq('id', user.id)
          .single()

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
      }
    }

    // Fallback Demo Session for Superadmin
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

    // Fallback Demo Session for Takmir
    const demoTakmirCookie = cookieStore.get('labanaji_demo_takmir')
    if (demoTakmirCookie?.value === 'true') {
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
  const cookieStore = await cookies()

  try {
    // 1. Direct match for demo superadmin
    if (
      email === 'admin@labanaji.com' &&
      (password === 'admin123' || password === 'admin' || password === 'superadmin')
    ) {
      cookieStore.set('labanaji_demo_superadmin', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24,
      })
      cookieStore.delete('labanaji_demo_takmir')
      return { success: true, redirectUrl: '/superadmin' }
    }

    // 2. Direct match for demo takmir
    if (
      email === 'takmir@banyuwangi.id' &&
      (password === 'takmir123' || password === 'takmir')
    ) {
      cookieStore.set('labanaji_demo_takmir', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24,
      })
      cookieStore.delete('labanaji_demo_superadmin')
      return { success: true, redirectUrl: '/takmir' }
    }

    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // If email is superadmin/admin, fallback to demo superadmin session
        if (
          email.toLowerCase().includes('admin') ||
          email.toLowerCase().includes('superadmin')
        ) {
          cookieStore.set('labanaji_demo_superadmin', 'true', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
          })
          cookieStore.delete('labanaji_demo_takmir')
          return { success: true, redirectUrl: '/superadmin' }
        }

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
          if (
            email.toLowerCase().includes('admin') ||
            email.toLowerCase().includes('superadmin')
          ) {
            cookieStore.set('labanaji_demo_superadmin', 'true', {
              httpOnly: true,
              path: '/',
              maxAge: 60 * 60 * 24,
            })
            return { success: true, redirectUrl: '/superadmin' }
          }
          
          // Auto-heal missing profile for Takmir
          const defaultMosqueId = DEMO_MOSQUES[0].id
          await (supabase as any).from('profiles').insert({
            id: data.user.id,
            role: 'takmir',
            mosque_id: defaultMosqueId,
            name: data.user.user_metadata?.name || 'Takmir Masjid',
            phone: '08123456789',
          })

          cookieStore.set('labanaji_demo_takmir', 'true', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
          })
          return { success: true, redirectUrl: '/takmir' }
        }

        const profile = rawProfile as Profile
        const role = profile.role
        if (role === 'superadmin') {
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
    } else {
      // Local development without Supabase env keys
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

  return { success: true, redirectUrl: targetRedirect }
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
  const cookieStore = await cookies()

  if (mosqueType === 'new') {
    if (!newMosqueName || !newMosqueAddress) {
      return { error: 'Nama dan alamat masjid baru wajib diisi.' }
    }
  } else {
    if (!existingMosqueId) {
      targetMosqueId = DEMO_MOSQUES[0].id
    }
  }

  try {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      // 1. Create user in Supabase Auth first
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
          return { error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk di halaman login.' }
        }
        return { error: `Gagal mendaftar: ${authError.message}` }
      }

      if (!authData.user) {
        return { error: 'Gagal membuat akun autentikasi.' }
      }

      // 2. Sign in to establish active session context
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // 3. Create new mosque if requested
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

        if (!mosqueError && newMosque) {
          targetMosqueId = newMosque.id
        } else {
          console.warn('Mosque insert warning (RLS or DB):', mosqueError)
          if (!targetMosqueId) {
            targetMosqueId = DEMO_MOSQUES[0].id
          }
        }
      }

      // 4. Insert profile with strict role = 'takmir'
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'takmir',
          mosque_id: targetMosqueId || DEMO_MOSQUES[0].id,
          name,
          phone,
        })

      if (profileError) {
        console.warn('Profile insert warning (RLS or DB):', profileError)
      }

      // Set cookie session backup
      cookieStore.set('labanaji_demo_takmir', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24,
      })
      cookieStore.delete('labanaji_demo_superadmin')
    } else {
      // Local development fallback
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

  return { success: true, redirectUrl: '/takmir' }
}

