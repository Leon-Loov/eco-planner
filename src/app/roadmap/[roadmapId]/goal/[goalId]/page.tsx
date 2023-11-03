import { notFound } from "next/navigation";
import getOneRoadmap from "@/functions/getOneRoadmap";
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import accessChecker from "@/lib/accessChecker";
import { AccessLevel, DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import Chart, { floatSmoother } from "@/lib/chartWrapper";
import ActionTable from "@/components/tables/actionTable";
import CombinedGraph from "./combinedGraph";
import ActionGraph from "./actionGraph";

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
  if (!goal || !accessLevel || !roadmap) {
    return notFound();
  }

  let mainChart: ApexAxisChartSeries = [];
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
    mainChart.push({
      name: (goal.name || goal.indicatorParameter).split('\\').slice(-1)[0],
      data: mainSeries,
      type: 'line',
    })
  }

  let mainChartOptions: ApexCharts.ApexOptions = {
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
    yaxis: {
      title: { text: goal.dataSeries?.unit },
      labels: { formatter: floatSmoother },
    },
    tooltip: {
      x: { format: 'yyyy' },
    },
  }

  return (
    <>
      <h1 style={{ marginBottom: ".25em" }}>{roadmap?.name ? `${roadmap.name}` : null}</h1>
      <span style={{ color: "gray" }}>Målbana</span>
      <ActionTable title='Åtgärder' goal={goal} accessLevel={accessLevel} params={params} />
      <br />
      { // Only show the chart if there are data points to show
        mainChart.length > 0 &&
        <>
          <h2>Dataserie</h2>
          <Chart
            options={mainChartOptions}
            series={mainChart}
            type="line"
            width="90%"
            height="500"
          />
          <br />
        </>
      }
      <CombinedGraph roadmap={roadmap} goal={goal} />
      <br />
      <ActionGraph actions={goal.actions} />
      <br />
    </>
  )
}