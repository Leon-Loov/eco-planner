import RoadmapForm from "../../createRoadmap/roadmapForm";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { getSessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/redirectButtons';

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
      <p><BackButton href="../" /></p>
      <h1>Redigera färdplanen {`"${roadmap.name}"`}</h1>
      <RoadmapForm
        user={session.user}
        userGroups={session.user?.userGroups}
        currentRoadmap={roadmap}
      />
    </>
  )
}