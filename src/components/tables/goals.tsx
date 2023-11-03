import './tables.css'
import { Action, DataSeries, Goal, Roadmap } from "@prisma/client"
import { NewGoalButton } from '../redirectButtons'
import { AccessLevel } from '@/types'
import GoalTable from "./goalTables/goalTable"
import TableSelector from './tableSelector/tableSelector'

export default function Goals({
  title,
  roadmap,
  accessLevel,
}: {
  title: String,
  roadmap: Roadmap & {
    goals: (Goal & {
      actions: Action[],
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
  return (
    <>
      <label htmlFor="goalTable" className="flex-row flex-between align-center flex-wrap">
        <h2>{title}</h2>
        <nav className='flex-row align-center gap-100'>
          <TableSelector />
          { // Only show the button if the user has edit access to the roadmap
            (accessLevel === 'EDIT' || accessLevel === 'ADMIN') &&
            <NewGoalButton roadmapId={roadmap.id} />
          }
        </nav>
      </label>
      <GoalTable roadmap={roadmap}></GoalTable>
    </>
  )
}