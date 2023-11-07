"use client"

import './tables.css'
import { Action, Goal } from "@prisma/client"
import { NewActionButton } from '../redirectButtons'
import { AccessLevel } from '@/types'
import TableSelector from './tableSelector/tableSelector'
import ActionTable from './actionTables/actionTable'
import { useGlobalContext } from '@/app/context/store'
import MinifiedActionTable from './actionTables/minifiedActionTable'

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
  const { tableType } = useGlobalContext();
  return <>
    <label htmlFor="action-table" className="flex-row flex-between align-center flex-wrap">
      <h2>{title}</h2>
      <nav className='flex-row align-center gap-100'>
        <TableSelector />
        { // Only show the button if the user has edit access to the goal
          (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
          <NewActionButton roadmapId={params.roadmapId} goalId={params.goalId} />
        }
      </nav>
    </label>
    {tableType == 'table' ? (
      <ActionTable goal={goal} accessLevel={accessLevel} />
    ): null }
    {tableType == 'listTree' ? (
        <p>List</p>
      ): null }
    {tableType == 'minTable' ? (
        <MinifiedActionTable goal={goal} accessLevel={accessLevel} />
      ): null }
  </>

}