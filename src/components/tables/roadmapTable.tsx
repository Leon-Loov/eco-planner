import { Data } from '@/lib/session';
import styles from './tables.module.css' with { type: "css" };
import { Roadmap } from "@prisma/client";
import Image from 'next/image';
import Link from 'next/link';

export default function RoadmapTable({
  title,
  roadmaps,
  user,
}: {
  title: String,
  roadmaps: (Roadmap & { _count: { goals: number } })[],
  user: Data['user']
}) {
  return <>
    <div className="overflow-x-scroll">
      <div className={`${styles.tableHeader} display-flex align-items-center justify-content-space-between`}>
        <h2>{title}</h2>
        <div>
          { // Only show the new roadmap button if the user is logged in
            user &&
            <> 
              <Link className={`${styles.newRoadmap} display-flex gap-50`} href='./roadmap/createRoadmap'>
                Skapa Färdplan
                <Image src="/icons/addToTable.svg" width={24} height={24} alt="Add new roadmap"></Image>
              </Link>
            </>
          }  
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Namn</th>
            <th>Antal målbanor</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {roadmaps.map(roadmap => (
            <tr key={roadmap.id}>
              <td><a href={`/roadmap/${roadmap.id}`}>{roadmap.name}</a></td>
              <td>{roadmap._count.goals}</td>
              <td>
                <button className={`${styles.actionButton} display-flex`}>
                  <Image src='/icons/dotsVertical.svg' alt='Åtgärder' width={24} height={24}></Image>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
}