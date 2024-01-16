import RoadmapForm from "@/components/forms/roadmapForm/roadmapForm";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { getSessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/buttons/redirectButtons';

export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
  ]);

  // User must be signed in and have edit access to the roadmap, which must exist
  if (!session.user || !roadmap) {
    return notFound();
  }

  return (
    <>
      <div className='display-flex align-items-center gap-100 margin-y-100'>
        <p><BackButton href={`/roadmap/${roadmap.id}`} /></p>
        <h1>Redigera färdplanen {`"${roadmap.name}"`}</h1>
      </div>
      <RoadmapForm
        user={session.user}
        userGroups={session.user?.userGroups}
        currentRoadmap={roadmap}
      />
    </>
  )
}