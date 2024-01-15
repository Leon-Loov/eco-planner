import { notFound } from "next/navigation";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import accessChecker from "@/lib/accessChecker";
import { AccessControlled, AccessLevel } from "@/types";
import CombinedGraph from "@/components/graphs/combinedGraph";
import ActionGraph from "@/components/graphs/actionGraph";
import Actions from "@/components/tables/actions";
import Link from "next/link";
import Image from "next/image";
import GraphGraph from "@/components/graphs/graphGraph";
import getOneGoal from "@/fetchers/getOneGoal";
import { Goal, DataSeries } from "@prisma/client";
import Comments from "@/components/comments/comments";
import { Fragment } from "react";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap, goal] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
    getOneGoal(params.goalId)
  ]);

  // TODO: Fetch national/parent goal
  let nationalGoal: Goal & { dataSeries: DataSeries | null } | null = null;

  let accessLevel: AccessLevel = AccessLevel.None;
  if (goal) {
    const goalAccessData: AccessControlled = {
      author: goal.author,
      editors: goal.roadmap.editors,
      viewers: goal.roadmap.viewers,
      editGroups: goal.roadmap.editGroups,
      viewGroups: goal.roadmap.viewGroups,
    }
    accessLevel = accessChecker(goalAccessData, session.user);
  }

  // 404 if the goal doesn't exist or if the user doesn't have access to it
  if (!goal || !accessLevel || !roadmap) {
    return notFound();
  }

  return (
    <>
      <h1 style={{ marginBottom: ".25em" }} className="display-flex align-items-center gap-25 flex-wrap-wrap">
        { // Only show the edit link if the user has edit access to the roadmap
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
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
      {goal.dataSeries?.scale &&
        <>
          <h2>Alla värden i tabellerna använder följande skala: {`"${goal.dataSeries?.scale}"`}</h2>
        </>
      }
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