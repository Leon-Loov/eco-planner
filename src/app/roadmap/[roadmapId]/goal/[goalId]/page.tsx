import { notFound } from "next/navigation";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import accessChecker from "@/lib/accessChecker";
import { AccessLevel } from "@/types";
import CombinedGraph from "@/components/graphs/combinedGraph";
import ActionGraph from "@/components/graphs/actionGraph";
import Actions from "@/components/tables/actions";
import MainGraph from "@/components/graphs/mainGraph";
import MainRelativeGraph from "@/components/graphs/mainRelativeGraph";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  const goal = roadmap?.goals.find(goal => goal.id === params.goalId);

  let accessLevel: AccessLevel = AccessLevel.None;
  if (goal) {
    accessLevel = accessChecker(goal, session.user);
  }

  // 404 if the goal doesn't exist or if the user doesn't have access to it
  if (!goal || !accessLevel || !roadmap) {
    return notFound();
  }

  return (
    <>
      <h1 style={{ marginBottom: ".25em" }}>{goal.name ? goal.name : goal.indicatorParameter}</h1>
      <span style={{ color: "gray" }}>Målbana</span>
      <Actions title='Åtgärder' goal={goal} accessLevel={accessLevel} params={params} />
      <br />
      { // TODO: Make this a toggle
        goal ?
          <MainGraph goal={goal} />
          :
          <MainRelativeGraph goal={goal} />
      }
      <br />
      <CombinedGraph roadmap={roadmap} goal={goal} />
      <br />
      <ActionGraph actions={goal.actions} />
      <br />
    </>
  )
}