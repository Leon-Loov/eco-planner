'use client';

import findSiblings from "@/functions/findSiblings";
import WrappedChart, { floatSmoother } from "@/lib/chartWrapper";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import { DataSeries, Goal, Roadmap } from "@prisma/client";
import { useState } from "react";
import styles from './graphs.module.css'
import Image from "next/image";

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

  const [isStacked, setIsStacked] = useState(true);

  for (let i in siblings) {
    let mainSeries = []
    if (siblings[i].dataSeries) {
      for (let j of dataSeriesDataFieldNames) {
        mainSeries.push({
          x: new Date(j.replace('val', '')).getTime(),
          y: siblings[i].dataSeries![j as keyof DataSeriesDataFields] ?? null,
        })
      }
    }
    // Only add the series to the graph if it isn't all null/0
    if (mainSeries.filter((entry) => entry.y).length > 0) {
      dataPoints.push({
        name: (siblings[i].name || siblings[i].indicatorParameter).split('\\').slice(-1)[0],
        data: mainSeries,
        type: isStacked ? 'area' : 'line',
      })
    }
  }

  let chartOptions: ApexCharts.ApexOptions = {
    chart: {
      id: 'combinedGraph',
      type: isStacked ? 'area' : 'line',
      stacked: isStacked,
      stackOnlyBar: false,
      animations: { enabled: false, dynamicAnimation: { enabled: false } }
    },
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
      inverseOrder: isStacked,
    },
    dataLabels: { enabled: false },
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
    <div>
      <nav className="display-flex justify-content-flex-end margin-y-100">
        <button className="call-to-action-primary" style={{width: 'fit-content', fontWeight: 'bold', fontSize: '1rem'}} type="button" onClick={() => setIsStacked(!isStacked)}>
          Byt typ av graf
          <Image src='/icons/chartArea.svg' alt='Byt graf' width={24} height={24} />

        </button>
      </nav>
      <div className={styles.graphWrapper}>
        <WrappedChart
          key={"combinedGraph"}
          options={chartOptions}
          series={dataPoints}
          type={isStacked ? 'area' : 'line'}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  )
}