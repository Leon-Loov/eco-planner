import { notFound } from "next/navigation";
import { NewActionButton } from "@/components/redirectButtons";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import accessChecker from "@/lib/accessChecker";
import { AccessLevel, DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import Chart from "@/lib/chartWrapper";
import ActionTable from "@/components/tables/actionTable";

export default async function Page({ params }: { params: { roadmapId: string, goalId: string } }) {
  const [session, roadmap] = await Promise.all([
    getSessionData(cookies()),
    getOneRoadmap(params.roadmapId)
  ]);

  const goal = roadmap?.goals.find(goal => goal.id === params.goalId);

  let accessLevel: AccessLevel = AccessLevel.None;
  if (goal) {
    accessLevel = accessChecker(goal, session.user);
  }

  // 404 if the goal doesn't exist or if the user doesn't have access to it
  if (!goal || !accessLevel) {
    return notFound();
  }

  let dataPoints: ApexAxisChartSeries = [];
  let mainSeries = []
  if (goal.dataSeries) {
    for (let i of dataSeriesDataFieldNames) {
      if (goal.dataSeries[i as keyof DataSeriesDataFields]) {
        mainSeries.push({
          x: new Date(i.replace('val', '')).getTime(),
          y: goal.dataSeries[i as keyof DataSeriesDataFields]
        })
      }
    }
    dataPoints.push({
      name: 'Data',
      data: mainSeries,
      type: 'line',
    })
  }

  for (let i in goal.actions) {
    let actionDurations = []
    if (goal.actions[i].startYear || goal.actions[i].endYear) {
      actionDurations.push({
        x: new Date(goal.actions[i].startYear ?? 2020).getTime(),
        y: i,
      })
      actionDurations.push({
        x: new Date(goal.actions[i].endYear ?? 2050).getTime(),
        y: i,
      })
      dataPoints.push({
        name: `${goal.actions[i].name}'s  aktiva period`,
        data: actionDurations,
        type: 'line',
      })
    }
  }

  let yaxisData: ApexYAxis[] = [{ seriesName: 'data', title: { text: goal.dataSeries?.unit } }]
  for (let i = 1; i < dataPoints.length; i++) {
    yaxisData.push({
      seriesName: dataPoints[1].name,
      opposite: true,
      max: goal.actions.length,
      min: -1,
      tickAmount: goal.actions.length + 1,
      show: i === 1 ? true : false,
      labels: { show: false },
    })
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
    yaxis: yaxisData,
    tooltip: {
      x: { format: 'yyyy' }
    },
  }

  return (
    <>
      <h1>Målbana &quot;{goal.name ? goal.name : goal.indicatorParameter}&quot;{roadmap?.name ? ` under färdplanen "${roadmap.name}"` : null}</h1>
      <ActionTable title='Åtgärder' goal={goal} accessLevel={accessLevel} params={params} />
      <br />
      { // Only show the chart if there are data points to show
        dataPoints.length > 0 &&
        <>
          <h2>Dataserie</h2>
          <Chart
            options={chartOptions}
            series={dataPoints}
            type="line"
            width="90%"
            height="500"
          />
          <br />
        </>
      }
      <br />
    </>
  )
}