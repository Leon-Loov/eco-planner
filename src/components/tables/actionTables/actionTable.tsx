import '../tables.css'
import { Action, Goal } from "@prisma/client"
import { AccessLevel } from '@/types'
import Image from "next/image";
import Link from 'next/link';

export default function ActionTable({
  goal,
  accessLevel,
  params,
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
  params: { roadmapId: string, goalId: string }
}) {
  if (!goal.actions.length) return (<p>Det har inte tillgång till några åtgärder i denna målbana, eller så har målbanan inga åtgärder.</p>);

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
              <td className='display-flex gap-50 align-items-center'>
                { // Only show the edit link if the user has edit access to the goal
                  // Should technically be if the user has edit access to the action, but that could build up a lot of checks
                  (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
                  <Link href={`/roadmap/${params.roadmapId}/goal/${params.goalId}/action/${action.id}/editAction`}>
                    <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit action: ${action.name}`} />
                  </Link>
                }
                <a href={`/roadmap/${params.roadmapId}/goal/${params.goalId}/action/${action.id}`}>{action.name}</a>
              </td>
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