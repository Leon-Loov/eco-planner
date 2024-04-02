import RoadmapForm from "@/components/forms/roadmapForm/roadmapForm";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { getSessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import accessChecker from "@/lib/accessChecker";
import { AccessLevel } from "@/types";
import Link from "next/link";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
  ]);

  const access = accessChecker(roadmap, session.user)

  // User must be signed in and have edit access to the roadmap, which must exist
  if (!session.user || !roadmap || access == AccessLevel.None || access == AccessLevel.View) {
    return notFound();
  }

  return (
    <>
      <div className='container-text' style={{marginInline: 'auto'}}>
        <h1>Redigera färdplan</h1>
        <p>Menade de att redigera den gemensamma metadatan för alla versioner av den här färdplanen? I så fall kan du <Link href={`/metaRoadmap/${roadmap.metaRoadmapId}/editMetaRoadmap`}>gå hit</Link> för att redigera metadatan.</p>
        <RoadmapForm
          user={session.user}
          userGroups={session.user?.userGroups}
          currentRoadmap={roadmap}
        />
      </div>
    </>
  )
}