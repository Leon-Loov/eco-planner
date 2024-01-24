"use client";

// TODO: Move to actions.tsx
import styles from '../tables.module.css' with { type: "css" };
import { Action, Goal } from "@prisma/client"
import { AccessLevel } from '@/types'
import Image from "next/image";
import Link from 'next/link';

interface ActionTableCommonProps {
  accessLevel?: AccessLevel,
}

interface ActionTableWithGoal extends ActionTableCommonProps {
  goal: Goal & {
    actions: (Action)[]
  },
  actions?: never,
}

interface ActionTableWithActions extends ActionTableCommonProps {
  goal?: never,
  actions: (Action & {
    goal: { id: string, roadmap: { id: string } }
  })[],
}

type ActionTableProps = ActionTableWithGoal | ActionTableWithActions;

/**
 * Displays a table of actions. Requires either a goal XOR a list of actions.
 * @param goal The goal containing the actions to display
 * @param actions A list of actions to display
 * @param accessLevel The access level of the user
 * @returns 
 */
export default function ActionTable({
  goal,
  actions,
  accessLevel,
}: ActionTableProps) {
  // Failsafe in case wrong props are passed
  if ((!actions && !goal) || (actions && goal)) throw new Error('ActionTable: Either `goal` XOR `actions` must be provided');

  // If a goal is provided, extract the actions from it
  if (!actions) {
    actions = goal.actions.map((action) => {
      let fakeGoal = { id: goal.id, roadmap: { id: goal.roadmapId } };
      return { ...action, goal: fakeGoal };
    });
  }

  // If no actions are found, return a message
  if (!actions.length) return (<p>Det har inte tillgång till några åtgärder i denna målbana, eller så har målbanan inga åtgärder.</p>);

  return <>
    <div className={`${styles.tableHeader} display-flex align-items-center justify-content-space-between`}>
      <h2>Åtgärder</h2>
      <nav className='display-flex align-items-center gap-100'>
        { // Only show the button if the user has edit access to the goal and a goal is provided
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) && goal &&
          <Link className={`${styles.newRoadmap} display-flex gap-50`} href={`/roadmap/${goal.roadmapId}/goal/${goal.id}/action/createAction`}>
            Skapa ny åtgärd
            <Image src="/icons/addToTable.svg" width={24} height={24} alt="Add new action"></Image>
          </Link>
        }
      </nav>
    </div>
    <div className={styles.tableWrapper}>
      <table id='action-table' className={styles.table}>
        <thead>
          <tr>
            <th>Namn</th>
            <th>Beskrivning</th>
            <th>Kostnadseffektivitet</th>
            <th>Förväntat utfall</th>
            <th>Relevanta aktörer</th>
            { // Only show project manager if the user has edit access to the goal
              (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
              <th>Projektansvarig</th>
            }
          </tr>
        </thead>
        <tbody>
          {actions.map(action => (
            <tr key={action.id}>
              <td className='display-flex gap-50 align-items-center'>
                { // Only show the edit link if the user has edit access to the goal
                  // Should technically be if the user has edit access to the action, but that could build up a lot of checks
                  (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
                  <Link href={`/roadmap/${action.goal.roadmap.id}/goal/${action.goal.id}/action/${action.id}/editAction`}>
                    <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit action: ${action.name}`} />
                  </Link>
                }
                <a href={`/roadmap/${action.goal.roadmap.id}/goal/${action.goal.id}/action/${action.id}`}>{action.name}</a>
              </td>
              <td>{action.description}</td>
              <td>{action.costEfficiency}</td>
              <td>{action.expectedOutcome}</td>
              <td>{action.relevantActors}</td>
              { // Only show project manager if the user has edit access to the goal
                (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
                <td>{action.projectManager}</td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>

}