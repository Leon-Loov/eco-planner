import { getSessionData } from "@/lib/session"
import { actionSorter } from "@/lib/sorters";
import prisma from "@/prismaClient";
import { AccessControlled } from "@/types";
import { Action, Comment, DataSeries, Goal, Link } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

// TODO: Check if we need to include data series unit as a key to make sure we don't get the wrong goal

/**
 * Gets specified goal and all actions for that goal.
 * 
 * Returns null if goal is not found or user does not have access to it. Also returns null on error.
 * @param roadmapId ID of the roadmap to search for the goal in
 * @param indicatorParameter Indicator parameter of the goal to get
 * @returns Goal object with actions
 */
export default async function getGoalByIndicator(roadmapId: string, indicatorParameter: string, unit?: string) {
  const session = await getSessionData(cookies());
  return getCachedGoal(roadmapId, indicatorParameter, unit, session.user?.id ?? '')
}

/**
 * Caches the specified goal and all actions for that goal.
 * Cache is invalidated when `revalidateTag()` is called on one of its tags `['database', 'goal', 'action', 'dataSeries']`, which is done in relevant API routes.
 * @param id ID of the roadmap to search for the goal in
 * @param indicatorParameter Indicator parameter of the goal to cache
 * @param userId ID of user. Isn't passed in, but is used to associate the cache with the user.
 */
const getCachedGoal = unstable_cache(
  async (roadmapId: string, indicatorParameter: string, unit: string | undefined, userId) => {
    const session = await getSessionData(cookies());

    let goal: Goal & {
      _count: { actions: number }
      dataSeries: DataSeries | null,
      actions: (Action & {
        author: { id: string, username: string },
      })[],
      roadmap: AccessControlled & { id: string, version: number, targetVersion: number | null, metaRoadmap: { id: string, name: string, parentRoadmapId: string | null } },
      links: Link[],
      comments?: (Comment & { author: { id: string, username: string } })[],
      author: { id: string, username: string },
    } | null = null;

    // If user is admin, always get the goal
    if (session.user?.isAdmin) {
      try {
        goal = await prisma.goal.findFirst({
          where: {
            indicatorParameter: indicatorParameter,
            // If unit is specified, get a goal with the specified unit
            ...(unit ? { dataSeries: { unit: unit } } : {}),
            roadmap: { id: roadmapId },
          },
          include: {
            _count: { select: { actions: true } },
            dataSeries: true,
            actions: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
            roadmap: {
              select: {
                id: true,
                version: true,
                targetVersion: true,
                metaRoadmap: {
                  select: {
                    id: true,
                    name: true,
                    parentRoadmapId: true,
                  },
                },
                author: { select: { id: true, username: true } },
                editors: { select: { id: true, username: true } },
                viewers: { select: { id: true, username: true } },
                editGroups: { select: { id: true, name: true, users: { select: { id: true, username: true } } } },
                viewGroups: { select: { id: true, name: true, users: { select: { id: true, username: true } } } },
              },
            },
            links: true,
            comments: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
            author: { select: { id: true, username: true } },
          }
        });
      } catch (error) {
        console.log(error);
        console.log('Error fetching admin goal');
        return null
      }

      goal?.actions.sort(actionSorter)

      return goal;
    }

    // If user is logged in, get the goal if they have access to it
    if (session.user?.isLoggedIn) {
      try {
        goal = await prisma.goal.findFirst({
          where: {
            indicatorParameter: indicatorParameter,
            ...(unit ? { dataSeries: { unit: unit } } : {}),
            roadmap: {
              id: roadmapId,
              OR: [
                { authorId: session.user.id },
                { editors: { some: { id: userId } } },
                { viewers: { some: { id: userId } } },
                { editGroups: { some: { users: { some: { id: userId } } } } },
                { viewGroups: { some: { users: { some: { id: userId } } } } },
                { viewGroups: { some: { name: 'Public' } } }
              ]
            }
          },
          include: {
            _count: { select: { actions: true } },
            dataSeries: true,
            actions: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
            roadmap: {
              select: {
                id: true,
                version: true,
                targetVersion: true,
                metaRoadmap: {
                  select: {
                    id: true,
                    name: true,
                    parentRoadmapId: true,
                  },
                },
                author: { select: { id: true, username: true } },
                editors: { select: { id: true, username: true } },
                viewers: { select: { id: true, username: true } },
                editGroups: { select: { id: true, name: true, users: { select: { id: true, username: true } } } },
                viewGroups: { select: { id: true, name: true, users: { select: { id: true, username: true } } } },
              },
            },
            links: true,
            comments: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
            author: { select: { id: true, username: true } },
          }
        });
      } catch (error) {
        console.log(error);
        console.log('Error fetching user goal');
        return null
      }

      goal?.actions.sort(actionSorter)

      return goal;
    }

    // If user is not logged in, get the goal if it is public
    try {
      goal = await prisma.goal.findFirst({
        where: {
          indicatorParameter: indicatorParameter,
          ...(unit ? { dataSeries: { unit: unit } } : {}),
          roadmap: {
            id: roadmapId,
            viewGroups: { some: { name: 'Public' } }
          }
        },
        include: {
          _count: { select: { actions: true } },
          dataSeries: true,
          actions: {
            include: {
              author: { select: { id: true, username: true } },
            },
          },
          roadmap: {
            select: {
              id: true,
              version: true,
              targetVersion: true,
              metaRoadmap: {
                select: {
                  id: true,
                  name: true,
                  parentRoadmapId: true,
                },
              },
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { select: { id: true, name: true, users: { select: { id: true, username: true } } } },
              viewGroups: { select: { id: true, name: true, users: { select: { id: true, username: true } } } },
            },
          },
          links: true,
          comments: {
            include: {
              author: { select: { id: true, username: true } },
            },
          },
          author: { select: { id: true, username: true } },
        }
      });
    } catch (error) {
      console.log(error);
      console.log('Error fetching public goal');
      return null
    }

    goal?.actions.sort(actionSorter)

    return goal;
  },
  ['goalByIndicator'],
  { revalidate: 600, tags: ['database', 'goal', 'action', 'dataSeries'] }
);