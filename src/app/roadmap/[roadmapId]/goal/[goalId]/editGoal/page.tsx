import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "@/components/forms/goalForm/goalForm";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import { BackButton } from '@/components/buttons/redirectButtons';
import getNationals from "@/fetchers/getNationals";
import getOneGoal from "@/fetchers/getOneGoal";
import { AccessLevel } from "@/types";


export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, currentGoal, nationalRoadmaps] = await Promise.all([
    getSessionData(cookies()),
    getOneGoal(params.goalId),
    getNationals(),
  ]);

  // User must be signed in and have edit access to the goal, and the goal must exist
  if (!currentGoal || !session.user || !accessChecker(currentGoal, session.user) || accessChecker(currentGoal, session.user) === AccessLevel.View) {
    return notFound();
  }

  // params.goalID WEIRD?!
  return (
    <>
      <div className='display-flex align-items-center gap-100 margin-y-100'>
        <p><BackButton href={`/roadmap/${params.roadmapId}/goal/${params.goalId}`} /></p>
        <h1>Redigera målbanan &quot;{currentGoal.name ? currentGoal.name : currentGoal.indicatorParameter}&quot; {currentGoal.roadmaps[0]?.name ? ` under färdplanen "${currentGoal.roadmaps[0].name}"` : null}</h1>
      </div>
      <GoalForm roadmapId={params.roadmapId} user={session.user} nationalRoadmaps={nationalRoadmaps} currentGoal={currentGoal} />
    </>
  )
}