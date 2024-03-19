"use client";

// TODO: Move to actions.tsx
import styles from './tables.module.css' with { type: "css" };
import { Action, Goal } from "@prisma/client"
import { AccessLevel } from '@/types'
import Link from 'next/link';
import { TableMenu } from './tableMenu/tableMenu';

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
      const fakeGoal = { id: goal.id, roadmap: { id: goal.roadmapId } };
      return { ...action, goal: fakeGoal };
    });
  }

  // If no actions are found, return a message
  if (!actions.length) return (
    <>
      <p>Målbanan har inga åtgärder.
        { // Only show the button if the user has edit access to the goal and a goal is provided
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) && goal &&
          <span> Vill du skapa en?&nbsp;
            <Link href={`/roadmap/${goal.roadmapId}/goal/${goal.id}/action/createAction`}>
              Skapa ny åtgärd
            </Link>
          </span>
        }
      </p>
    </>
  );

  return <>
    {/* 
      Only show project manager if the user has edit access to the goal
      (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
      <th>Projektansvarig</th>
    */}
    {actions.map(action => (
      <div className='flex gap-100 justify-content-space-between align-items-center' key={action.id}>
        <a href={`/roadmap/${action.goal.roadmap.id}/goal/${action.goal.id}/action/${action.id}`} className={`${styles.roadmapLink} flex-grow-100`}>
          <span className={styles.linkTitle}>{action.name}</span>
          <p className={styles.actionLinkInfo}>{action.description}</p>
        </a>
        <TableMenu
          accessLevel={accessLevel}
          object={action}
        />
        {/*
          <span>{action.costEfficiency}</span>
          <span>{action.expectedOutcome}</span>
          <span>{action.relevantActors}</span>
        */}
      </div>
    ))}
  </>

}