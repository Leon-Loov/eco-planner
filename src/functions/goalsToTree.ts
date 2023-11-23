import { DataSeries, Goal } from "@prisma/client";

export default function goalsToTree(goals: (Goal & { dataSeries: DataSeries | null })[]) {
  let tree: any = {}

  for (const goal of goals) {
    const parameters = goal.indicatorParameter.split('\\')

    // TODO: check if naming of demand and key makes sense
    if (parameters[0].toLowerCase() == 'key' || parameters[0].toLowerCase() == 'demand') {
      parameters.shift();
    }

    // Create the path to the goal
    let current = tree
    for (const parameter of parameters) {
      if (!current[parameter]) {
        current[parameter] = {}
      }
      current = current[parameter]
    }
    // Add the goal object to the path
    current[`${goal.name || goal.indicatorParameter.split('\\').slice(-1)}${goal.dataSeries?.unit ? ` - ${goal.dataSeries.unit}` : ''}`] = goal
  }

  return tree
}