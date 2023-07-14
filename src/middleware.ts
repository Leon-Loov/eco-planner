import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)

  // Example of restricting access to specific paths/folders
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session.user) return new NextResponse(null, { status: 401 })
    if (session.user.isLoggedIn !== true) return new NextResponse(null, { status: 403 })
  }

  // Redirect away from login page if already logged in
  if (req.nextUrl.pathname.startsWith('/login')) {
    if (session.user?.isLoggedIn === true) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Redirect away from signup page if already logged in
  if (req.nextUrl.pathname.startsWith('/signup')) {
    if (session.user?.isLoggedIn === true) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}