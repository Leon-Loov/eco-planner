import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { notFound } from "next/navigation";

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
        <section style={{borderBottom: '2px dashed var(--gray-90)', marginTop: '3rem'}}>
            <span style={{color: 'gray'}}>Färdplan</span>
            <h1 style={{fontSize: '2.5rem', margin: '0'}}>{roadmap.metaRoadmap.name}</h1>
            <p style={{fontSize: '1.25rem', marginTop: '0'}}>
                {(roadmap.metaRoadmap.actor) &&
                <> {roadmap.metaRoadmap.actor} • </> 
                }
                {roadmap.goals.length} målbanor
            </p>
        </section>
        {children}
      </>
    )
  }