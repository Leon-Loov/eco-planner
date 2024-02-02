import { getSessionData } from '@/lib/session';
import MetaRoadmapForm from '@/components/forms/metaRoadmapForm/metaRoadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/buttons/redirectButtons';
import getMetaRoadmaps from '@/fetchers/getMetaRoadmaps';

export default async function Page() {
  let [session, parentRoadmapOptions] = await Promise.all([
    getSessionData(cookies()),
    getMetaRoadmaps(),
  ]);

  // User must be signed in
  if (!session.user) {
    return notFound();
  }

  return (
    <>
      <div className='display-flex align-items-center gap-100 margin-y-100'>
        <BackButton href="../" />
        <h1>Skapa en ny färdplan</h1>
      </div>
      <MetaRoadmapForm
        user={session.user}
        userGroups={session.user?.userGroups}
        parentRoadmapOptions={parentRoadmapOptions}
      />
    </>
  )
}