"use client"

import { Action, Goal } from "@prisma/client"
import { AccessLevel } from '@/types'
import ActionTable from './actionTables/actionTable'

export default function Actions({
  goal,
  accessLevel,
}: {
  goal: Goal & {
    actions: (Action)[]
  },
  accessLevel?: AccessLevel,
}) {
  return <>
    <div style={{ marginTop: '1.5rem' }}> {/* TODO: Remove this div (replace with layout in parent page) */}
      <ActionTable goal={goal} accessLevel={accessLevel} />
    </div>
  </>
}