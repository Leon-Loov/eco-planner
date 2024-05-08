import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import { DataSeries, Goal } from "@prisma/client";
import styles from '../graphs.module.css'
import { getTableContent } from "@/lib/scb/getTableContent";
import filterTableContentKeys from "@/lib/scb/filterTableContentKeys";
import { PxWebApiV2TableContent } from "@/lib/scb/PxWebApiV2Types";

export default function MainGraph({
  goal,
  nationalGoal,
  historicalData,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  nationalGoal: Goal & { dataSeries: DataSeries | null } | null,
  historicalData?: PxWebApiV2TableContent['data']
}) {
  if (!goal.dataSeries) {
    return null
  }

  let mainChart: ApexAxisChartSeries = [];
  if (goal.dataSeries) {
    let mainSeries = []
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

  // if (nationalGoal?.dataSeries) {
  //   let nationalSeries = []
  //   for (let i of dataSeriesDataFieldNames) {
  //     if (nationalGoal.dataSeries[i as keyof DataSeriesDataFields]) {
  //       nationalSeries.push({
  //         x: new Date(i.replace('val', '')).getTime(),
  //         y: nationalGoal.dataSeries[i as keyof DataSeriesDataFields]
  //       })
  //     }
  //   }
  //   mainChart.push({
  //     name: 'Nationell motsvarighet',
  //     data: nationalSeries,
  //     type: 'line',
  //   })
  // }

  if (historicalData) {
    const historicalSeries = []
    for (const i of historicalData) {
      historicalSeries.push({
        x: new Date(i.key[0]).getTime(),
        y: parseFloat(i.values[0])
      })
    }
    mainChart.push({
      name: 'Historik',
      data: historicalSeries,
      type: 'line',
    })
  }

  let mainChartOptions: ApexCharts.ApexOptions = {
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
      // categories: dataSeriesDataFieldNames.map(name => name.replace('val', ''))
    },
    yaxis: [
      {
        title: { text: goal.dataSeries?.unit },
        labels: { formatter: floatSmoother },
      }
    ],
    tooltip: {
      x: { format: 'yyyy' },
    },
  }

  if (mainChart.length > 1) {
    (mainChartOptions.yaxis as ApexYAxis[]).push({
      title: { text: "Nationell målbana" },
      labels: { formatter: floatSmoother },
      opposite: true,
    })
  }

  return (
    <>
      <div className={styles.graphWrapper}>
        <WrappedChart
          options={mainChartOptions}
          series={mainChart}
          type="line"
          width="100%"
          height="100%"
        />
      </div>
    </>
  )
}