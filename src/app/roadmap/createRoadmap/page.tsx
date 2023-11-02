import { getSessionData } from '@/lib/session';
import RoadmapForm from './roadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/redirectButtons';
import getRoadmaps from '@/functions/getRoadmaps';

export default async function Page() {
  const [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmaps(),
  ]);

  // User must be signed in
  if (!session.user) {
    return notFound();
  }

  return (
    <>
      <p><BackButton href="../" /></p>
      <h1>Skapa en ny färdplan</h1>
      <RoadmapForm
        user={session.user}
        userGroups={session.user?.userGroups}
        nationalRoadmaps={roadmaps.filter((roadmap) => roadmap.isNational)}
      />
    </>
  )
}