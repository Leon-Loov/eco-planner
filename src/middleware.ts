import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)

  if (!session.user) return new NextResponse(null, { status: 401 })
  if (session.user.isLoggedIn !== true) return new NextResponse(null, { status: 403 })

  return res
}

export const config = {
  matcher: '/admin'
}