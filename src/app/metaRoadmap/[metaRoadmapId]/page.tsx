import getOneMetaRoadmap from "@/fetchers/getOneMetaRoadmap";
import accessChecker from "@/lib/accessChecker";
import { getSessionData } from "@/lib/session";
import { AccessLevel } from "@/types";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import RoadmapTable from "@/components/tables/roadmapTable";

export default async function Page({ params }: { params: { metaRoadmapId: string } }) {
  const [session, metaRoadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneMetaRoadmap(params.metaRoadmapId),
  ]);

  const accessLevel = accessChecker(metaRoadmap, session.user);

  // 404 if the meta roadmap doesn't exist or the user doesn't have access
  if (!metaRoadmap) {
    return notFound();
  }

  return (
    <>
      <h1 style={{ marginBottom: ".25em" }} className="display-flex align-items-center gap-25 flex-wrap-wrap">
        { // Only show the edit link if the user has edit access to the roadmap
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Admin) &&
          <Link href={`/metaRoadmap/${metaRoadmap.id}/editMetaRoadmap`}>
            <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${metaRoadmap.name}`} />
          </Link>
        }
        {`${metaRoadmap.name}`}
      </h1>
      <span style={{ color: "gray" }}>Metadata för en färdplan</span>
      <RoadmapTable title="Versioner av målbanan" user={session.user} metaRoadmap={metaRoadmap} />
    </>
  )
}