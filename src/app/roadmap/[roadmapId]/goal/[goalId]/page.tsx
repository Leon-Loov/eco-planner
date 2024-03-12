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
import styles from './page.module.css'
import getGoalByIndicator from "@/fetchers/getGoalByIndicator";
import getRoadmapByVersion from "@/fetchers/getRoadmapByVersion";
import prisma from "@/prismaClient";
import DataSeriesScaler from "@/components/DataSeriesScaler";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap, goal] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId),
    getOneGoal(params.goalId)
  ]);

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

  // Fetch parent goal
  let parentGoal: Goal & { dataSeries: DataSeries | null } | null = null;
  if (roadmap?.metaRoadmap.parentRoadmapId) {
    try {
      // Get the parent roadmap (if any)
      let parentRoadmap = await getRoadmapByVersion(roadmap.metaRoadmap.parentRoadmapId,
        roadmap.targetVersion ||
        (await prisma.roadmap.aggregate({ where: { metaRoadmapId: roadmap.metaRoadmap.parentRoadmapId }, _max: { version: true } }))._max.version ||
        0);

      // If there is a parent roadmap, look for a goal with the same indicator parameter in it
      if (parentRoadmap) {
        parentGoal = await getGoalByIndicator(parentRoadmap.id, goal.indicatorParameter, goal.dataSeries?.unit);
      }
    } catch (error) {
      parentGoal = null;
      console.log(error);
    }
  }

  return (
    <>
      <h1 className="display-flex align-items-center gap-25 flex-wrap-wrap">
        { // Only show the edit link if the user has edit access to the roadmap
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
          <Link href={`/roadmap/${roadmap.id}/goal/${goal.id}/editGoal`}>
            <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${goal.name}`} />
          </Link>
        }
        {goal.name ? goal.name : goal.indicatorParameter}
      </h1>
      {goal.name && <>
        <span> {`${goal.indicatorParameter}, `} </span>
      </>}
      <span>Målbana</span>
      {goal.links.length > 0 &&
        <>
          <h2>Länkar</h2>
          {goal.links.map((link) => (
            <Fragment key={link.id}>
              <a href={link.url}>{link.description || link.url}</a>
            </Fragment>
          ))}
        </>
      }
      {goal.dataSeries?.scale &&
        <>
          <h2>Alla värden i tabellerna använder följande skala: {`"${goal.dataSeries?.scale}"`}</h2>
        </>
      }
      { // Only allow scaling the values if the user has edit access to the goal
        (accessLevel === AccessLevel.Admin || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Edit) && goal.dataSeries?.id &&
        <DataSeriesScaler dataSeriesId={goal.dataSeries.id} />
      }
      <section className={styles.graphLayout}>
        <GraphGraph goal={goal} nationalGoal={parentGoal} />
        <CombinedGraph roadmap={roadmap} goal={goal} />
      </section>
        <ActionGraph actions={goal.actions} />
      <Actions goal={goal} accessLevel={accessLevel} />
      <Comments comments={goal.comments} objectId={goal.id} />
    </>
  )
}