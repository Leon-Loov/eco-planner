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
      {/* 
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
    */}

    <section className="margin-y-100">
      <span style={{color: 'gray'}}>Målbana</span>
      <h2 style={{fontSize: '2.5rem', margin: '0'}}>{goal.name}</h2>
      <p style={{width: 'min(120ch, 100%)'}}>{goal.description}</p>
    </section>


      <section className={styles.graphLayout}>
        <GraphGraph goal={goal} nationalGoal={parentGoal} />
        <CombinedGraph roadmap={roadmap} goal={goal} />
      </section>
      <section>
        <h2 className="flex align-items-center justify-content-space-between">
          Åtgärder
          <Link href='/' className="button color-purewhite pureblack round">Skapa ny åtgärd</Link>
        </h2>
        <ActionGraph actions={goal.actions} />

        <section>
          <section className="margin-y-100 padding-y-50" style={{ borderBottom: '2px solid var(--gray-90)' }}>
            <label className="font-weight-bold margin-y-25 container-text">
              Sök åtgärd
              <div className="margin-y-50 flex align-items-center gray-90 padding-50 smooth focusable">
                <Image src='/icons/search.svg' alt="" width={24} height={24} />
                <input type="search" className="padding-0 margin-x-50" />
              </div>
            </label>
            <div className="flex gap-100 align-items-center justify-content-space-between">
              <label className="margin-y-100 font-weight-bold">
                Sortera på:
                <select className="font-weight-bold margin-y-50 block">
                  <option>Namn (A-Ö)</option>
                  <option>Namn (Ö-A)</option>
                </select>
              </label>
              <label className='flex align-items-center gap-50 padding-50 font-weight-bold button smooth transparent'>
                <span style={{ lineHeight: '1' }}>Filtrera</span>
                <div className='position-relative grid place-items-center'>
                  <input type="checkbox" className="position-absolute width-100 height-100 hidden" />
                  <Image src="/icons/filter.svg" alt="" width="24" height="24" />
                </div>
              </label>
            </div>
          </section>
          <section id="roadmapFilters" className="margin-y-200 padding-100 gray-90 rounded">
            <b>Enhet</b>
            <label className="flex align-items-center gap-25 margin-y-50">
              <input type="checkbox" />
              Enhet 1
            </label>
            <label className="flex align-items-center gap-25 margin-y-50">
              <input type="checkbox" />
              Enhet 2
            </label>
          </section>
        </section>

        <Actions goal={goal} accessLevel={accessLevel} />
      </section>
      <Comments comments={goal.comments} objectId={goal.id} />
    </>
  )
}