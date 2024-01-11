import { DataSeries, Prisma, RoadmapType } from "@prisma/client";

/** An object that implements the AccessControlled interface can be checked with the accessChecker function. */
export interface AccessControlled {
  author: { id: string, username: string },
  editors: { id: string, username: string }[],
  viewers: { id: string, username: string }[],
  editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
};

/** Enum for the different access levels returned by the accessChecker function. */
export enum AccessLevel {
  None = "",
  View = "VIEW",
  Edit = "EDIT",
  Admin = "ADMIN",
};

/** The format of the data needed to create new roadmap metadata. */
export type MetaRoadmapInput = Omit<
  Prisma.MetaRoadmapCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'author' | 'editors' |
  'viewers' | 'editGroups' | 'viewGroups' | 'comments' | 'links' |
  'roadmapVersions' | 'parentRoadmap' | 'childRoadmaps'
> & {
  links?: { url: string, description?: string }[] | undefined;
  // Accepts lists of UUIDs for all of the following, to link them to the roadmap (optional)
  editors?: string[] | undefined;
  viewers?: string[] | undefined;
  editGroups?: string[] | undefined;
  viewGroups?: string[] | undefined;
  // UUID for the parent meta roadmap (if any)
  parentRoadmapId?: string | undefined;
};

/** The format of the data needed to create a new roadmap version. */
export type RoadmapInput = Omit<
  Prisma.RoadmapCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'goals' | 'author' | 'editors' |
  'viewers' | 'editGroups' | 'viewGroups' | 'comments' | 'metaRoadmap'
> & {
  // Accepts lists of UUIDs for all of the following, to link them to the roadmap (optional)
  editors?: string[] | undefined;
  viewers?: string[] | undefined;
  editGroups?: string[] | undefined;
  viewGroups?: string[] | undefined;
  // UUID for the meta roadmap this roadmap belongs to
  metaRoadmapId: string;
  inheritFromId?: string | undefined;
};

/** The format of the data needed to create a new goal. */
export type GoalInput = Omit<
  Prisma.GoalCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'roadmap' | 'author' | 'dataSeries' | 'links' | 'comments' | 'actions'
> & {
  // This will be turned into an actual dataSeries object by the API
  // The expected input is a stringified array of floats
  dataSeries: string[];
  // The unit of measurement for the data series
  dataUnit: string;
  dataScale?: string | undefined;
  links?: { url: string, description?: string }[] | undefined;
  // UUID for the roadmap this goal belongs to
  roadmapId: string;
};

/** The format of the data needed to create a new action. */
export type ActionInput = Omit<
  Prisma.ActionCreateInput,
  'id' | 'createdAt' | 'updatedAt' | 'goal' | 'author' | 'notes' | 'links' | 'comments'
> & {
  links?: { url: string, description?: string }[] | undefined;
  // UUID for the goal this action belongs to
  goalId: string;
};

/** A type with only the data fields of the data series object. Not dynamic, so might need to be updated if the data series object changes. */
export type DataSeriesDataFields = Omit<
  DataSeries,
  'author' | 'unit' | 'scale' | 'id' | 'createdAt' | 'updatedAt' |
  'editors' | 'viewers' | 'editGroups' | 'viewGroups' | 'authorId' | 'goalId'
>;

let dataFields: (keyof DataSeriesDataFields)[] = []
for (let i = 2020; i <= 2050; i++) {
  dataFields.push(`val${i}` as keyof DataSeriesDataFields)
};
/** An array containing the keys of the actual data fields in the data series object. Not dynamic, so might need to be updated if the data series object changes. */
export const dataSeriesDataFieldNames = dataFields;