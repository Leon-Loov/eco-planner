import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)

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

  if (
    req.nextUrl.pathname.endsWith('/createRoadmap') ||
    req.nextUrl.pathname.endsWith('/createRoadmap/') ||
    req.nextUrl.pathname.endsWith('/createGoal') ||
    req.nextUrl.pathname.endsWith('/createGoal/') ||
    req.nextUrl.pathname.endsWith('/createAction') ||
    req.nextUrl.pathname.endsWith('/createAction/')
  ) {
    if (!session.user?.isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}