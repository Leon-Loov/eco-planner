import { getSessionData } from '@/lib/session'
import { cookies } from 'next/headers'

export default async function Page() {
  const { user } = await getSessionData(cookies())

  return <h1>Hello {user?.username}!</h1>
}