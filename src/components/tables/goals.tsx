"use client"

import { DataSeries, Goal, Roadmap } from "@prisma/client"
import { PrimaryLink } from "../generic/links/links"
import { AccessLevel } from '@/types'
import GoalTable from "./goalTables/goalTable"
import TableSelector from './tableSelector/tableSelector'
import LinkTree from './goalTables/linkTree'
import { useEffect, useState } from "react"
import { getStoredViewMode } from "./tableFunctions"
import Link from "next/link"

/** Enum for the different view modes for the goal table. */
export enum ViewMode {
  Table = "TABLE",
  Tree = "TREE",
};

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
  const [viewMode, setViewMode] = useState<ViewMode | "">("")

  useEffect(() => {
    setViewMode(getStoredViewMode(roadmap.id))
  }, [roadmap.id]);

  return (
    <>
      <label htmlFor="goalTable" className="display-flex justify-content-space-between align-items-center flex-wrap-wrap">
        <h2>{title}</h2>
        <nav className='display-flex align-items-center gap-100'>
          <TableSelector id={roadmap.id} current={viewMode} setter={setViewMode} />
          { // Only show the button if the user has edit access to the roadmap
            (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
            <Link className="button round color-purewhite pureblack" style={{fontWeight: '500'}} href={`/roadmap/${roadmap.id}/goal/createGoal`}>Skapa ny målbana</Link>
          }
        </nav>
      </label>
      {viewMode == ViewMode.Table && (
        <GoalTable roadmap={roadmap} />
      )}
      {viewMode == ViewMode.Tree && (
        <LinkTree roadmap={roadmap} />
      )}
      {(viewMode != ViewMode.Table && viewMode != ViewMode.Tree) && (
        <p>
          Laddar vyn... Om vyn inte laddar efter någon sekund, testa att byta vy med knapparna uppe till höger.
        </p>
      )}
    </>
  )
}