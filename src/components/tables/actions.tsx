"use client"

import { Action, Goal } from "@prisma/client"
import { AccessLevel } from '@/types'
import ActionTable from './actionTables/actionTable'
import { PrimaryLink } from "../generic/links/links"

export default function Actions({
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
    <label htmlFor="action-table" className="display-flex justify-content-space-between align-items-center flex-wrap-wrap">
      <h2>{title}</h2>
      <nav className='display-flex align-items-center gap-100'>
        { // Only show the button if the user has edit access to the goal
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
          <PrimaryLink href={`./roadmap/${params.roadmapId}/goal/${params.goalId}/action/createAction`}>Skapa ny åtgärd</PrimaryLink>
        }
      </nav>
    </label>
    <ActionTable goal={goal} accessLevel={accessLevel} params={params} />
  </>

}