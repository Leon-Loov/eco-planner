import { notFound } from "next/navigation";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import accessChecker from "@/lib/accessChecker";
import { AccessLevel } from "@/types";
import CombinedGraph from "@/components/graphs/combinedGraph";
import ActionGraph from "@/components/graphs/actionGraph";
import Actions from "@/components/tables/actions";
import Link from "next/link";
import Image from "next/image";
import GraphGraph from "@/components/graphs/graphGraph";
import getOneGoal from "@/fetchers/getOneGoal";
import { Goal, DataSeries } from "@prisma/client";
import GraphSelector from "@/components/graphs/graphselector/graphSelector";
import Comments from "@/components/comments/comments";
import { Fragment } from "react";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap, goal] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
    getOneGoal(params.goalId)
  ]);

  let nationalGoal: Goal & { dataSeries: DataSeries | null } | null = null;

  let accessLevel: AccessLevel = AccessLevel.None;
  if (goal) {
    accessLevel = accessChecker(goal, session.user);

    if (goal.nationalGoalId) {
      nationalGoal = await getOneGoal(goal.nationalGoalId)
    }

  }

  // 404 if the goal doesn't exist or if the user doesn't have access to it
  if (!goal || !accessLevel || !roadmap) {
    return notFound();
  }

  return (
    <>
      <h1 style={{ marginBottom: ".25em" }} className="display-flex align-items-center gap-25 flex-wrap-wrap">
        { // Only show the edit link if the user has edit access to the roadmap
          (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
          <Link href={`/roadmap/${roadmap.id}/goal/${goal.id}/editGoal`}>
            <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${goal.name}`} />
          </Link>
        }
        {goal.name ? goal.name : goal.indicatorParameter}
      </h1>
      {goal.name && <>
        <span style={{ color: "gray" }}> {`${goal.indicatorParameter}, `} </span>
        <br />
      </>}
      <span style={{ color: "gray" }}>Målbana</span>
      {goal.links.length > 0 &&
        <>
          <h2>Länkar</h2>
          {goal.links.map((link) => (
            <Fragment key={link.id}>
              <a href={link.url}>{link.description || link.url}</a>
              <br />
            </Fragment>
          ))}
        </>
      }
      <Actions title='Åtgärder' goal={goal} accessLevel={accessLevel} params={params} />
      <br />
      <GraphGraph goal={goal} nationalGoal={nationalGoal} />
      <br />
      <CombinedGraph roadmap={roadmap} goal={goal} />
      <br />
      <ActionGraph actions={goal.actions} />
      <br />
      <Comments comments={goal.comments} objectId={goal.id} />
    </>
  )
}