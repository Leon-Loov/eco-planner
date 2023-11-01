import './tables.css'
import { Action, Goal } from "@prisma/client"
import { NewActionButton } from '../redirectButtons'
import { AccessLevel } from '@/types'
import RadioImage from '../images/radioImage'

export default function ActionTable({
  title,
  goal,
  accessLevel,
  params,
}: {
  title: String,
  goal: Goal & {
    actions: Action[],
    author: { id: string, username: string },
    editors: { id: string, username: string }[],
    viewers: { id: string, username: string }[],
    editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  },
  accessLevel?: AccessLevel,
  params: { roadmapId: string, goalId: string },
}) {
  return <>
    <label htmlFor="action-table" className="flex-row flex-between align-center flex-wrap">
      <h2>{title}</h2>
      <nav className='flex-row align-center gap-100'>
        <RadioImage value='listTree' src='/icons/listTree.svg' name='table' />
        <RadioImage value='table' src='/icons/table.svg' name='table' />
        <RadioImage value='columns' src='/icons/columns.svg' name='table' />
        { // Only show the button if the user has edit access to the goal
          (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
          <NewActionButton roadmapId={params.roadmapId} goalId={params.goalId} />
        }
      </nav>
    </label>
    <div className="overflow-x-scroll">
      <table id="action-table">
        <thead>
          <tr>
            <th>Namn</th>
            <th>Beskrivning</th>
            <th>Kostnadseffektivitet</th>
            <th>Förväntat utfall</th>
            <th>Relevanta aktörer</th>
            { // Only show project manager if the user has edit access to the goal
              (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
              <th>Projektansvarig</th>
            }
          </tr>
        </thead>
        <tbody>
          {goal.actions.map(action => (
            <tr key={action.id}>
              <td>{action.name}</td>
              <td>{action.description}</td>
              <td>{action.costEfficiency}</td>
              <td>{action.expectedOutcome}</td>
              <td>{action.relevantActors}</td>
              { // Only show project manager if the user has edit access to the goal
                (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
                <td>{action.projectManager}</td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>

}