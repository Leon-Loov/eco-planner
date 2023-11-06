import { DataSeries } from "@prisma/client";

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
  county: string | undefined;
  municipality: string | undefined;
  // Accepts lists of UUIDs for all of the following, to link them to the roadmap (optional)
  editors: string[] | undefined;
  viewers: string[] | undefined;
  editGroups: string[] | undefined;
  viewGroups: string[] | undefined;
}

/** The format of the data needed to create a new goal. */
export type GoalInput = {
  name?: string | undefined;
  description?: string | undefined;
  // IDs are UUIDs and thus strings, not numbers
  nationalRoadmapId?: string | undefined;
  nationalGoalId?: string | undefined;
  indicatorParameter: string;
  // This will be turned into an actual dataSeries object by the API
  // The expected input is a stringified array of floats
  dataSeries: string[];
  // The unit of measurement for the data series, used when creating a new data series
  dataUnit: string;
  dataScale?: string | undefined;
  // In case the user wants to reference an existing data series instead of creating a new one
  // If both dataSeries and dataSeriesId are provided, dataSeriesId takes precedence
  // Currently disabled
  // dataSeriesId: string | undefined;
  // UUID for the roadmap this goal belongs to
  roadmapId: string;
  // Accepts lists of UUIDs for all of the following, to link them to the goal (optional)
  editors?: string[] | undefined;
  viewers?: string[] | undefined;
  editGroups?: string[] | undefined;
  viewGroups?: string[] | undefined;
};

/** The format of the data needed to create a new action. */
export type ActionInput = {
  name: string;
  description: string | undefined;
  costEfficiency: string | undefined;
  expectedOutcome: string | undefined;
  startYear: number | undefined;
  endYear: number | undefined;
  projectManager: string | undefined;
  relevantActors: string | undefined;
  // UUID for the goal this goal belongs to
  goalId: string;
  // Accepts lists of UUIDs for all of the following, to link them to the action (optional)
  editors: string[] | null;
  viewers: string[] | null;
  editGroups: string[] | null;
  viewGroups: string[] | null;
}

/** A type with only the data fields of the data series object. Not dynamic, so might need to be updated if the data series object changes. */
export type DataSeriesDataFields = Omit<
  DataSeries,
  'author' | 'unit' | 'scale' | 'id' | 'createdAt' | 'updatedAt' |
  'editors' | 'viewers' | 'editGroups' | 'viewGroups' | 'authorId'
>;

let dataFields: (keyof DataSeriesDataFields)[] = []
for (let i = 2020; i <= 2050; i++) {
  dataFields.push(`val${i}` as keyof DataSeriesDataFields)
}
/** An array containing the keys of the actual data fields in the data series object. Not dynamic, so might need to be updated if the data series object changes. */
export const dataSeriesDataFieldNames = dataFields;