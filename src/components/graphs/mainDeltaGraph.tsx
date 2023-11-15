import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { dataSeriesDataFieldNames } from "@/types";
import { Goal, DataSeries } from "@prisma/client";

export default function MainDeltaGraph({
  goal,
  nationalGoal,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  nationalGoal: Goal & { dataSeries: DataSeries | null } | null, 
}) {
  if (!goal.dataSeries) {
    return null
  }

  let chart: ApexAxisChartSeries = [];

  // Local goal
  let mainSeries = []
  // Start at 1 to skip the first value
  for (let i = 1; i < dataSeriesDataFieldNames.length; i++) {
    let currentField = dataSeriesDataFieldNames[i]
    let previousField = dataSeriesDataFieldNames[i - 1]
    if (goal.dataSeries[currentField] && goal.dataSeries[previousField]) {
      mainSeries.push({
        x: new Date(currentField.replace('val', '')).getTime(),
        y: goal.dataSeries[currentField]! - goal.dataSeries[previousField]!
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
    for (let i = 1; i < dataSeriesDataFieldNames.length; i++) {
      let currentField = dataSeriesDataFieldNames[i]
      let previousField = dataSeriesDataFieldNames[i - 1]
      if (nationalGoal.dataSeries[currentField] && nationalGoal.dataSeries[previousField]) {
        nationalSeries.push({
          x: new Date(currentField.replace('val', '')).getTime(),
          y: nationalGoal.dataSeries[currentField]! - nationalGoal.dataSeries[previousField]!
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
      animations: { enabled: false, dynamicAnimation: { enabled: false }}
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
      title: { text: `Årlig förändring i ${goal.dataSeries.unit.toLowerCase() == 'procent' ? 'procentenheter' : goal.dataSeries.unit}` },
      labels: { formatter: floatSmoother },
    },
    tooltip: {
      x: { format: 'yyyy' },
    },
  }

  return (
    <>
      <WrappedChart
        options={chartOptions}
        series={chart}
        type="line"
        width="100%"
        height="500"
      />
    </>
  );
}