import styles from '../tables.module.css' with { type: "css" };
import { DataSeries, Goal } from "@prisma/client";

interface GoalTableCommonProps { }

interface GoalTableWithGoals extends GoalTableCommonProps {
  goals: (Goal & {
    _count: { actions: number }
    dataSeries: DataSeries | null,
    roadmap: { id: string, metaRoadmap: { name: string, id: string } },
  })[],
  roadmap?: never,
}

interface GoalTableWithRoadmap extends GoalTableCommonProps {
  goals?: never,
  roadmap: {
    id: string,
    metaRoadmap: { name: string, id: string },
    goals: (Goal & {
      _count: { actions: number },
      dataSeries: DataSeries | null,
    })[]
  },
}

type GoalTableProps = GoalTableWithGoals | GoalTableWithRoadmap;

export default function GoalTable({
  goals,
  roadmap,
}: GoalTableProps) {
  // Failsafe in case wrong props are passed
  if ((!goals && !roadmap) || (goals && roadmap)) throw new Error('GoalTable: Either `goals` XOR `roadmap` must be provided');

  if (!goals) {
    goals = roadmap.goals.map(goal => {
      return {
        ...goal,
        roadmap: (({ goals, ...data }) => data)(roadmap),
      }
    })
  }

  if (!goals.length) return (<p>Du har inte tillgång till några målbanor i denna färdplan, eller så är färdplanen tom.</p>);

  return <>
    <div className="overflow-x-scroll smooth">
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
              <td><a href={`/roadmap/${goal.roadmap.id}/goal/${goal.id}`}>{goal.name || goal.indicatorParameter}</a></td>
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