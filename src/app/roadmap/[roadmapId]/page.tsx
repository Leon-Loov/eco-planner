import { notFound } from "next/navigation";
import Tooltip from "@/lib/tooltipWrapper";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { NewGoalButton } from "@/components/redirectButtons";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import accessChecker from "@/lib/accessChecker";
import GoalTable from '@/components/tables/goalTable'

export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);
  
  let accessLevel;
  if(roadmap) {
    accessLevel = accessChecker(roadmap, session.user)
  }
  
  // 404 if the roadmap doesn't exist or if the user doesn't have access to it
  if (!roadmap || !accessLevel) {
    return notFound();
  }

  return <>
    <h1>Färdplan &quot;{roadmap.name}&quot;{roadmap.isNational ? ", en nationell färdplan" : null}</h1>
    <GoalTable title="Målbanor" roadmap={roadmap} accessLevel={accessLevel} />
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