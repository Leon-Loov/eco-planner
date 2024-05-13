import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import { DataSeries, Goal } from "@prisma/client";
import styles from '../graphs.module.css'
import { PxWebApiV2TableContent } from "@/lib/pxWeb/pxWebApiV2Types";
import { parsePeriod } from "@/lib/pxWeb/utility";

export default function MainGraph({
  goal,
  nationalGoal,
  historicalData,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  nationalGoal: Goal & { dataSeries: DataSeries | null } | null,
  historicalData?: PxWebApiV2TableContent | null,
}) {
  if (!goal.dataSeries) {
    return null
  }

  const mainChartOptions: ApexCharts.ApexOptions = {
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
      x: { format: 'yyyy-MM-dd' },
      shared: true,
    },
  }

  const mainChart: ApexAxisChartSeries = [];
  if (goal.dataSeries) {
    const mainSeries = []
    for (const i of dataSeriesDataFieldNames) {
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

  if (nationalGoal?.dataSeries) {
    const nationalSeries = []
    for (const i of dataSeriesDataFieldNames) {
      if (nationalGoal.dataSeries[i as keyof DataSeriesDataFields]) {
        nationalSeries.push({
          x: new Date(i.replace('val', '')).getTime(),
          y: nationalGoal.dataSeries[i as keyof DataSeriesDataFields]
        })
      }
    }
    mainChart.push({
      name: 'Nationell motsvarighet',
      data: nationalSeries,
      type: 'line',
    });
    (mainChartOptions.yaxis as ApexYAxis[]).push({
      title: { text: "Nationell målbana" },
      labels: { formatter: floatSmoother },
      opposite: true,
    });
  }

  if (historicalData) {
    const historicalSeries = []
    for (const i of historicalData.data) {
      historicalSeries.push({
        x: parsePeriod(i.key[0]).getTime(),
        y: parseFloat(i.values[0])
      })
    }
    mainChart.push({
      name: `${historicalData.metadata[0]?.label}`,
      data: historicalSeries,
      type: 'line',
    });
    (mainChartOptions.yaxis as ApexYAxis[]).push({
      title: { text: "Historik" },
      labels: { formatter: floatSmoother },
      opposite: true,
    });
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