import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/technician', '/admin']
const authPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('fixforge-session')

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && session) {
    try {
      const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'))
      const role = decoded.role
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
      if (role === 'technician') return NextResponse.redirect(new URL('/technician', request.url))
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
