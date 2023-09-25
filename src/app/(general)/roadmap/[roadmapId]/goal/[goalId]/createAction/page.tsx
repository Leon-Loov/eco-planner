import getUserGroups from "@/functions/getUserGroups"
import { getSessionData } from "@/lib/session"
import { cookies } from "next/headers"
import ActionForm from "./actionForm"
import getOneRoadmap from "@/functions/getOneRoadmap"

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  let session = await getSessionData(cookies())
  let userGroups: string[] = [...(await getUserGroups(session.user?.id!)), 'Public']

  let roadmap = await getOneRoadmap(params.roadmapId)
  let goal = roadmap?.goals.find(goal => goal.id === params.goalId)

  return (
    <>
      <h1>Skapa ny åtgärd {roadmap ? `under målbanan "${goal?.name || "namn saknas"}" i "${roadmap.name}"` : ""}</h1>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} userGroups={userGroups} />
    </>
  )
}