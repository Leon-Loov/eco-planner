import { Action, Comment, Goal, Roadmap, RoadmapType } from "@prisma/client";

// Used for alphabetical sorting, we use Swedish locale and ignore case, but it can be changed here
const collator = new Intl.Collator('sv', { numeric: true, sensitivity: 'accent', caseFirst: 'upper' });

/**
 * Sorts roadmaps by type (national first), then alphabetically by name
 */
export function roadmapSorter(a: Roadmap, b: Roadmap) {
  // Higher priority roadmaps are first in the values array, so we reverse it to
  // account for the fact that indexOf() returns -1 if the element is not found, which
  // should be considered lower priority than any other index
  let values = Object.values(RoadmapType);
  values.reverse();
  const aIndex = values.indexOf(a.type);
  const bIndex = values.indexOf(b.type);
  // Larger index means higher priority (closer to national level)
  // Negative return values are placed before positive ones in the sorted array
  if (aIndex > bIndex) {
    return -1;
  } else if (aIndex < bIndex) {
    return 1;
  } else {
    return collator.compare(a.name, b.name);
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
 * Sorts comments by time created, newest first.
 * Since unstable_cache returns stringified dates we need to convert them to Date objects first.
 */
export function commentSorter(a: Comment, b: Comment) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}