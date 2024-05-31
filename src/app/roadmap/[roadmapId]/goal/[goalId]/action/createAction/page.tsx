import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import ActionForm from "@/components/forms/actionForm/actionForm";
import { notFound } from "next/navigation";
import accessChecker from "@/lib/accessChecker";
import getOneGoal from "@/fetchers/getOneGoal";
import { AccessControlled, AccessLevel } from "@/types";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, goal] = await Promise.all([
    getSession(cookies()),
    getOneGoal(params.goalId)
  ]);

  let goalAccessData: AccessControlled | null = null;
  if (goal) {
    goalAccessData = {
      author: goal.author,
      editors: goal.roadmap.editors,
      viewers: goal.roadmap.viewers,
      editGroups: goal.roadmap.editGroups,
      viewGroups: goal.roadmap.viewGroups,
      isPublic: goal.roadmap.isPublic
    }
  }
  // User must be signed in and have edit access to the goal, and the goal must exist
  if (!goal || !session.user || !accessChecker(goalAccessData, session.user) || accessChecker(goalAccessData, session.user) === AccessLevel.View) {
    return notFound();
  }

  return (
    <>
      <div className="container-text" style={{ marginInline: 'auto' }}>
        <h1>Skapa ny åtgärd under målbana: {`${goal?.name || goal.indicatorParameter}`}</h1>
        <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} />
      </div>
    </>
  )
}