import getRoadmaps from "@/fetchers/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import RoadmapTable from "@/components/tables/roadmapTable";
import AttributedImage from "@/components/generic/images/attributedImage";
import { RoadmapType } from "@prisma/client";

export default async function Page() {
  const [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmaps()
  ]);

  // TODO: Filter into more categories based on `RoadmapType`
  let nationalRoadmaps = roadmaps.filter(roadmap => roadmap.type === RoadmapType.NATIONAL)
  let regionalRoadmaps = roadmaps.filter(roadmap => roadmap.type !== RoadmapType.NATIONAL)

  return <>
    <div style={{ width: '100%', height: '350px', marginTop: '1.5em', }}>
      <AttributedImage src="/images/roadmap.webp" alt="" borderRadius=".5em">
        Photo by <a href="https://unsplash.com/@alvarordesign?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alvaro Reyes</a> on <a href="https://unsplash.com/photos/person-working-on-blue-and-white-paper-on-board-qWwpHwip31M?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      </AttributedImage>
    </div>
    <h1>Färdplaner</h1>
    <p>
      Detta verktyg syftar till att bidra till Sveriges klimatomställning.
      I verktyget kan nationella scenarier, även kallade kvantitativa färdplaner, brytas ner till regional och lokal nivå och en handlingsplan kan skapas.
      Handlingsplanen byggs upp av åtgärder vilka relaterar till en specifik målbana och målbanorna utgör tillsammans hela färdplanen.
      Användare kan inspireras av varandras åtgärder, på så sätt skapas en gemensam åtgärdsdatabas för Sverige.
      På lokal nivå kan också olika aktörer samarbeta kring åtgärder.
    </p>
    <section className="grid-auto-rows">
      <div>
        <RoadmapTable user={session.user} title="Nationella färdplaner" roadmaps={nationalRoadmaps} />
        {!roadmaps.length && <p>Inga färdplaner hittades. Detta kan bero på ett problem med databasen</p>}
      </div>
      <div>
        <RoadmapTable user={session.user} title="Regionala färdplaner" roadmaps={regionalRoadmaps} />
        {!roadmaps.length && <p>Inga färdplaner hittades. Detta kan bero på ett problem med databasen</p>}
      </div>
    </section>
  </>
}