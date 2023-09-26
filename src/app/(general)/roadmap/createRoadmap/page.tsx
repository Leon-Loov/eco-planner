import { getSessionData } from '@/lib/session';
import CreateRoadmap from './createRoadmap';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function Page() {
  let session = await getSessionData(cookies())

  // User must be signed in
  if (!session.user) {
    return notFound();
  }

  return (
    <>
      <h1>Skapa en ny färdplan</h1>
      <CreateRoadmap user={session.user} userGroups={session.user?.userGroups} />
    </>
  )
}