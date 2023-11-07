import '../tables.css'
import { Action, Goal } from "@prisma/client"
import { AccessLevel } from '@/types'

export default function ActionTable({
  goal,
  accessLevel,
}: {
  goal: Goal & {
    actions: Action[],
    author: { id: string, username: string },
    editors: { id: string, username: string }[],
    viewers: { id: string, username: string }[],
    editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  },
  accessLevel?: AccessLevel,
}) {
  return <>
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