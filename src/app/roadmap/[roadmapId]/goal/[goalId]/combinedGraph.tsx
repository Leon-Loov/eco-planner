import findSiblings from "@/functions/findSiblings";
import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import { DataSeries, Goal, Roadmap } from "@prisma/client";


export default function CombinedGraph(
  {
    roadmap,
    goal,
  }: {
    roadmap: Roadmap & {
      goals: (Goal & { dataSeries: DataSeries | null })[],
    },
    goal: Goal & { dataSeries: DataSeries | null },
  }
) {
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
      dataPoints.push({
        name: (siblings[i].name || siblings[i].indicatorParameter).split('\\').slice(-1)[0],
        data: mainSeries,
        type: 'line',
      })
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
    yaxis: {
      title: { text: goal.dataSeries?.unit },
      labels: { formatter: floatSmoother },
    },
    tooltip: {
      x: { format: 'yyyy' }
    },
  }

  return (siblings.length > 1 &&
    <>
      <h2>Kombinerad graf</h2>
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