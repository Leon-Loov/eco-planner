import { getSessionData } from '@/lib/session';
import RoadmapForm from '@/components/forms/roadmapForm/roadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/buttons/redirectButtons';
import getNationals from '@/fetchers/getNationals';

export default async function Page() {
  const [session, nationalRoadmaps] = await Promise.all([
    getSessionData(cookies()),
    getNationals(),
  ]);

  // User must be signed in
  if (!session.user) {
    return notFound();
  }

  return (
    <>
      <div className='display-flex align-items-center gap-100'>
        <BackButton href="../" />
        <h1>Skapa en ny färdplan</h1>
      </div>
      <RoadmapForm
        user={session.user}
        userGroups={session.user?.userGroups}
        nationalRoadmaps={nationalRoadmaps}
      />
    </>
  )
}