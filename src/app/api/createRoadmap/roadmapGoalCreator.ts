import { RoadmapInput, GoalInput } from "@/types";
import { Prisma } from "@prisma/client";

export default function roadmapGoalCreator(
  roadmap: RoadmapInput & { goals?: GoalInput[]; },
  author: string,
  editors: { username: string }[],
  viewers: { username: string }[],
  editGroups: { name: string }[],
  viewGroups: { name: string }[],
) {
  if (!roadmap.goals?.length) {
    return undefined;
  }

  let output: Prisma.GoalCreateWithoutRoadmapsInput[] = [];

  roadmap.goals.forEach((goal, goalIndex) => {
    // The code for data series also exists in src/app/api/createGoal/route.ts, if one changes the other should be changed as well
    // Create data series
    let dataValues: Prisma.DataSeriesCreateWithoutGoalsInput = {
      author: { connect: { id: author } },
      unit: goal.dataUnit ?? "missing",
      scale: goal.dataScale,
    };
    // Assign values to data fields
    if (goal.dataSeries?.length && goal.dataSeries.length <= 31) {
      // The keys for the data values are `val2020`, `val2021`, etc. up to `val2050
      let keys = goal.dataSeries.map((_, index) => `val${index + 2020}`);
      keys.forEach((key, index) => {
        let value = parseFloat(goal.dataSeries![index]);
        // If the value is a number, add it to the dataValues object
        if (!isNaN(value)) {
          // This mess assures TypeScript that we are not trying to assign numbers to any of the
          // other fields in the dataSeries object.
          dataValues[key as keyof Omit<
            Prisma.DataSeriesCreateWithoutGoalsInput,
            'author' | 'unit' | 'scale' | 'id' | 'createdAt' | 'updatedAt' |
            'editors' | 'viewers' | 'editGroups' | 'viewGroups'
          >] = value;
        }
      });
    }
    // If the data series is invalid, throw an error
    else if (!goal.dataSeries?.length || goal.dataSeries!.length > 31) {
      throw new Error(`Invalid nested data series at index ${goalIndex}`, { cause: 'nestedGoalCreation' })
    }

    // Format and add to output
    output.push({
      name: goal.name,
      description: goal.description,
      nationalRoadmapId: goal.nationalRoadmapId,
      nationalGoalId: goal.nationalGoalId,
      indicatorParameter: goal.indicatorParameter,
      dataSeries: {
        create: dataValues,
      },
      author: { connect: { id: author } },
      editors: { connect: editors },
      viewers: { connect: viewers },
      editGroups: { connect: editGroups },
      viewGroups: { connect: viewGroups },
    })
  });

  return output;
}