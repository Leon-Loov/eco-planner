import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import ActionForm from "./actionForm";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { notFound } from "next/navigation";
import accessChecker from "@/lib/accessChecker";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  let goal = roadmap?.goals.find(goal => goal.id === params.goalId);

  // User must be signed in and have edit access to the goal, and the goal must exist
  if (!goal || !session.user || !accessChecker(goal, session.user) || accessChecker(goal, session.user) === 'VIEW') {
    return notFound();
  }

  return (
    <>
      <h1>Skapa ny åtgärd {roadmap ? `under målbanan "${goal?.name || "namn saknas"}" i "${roadmap.name}"` : ""}</h1>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} user={session.user} />
    </>
  )
}