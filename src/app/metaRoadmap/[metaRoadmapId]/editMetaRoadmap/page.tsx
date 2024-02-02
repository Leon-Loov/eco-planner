import { getSessionData } from '@/lib/session';
import MetaRoadmapForm from '@/components/forms/metaRoadmapForm/metaRoadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/buttons/redirectButtons';
import getMetaRoadmaps from '@/fetchers/getMetaRoadmaps';
import getOneMetaRoadmap from '@/fetchers/getOneMetaRoadmap';
import accessChecker from '@/lib/accessChecker';
import { AccessLevel } from '@/types';

export default async function Page({ params }: { params: { metaRoadmapId: string } }) {
  const [session, currentRoadmap, parentRoadmapOptions] = await Promise.all([
    getSessionData(cookies()),
    getOneMetaRoadmap(params.metaRoadmapId),
    getMetaRoadmaps(),
  ]);

  const access = accessChecker(currentRoadmap, session.user)

  // User must be signed in and have edit access to the roadmap, which must exist
  if (!session.user || !currentRoadmap || access == AccessLevel.None || access == AccessLevel.View) {
    return notFound();
  }

  return (
    <>
      <div className='display-flex align-items-center gap-100 margin-y-100'>
        <BackButton href="../" />
        <h1>Redigera metadatan för färdplanen {`"${currentRoadmap.name}"`}</h1>
      </div>
      <MetaRoadmapForm
        user={session.user}
        userGroups={session.user?.userGroups}
        parentRoadmapOptions={parentRoadmapOptions}
        currentRoadmap={currentRoadmap}
      />
    </>
  )
}