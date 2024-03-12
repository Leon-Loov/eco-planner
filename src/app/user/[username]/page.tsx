import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  const session = await getSessionData(cookies())

  return <>
    <h1>{session.user?.username}</h1>
    <h2 style={{fontSize: '1rem'}}>Tillhör:</h2>
    <ul>
      {session.user?.userGroups.map((usergroup, i) => (usergroup &&
        <li key={i}>{usergroup}</li>
      ))}
    </ul>
  </>

}