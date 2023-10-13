import { getSessionData } from '@/lib/session';
import RoadmapForm from './roadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function Page() {
  let session = await getSessionData(cookies())

  // User must be signed in
  if (!session.user) {
    return notFound();
  }

  return (
    <>
      <p><Link href="../">🠘 Gå tillbaka</Link></p>
      <h1>Skapa en ny färdplan</h1>
      <RoadmapForm user={session.user} userGroups={session.user?.userGroups} />
    </>
  )
}