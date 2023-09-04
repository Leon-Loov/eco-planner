import getRoadmaps from "@/functions/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from 'next/headers'
import { notFound } from "next/navigation"
import getRoadmapGoals from "@/functions/getRoadmapGoals";
import Tooltip from "@/lib/tooltipWrapper";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  let session = await getSessionData(cookies());

  // TODO: Make a  function to get the specific roadmap from the start instead of getting all roadmaps
  // and then filtering them
  let roadmaps = await getRoadmaps();

  let currentRoadmap = roadmaps.find(roadmap => roadmap.id === params.roadmapId)

  // 404 if the roadmap doesn't exist
  if (!currentRoadmap) {
    return notFound()
  }

  // 404 if the user doesn't have access to the roadmap
  let hasAccess = (
    session.user?.isAdmin ||
    currentRoadmap.author.id === session.user?.id ||
    currentRoadmap.editors.some(user => user.id === session.user?.id) ||
    currentRoadmap.viewers.some(user => user.id === session.user?.id) ||
    currentRoadmap.editGroups.some(group => group.users.some(user => user.id === session.user?.id)) ||
    currentRoadmap.viewGroups.some(group => group.users.some(user => user.id === session.user?.id)) ||
    currentRoadmap.viewGroups.some(group => group.name === "Public")
  )
  if (!hasAccess) {
    return notFound()
  }

  let goals = await getRoadmapGoals(currentRoadmap.id)

  return <>
    <h1>{currentRoadmap.name}</h1>
    <label htmlFor="goal-table"><h2>Målbanor</h2></label>
    <table id="goal-table">
      <thead>
        <tr>
          <th>Namn</th>
          {/* TODO: Add indicators to headers with tooltips */}
          <th id="goal-object">Målobjekt</th>
          <th id="leap-parameter">LEAP parameter</th>
          <th>Enhet för dataserie</th>
          <th>Antal åtgärder</th>
        </tr>
      </thead>
      <tbody>
        {goals.map(goal => (
          <tr key={goal.id}>
            <td><a href={`/roadmap/${currentRoadmap?.id}/goal/${goal.id}`}>{goal.name}</a></td>
            <td>{goal.goalObject}</td>
            <td>{goal.indicatorParameter}</td>
            <td>{goal.dataSeries?.unit}</td>
            <td>{goal.actions.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <Tooltip anchorSelect="#goal-object">
      Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation.
    </Tooltip>
    <Tooltip anchorSelect="#leap-parameter">
      LEAP parametern beskriver vad som mäts, exempelvis energianvändning eller utsläpp av växthusgaser.
    </Tooltip>
  </>
}