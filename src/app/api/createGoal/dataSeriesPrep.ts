import { GoalInput, dataSeriesDataFieldNames } from "@/types";
import { Prisma } from "@prisma/client";

/**
 * Converts GoalInput data into the format needed to create a data series.
 * 
 * Returns null if the data series is invalid.
 * @param goal `GoalInput` object
 * @param authorId ID of the user creating the goal, a UUID string
 * @returns `Prisma.DataSeriesCreateWithoutGoalInput` object or `null`
 */
export default function dataSeriesPrep(
  goal: GoalInput,
  authorId: string,
) {
  // Text fields
  let dataValues: Prisma.DataSeriesCreateWithoutGoalInput = {
    author: { connect: { id: authorId } },
    unit: goal.dataUnit ?? "missing",
    scale: goal.dataScale,
  };
  // Data value fields
  if (goal.dataSeries?.length && goal.dataSeries.length <= dataSeriesDataFieldNames.length) {
    // The keys for the data values are `val2020`, `val2021`, etc. up to `val2050`
    let keys = goal.dataSeries.map((_, index) => `val${index + 2020}`);
    keys.forEach((key, index) => {
      let value: number | null = parseFloat(goal.dataSeries![index]);
      // If the value is empty, set it to null
      if (!goal.dataSeries![index] && goal.dataSeries![index] != "0") {
        value = null;
      }
      // If the value is a number or null, add it to the dataValues object
      if (value === null || !isNaN(value)) {
        // This mess assures TypeScript that we are not trying to assign numbers to any of the
        // other fields in the dataSeries object.
        dataValues[key as keyof Omit<
          Prisma.DataSeriesCreateWithoutGoalInput,
          'author' | 'unit' | 'scale' | 'id' | 'createdAt' | 'updatedAt' |
          'editors' | 'viewers' | 'editGroups' | 'viewGroups'
        >] = value;
      }
    });
  }
  // If the data series is invalid, return an error
  else {
    return null;
  }

  return dataValues;
}