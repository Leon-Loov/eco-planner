import { Action, Comment, Goal, Roadmap } from "@prisma/client";

// Used for alphabetical sorting, we use Swedish locale and ignore case, but it can be changed here
const collator = new Intl.Collator('se', { numeric: true, sensitivity: 'accent' });

/**
 * Sorts roadmaps by whether they are national or not, then alphabetically by name
 */
export function roadmapSorter(a: Roadmap, b: Roadmap) {
  if (a.isNational === b.isNational) {
    return collator.compare(a.name, b.name);
  }

  return a.isNational ? -1 : 1;
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