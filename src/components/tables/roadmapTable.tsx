import styles from './tables.module.css'
import { Goal, Roadmap } from "@prisma/client"

export default function RoadmapTable({
  title,
  roadmaps,
}: {
  title: String,
  roadmaps: (Roadmap & { _count: { goals: number } })[],
}) {
  return <>
    <h2>{title}</h2>
    <div className="overflow-x-scroll">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Namn</th>
            <th>Antal mål</th>
          </tr>
        </thead>
        <tbody>
          {roadmaps.map(roadmap => (
            <tr key={roadmap.id}>
              <td><a href={`/roadmap/${roadmap.id}`}>{roadmap.name}</a></td>
              <td>{roadmap._count.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
}