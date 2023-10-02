import { notFound } from "next/navigation";
import { NewActionButton } from "@/components/redirectButtons";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import accessChecker from "@/lib/accessChecker";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import Chart from "@/lib/chartWrapper";

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

  let dataPoints = [];
  if (goal.dataSeries) {
    for (let i of dataSeriesDataFieldNames) {
      if (goal.dataSeries[i as keyof DataSeriesDataFields]) {
        dataPoints.push({
          x: new Date(i.replace('val', '')).getTime(),
          y: goal.dataSeries[i as keyof DataSeriesDataFields]
        })
      }
    }
  }

  let chartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'line' },
    stroke: { curve: 'straight' },
    xaxis: {
      type: 'datetime',
      labels: { format: 'yyyy' },
      tooltip: { enabled: false },
      min: new Date(dataSeriesDataFieldNames[0].replace('val', '')).getTime(),
      max: new Date(dataSeriesDataFieldNames[dataSeriesDataFieldNames.length - 1].replace('val', '')).getTime()
      // categories: dataSeriesDataFieldNames.map(name => name.replace('val', ''))
    },
    tooltip: {
      x: { format: 'yyyy' }
    },
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
      { // Only show the chart if there are data points to show
        dataPoints.length > 0 &&
        <>
          <Chart
            options={chartOptions}
            series={[
              {
                name: 'Data',
                data: dataPoints,
              }
            ]}
            type="line"
            width="90%"
            height="500"
          />
          <br />
        </>
      }
      { // Only show the button if the user has edit access to the goal
        (accessChecker(goal, session.user) === 'EDIT' || accessChecker(goal, session.user) === 'ADMIN') &&
        <NewActionButton roadmapId={params.roadmapId} goalId={params.goalId} />
      }
      <br />
    </>
  )
}