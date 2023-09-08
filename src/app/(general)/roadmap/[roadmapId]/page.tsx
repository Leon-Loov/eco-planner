import { notFound } from "next/navigation"
import Tooltip from "@/lib/tooltipWrapper";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { NewGoalButton } from "@/components/redirectButtons";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  let roadmap = await getOneRoadmap(params.roadmapId);

  // 404 if the roadmap doesn't exist or if the user doesn't have access to it
  if (!roadmap) {
    return notFound();
  }

  return <>
    <h1>{roadmap.name}</h1>
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
        {roadmap.goals.map(goal => (
          <tr key={goal.id}>
            <td><a href={`/roadmap/${roadmap?.id}/goal/${goal.id}`}>{goal.name}</a></td>
            <td>{goal.goalObject}</td>
            <td>{goal.indicatorParameter}</td>
            <td>{goal.dataSeries?.unit}</td>
            <td>{goal.actions.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <br />
    <NewGoalButton roadmapId={roadmap.id} />
    <br />
    <Tooltip anchorSelect="#goal-object">
      Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation.
    </Tooltip>
    <Tooltip anchorSelect="#leap-parameter">
      LEAP parametern beskriver vad som mäts, exempelvis energianvändning eller utsläpp av växthusgaser.
    </Tooltip>
  </>
}