import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "./goalForm";
import getOneRoadmap from "@/functions/getOneRoadmap";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import getRoadmaps from "@/functions/getRoadmaps";
import { BackButton } from '@/components/redirectButtons';


export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap, allRoadmaps] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
    getRoadmaps(),
  ]);

  let nationalRoadmaps = allRoadmaps.filter((roadmap) => roadmap.isNational);

  // User must be signed in and have edit access to the roadmap, and the roadmap must exist
  if (!roadmap || !session.user || !accessChecker(roadmap, session.user) || accessChecker(roadmap, session.user) === 'VIEW') {
    return notFound();
  }

  return (
    <>
      <p><BackButton href="../"/></p>
      <h1>Skapa ny målbana{roadmap?.name ? ` under "${roadmap.name}"` : null}</h1>
      <GoalForm roadmapId={params.roadmapId} user={session.user} nationalRoadmaps={nationalRoadmaps} />
    </>
  )
}