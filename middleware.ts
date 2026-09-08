import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is configured, refresh session cookie via SSR client
  let isAuthenticated = false

  const isSupabaseConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')

  if (isSupabaseConfigured) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      isAuthenticated = true
    }
  }

  // Fallback demo cookies for local preview
  if (!isAuthenticated) {
    const demoTakmir = request.cookies.get('labanaji_demo_takmir')?.value
    const demoSuperadmin = request.cookies.get('labanaji_demo_superadmin')?.value
    if (demoTakmir === 'true' || demoSuperadmin === 'true') {
      isAuthenticated = true
    }
  }

  // Protect /takmir and /superadmin routes
  const isProtectedRoute =
    pathname.startsWith('/takmir') || pathname.startsWith('/superadmin')

  // Allow /takmir/login without auth (or redirect to /login)
  if (pathname === '/takmir/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svg, png)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
