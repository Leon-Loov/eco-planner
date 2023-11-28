import styles from '../tables.module.css'
import { DataSeries, Goal, Roadmap } from "@prisma/client"

export default function GoalTable({
  roadmap,
}: {
  roadmap: Roadmap & {
    goals: (Goal & {
      _count: { actions: number }
      dataSeries: DataSeries | null,
      author: { id: string, username: string },
      editors: { id: string, username: string }[],
      viewers: { id: string, username: string }[],
      editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    })[],
    author: { id: string, username: string },
    editors: { id: string, username: string }[],
    viewers: { id: string, username: string }[],
    editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  },
}) {
  if (!roadmap.goals.length) return (<p>Du har inte tillgång till några målbanor i denna färdplan, eller så är färdplanen tom.</p>);

  return <>
    <div className="overflow-x-scroll">
      <table id="goalTable" className={styles.table}>
        <thead>
          <tr>
            <th id="goalName">Målbanenamn</th>
            {/* TODO: Add indicators to headers with tooltips */}
            <th id="leapParameter">LEAP parameter</th>
            <th id="dataUnit">Enhet för dataserie</th>
            <th id="goalActions">Antal åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {roadmap.goals.map(goal => (
            <tr key={goal.id}>
              <td><a href={`/roadmap/${roadmap?.id}/goal/${goal.id}`}>{goal.name || goal.indicatorParameter}</a></td>
              <td>{goal.indicatorParameter}</td>
              <td>{goal.dataSeries?.unit}</td>
              <td>{goal._count.actions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
}