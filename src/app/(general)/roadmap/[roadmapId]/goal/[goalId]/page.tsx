import { notFound } from "next/navigation"
import getOneGoal from "@/functions/getOneGoal";
import { NewActionButton } from "@/components/redirectButtons";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  let goal = await getOneGoal(params.goalId);

  // 404 if the goal doesn't exist or if the user doesn't have access to it
  if (!goal) {
    return notFound();
  }

  return (
    <>
      <h1>{goal.name}</h1>
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
      <NewActionButton roadmapId={params.roadmapId} goalId={params.goalId} />
      <br />
    </>
  )
}