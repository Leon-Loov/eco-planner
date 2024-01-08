import { Action, Comment, Goal, Roadmap } from "@prisma/client";

// Used for alphabetical sorting, we use Swedish locale and ignore case, but it can be changed here
const collator = new Intl.Collator('se', { numeric: true, sensitivity: 'accent' });

/**
 * Sorts roadmaps by type (national first), then alphabetically by name
 */
export function roadmapSorter(a: Roadmap, b: Roadmap) {
  switch (a.type) {
    case 'NATIONAL':
      if (b.type === 'NATIONAL') {
        return collator.compare(a.name, b.name);
      }
      return -1;
    case 'REGIONAL':
      if (b.type === 'REGIONAL') {
        return collator.compare(a.name, b.name);
      }
      return b.type === 'NATIONAL' ? 1 : -1;
    case 'LOCAL':
      if (b.type === 'LOCAL') {
        return collator.compare(a.name, b.name);
      }
      return (b.type === 'NATIONAL' || b.type === 'REGIONAL') ? 1 : -1;
    default:
      if (b.type === 'NATIONAL' || b.type === 'REGIONAL' || b.type === 'LOCAL') {
        return 1;
      }
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