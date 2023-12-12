"use client"

import { DataSeries, Goal, Roadmap } from "@prisma/client"
import { PrimaryLink } from "../generic/links/links"
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
            (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
            <PrimaryLink href={`./roadmap/${roadmap.id}/goal/createGoal`}>Skapa ny målbana</PrimaryLink>
          }
        </nav>
      </label>
      {tableType == 'table' ? (
        <GoalTable goals={roadmap.goals} />
      ) : null}
      {tableType == 'listTree' ? (
        <LinkTree roadmap={roadmap} />
      ) : null}
    </>
  )
}