import { Data } from '@/lib/session';
import styles from './tables.module.css' with { type: "css" };
import { MetaRoadmap, Roadmap } from "@prisma/client";
import Image from 'next/image';
import Link from 'next/link';
import { RoadmapActionButton } from './tableActions/roadmapActions';

export default function RoadmapTable({
  title,
  roadmaps,
  user,
  metaRoadmapId,
}: {
  title: String,
  roadmaps: ({ id: string, version: number, _count: { goals: number }, metaRoadmap: MetaRoadmap })[],
  user: Data['user'],
  metaRoadmapId?: string,
}) {
  let creationLink = '/metaRoadmap/createMetaRoadmap';
  if (metaRoadmapId) {
    creationLink = `/roadmap/createRoadmap?metaRoadmapId=${metaRoadmapId}`
  }

  return <>
    <div className={`${styles.tableHeader} display-flex align-items-center justify-content-space-between`}>
      <h2>{title}</h2>
      <div>
        { // Only show the new roadmap button if the user is logged in
          user &&
          <>
            <Link className={`${styles.newRoadmap} display-flex gap-50`} href={creationLink}>
              Skapa Färdplan
              <Image src="/icons/addToTable.svg" width={24} height={24} alt="Add new roadmap"></Image>
            </Link>
          </>
        }
      </div>
    </div>
    {roadmaps.length ?
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Namn</th>
              <th style={{ textAlign: 'center' }}>Antal målbanor</th>
              <th style={{ textAlign: 'center' }}>Redigera</th>
            </tr>
          </thead>
          <tbody>
            {roadmaps.map(roadmap => (
              <tr key={roadmap.id}>
                <td><a href={`/roadmap/${roadmap.id}`}>{`${roadmap.metaRoadmap.name}, version ${roadmap.version}`}</a></td>
                <td style={{ textAlign: 'center' }}>{roadmap._count.goals}</td>
                <td>
                  <RoadmapActionButton
                    addGoalHref={`/roadmap/${roadmap.id}/goal/createGoal`}
                    editHref={`/roadmap/${roadmap.id}/editRoadmap`}
                    id={roadmap.id}
                    tableName={roadmap.metaRoadmap.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      : <p>Inga färdplaner hittades. Detta kan bero på ett problem med databasen</p>}
  </>
}