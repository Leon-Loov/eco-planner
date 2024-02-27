import getRoadmaps from "@/fetchers/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import RoadmapTable from "@/components/tables/roadmapTable";
import AttributedImage from "@/components/generic/images/attributedImage";
import { RoadmapType } from "@prisma/client";
import getMetaRoadmaps from "@/fetchers/getMetaRoadmaps";
import Image from "next/image";

export default async function Page() {
  const [session, metaRoadmaps] = await Promise.all([
    getSessionData(cookies()),
    getMetaRoadmaps()
  ]);

  let nationalMetaRoadmaps = metaRoadmaps.filter(metaRoadmap => metaRoadmap.type === RoadmapType.NATIONAL)
  // TODO: Use all of these, and change `regionalMetaRoadmaps` to be those with `type === RoadmapType.REGIONAL`
  let regionalMetaRoadmaps = metaRoadmaps.filter(metaRoadmap => metaRoadmap.type !== RoadmapType.NATIONAL)
  let municipalMetaRoadmaps = metaRoadmaps.filter(metaRoadmap => metaRoadmap.type === RoadmapType.MUNICIPAL)
  let localMetaRoadmaps = metaRoadmaps.filter(metaRoadmap => metaRoadmap.type === RoadmapType.LOCAL)
  let otherMetaRoadmaps = metaRoadmaps.filter(metaRoadmap => metaRoadmap.type === RoadmapType.OTHER || !Object.values(RoadmapType).includes(metaRoadmap.type))

  // Latest version of every national roadmap
  let nationalRoadmaps: typeof metaRoadmaps[number]['roadmapVersions'] = [];
  nationalMetaRoadmaps.forEach(metaRoadmap => {
    if (metaRoadmap.roadmapVersions.length) {
      let foundRoadmap = metaRoadmap.roadmapVersions.find(roadmap => roadmap.version === Math.max(...metaRoadmap.roadmapVersions.map(roadmap => roadmap.version)))
      if (foundRoadmap) {
        nationalRoadmaps.push(foundRoadmap)
      }
    }
  })

  // Latest version of every non-national roadmap
  let regionalRoadmaps: typeof metaRoadmaps[number]['roadmapVersions'] = [];
  regionalMetaRoadmaps.forEach(metaRoadmap => {
    if (metaRoadmap.roadmapVersions.length) {
      let foundRoadmap = metaRoadmap.roadmapVersions.find(roadmap => roadmap.version === Math.max(...metaRoadmap.roadmapVersions.map(roadmap => roadmap.version)))
      if (foundRoadmap) {
        regionalRoadmaps.push(foundRoadmap)
      }
    }
  })

  return <>
    <div>
      <AttributedImage src="/images/solarpanels.jpg" alt="" borderRadius=".5rem">
        <div className="flex flex-wrap-wrap align-items-flex-end justify-content-space-between padding-100">
          <div>
            <h1>Färdplaner</h1>
            <p>Photo by <a href="https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Markus Spiske</a> on <a href="https://unsplash.com/photos/white-and-blue-solar-panels-pwFr_1SUXRo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></p>
          </div>
          <a href="/metaRoadmap/createMetaRoadmap">Skapa ny färdplan</a>
        </div>
      </AttributedImage>
    </div>
    <section>
      <section className="margin-y-100 padding-y-100">
        <label className="margin-y-25">
          Sök färdplan
          <div className="flex">
            <input type="search" className="block margin-y-50"/>
            <div className="margin-y-50 padding-50">
              <Image src='/icons/search.svg' alt="" width={24} height={24}/>
            </div>
          </div>
        </label>
        <div className="flex gap-100 align-items-flex-end justify-content-space-between">
          <label>
            Sortera på:
            <select>
              <option>Namn (A-Ö)</option>
              <option>Namn (Ö-A)</option>
              <option>Antal målbanor (stigande)</option>
              <option>Antal målbanor (fallande)</option>
            </select>
          </label>
          <label className="flex gap-50">
            <span>Filtrera</span>
            <div> 
              <input type="checkbox"/>
              <Image src="/icons/filter.svg" alt="" width="24" height="24" />
            </div>
          </label>
        </div>
      </section>
      <section id="roadmapFilters" className="margin-y-100 padding-100">
        <p><b>Visa</b></p>
        <label className="flex align-items-center gap-25 margin-y-50">
        <input type="checkbox"/>
          Nationella färdplaner
        </label>
        <label className="flex align-items-center gap-25 margin-y-50">
          <input type="checkbox" />
          Regionala färdplaner
        </label>
      </section>
    </section>
    <RoadmapTable user={session.user} roadmaps={nationalRoadmaps} />
    <RoadmapTable user={session.user} roadmaps={regionalRoadmaps} />
  </>
}