import { Prisma } from "@prisma/client";

function exclude<Model, Key extends keyof Model>(
  model: Model,
  keys: Key[]
): Omit<Model, Key> {
  return Object.fromEntries(
    Object.entries(model!).filter(([key]) => !keys.includes(key as Key))
  ) as Omit<Model, Key>;
}

export type RoadmapInput = {
  name: string;
  isNational: boolean | undefined;
  // Accepts lists of UUIDs for all of the following, to link them to the roadmap (optional)
  editors: string[] | undefined;
  viewers: string[] | undefined;
  editGroups: string[] | undefined;
  viewGroups: string[] | undefined;
}

export type GoalInput = {
  name: string;
  goalObject: string;
  // External IDs are UUIDs and thus strings, not numbers
  nationalRoadmapId: string | undefined;
  indicatorParameter: string;
  // This will be turned into an actual dataSeries object by the API
  // The expected input is a stringified array of floats
  dataSeries: string[] | undefined;
  // The unit of measurement for the data series, used when creating a new data series
  dataUnit: string | undefined;
  // In case the user wants to reference an existing data series instead of creating a new one
  // If both dataSeries and dataSeriesId are provided, dataSeriesId takes precedence
  dataSeriesId: string | undefined;
  // UUID for the roadmap this goal belongs to
  roadmapId: string | undefined;
  // Accepts lists of UUIDs for all of the following, to link them to the goal (optional)
  editors: string[] | undefined;
  viewers: string[] | undefined;
  editGroups: string[] | undefined;
  viewGroups: string[] | undefined;
};

export type ActionInput = {
  name: string;
  description: string;
  costEfficiency: string;
  expectedOutcome: string;
  projectManager: string;
  relevantActors: string;
  // UUID for the goal this goal belongs to
  goalId: string | null;
  // Accepts lists of UUIDs for all of the following, to link them to the action (optional)
  editors: string[] | null;
  viewers: string[] | null;
  editGroups: string[] | null;
  viewGroups: string[] | null;
}

const goalWithRelations = Prisma.validator<Prisma.GoalArgs>()({
  include: {
    dataSeries: true,
    author: true,
    editors: true,
    viewers: true,
    editGroups: true,
    viewGroups: true,
    actions: true,
    roadmaps: true,
  },
});
export type GoalWithRelations = Prisma.GoalGetPayload<typeof goalWithRelations>;