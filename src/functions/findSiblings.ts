import { DataSeries, Goal, Roadmap } from "@prisma/client";

export default function findSiblings(
  roadmap: Roadmap & {
    goals: (Goal & { dataSeries: DataSeries | null })[],
  },
  goal: Goal & { dataSeries: DataSeries | null },
) {
  let siblings: (Goal & { dataSeries: DataSeries | null })[] = [];

  let goalParameters = goal.indicatorParameter.split("\\");
  // Remove the "Key" or "Demand" parameter if present
  if (goalParameters[0] == "Key" || goalParameters[0] == "Demand") {
    goalParameters.shift()
  }

  for (let sibling of roadmap.goals) {
    let siblingParameters = sibling.indicatorParameter.split("\\");
    // Goals can be siblings despite one of them having a "Key" and the other a "Demand" parameter
    if (siblingParameters[0] == "Key" || siblingParameters[0] == "Demand") {
      siblingParameters.shift()
    }

    let isSibling = true;
    // Goals with different data units are not siblings
    if (goal.dataSeries?.unit != sibling.dataSeries?.unit) {
      isSibling = false;
    }
    // Goals on different levels are not siblings
    if (isSibling) {
      if (goalParameters.length != siblingParameters.length) {
        isSibling = false;
      }
    }
    // Goals with different parameters (except the last one) are not siblings
    if (isSibling) {
      for (let i = 0; i < goalParameters.length - 1; i++) {
        if (goalParameters[i] != siblingParameters[i]) {
          isSibling = false;
          break;
        }
      }
    }
    if (isSibling) {
      siblings.push(sibling);
    }
  }

  return siblings;
}