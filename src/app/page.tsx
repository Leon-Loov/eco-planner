import { NewRoadmapButton } from "@/components/redirectButtons";
import getRoadmaps from "@/functions/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import Roadmap from "@/components/tables/roadmapTable";

export default async function Page() {
  const [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmaps()
  ]);

  let nationalRoadmaps = roadmaps.filter(roadmap => roadmap.isNational)
  let regionalRoadmaps = roadmaps.filter(roadmap => !roadmap.isNational)

  return <>
    <img src="/images/moose.webp" alt="" style={{width: '100%', height: '300px', borderRadius: '.5em', marginTop: '1.5em', objectFit: 'cover' }} />
    <div className="flex-row flex-between align-center flex-wrap">
      <h1>Färdplaner</h1>
      { // Only show the new roadmap button if the user is logged in
        session.user &&
        <NewRoadmapButton />
      }
    </div>
    <p>Beskrivning, vad är en färdplan?</p>
    <section className="grid-auto-rows">
      <div>
        <Roadmap title="Nationella färdplaner" roadmaps={nationalRoadmaps}/>
      </div>
      <div>
        <Roadmap title="Regionala färdplaner" roadmaps={regionalRoadmaps}/>
      </div>
    </section>
  </>
}