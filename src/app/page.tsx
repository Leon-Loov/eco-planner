import getRoadmaps from "@/fetchers/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import RoadmapTable from "@/components/tables/roadmapTable";
import AttributedImage from "@/components/generic/images/attributedImage";
import { PrimaryLink } from "@/components/generic/links/links";

export default async function Page() {
  const [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmaps()
  ]);

  let nationalRoadmaps = roadmaps.filter(roadmap => roadmap.isNational)
  let regionalRoadmaps = roadmaps.filter(roadmap => !roadmap.isNational)

  return <>
    <div style={{ width: '100%', height: '350px', marginTop: '1.5em', }}>
      <AttributedImage src="/images/roadmap.webp" alt="" borderRadius=".5em">
        Photo by <a href="https://unsplash.com/@alvarordesign?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alvaro Reyes</a> on <a href="https://unsplash.com/photos/person-working-on-blue-and-white-paper-on-board-qWwpHwip31M?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      </AttributedImage>
    </div>
    <div className="display-flex justify-content-space-between align-items-center flex-wrap-wrap">
      <h1>Färdplaner</h1>
      { // Only show the new roadmap button if the user is logged in
        session.user &&
        <PrimaryLink href="./roadmap/createRoadmap">Skapa ny Färdplan</PrimaryLink>
      }
    </div>
    <p>
      Detta verktyg syftar till att bidra till Sveriges klimatomställning.
      I verktyget kan nationella scenarier, även kallade kvantitativa färdplaner, brytas ner till regional och lokal nivå och en handlingsplan kan skapas.
      Handlingsplanen byggs upp av åtgärder vilka relaterar till en specifik målbana och målbanorna utgör tillsammans hela färdplanen.
      Användare kan inspireras av varandras åtgärder, på så sätt skapas en gemensam åtgärdsdatabas för Sverige.
      På lokal nivå kan också olika aktörer samarbeta kring åtgärder.
    </p>
    <section className="grid-auto-rows">
      <div>
        <RoadmapTable title="Nationella färdplaner" roadmaps={nationalRoadmaps} />
        {!roadmaps.length && <p>Inga färdplaner hittades. Detta kan bero på ett problem med databasen</p>}
      </div>
      <div>
        <RoadmapTable title="Regionala färdplaner" roadmaps={regionalRoadmaps} />
        {!roadmaps.length && <p>Inga färdplaner hittades. Detta kan bero på ett problem med databasen</p>}
      </div>
    </section>
  </>
}