import getUserGroups from "@/functions/getUserGroups";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import CreateGoal from "./goalForm";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  let session = await getSessionData(cookies())
  let userGroups: string[] = [...(await getUserGroups(session.user?.id!)), 'Public']

  return (
    <>
      <h1>Skapa målbana</h1>
      <CreateGoal roadmapId={params.roadmapId} userGroups={userGroups} />
    </>
  )
}