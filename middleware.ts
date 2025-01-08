import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Update session if exists
  await updateSession(request)

  // Public paths that don't require authentication
  const isPublicPath = path === '/auth' || 
    path === '/auth/login' || 
    path === '/auth/register'

  const token = request.cookies.get('token')?.value

  // Redirect authenticated users away from auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect unauthenticated users to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/cart',
    '/wishlist',
    '/sell',
  ],
}

