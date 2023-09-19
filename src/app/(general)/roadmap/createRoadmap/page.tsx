import { getSessionData } from '@/lib/session';
import CreateRoadmap from './createRoadmap';
import { cookies } from 'next/headers';
import getUserGroups from '@/functions/getUserGroups';

export default async function Page() {
  let session = await getSessionData(cookies())
  let userGroups: string[] = [...(await getUserGroups(session.user?.id!)), 'Public']

  return (
    <>
      <h1>Skapa färdplan</h1>
      <CreateRoadmap user={session.user} userGroups={userGroups} />
    </>
  )
}