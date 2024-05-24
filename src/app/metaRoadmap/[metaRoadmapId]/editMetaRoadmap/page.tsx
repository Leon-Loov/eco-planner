import { getSession } from '@/lib/session';
import MetaRoadmapForm from '@/components/forms/metaRoadmapForm/metaRoadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import getMetaRoadmaps from '@/fetchers/getMetaRoadmaps';
import getOneMetaRoadmap from '@/fetchers/getOneMetaRoadmap';
import accessChecker from '@/lib/accessChecker';
import { AccessLevel } from '@/types';

export default async function Page({ params }: { params: { metaRoadmapId: string } }) {
  const [session, currentRoadmap, parentRoadmapOptions] = await Promise.all([
    getSession(cookies()),
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
      <div className='container-text' style={{marginInline: 'auto'}}>
        <h1>Redigera metadatan för färdplan: {`${currentRoadmap.name}`}</h1>
        <MetaRoadmapForm
          user={session.user}
          userGroups={session.user?.userGroups}
          parentRoadmapOptions={parentRoadmapOptions}
          currentRoadmap={currentRoadmap}
        />
      </div>
    </>
  )
}