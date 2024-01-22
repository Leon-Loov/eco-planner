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
  goal: Goal & {
    actions: (Action)[]
  },
  accessLevel?: AccessLevel,
  params: { roadmapId: string, goalId: string },
}) {
  return <>
    <div style={{ marginTop: '1.5rem' }}> {/* TODO: Remove this div (replace with layout in parent page) */}
      <ActionTable goal={goal} accessLevel={accessLevel} />
    </div>
  </>

}