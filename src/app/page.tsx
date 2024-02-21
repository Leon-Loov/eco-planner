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
    <div style={{ width: '100%', height: '350px', margin: '1.5rem 0 0 0', }}>
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
    <section>
      <section className="margin-y-100 padding-y-100" style={{borderBottom: '2px solid var(--gray-90)'}}>
        <label className="margin-y-25" style={{width: 'min(60ch, 100%)'}}>
          Sök färdplan
          <div className="flex">
            <input type="search" className="block margin-y-50" style={{appearance: 'none', borderRadius: '3px 0 0 3px', border: 'none', width: '100%', backgroundColor: 'var(--gray-90)'}} />
            <div className="margin-y-50 padding-50" style={{backgroundColor: 'var(--gray-90)', display: 'grid', placeItems: 'center', borderRadius: '0 3px 3px 0'}}>
              <Image src='/icons/search.svg' alt="" width={24} height={24}/>
            </div>
          </div>
        </label>
        <div className="flex gap-100 align-items-flex-end justify-content-space-between">
          <label style={{marginTop: '1rem'}}>
            Sortera på:
            <select style={{width: 'unset', backgroundColor: 'unset', padding: 'unset'}}>
              <option>Namn (A-Ö)</option>
              <option>Namn (Ö-A)</option>
              <option>Antal målbanor (stigande)</option>
              <option>Antal målbanor (fallande)</option>
            </select>
          </label>
          <label className="flex gap-50" style={{marginTop: '1rem'}}>
            <span>Filtrera</span>
            <div style={{position: 'relative', display: 'grid'}}> 
              <input type="checkbox" style={{position: 'absolute', margin: '0', left: '0', top: '0', height: '100%', width: '100%', opacity: '0'}} />
              <Image src="/icons/filter.svg" alt="" width="24" height="24" />
            </div>
          </label>
        </div>
      </section>
      <section className="margin-y-100 padding-100" style={{backgroundColor: 'var(--gray-90)', borderRadius: '.5rem',}}>
        <p style={{marginTop: '0'}}><b>Visa</b></p>
        <label className="flex align-items-center gap-25 margin-y-50" style={{fontWeight: 'normal'}}>
        <input type="checkbox" style={{padding: '0', margin: '0', height: '16px', width: '16px'}} />
          Nationella färdplaner
        </label>
        <label className="flex align-items-center gap-25 margin-y-50" style={{fontWeight: 'normal'}}>
          <input type="checkbox" style={{padding: '0', margin: '0', height: '16px', width: '16px'}} />
          Regionala färdplaner
        </label>
      </section>
    </section>
    <RoadmapTable user={session.user} roadmaps={nationalRoadmaps} />
    <RoadmapTable user={session.user} roadmaps={regionalRoadmaps} />
  </>
}