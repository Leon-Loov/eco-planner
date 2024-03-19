import { notFound } from "next/navigation";
import Tooltip from "@/lib/tooltipWrapper";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import accessChecker from "@/lib/accessChecker";
import Goals from "@/components/tables/goals";
import Image from "next/image";
import Comments from "@/components/comments/comments";
import { AccessLevel } from "@/types";

export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  let accessLevel: AccessLevel = AccessLevel.None;
  if (roadmap) {
    accessLevel = accessChecker(roadmap, session.user)
  }

  // 404 if the roadmap doesn't exist or if the user doesn't have access to it
  if (!roadmap || !accessLevel) {
    return notFound();
  }

  return <>
    {/*
    { // Only show the edit link if the user has edit access to the roadmap
      (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
      <Link href={`/roadmap/${roadmap.id}/editRoadmap`}>
        <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${roadmap.metaRoadmap.name}`} />
      </Link>
    }
    <a href={`/metaRoadmap/${roadmap.metaRoadmapId}`}>Länk till metadata och fler versioner</a>
    */}

    <p>{roadmap.description}</p>

    <section>
      <section className="margin-y-100 padding-y-50" style={{ borderBottom: '2px solid var(--gray-90)' }}>
        <label className="font-weight-bold margin-y-25 container-text">
          Sök Målbana
          <div className="margin-y-50 flex align-items-center gray-90 padding-50 smooth focusable">
            <Image src='/icons/search.svg' alt="" width={24} height={24} />
            <input type="search" className="padding-0 margin-x-50" />
          </div>
        </label>
        <div className="flex gap-100 align-items-center justify-content-space-between">
          <label className="margin-y-100 font-weight-bold">
            Sortera på:
            <select className="font-weight-bold margin-y-50 block">
              <option>Namn (A-Ö)</option>
              <option>Namn (Ö-A)</option>
              <option>Antal åtgärder (stigande)</option>
              <option>Antal åtgärder (fallande)</option>
            </select>
          </label>
          <label className='flex align-items-center gap-50 padding-50 font-weight-bold button smooth transparent'>
            <span style={{ lineHeight: '1' }}>Filtrera</span>
            <div className='position-relative grid place-items-center'>
              <input type="checkbox" className="position-absolute width-100 height-100 hidden" />
              <Image src="/icons/filter.svg" alt="" width="24" height="24" />
            </div>
          </label>
        </div>
      </section>
      <section id="roadmapFilters" className="margin-y-200 padding-100 gray-90 rounded">
        <b>Enhet</b>
        <label className="flex align-items-center gap-25 margin-y-50">
          <input type="checkbox" />
          Enhet 1
        </label>
        <label className="flex align-items-center gap-25 margin-y-50">
          <input type="checkbox" />
          Enhet 2
        </label>
      </section>
    </section>

    <Goals title="Målbanor" roadmap={roadmap} accessLevel={accessLevel} />
    <Comments comments={roadmap.comments} objectId={roadmap.id} />
    <Tooltip anchorSelect="#goalName">
      Beskrivning av vad målbanan beskriver, tex. antal bilar.
    </Tooltip>
    <Tooltip anchorSelect="#goalObject">
      Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation.
    </Tooltip>
    <Tooltip anchorSelect="#leapParameter">
      LEAP parametern beskriver vad som mäts, exempelvis energianvändning eller utsläpp av växthusgaser.
    </Tooltip>
    <Tooltip anchorSelect="#dataUnit">
      Beskriver vilken enhet värdena i dataserien är i.
    </Tooltip>
    <Tooltip anchorSelect="#goalActions">
      Antal åtgärder som finns definierade och kopplade till målbanan.
    </Tooltip>
  </>
}