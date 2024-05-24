import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import GoalForm from "@/components/forms/goalForm/goalForm";
import getOneRoadmap from "@/fetchers/getOneRoadmap";
import accessChecker from "@/lib/accessChecker";
import { notFound } from "next/navigation";
import { AccessLevel } from "@/types";


export default async function Page({ params }: { params: { roadmapId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSession(cookies()),
    getOneRoadmap(params.roadmapId),
  ]);

  // User must be signed in and have edit access to the roadmap, and the roadmap must exist
  if (!roadmap || !session.user || !accessChecker(roadmap, session.user) || accessChecker(roadmap, session.user) === AccessLevel.View) {
    return notFound();
  }

  return (
    <>
      <div className="container-text" style={{marginInline: 'auto'}}>
        <h1>Skapa ny målbana</h1>
        <GoalForm roadmapId={params.roadmapId} />
      </div>
    </>
  )
}