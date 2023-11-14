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
import MainDeltaGraph from "@/components/graphs/mainDeltaGraph";
import Link from "next/link";
import Image from "next/image";

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

  let graphSelection = 'mainGraph';

  return (
    <>
      <h1 style={{ marginBottom: ".25em" }} className="flex-row align-center gap-25 flex-wrap">
        { // Only show the edit link if the user has edit access to the roadmap
          (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
          <Link href={`/roadmap/${roadmap.id}/goal/${goal.id}/editGoal`}>
            <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${goal.name}`} />
          </Link>
        }
        {goal.name ? goal.name : goal.indicatorParameter}
      </h1>
      <span style={{ color: "gray" }}>Målbana</span>
      <Actions title='Åtgärder' goal={goal} accessLevel={accessLevel} params={params} />
      <br />
      { // TODO: Make a proper toggle
        graphSelection == 'mainGraph' ?
          <MainGraph goal={goal} />
          :
          graphSelection == 'mainRelativeGraph' ?
            <MainRelativeGraph goal={goal} />
            :
            graphSelection == 'mainDeltaGraph' ?
              <MainDeltaGraph goal={goal} />
              :
              null
      }
      <br />
      <CombinedGraph roadmap={roadmap} goal={goal} />
      <br />
      <ActionGraph actions={goal.actions} />
      <br />
    </>
  )
}