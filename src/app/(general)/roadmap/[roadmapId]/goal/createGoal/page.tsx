import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import CreateGoal from "./goalForm";
import getOneRoadmap from "@/functions/getOneRoadmap";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  // User must be signed in and have edit access to the roadmap, and the roadmap must exist
  if (!roadmap || !session.user || !accessChecker(roadmap, session.user) || accessChecker(roadmap, session.user) === 'VIEW') {
    return notFound();
  }

  return (
    <>
      <h1>Skapa ny målbana {roadmap?.name ? `under "${roadmap.name}"` : ""}</h1>
      <CreateGoal roadmapId={params.roadmapId} userGroups={session.user.userGroups} />
    </>
  )
}