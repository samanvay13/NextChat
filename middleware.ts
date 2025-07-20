import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', user.id)
        requestHeaders.set('x-user-email', user.email || '')
        
        supabaseResponse = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
    }
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isHomePage = request.nextUrl.pathname === '/'
  const isCallback = request.nextUrl.pathname === '/auth/callback'
  const isResetPassword = request.nextUrl.pathname === '/auth/reset-password'

  if (isCallback) {
    return supabaseResponse
  }

  if (isResetPassword) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  if (!request.nextUrl.pathname.startsWith('/api/')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user && isHomePage) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    if (user && isAuthPage && !isCallback && !isResetPassword) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}