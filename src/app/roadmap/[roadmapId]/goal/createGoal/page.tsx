import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "@/components/forms/goalForm/goalForm";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import { BackButton } from '@/components/buttons/redirectButtons';
import { AccessLevel } from "@/types";


export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
  ]);

  // User must be signed in and have edit access to the roadmap, and the roadmap must exist
  if (!roadmap || !session.user || !accessChecker(roadmap, session.user) || accessChecker(roadmap, session.user) === AccessLevel.View) {
    return notFound();
  }

  return (
    <>
      <div className='display-flex align-items-center gap-100 margin-y-100'>
        <p><BackButton href="../" /></p>
        <h1>Skapa ny målbana{roadmap?.metaRoadmap.name ? ` under "${roadmap.metaRoadmap.name}"` : null}</h1>
      </div>
      <GoalForm roadmapId={params.roadmapId} />
    </>
  )
}