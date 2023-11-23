"use client"

import './tables.css'
import { DataSeries, Goal, Roadmap } from "@prisma/client"
import { NewGoalButton } from '../buttons/redirectButtons'
import { AccessLevel } from '@/types'
import GoalTable from "./goalTables/goalTable"
import TableSelector from './tableSelector/tableSelector'
import { useGlobalContext } from '@/app/context/store'
import LinkTree from './goalTables/linkTree'

export default function Goals({
  title,
  roadmap,
  accessLevel,
}: {
  title: String,
  roadmap: Roadmap & {
    goals: (Goal & {
      _count: { actions: number }
      dataSeries: DataSeries | null,
      author: { id: string, username: string },
      editors: { id: string, username: string }[],
      viewers: { id: string, username: string }[],
      editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    })[],
    author: { id: string, username: string },
    editors: { id: string, username: string }[],
    viewers: { id: string, username: string }[],
    editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  },
  accessLevel?: AccessLevel
}) {
  const { tableType } = useGlobalContext();
  return (
    <>
      <label htmlFor="goalTable" className="display-flex justify-content-space-between align-items-center flex-wrap-wrap">
        <h2>{title}</h2>
        <nav className='display-flex align-items-center gap-100'>
          <TableSelector />
          { // Only show the button if the user has edit access to the roadmap
            (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
            <NewGoalButton roadmapId={roadmap.id} />
          }
        </nav>
      </label>
      {tableType == 'table' ? (
        <GoalTable roadmap={roadmap} />
      ) : null}
      {tableType == 'listTree' ? (
        <LinkTree roadmap={roadmap} />
      ) : null}
    </>
  )
}