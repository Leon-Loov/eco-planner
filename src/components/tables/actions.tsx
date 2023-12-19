"use client"

import { Action, Goal } from "@prisma/client"
import { AccessControlled, AccessLevel } from '@/types'
import ActionTable from './actionTables/actionTable'
import { PrimaryLink } from "../generic/links/links"

export default function Actions({
  title,
  goal,
  accessLevel,
  params,
}: {
  title: String,
  goal: Goal & AccessControlled & {
    actions: (Action & AccessControlled)[]
  },
  accessLevel?: AccessLevel,
  params: { roadmapId: string, goalId: string },
}) {
  return <>
    <label htmlFor="action-table" className="display-flex justify-content-space-between align-items-center flex-wrap-wrap">
      <h2>{title}</h2>
      <nav className='display-flex align-items-center gap-100'>
        { // Only show the button if the user has edit access to the goal
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
          <PrimaryLink href={`./roadmap/${params.roadmapId}/goal/${params.goalId}/action/createAction`}>Skapa ny åtgärd</PrimaryLink>
        }
      </nav>
    </label>
    <ActionTable goal={goal} accessLevel={accessLevel} roadmapId={params.roadmapId} />
  </>

}