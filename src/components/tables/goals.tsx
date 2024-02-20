"use client"

import { DataSeries, Goal, Roadmap } from "@prisma/client"
import { PrimaryLink } from "../generic/links/links"
import { AccessLevel } from '@/types'
import GoalTable from "./goalTables/goalTable"
import TableSelector from './tableSelector/tableSelector'
import { useGlobalContext } from '@/app/context/store'
import LinkTree from './goalTables/linkTree'
import { getLocalStorage, setLocalStorage } from "@/functions/localStorage"
import { useEffect, useState } from "react"

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
    })[],
    metaRoadmap: { name: string, id: string },
    author: { id: string, username: string },
  },
  accessLevel?: AccessLevel
}) {
  const { tableType } = useGlobalContext();
  const [viewMode, setViewMode] = useState("")

  useEffect(() => {
    setViewMode(getLocalStorage(roadmap.id + "_viewMode"))
  }, [roadmap.id]);

  return (
    <>
      <label htmlFor="goalTable" className="display-flex justify-content-space-between align-items-center flex-wrap-wrap">
        <h2>{title}</h2>
        <nav className='display-flex align-items-center gap-100'>
          <TableSelector id={roadmap.id} setter={setViewMode} />
          { // Only show the button if the user has edit access to the roadmap
            (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
            <PrimaryLink href={`/roadmap/${roadmap.id}/goal/createGoal`}>Skapa ny målbana</PrimaryLink>
          }
        </nav>
      </label>
      {viewMode == 'table' ? (
        <GoalTable roadmap={roadmap} />
      ) : null}
      {viewMode == 'listTree' ? (
        <LinkTree roadmap={roadmap} />
      ) : null}
    </>
  )
}