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
    <ActionTable goal={goal} accessLevel={accessLevel} />
  </>
}