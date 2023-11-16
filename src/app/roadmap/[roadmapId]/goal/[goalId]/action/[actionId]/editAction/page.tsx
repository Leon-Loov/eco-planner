import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import ActionForm from "../../createAction/actionForm";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { notFound } from "next/navigation";
import accessChecker from "@/lib/accessChecker";
import { BackButton } from '@/components/redirectButtons';

export default async function Page({ params }: { params: { roadmapId: string, goalId: string, actionId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  let goal = roadmap?.goals.find(goal => goal.id === params.goalId);
  let action = goal?.actions.find(action => action.id === params.actionId);

  // User must be signed in and have edit access to the action, and the action must exist
  if (!action || !goal || !session.user || !accessChecker(action, session.user) || accessChecker(action, session.user) === 'VIEW') {
    return notFound();
  }

  return (
    <>
      <p><BackButton href="./" /></p>
      <h1>Redigera åtgärden {`"${action.name}"`} {roadmap ? `under målbanan "${goal.name || goal.indicatorParameter}" i "${roadmap.name}"` : ""}</h1>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} user={session.user} currentAction={action} />
    </>
  )
}