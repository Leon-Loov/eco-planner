import { NewRoadmapButton } from "@/components/redirectButtons";
import getRoadmaps from "@/functions/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";

export default async function Page() {
  const [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmaps()
  ]);

  let nationalRoadmaps = roadmaps.filter(roadmap => roadmap.isNational)
  let regionalRoadmaps = roadmaps.filter(roadmap => !roadmap.isNational)

  return <>
    <img src="/images/moose.webp" alt="" style={{width: '100%', height: '300px', borderRadius: '.5em', marginTop: '1.5em', objectFit: 'cover' }} />
    <h1>Färdplaner</h1>
    <p>Beskrivning, vad är en färdplan?</p>
    <section className="grid-auto-rows">
      <div>
        <h2>Nationella färdplaner</h2>
        <div className="overflow-x-scroll">
          <table>
            <thead>
              <tr>
                <th>Namn</th>
                <th>Antal mål</th>
              </tr>
            </thead>
            <tbody>
              {nationalRoadmaps.map(roadmap => (
                <tr key={roadmap.id}>
                  <td><a href={`/roadmap/${roadmap.id}`}>{roadmap.name}</a></td>
                  <td>{roadmap.goals.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2>Regionala färdplaner</h2>
        <div className="overflow-x-scroll">
          <table>
            <thead>
              <tr>
                <th>Namn</th>
                <th>Antal mål</th>
              </tr>
            </thead>
            <tbody>
              {regionalRoadmaps.map(roadmap => (
                <tr key={roadmap.id}>
                  <td><a href={`/roadmap/${roadmap.id}`}>{roadmap.name}</a></td>
                  <td>{roadmap.goals.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <br /><br />
    { // Only show the new roadmap button if the user is logged in
      session.user &&
      <NewRoadmapButton />
    }
    <br />
  </>
}