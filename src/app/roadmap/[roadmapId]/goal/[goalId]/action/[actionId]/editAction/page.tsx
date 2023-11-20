import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import ActionForm from "../../createAction/actionForm";
import { notFound } from "next/navigation";
import accessChecker from "@/lib/accessChecker";
import { BackButton } from '@/components/redirectButtons';
import getOneGoal from "@/fetchers/getOneGoal";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string, actionId: string } }) {
  const [session, goal] = await Promise.all([
    getSessionData(cookies()),
    getOneGoal(params.goalId)
  ]);

  let action = goal?.actions.find(action => action.id === params.actionId);

  // User must be signed in and have edit access to the action, and the action must exist
  if (!action || !goal || !session.user || !accessChecker(action, session.user) || accessChecker(action, session.user) === 'VIEW') {
    return notFound();
  }

  return (
    <>
      <p><BackButton href="./" /></p>
      <h1>Redigera åtgärden {`"${action.name}" under målbanan "${goal.name || goal.indicatorParameter}"`}</h1>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} user={session.user} currentAction={action} />
    </>
  )
}