import { notFound } from "next/navigation";
import Tooltip from "@/lib/tooltipWrapper";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import accessChecker from "@/lib/accessChecker";
import Goals from "@/components/tables/goals";
import Link from "next/link";
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
    <h1 style={{ marginBottom: ".25em" }} className="display-flex align-items-center gap-25 flex-wrap-wrap">
      { // Only show the edit link if the user has edit access to the roadmap
        (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
        <Link href={`/roadmap/${roadmap.id}/editRoadmap`}>
          <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${roadmap.metaRoadmap.name}`} />
        </Link>
      }
      {roadmap.metaRoadmap.name}
    </h1>
    <span style={{ color: "gray" }}>
      Färdplan • <a href={`/metaRoadmap/${roadmap.metaRoadmapId}`}>{`v.${roadmap.version}`}</a>
    </span>

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