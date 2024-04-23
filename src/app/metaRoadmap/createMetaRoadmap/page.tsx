import { getSessionData } from '@/lib/session';
import MetaRoadmapForm from '@/components/forms/metaRoadmapForm/metaRoadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
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
      <div className='container-text' style={{marginInline: 'auto'}}>
        <div className='margin-y-300' style={{fontSize: 'larger', width: 'min(45ch, 100%)', marginInline: 'auto'}}>
          <h1 style={{textAlign: 'center'}}>Skapa en ny färdplan</h1>
        </div>
        <MetaRoadmapForm
          user={session.user}
          userGroups={session.user?.userGroups}
          parentRoadmapOptions={parentRoadmapOptions}
        />
      </div>
    </>
  )
}