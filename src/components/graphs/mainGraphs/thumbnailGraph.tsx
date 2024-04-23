import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import { DataSeries, Goal } from "@prisma/client";
import styles from '../graphs.module.css'

export default function ThumbnailGraph({
  goal,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
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

  let mainChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      animations: { enabled: false, dynamicAnimation: { enabled: false } },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip : {  enabled : false },
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
  }

  return (
    <>
      <div className={styles.graphWrapperThumbnail}>
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