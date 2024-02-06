import { GoalInput } from "@/types";
import { DataSeries, Goal, Roadmap } from "@prisma/client";


export default function goalInputFromGoalArray(goals: (Goal & { dataSeries: DataSeries | null } | null)[]) {
  let output: GoalInput[] = [];

  for (let goal of goals || []) {
    if (!goal || !goal.dataSeries) {
      continue;
    }
    let dataSeries: string[] = [];
    for (let i = 2020; i <= 2050; i++) {
      let value = goal.dataSeries[`val${i}` as keyof typeof goal.dataSeries] as number | undefined;
      dataSeries.push(value?.toString() || "");
    }

    output.push({
      name: goal.name ?? undefined,
      description: goal.description ?? undefined,
      indicatorParameter: goal.indicatorParameter,
      dataSeries: dataSeries,
      dataUnit: goal.dataSeries.unit,
      dataScale: goal.dataSeries.scale ?? undefined,
    })
  }

  return output
}