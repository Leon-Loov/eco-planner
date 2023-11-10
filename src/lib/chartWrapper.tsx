'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * A wrapper for ApexCharts that only renders the chart on the client.
 * This is because ApexCharts uses `window`, which is not available on the server.
 */
export default function WrappedChart({
  type,
  series,
  width,
  height,
  options,
  ...props
}: {
  type?:
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap",
  series?: ApexCharts.ApexOptions['series'],
  width?: string | number,
  height?: string | number,
  options?: ApexCharts.ApexOptions
}) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  const Chart = dynamic(() => import('react-apexcharts'))
  return (
    <>
      {isClient &&
        <Chart
          type={type}
          series={series}
          width={width}
          height={height}
          options={options}
          {...props}
        />
      }
    </>
  )
}

/**
 * Used as a formatter for ApexCharts to remove trailing zeros in floats.
 * Actually just `value.toString()`.
 * Declared as a client-side function so it can be used in `WrappedChart`.
 */
export function floatSmoother(value: number) {
  return value.toLocaleString('sv-SE')
}