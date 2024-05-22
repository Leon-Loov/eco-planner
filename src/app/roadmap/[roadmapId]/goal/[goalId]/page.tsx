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
import styles from './page.module.css'
import getGoalByIndicator from "@/fetchers/getGoalByIndicator";
import getRoadmapByVersion from "@/fetchers/getRoadmapByVersion";
import prisma from "@/prismaClient";
import CopyAndScale from "@/components/modals/copyAndScale";
import { getTableContent } from "@/lib/pxWeb/getTableContent";
import filterTableContentKeys from "@/lib/pxWeb/filterTableContentKeys";
import { PxWebApiV2TableContent } from "@/lib/pxWeb/pxWebApiV2Types";
import QueryBuilder from "@/components/forms/pxWeb/queryBuilder";

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

  let externalData: PxWebApiV2TableContent | null = null;
  if (goal.externalDataset && goal.externalTableId && goal.externalSelection) {
    externalData = await getTableContent(goal.externalTableId, JSON.parse(goal.externalSelection), goal.externalDataset).then(data => filterTableContentKeys(data));
  }

  // Fetch parent goal
  let parentGoal: Goal & { dataSeries: DataSeries | null } | null = null;
  if (roadmap?.metaRoadmap.parentRoadmapId) {
    try {
      // Get the parent roadmap (if any)
      const parentRoadmap = await getRoadmapByVersion(roadmap.metaRoadmap.parentRoadmapId,
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
      */}

      <section className="display-flex justify-content-space-between flex-wrap-wrap margin-y-100">
        <section>
          <span style={{ color: 'gray' }}>Målbana</span>
          <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{goal.name}</h2>
          <p>{goal.description}</p>
        </section>
        <aside>
          { // Only show the edit link if the user has edit access to the roadmap
            (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
            <Link href={`/roadmap/${roadmap.id}/goal/${goal.id}/editGoal`} className="display-flex align-items-center gap-50 justify-content-flex-end color-pureblack" style={{ textDecoration: 'none', fontWeight: '500' }} >
              Redigera Målbana
              <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${goal.name}`} />
            </Link>
          } <br />
          { // TODO: Maybe show button even if no data series is attached?
            goal.dataSeries?.id &&
            <CopyAndScale goal={goal} user={session.user} />
          }
          {
            (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
            <QueryBuilder goal={goal} user={session.user} />
          }
        </aside>
      </section>



      { /* Only allow scaling the values if the user has edit access to the goal
        (accessLevel === AccessLevel.Admin || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Edit) && goal.dataSeries?.id &&
        <DataSeriesScaler dataSeriesId={goal.dataSeries.id} />
      */ }

      <section className={styles.graphLayout}>
        <GraphGraph goal={goal} nationalGoal={parentGoal} historicalData={externalData} />
        <CombinedGraph roadmap={roadmap} goal={goal} />
      </section>

      <section>

        <div className="flex align-items-center justify-content-space-between">
          <h2>Åtgärder</h2>
          <Link href={`/roadmap/${roadmap.id}/goal/${goal.id}/action/createAction`} className="button color-purewhite pureblack round font-weight-bold">Skapa ny åtgärd</Link>
        </div>
        <div className="margin-y-100">
          <ActionGraph actions={goal.actions} />
        </div>
        {/*
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
        */}

        <Actions goal={goal} accessLevel={accessLevel} />
      </section>
      <Comments comments={goal.comments} objectId={goal.id} />
    </>
  )
}