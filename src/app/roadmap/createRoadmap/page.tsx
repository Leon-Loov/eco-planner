import { getSessionData } from '@/lib/session';
import RoadmapForm from '@/components/forms/roadmapForm/roadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/buttons/redirectButtons';
import getDeeperNationals from '@/fetchers/getDeeperNationals';

export default async function Page() {
  const [session, nationalRoadmaps] = await Promise.all([
    getSessionData(cookies()),
    getDeeperNationals(),
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
        nationalRoadmaps={nationalRoadmaps}
      />
    </>
  )
}