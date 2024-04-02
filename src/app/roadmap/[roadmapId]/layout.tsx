import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function Layout({
    children,
    params,
  }: {
    children: React.ReactNode,
    params: { roadmapId: string }
  }) {

    const [roadmap] = await Promise.all([
        getOneRoadmap(params.roadmapId)
    ]);

    if (!roadmap) {
        return notFound();
    }

    return (
      <>
        <section className="display-flex justify-content-space-between flex-wrap-wrap" style={{borderBottom: '2px dashed var(--gray-90)', marginTop: '2rem'}}>
            <section className="flex-grow-100 margin-y-100" style={{minWidth: 'max-content'}}>
              <div></div>
              <span style={{color: 'gray'}}>Färdplan</span>
              <h1 style={{fontSize: '2.5rem', margin: '0'}}>{roadmap.metaRoadmap.name}</h1>
              <p style={{fontSize: '1.25rem', margin: '0'}}>
                  {(roadmap.metaRoadmap.actor) &&
                  <> {roadmap.metaRoadmap.actor} • </> 
                  }
                  {roadmap.goals.length} målbanor
              </p>
            </section>
            <aside className="display-flex justify-content-flex-end margin-y-100">
              <a href="" className="display-flex align-items-center gap-50" style={{textDecoration: 'none', color: 'black', fontWeight: '500'}}>
                Redigera färdplan
                <Image src="/icons/edit.svg" alt="" width="24" height="24" />
              </a>
            </aside>
        </section>
        {children}
      </>
    )
  }