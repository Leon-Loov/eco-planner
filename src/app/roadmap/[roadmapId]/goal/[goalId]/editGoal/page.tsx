import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "@/components/forms/goalForm/goalForm";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import { BackButton } from '@/components/buttons/redirectButtons';
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

  // params.goalID WEIRD?!
  return (
    <>
      <p><BackButton href={`/roadmap/${params.roadmapId}/goal/${params.goalId}`} /></p>
      <h1>Redigera målbanan &quot;{currentGoal.name ? currentGoal.name : currentGoal.indicatorParameter}&quot; {currentGoal.roadmap.metaRoadmap.name ? ` under färdplanen "${currentGoal.roadmap.metaRoadmap.name}"` : null}</h1>
      <GoalForm roadmapId={params.roadmapId} currentGoal={currentGoal} />
    </>
  )
}