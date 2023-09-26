import { notFound } from "next/navigation";
import { NewActionButton } from "@/components/redirectButtons";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import accessChecker from "@/lib/accessChecker";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  const goal = roadmap?.goals.find(goal => goal.id === params.goalId);

  // 404 if the goal doesn't exist or if the user doesn't have access to it
  if (!goal || !accessChecker(goal, session.user)) {
    return notFound();
  }

  return (
    <>
      <h1>Målbana &quot;{goal.name}&quot;{roadmap?.name ? ` under färdplanen "${roadmap.name}"` : null}</h1>
      <label htmlFor="action-table"><h2>Åtgärder</h2></label>
      <table id="action-table">
        <thead>
          <tr>
            <th>Namn</th>
            <th>Beskrivning</th>
            <th>Kostnadseffektivitet</th>
            <th>Förväntat utfall</th>
            <th>Relevanta aktörer</th>
          </tr>
        </thead>
        <tbody>
          {goal.actions.map(action => (
            <tr key={action.id}>
              <td>{action.name}</td>
              <td>{action.description}</td>
              <td>{action.costEfficiency}</td>
              <td>{action.expectedOutcome}</td>
              <td>{action.relevantActors}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      { // Only show the button if the user has edit access to the goal
        (accessChecker(goal, session.user) === 'EDIT' || accessChecker(goal, session.user) === 'ADMIN') &&
        <NewActionButton roadmapId={params.roadmapId} goalId={params.goalId} />
      }
      <br />
    </>
  )
}