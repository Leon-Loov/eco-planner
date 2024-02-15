import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { dataSeriesDataFieldNames, DataSeriesDataFields } from "@/types";
import { Goal, DataSeries } from "@prisma/client";

export default function MainRelativeGraph({
  goal,
  nationalGoal,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  nationalGoal: Goal & { dataSeries: DataSeries | null } | null,
}) {
  if (!goal.dataSeries || goal.dataSeries.unit.toLowerCase() == "procent" || goal.dataSeries.unit.toLowerCase() == "andel") {
    return null
  }

  let chart: ApexAxisChartSeries = [];

  // Local goal
  let mainSeries = []
  for (let i in dataSeriesDataFieldNames) {
    let currentField = dataSeriesDataFieldNames[i]
    let baseValue = goal.dataSeries[dataSeriesDataFieldNames[0]]
    if (goal.dataSeries[currentField] && baseValue) {
      mainSeries.push({
        x: new Date(currentField.replace('val', '')).getTime(),
        y: (goal.dataSeries[currentField]! / baseValue) * 100
      })
    }
  }
  chart.push({
    name: (goal.name || goal.indicatorParameter).split('\\').slice(-1)[0],
    data: mainSeries,
    type: 'line',
  })

  // National goal
  if (nationalGoal?.dataSeries) {
    let nationalSeries = []
    for (let i in dataSeriesDataFieldNames) {
      let currentField = dataSeriesDataFieldNames[i]
      let baseValue = nationalGoal.dataSeries[dataSeriesDataFieldNames[0]]
      if (nationalGoal.dataSeries[currentField] && baseValue) {
        nationalSeries.push({
          x: new Date(currentField.replace('val', '')).getTime(),
          y: (nationalGoal.dataSeries[currentField]! / baseValue) * 100
        })
      }
    }
    chart.push({
      name: 'Nationell motsvarighet',
      data: nationalSeries,
      type: 'line',
    })
  }

  let chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      animations: { enabled: false, dynamicAnimation: { enabled: false } }
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
      title: { text: "procent relativt basår" },
      labels: { formatter: floatSmoother },
    },
    tooltip: {
      x: { format: 'yyyy' },
    },
  }

  return (
    <>
      <div style={{ backgroundColor: 'var(--blue-20)', padding: '.5rem', borderRadius: '1rem' }}>
        <div style={{ height: "500px", width: "100%", padding: '1rem', backgroundColor: 'white', borderRadius: '.5rem' }}>
          <WrappedChart
            options={chartOptions}
            series={chart}
            type="line"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </>
  )
}