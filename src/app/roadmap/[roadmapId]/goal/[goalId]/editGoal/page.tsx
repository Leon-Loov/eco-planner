import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "@/components/forms/goalForm/goalForm";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import getOneGoal from "@/fetchers/getOneGoal";
import { AccessControlled, AccessLevel } from "@/types";


export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, currentGoal] = await Promise.all([
    getSessionData(cookies()),
    getOneGoal(params.goalId),
  ]);

  let goalAccessData: AccessControlled | null = null;
  if (currentGoal) {
    goalAccessData = {
      author: currentGoal.author,
      editors: currentGoal.roadmap.editors,
      viewers: currentGoal.roadmap.viewers,
      editGroups: currentGoal.roadmap.editGroups,
      viewGroups: currentGoal.roadmap.viewGroups,
    }
  }
  // User must be signed in and have edit access to the goal, and the goal must exist
  if (!currentGoal || !session.user || !accessChecker(goalAccessData, session.user) || accessChecker(goalAccessData, session.user) === AccessLevel.View) {
    return notFound();
  }

  return (
    <>
      <div className="container-text">
        <h1>Redigera målbana: {currentGoal.name ? currentGoal.name : currentGoal.indicatorParameter}</h1>
        <GoalForm roadmapId={params.roadmapId} currentGoal={currentGoal} />
      </div>
    </>
  )
}