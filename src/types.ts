/** An object that implements the AccessControlled interface can be checked with the accessChecker function. */
export interface AccessControlled {
  author: { id: string, username: string },
  editors: { id: string, username: string }[],
  viewers: { id: string, username: string }[],
  editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
}

/** Enum for the different access levels returned by the accessChecker function. */
export enum AccessLevel {
  None = "",
  View = "VIEW",
  Edit = "EDIT",
  Admin = "ADMIN",
}

/** The format of the data needed to create a new roadmap. */
export type RoadmapInput = {
  name: string;
  isNational: boolean | undefined;
  // Accepts lists of UUIDs for all of the following, to link them to the roadmap (optional)
  editors: string[] | undefined;
  viewers: string[] | undefined;
  editGroups: string[] | undefined;
  viewGroups: string[] | undefined;
}

/** The format of the data needed to create a new goal. */
export type GoalInput = {
  name: string;
  goalObject: string;
  // IDs are UUIDs and thus strings, not numbers
  nationalRoadmapId: string | undefined;
  nationalGoalId: string | undefined;
  indicatorParameter: string;
  // This will be turned into an actual dataSeries object by the API
  // The expected input is a stringified array of floats
  dataSeries: string[] | undefined;
  // The unit of measurement for the data series, used when creating a new data series
  dataUnit: string | undefined;
  // In case the user wants to reference an existing data series instead of creating a new one
  // If both dataSeries and dataSeriesId are provided, dataSeriesId takes precedence
  // Currently disabled
  // dataSeriesId: string | undefined;
  // UUID for the roadmap this goal belongs to
  roadmapId: string | undefined;
  // Accepts lists of UUIDs for all of the following, to link them to the goal (optional)
  editors: string[] | undefined;
  viewers: string[] | undefined;
  editGroups: string[] | undefined;
  viewGroups: string[] | undefined;
};

/** The format of the data needed to create a new action. */
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