import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "../../createGoal/goalForm";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import getRoadmaps from "@/fetchers/getRoadmaps";
import { BackButton } from '@/components/redirectButtons';


export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap, allRoadmaps] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
    getRoadmaps(),
  ]);

  let nationalRoadmaps = allRoadmaps.filter((roadmap) => roadmap.isNational);
  let currentGoal = roadmap!.goals.find(goal => goal.id === params.goalId);

  // User must be signed in and have edit access to the roadmap, and the roadmap must exist
  if (!roadmap || !session.user || !accessChecker(roadmap, session.user) || accessChecker(roadmap, session.user) === 'VIEW') {
    return notFound();
  }
  
// params.goalID WEIRD?!
  return (
    <>
      <p><BackButton href={`/roadmap/${roadmap.id}/goal/${params.goalId}`} /></p>
      <h1>Redigera målbanan &quot;{currentGoal?.name ? currentGoal.name : currentGoal?.indicatorParameter}&quot; {roadmap?.name ? ` under färdplanen "${roadmap.name}"` : null}</h1>
      <GoalForm roadmapId={params.roadmapId} user={session.user} nationalRoadmaps={nationalRoadmaps} currentGoal={currentGoal} />
    </>
  )
}