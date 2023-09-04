import { Action, Goal, Roadmap } from "@prisma/client";

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
 * Sorts goals alphabetically by name
 */
export function goalSorter(a: Goal, b: Goal) {
  return collator.compare(a.name, b.name);
}

/**
 * Sorts actions alphabetically by name
 */
export function actionSorter(a: Action, b: Action) {
  return collator.compare(a.name, b.name);
}