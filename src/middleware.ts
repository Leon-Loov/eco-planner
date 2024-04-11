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

  /**
   * Mathces the creation and editing pages for MetaRoadmaps, Roadmaps, Goals, and Actions, with or without trailing slashes.
   * For example, "/createMetaRoadmap" or "/editAction/"
   */
  const createOrEditRegEx = /\/(create|edit)(MetaRoadmap|Roadmap|Goal|Action)\/?$/
  // Redirect away from creation and editing pages if not logged in
  if (req.nextUrl.pathname.match(createOrEditRegEx)) {
    if (!session.user?.isLoggedIn) {
      const loginUrl = new URL('/login', req.url)
      // Save the current page as the "from" query parameter so we can redirect back after logging in
      loginUrl.searchParams.set('from', req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}