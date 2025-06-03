import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { USER_AUTHENTICATION_TOKEN } from '@/app/constant/cookie-name'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login'
  const token = request.cookies.get(USER_AUTHENTICATION_TOKEN)?.value || ''

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}

export const config = {
  matcher: ['/', '/login', '/card-issue', '/face-id-registration'],
}
