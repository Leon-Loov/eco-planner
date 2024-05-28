import getOneAction from "@/fetchers/getOneAction";
import { getSession } from "@/lib/session";
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
    getSession(cookies()),
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

  return ( // TODO: Make sure optional stuff from form renders conditionally
    <>
      <section className="margin-y-100">
        <span style={{ color: 'gray' }}>Åtgärd</span>
        <h1 style={{margin: '0'}}>{action.name}</h1>
        <p style={{fontSize: '1.25rem', margin: '0'}}>{action.startYear} - {action.endYear}</p>
        {(accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin) ?
          <div className="margin-y-100">
            <Link href={`/roadmap/${params.roadmapId}/goal/${params.goalId}/action/${params.actionId}/editAction`} className="flex align-items-center gap-50 padding-50 smooth button transparent" style={{width: 'fit-content', fontWeight: '500'}}>
              Redigera åtgärd
              <Image src="/icons/edit.svg" width={24} height={24} alt={`Redigera åtgärd: ${action.name}`} />
            </Link>
          </div>
        : null}
      </section>

      <p>{action.description}</p>

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