import { notFound } from "next/navigation";
import Tooltip from "@/lib/tooltipWrapper";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { NewGoalButton } from "@/components/redirectButtons";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import accessChecker from "@/lib/accessChecker";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  // 404 if the roadmap doesn't exist or if the user doesn't have access to it
  if (!roadmap || !accessChecker(roadmap, session.user)) {
    return notFound();
  }

  return <>
    <h1>Färdplan &quot;{roadmap.name}&quot;{roadmap.isNational ? ", en nationell färdplan" : null}</h1>
    <label htmlFor="goalTable"><h2>Målbanor</h2></label>
    <table id="goalTable">
      <thead>
        <tr>
          <th id="goalName">Målbanenamn</th>
          {/* TODO: Add indicators to headers with tooltips */}
          <th id="goalObject">Målobjekt</th>
          <th id="leapParameter">LEAP parameter</th>
          <th id="dataUnit">Enhet för dataserie</th>
          <th id="goalActions">Antal åtgärder</th>
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
    { // Only show the button if the user has edit access to the roadmap
      (accessChecker(roadmap, session.user) === 'EDIT' || accessChecker(roadmap, session.user) === 'ADMIN') &&
      <NewGoalButton roadmapId={roadmap.id} />
    }
    <br />
    <Tooltip anchorSelect="#goalName">
      Beskrivning av vad målbanan beskriver, tex. antal bilar.
    </Tooltip>
    <Tooltip anchorSelect="#goalObject">
      Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation.
    </Tooltip>
    <Tooltip anchorSelect="#leapParameter">
      LEAP parametern beskriver vad som mäts, exempelvis energianvändning eller utsläpp av växthusgaser.
    </Tooltip>
    <Tooltip anchorSelect="#dataUnit">
      Beskriver vilken enhet värdena i dataserien är i.
    </Tooltip>
    <Tooltip anchorSelect="#goalActions">
      Antal åtgärder som finns definierade och kopplade till målbanan.
    </Tooltip>
  </>
}