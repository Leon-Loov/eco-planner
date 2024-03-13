import getRoadmaps from "@/fetchers/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import RoadmapTable from "@/components/tables/roadmapTable";
import AttributedImage from "@/components/generic/images/attributedImage";
import { RoadmapType } from "@prisma/client";
import getMetaRoadmaps from "@/fetchers/getMetaRoadmaps";
import Image from "next/image";
import styles from "./page.module.css" with { type: "css" };

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
        <div className="flex gap-100 flex-wrap-wrap align-items-flex-end justify-content-space-between padding-100 width-100">
          <div>
            <h1 className="margin-y-25">Färdplaner</h1>
            <p className="margin-0">Photo by <a className="color-purewhite" href="https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Markus Spiske</a> on <a className="color-purewhite" href="https://unsplash.com/photos/white-and-blue-solar-panels-pwFr_1SUXRo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></p>
          </div>
          { // Link to create roadmap form if logged in
            session.user &&
            <a href="/metaRoadmap/createMetaRoadmap" className="button purewhite round block" >Skapa ny färdplan</a>
          }
        </div>
      </AttributedImage>
    </div>
    <section>
      <section className="margin-y-100 padding-y-50" style={{borderBottom: '2px solid var(--gray-90)'}}>
        <label className="font-weight-bold margin-y-25 container-text">
          Sök färdplan
            <div className="margin-y-50 flex align-items-center gray-90 padding-50 smooth focusable">
              <Image src='/icons/search.svg' alt="" width={24} height={24}/>
              <input type="search" className="padding-0 margin-x-50" />
            </div>
        </label>
        <div className="flex gap-100 align-items-center justify-content-space-between">
          <label className="margin-y-100 font-weight-bold">
            Sortera på:
            <select className="font-weight-bold margin-y-50 block">
              <option>Namn (A-Ö)</option>
              <option>Namn (Ö-A)</option>
              <option>Antal målbanor (stigande)</option>
              <option>Antal målbanor (fallande)</option>
            </select>
          </label>
          <label className='flex align-items-center gap-50 padding-50 font-weight-bold button smooth transparent'>
            <span style={{lineHeight: '1',}}>Filtrera</span>
            <div className='position-relative grid place-items-center'> 
              <input type="checkbox" className="position-absolute width-100 height-100 hidden"/>
              <Image src="/icons/filter.svg" alt="" width="24" height="24" />
            </div>
          </label>
        </div>
      </section>
      <section id="roadmapFilters" className="margin-y-200 padding-100 gray-90 rounded">
        <b>Visa</b>
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
    <section>
      <RoadmapTable user={session.user} roadmaps={nationalRoadmaps} />
      <RoadmapTable user={session.user} roadmaps={regionalRoadmaps} />
    </section>
  </>
}