import getOneAction from "@/fetchers/getOneAction";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AccessControlled, AccessLevel } from "@/types";
import accessChecker from "@/lib/accessChecker";
import { Fragment } from "react";
import Comments from "@/components/comments/comments";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string, actionId: string } }) {
  const [session, action] = await Promise.all([
    getSessionData(cookies()),
    getOneAction(params.actionId)
  ]);

  let accessLevel: AccessLevel = AccessLevel.None;
  if (action) {
    const actionAccessData: AccessControlled = {
      author: action.author,
      editors: action.goal.roadmap.editors,
      viewers: action.goal.roadmap.viewers,
      editGroups: action.goal.roadmap.editGroups,
      viewGroups: action.goal.roadmap.viewGroups,
    }
    accessLevel = accessChecker(actionAccessData, session.user);
  }

  // 404 if the action doesn't exist or if the user doesn't have access to it
  if (!accessLevel || !action) {
    return notFound();
  }

  return (
    <>
      <h1 className="display-flex align-items-center gap-25 flex-wrap-wrap">
        { // Only show the edit link if the user has edit access to the roadmap
          (accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) &&
          <Link href={`/roadmap/${params.roadmapId}/goal/${params.goalId}/action/${params.actionId}/editAction`}>
            <Image src="/icons/edit.svg" width={24} height={24} alt={`Edit roadmap: ${action.name}`} />
          </Link>
        }
        {action.name}
      </h1>
      <span>Åtgärd</span>
      {action.links.length > 0 &&
        <>
          <h2>Länkar</h2>
          {action.links.map((link) => (
            <Fragment key={link.id}>
              <a href={link.url}>{link.description || link.url}</a>
            </Fragment>
          ))}
        </>
      }
      <h2>Detaljer</h2>
      {action.description && <p>Beskrivning: {action.description}</p>}
      {(action.startYear || action.endYear) &&
        <>
          <p>
            {"Aktiv period: "}
            {action.startYear && action.startYear}
            {action.startYear && action.endYear && ' - '}
            {action.endYear && action.endYear}
          </p>
        </>
      }
      {action.costEfficiency && <p>Kostnadseffektivitet: {action.costEfficiency}</p>}
      {action.expectedOutcome && <p>Förväntad effekt: {action.expectedOutcome}</p>}
      {(action.projectManager && (accessLevel == AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel == AccessLevel.Admin)) &&
        <p>Projektledare: {action.projectManager}</p>
      }
      {action.relevantActors && <p>Relevanta aktörer: {action.relevantActors}</p>}
      {(action.isEfficiency || action.isSufficiency || action.isRenewables) &&
        <p>
          Kategorier:
          <span className="margin-x-100">
            {action.isEfficiency && 'Efficiency'} {(action.isEfficiency && (action.isSufficiency || action.isRenewables))}
            {action.isSufficiency && 'Sufficiency'} {(action.isSufficiency && action.isRenewables)}
            {action.isRenewables && 'Renewables'}
          </span>
        </p>
      }
      <Comments comments={action.comments} objectId={action.id} />
    </>
  )
}