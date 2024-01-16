import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import ActionForm from "@/components/forms/actionForm/actionForm";
import { notFound } from "next/navigation";
import accessChecker from "@/lib/accessChecker";
import { BackButton } from '@/components/buttons/redirectButtons';
import getOneAction from "@/fetchers/getOneAction";
import { AccessLevel } from "@/types";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string, actionId: string } }) {
  const [session, action] = await Promise.all([
    getSessionData(cookies()),
    getOneAction(params.actionId)
  ]);

  // User must be signed in and have edit access to the action, and the action must exist
  if (!action || !session.user || !accessChecker(action, session.user) || accessChecker(action, session.user) === AccessLevel.View) {
    return notFound();
  }

  return (
    <>
      <div className='display-flex align-items-center gap-100 margin-y-100'>
        <p><BackButton href="./" /></p>
        <h1>Redigera åtgärden {`"${action.name}" under målbanan "${action.goals[0]?.name || action.goals[0]?.indicatorParameter || "ERROR"}"`}</h1>
      </div>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} user={session.user} currentAction={action} />
    </>
  )
}