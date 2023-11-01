import './tables.css'
import { Action, DataSeries, Goal, Roadmap } from "@prisma/client"
import { NewGoalButton } from '../redirectButtons'
import { AccessLevel } from '@/types'
import RadioImage from '../images/radioImage'

export default function GoalTable({
  title,
  roadmap,
  accessLevel,
}: {
  title: String,
  roadmap: Roadmap & {
    goals: (Goal & {
      actions: Action[],
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
  accessLevel?: AccessLevel
}) {
  return <>
    <label htmlFor="goalTable" className="flex-row flex-between align-center flex-wrap">
      <h2>{title}</h2>
      <nav className='flex-row align-center gap-100'>
        <RadioImage value='listTree' src='/icons/listTree.svg' name='table' />
        <RadioImage value='table' src='/icons/table.svg' name='table' />
        <RadioImage value='columns' src='/icons/columns.svg' name='table' />
        { // Only show the button if the user has edit access to the roadmap
          (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
          <NewGoalButton roadmapId={roadmap.id} />
        }
      </nav>
    </label>
    <div className="overflow-x-scroll">
      <table id="goalTable">
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
              <td>{goal.actions.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
}