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
    <div className="rounded width-100 margin-y-100 position-relative overflow-hidden" style={{height: '350px'}}>
      <AttributedImage src="/images/solarpanels.jpg" alt="" >
        <div className="flex flex-wrap-wrap align-items-flex-end justify-content-space-between padding-100 width-100">
          <div>
            <h1 className="margin-y-25">Färdplaner</h1>
            <p className="margin-0">Photo by <a className="color-purewhite" href="https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Markus Spiske</a> on <a className="color-purewhite" href="https://unsplash.com/photos/white-and-blue-solar-panels-pwFr_1SUXRo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></p>
          </div>
          <a href="/metaRoadmap/createMetaRoadmap" className="button purewhite round block" >Skapa ny färdplan</a>
        </div>
      </AttributedImage>
    </div>
    <section>
      <section className="margin-y-100 padding-y-100">
        <label className=" font-weight-bold margin-y-25 container-text">
          Sök färdplan
            <div className="margin-y-50 flex align-items-center gray-90 padding-50 smooth focusable">
              <Image src='/icons/search.svg' alt="" width={24} height={24}/>
              <input type="search" className="padding-0 margin-x-50" />
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