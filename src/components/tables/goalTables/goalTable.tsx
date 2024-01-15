import { AccessControlled } from '@/types';
import styles from '../tables.module.css' with { type: "css" };
import { DataSeries, Goal, Roadmap } from "@prisma/client"

export default function GoalTable({
  goals,
  roadmapId,
}: {
  goals: ((Goal & {
    _count: { actions: number }
    dataSeries: DataSeries | null,
    roadmap?: { id: string, metaRoadmap: { name: string, id: string } },
  }) | null)[],
  roadmapId?: string,
}) {
  if (!goals.length) return (<p>Du har inte tillgång till några målbanor i denna färdplan, eller så är färdplanen tom.</p>);

  if (!roadmapId && goals.find(goal => goal && !goal.roadmap)) { throw new Error('GoalTable: roadmapId must be provided if any goal does not pass a `.roadmap` property') }

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
          {goals.map(goal => (goal &&
            <tr key={goal.id}>
              <td><a href={`/roadmap/${roadmapId || goal.roadmap?.id}/goal/${goal.id}`}>{goal.name || goal.indicatorParameter}</a></td>
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