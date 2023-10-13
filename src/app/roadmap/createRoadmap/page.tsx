import { getSessionData } from '@/lib/session';
import RoadmapForm from './roadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/redirectButtons';

export default async function Page() {
  let session = await getSessionData(cookies())

  // User must be signed in
  if (!session.user) {
    return notFound();
  }

  return (
    <>
      <p><BackButton href="../"/></p>
      <h1>Skapa en ny färdplan</h1>
      <RoadmapForm user={session.user} userGroups={session.user?.userGroups} />
    </>
  )
}