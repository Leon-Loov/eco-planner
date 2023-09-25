import getUserGroups from "@/functions/getUserGroups";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import CreateGoal from "./goalForm";
import getOneRoadmap from "@/functions/getOneRoadmap";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  let session = await getSessionData(cookies())
  let userGroups: string[] = [...(await getUserGroups(session.user?.id!)), 'Public']
  let roadmap = await getOneRoadmap(params.roadmapId)

  return (
    <>
      <h1>Skapa ny målbana {roadmap?.name ? `under "${roadmap.name}"` : ""}</h1>
      <CreateGoal roadmapId={params.roadmapId} userGroups={userGroups} />
    </>
  )
}