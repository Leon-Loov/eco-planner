import getUserGroups from "@/functions/getUserGroups"
import { getSessionData } from "@/lib/session"
import { cookies } from "next/headers"
import ActionForm from "./actionForm"

export default async function Page({ params }: { params: { roadmapId: string, goalId: string }}) {
  let session = await getSessionData(cookies())
  let userGroups: string[] = [...(await getUserGroups(session.user?.id!)), 'Public']

  return (
    <>
      <h1>Skapa åtgärd</h1>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} userGroups={userGroups} />
    </>
  )
}