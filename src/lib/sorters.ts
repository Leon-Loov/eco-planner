import { Action, Comment, Goal, MetaRoadmap, Roadmap, RoadmapType } from "@prisma/client";

// Used for alphabetical sorting, we use Swedish locale and ignore case, but it can be changed here
const collator = new Intl.Collator('sv', { numeric: true, sensitivity: 'accent', caseFirst: 'upper' });

/**
 * Sorts meta roadmaps by type (national first), then alphabetically by name
 */
export function metaRoadmapSorter(a: MetaRoadmap, b: MetaRoadmap) {
  // Higher priority roadmaps are first in the values array, so we reverse it to
  // account for the fact that indexOf() returns -1 if the element is not found, which
  // should be considered lower priority than any other index
  let values = Object.values(RoadmapType);
  values.reverse();
  const aIndex = values.indexOf(a.type);
  const bIndex = values.indexOf(b.type);
  // Larger index means higher priority (closer to national level)
  if (aIndex > bIndex) {
    return -1;
  } else if (aIndex < bIndex) {
    return 1;
  } else {
    return collator.compare(a.name, b.name);
  }
}

/**
 * Sorts roadmaps by type (national first), then alphabetically by name
 */
export function roadmapSorter(a: Roadmap & { metaRoadmap: MetaRoadmap }, b: Roadmap & { metaRoadmap: MetaRoadmap }) {
  // Higher priority roadmaps are first in the values array, so we reverse it to
  // account for the fact that indexOf() returns -1 if the element is not found, which
  // should be considered lower priority than any other index
  let values = Object.values(RoadmapType);
  values.reverse();
  const aIndex = values.indexOf(a.metaRoadmap.type);
  const bIndex = values.indexOf(b.metaRoadmap.type);
  // Larger index means higher priority (closer to national level)
  // Negative return values means a is placed before b in the sorted array
  if (aIndex > bIndex) {
    return -1;
  } else if (aIndex < bIndex) {
    return 1;
  } else {
    return collator.compare(a.metaRoadmap.name, b.metaRoadmap.name);
  }
}

/**
 * Sorts goals alphabetically by name.
 * If no name is provided, the indicator parameter is used instead.
 */
export function goalSorter(a: Goal, b: Goal) {
  return collator.compare(a.name || a.indicatorParameter, b.name || b.indicatorParameter);
}

/**
 * Sorts actions alphabetically by name
 */
export function actionSorter(a: Action, b: Action) {
  return collator.compare(a.name, b.name);
}

/**
 * Sorts actions by start year, then by end year, then by name
 */
export function actionGraphSorter(a: { x: string, y: number[] }, b: { x: string, y: number[] }) {
  // Strt year
  if ((a.y[0] || 0) < (b.y[0] || 0)) {
    return -1;
  } else if ((a.y[0] || 0) > (b.y[0] || 0)) {
    return 1;
  } else {
    // End year
    if ((a.y[1] || 0) < (b.y[1] || 0)) {
      return -1;
    } else if ((a.y[1] || 0) > (b.y[1] || 0)) {
      return 1;
    } else {
      // Name
      return collator.compare(a.x, b.x);
    }
  }
}

/**
 * Sorts comments by time created, newest first.
 * Since unstable_cache returns stringified dates we need to convert them to Date objects first.
 */
export function commentSorter(a: Comment, b: Comment) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

/**
 * Sorts areas alphabetically by name, but putting the national area (code: "00") first
 */
export function areaSorter(a: [name: string, code: string], b: [name: string, code: string]) {
  if (a[1] === "00" && b[1] === "00") {
    return collator.compare(a[0], b[0]);
  }
  else if (a[1] === "00") {
    return -1;
  } else if (b[1] === "00") {
    return 1;
  } else {
    return collator.compare(a[0], b[0]);
  }
}
