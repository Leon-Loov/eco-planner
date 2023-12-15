import WrappedChart from "@/lib/chartWrapper";
import { Action } from "@prisma/client";

export default function ActionGraph({
  actions,
}: {
  actions: Action[],
}) {
  let series: ApexAxisChartSeries = [];
  let actionData = []

  // The string '2020' is interpreted as a year while the number 2020 is interpreted as a timestamp
  for (let action of actions) {
    actionData.push({
      x: action.name,
      y: [
        new Date((action.startYear ?? 2020).toString()).getTime(),
        new Date((action.endYear ?? 2050).toString()).getTime()
      ]
    })
  }

  series.push({
    name: 'Åtgärder',
    data: actionData,
    type: 'rangeBar',
  })

  let chartOptions: ApexCharts.ApexOptions = {
    chart: { 
      type: 'rangeBar',
      animations: { enabled: false, dynamicAnimation: { enabled: false }}
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50px",
        
      }
    },
    xaxis: {
      type: 'datetime',
      labels: { format: 'yyyy' },
      min: new Date("2020").getTime(),
      max: new Date("2050").getTime(),
    },
    tooltip: {
      x: { format: 'yyyy' }
    },
  }

  return (actions.length > 0 &&
    <>
      <h2>Åtgärdsgraf</h2>
      <div style={{height: "500px", width: "100%"}}>
        <WrappedChart
          options={chartOptions}
          series={series}
          type="rangeBar"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
}