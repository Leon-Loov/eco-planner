import { NewRoadmapButton } from "@/components/redirectButtons";
import getRoadmaps from "@/functions/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import RoadmapTable from "@/components/tables/roadmapTable";
import AttributedImage from "@/components/images/attributedImage";

export default async function Page() {
  const [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmaps()
  ]);

  let nationalRoadmaps = roadmaps.filter(roadmap => roadmap.isNational)
  let regionalRoadmaps = roadmaps.filter(roadmap => !roadmap.isNational)

  return <>
    <div style={{width: '100%', height: '350px', marginTop: '1.5em',}}>
      <AttributedImage src="/images/moose.webp" alt="2 Moose calves walking in grass" borderRadius=".5em">
        Photo by <a href="https://unsplash.com/@scottosbornphoto?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Scott Osborn</a> on <a href="https://unsplash.com/photos/SlXRLSUgQmI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      </AttributedImage>
    </div>
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
        <RoadmapTable title="Nationella färdplaner" roadmaps={nationalRoadmaps}/>
      </div>
      <div>
        <RoadmapTable title="Regionala färdplaner" roadmaps={regionalRoadmaps}/>
      </div>
    </section>
  </>
}