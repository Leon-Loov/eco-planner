import getRoadmaps from "@/fetchers/getRoadmaps";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import RoadmapTable from "@/components/tables/roadmapTable";
import AttributedImage from "@/components/generic/images/attributedImage";
import { RoadmapType } from "@prisma/client";
import getMetaRoadmaps from "@/fetchers/getMetaRoadmaps";

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
    <div style={{ width: '100%', height: '350px', margin: '1.5rem 0', }}>
      <AttributedImage src="/images/solarpanels.jpg" alt="" borderRadius=".5rem">
        <div className="flex flex-wrap-wrap align-items-flex-end justify-content-space-between padding-100" style={{background: 'linear-gradient(180deg, transparent, rgba(0, 0, 0, .65))', height: '100%', borderRadius: '.5rem'}}>
          <div>
            <h1 style={{marginBottom: '.5rem', fontSize: '3rem'}}>Färdplaner</h1>
            <p style={{color: 'white', margin: '0'}}>Photo by <a href="https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" style={{color: 'white'}}>Markus Spiske</a> on <a href="https://unsplash.com/photos/white-and-blue-solar-panels-pwFr_1SUXRo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" style={{color: 'white'}}>Unsplash</a></p>
          </div>
          <a href="/metaRoadmap/createMetaRoadmap" style={{color: 'black', textDecoration: 'none', padding: '.5rem 1rem', backgroundColor: 'white', borderRadius: '9999px'}}>Skapa ny färdplan</a>
        </div>
      </AttributedImage>
    </div>
    <RoadmapTable user={session.user} title="Nationella färdplaner" roadmaps={nationalRoadmaps} />
    <RoadmapTable user={session.user} title="Regionala färdplaner" roadmaps={regionalRoadmaps} />
  </>
}