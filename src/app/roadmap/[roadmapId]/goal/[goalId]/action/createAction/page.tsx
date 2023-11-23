import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import ActionForm from "../../../../../../../components/forms/createAction/actionForm";
import { notFound } from "next/navigation";
import accessChecker from "@/lib/accessChecker";
import { BackButton } from '@/components/buttons/redirectButtons';
import getOneGoal from "@/fetchers/getOneGoal";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, goal] = await Promise.all([
    getSessionData(cookies()),
    getOneGoal(params.goalId)
  ]);

  // User must be signed in and have edit access to the goal, and the goal must exist
  if (!goal || !session.user || !accessChecker(goal, session.user) || accessChecker(goal, session.user) === 'VIEW') {
    return notFound();
  }

  return (
    <>
      <p><BackButton href="../" /></p>
      <h1>Skapa ny åtgärd {`under målbanan "${goal?.name || goal.indicatorParameter}"`}</h1>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} user={session.user} />
    </>
  )
}