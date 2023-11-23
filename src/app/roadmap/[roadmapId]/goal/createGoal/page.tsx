import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "./goalForm";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import { BackButton } from '@/components/buttons/redirectButtons';
import getNationals from "@/fetchers/getNationals";


export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap, nationalRoadmaps] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
    getNationals(),
  ]);

  // User must be signed in and have edit access to the roadmap, and the roadmap must exist
  if (!roadmap || !session.user || !accessChecker(roadmap, session.user) || accessChecker(roadmap, session.user) === 'VIEW') {
    return notFound();
  }

  return (
    <>
      <p><BackButton href="../" /></p>
      <h1>Skapa ny målbana{roadmap?.name ? ` under "${roadmap.name}"` : null}</h1>
      <GoalForm roadmapId={params.roadmapId} user={session.user} nationalRoadmaps={nationalRoadmaps} />
    </>
  )
}