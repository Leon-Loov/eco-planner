import findSiblings from "@/functions/findSiblings";
import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import { DataSeries, Goal, Roadmap } from "@prisma/client";


export default function CombinedGraph({
  roadmap,
  goal,
}: {
  roadmap: Roadmap & {
    goals: (Goal & { dataSeries: DataSeries | null })[],
  },
  goal: Goal & { dataSeries: DataSeries | null },
}) {
  const siblings = findSiblings(roadmap, goal);
  const dataPoints: ApexAxisChartSeries = [];

  for (let i in siblings) {
    let mainSeries = []
    if (siblings[i].dataSeries) {
      for (let j of dataSeriesDataFieldNames) {
        if (siblings[i].dataSeries![j as keyof DataSeriesDataFields]) {
          mainSeries.push({
            x: new Date(j.replace('val', '')).getTime(),
            y: siblings[i].dataSeries![j as keyof DataSeriesDataFields]
          })
        }
      }
    }
    // If the series is only null/0, don't add it to the graph
    if (mainSeries.filter((entry) => entry.y).length > 0) {
      dataPoints.push({
        name: (siblings[i].name || siblings[i].indicatorParameter).split('\\').slice(-1)[0],
        data: mainSeries,
        type: 'area',
      })
    }
  }

  let chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      stacked: true,
    },
    stroke: { curve: 'straight' },
    xaxis: {
      type: 'datetime',
      labels: { format: 'yyyy' },
      tooltip: { enabled: false },
      min: new Date(dataSeriesDataFieldNames[0].replace('val', '')).getTime(),
      max: new Date(dataSeriesDataFieldNames[dataSeriesDataFieldNames.length - 1].replace('val', '')).getTime()
    },
    yaxis: {
      title: { text: goal.dataSeries?.unit },
      labels: { formatter: floatSmoother },
    },
    tooltip: {
      x: { format: 'yyyy' },
    },
  }

  let indicatorCategory: string;
  let additionalInfo: string = '';
  if (goal.indicatorParameter.split('\\')[0] == 'Key' || goal.indicatorParameter.split('\\')[0] == 'Demand') {
    indicatorCategory = goal.indicatorParameter.split('\\').slice(1, -1).join('\\')
    additionalInfo = "Visar data för både Key och Demand"
  } else {
    indicatorCategory = goal.indicatorParameter.split('\\').slice(0, -1).join('\\')
  }

  return (siblings.length > 1 &&
    <>
      <h2>Kombinerad graf</h2>
      <h3>{indicatorCategory}</h3>
      {additionalInfo && <p>{additionalInfo}</p>}
      <WrappedChart
        options={chartOptions}
        series={dataPoints}
        type="line"
        width="90%"
        height="500"
      />
    </>
  )
}