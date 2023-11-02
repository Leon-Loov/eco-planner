import WrappedChart from "@/lib/chartWrapper";
import { dataSeriesDataFieldNames } from "@/types";
import { Action } from "@prisma/client";

export default function ActionGraph(
  {
    actions,
  }: {
    actions: Action[],
  }
) {
  let series: ApexAxisChartSeries = [];
  let actionData = []

  for (let action of actions) {
    actionData.push({
      x: action.name,
      y: [
        new Date(action.startYear ?? 2020).getTime(),
        new Date(action.endYear ?? 2050).getTime()
      ]
    })
  }
  console.log(actionData)
  series.push({
    name: 'Åtgärder',
    data: actionData,
    type: 'rangeBar',
  })

  let chartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'rangeBar' },
    plotOptions: {
      bar: {
        horizontal: true,
        isDumbbell: true,
      }
    },
    xaxis: {
      type: 'datetime',
      labels: { format: 'yyyy' },
      tooltip: { enabled: false },
    },
  }

  return (actions.length > 0 &&
    <>
      <h2>Åtgärdsgraf</h2>
      <WrappedChart
        options={chartOptions}
        series={series}
        type="rangeBar"
        width="90%"
        height="500"
      />
    </>
  );
}