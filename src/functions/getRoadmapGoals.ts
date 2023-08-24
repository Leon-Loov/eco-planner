import { getSessionData } from "@/lib/session";
import { goalSorter } from "@/lib/sorters";
import prisma from "@/prismaClient";
import { Action, DataSeries, Goal } from "@prisma/client";
import { cookies } from "next/headers";

/**
 * Gets all goals for a roadmap.
 * 
 * Error handling should be done in calling function, if `error.code == 'P2025'` then roadmap was not found
 * or user does not have access to it.
 * @param roadmapId ID of the roadmap to get goals for
 * @returns Array of goals
 */
export default async function getRoadmapGoals(roadmapId: string) {
  const session = await getSessionData(cookies());

  let goals: (Goal & { actions: Action[], dataSeries: DataSeries | null })[] = [];

  // If user is admin, fetch regardless of access
  if (session.user?.isAdmin) {
    try {
      await prisma.roadmap.findUniqueOrThrow({
        where: { id: roadmapId },
        select: {
          goals: {
            include: {
              actions: true,
              dataSeries: true,
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { include: { users: { select: { id: true, username: true } } } },
              viewGroups: { include: { users: { select: { id: true, username: true } } } },
            }
          }
        }
      }).then((roadmap) => {
        goals = roadmap.goals;
      });

      goals.sort(goalSorter);

      return goals;
    } catch (error) {
      throw error;
    }
  }

  // If user is logged in, fetch goals if they have access to the roadmap
  if (session.user?.isLoggedIn) {
    try {
      await prisma.roadmap.findUniqueOrThrow({
        where: {
          id: roadmapId,
          OR: [
            { authorId: session.user.id },
            { editors: { some: { id: session.user.id } } },
            { viewers: { some: { id: session.user.id } } },
            { editGroups: { some: { users: { some: { id: session.user.id } } } } },
            { viewGroups: { some: { users: { some: { id: session.user.id } } } } },
            { viewGroups: { some: { name: 'Public' } } }
          ]
        },
        select: {
          goals: {
            include: {
              actions: true,
              dataSeries: true,
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { include: { users: { select: { id: true, username: true } } } },
              viewGroups: { include: { users: { select: { id: true, username: true } } } },
            }
          }
        }
      }).then((roadmap) => {
        goals = roadmap.goals;
      });

      goals.sort(goalSorter);

      return goals;
    } catch (error) {
      throw error;
    }
  }

  // If user is not logged in, only fetch goals if roadmap is public
  try {
    await prisma.roadmap.findUniqueOrThrow({
      where: {
        id: roadmapId,
        viewGroups: { some: { name: 'Public' } }
      },
      select: {
        goals: {
          include: {
            actions: true,
            dataSeries: true,
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          }
        }
      }
    }).then((roadmap) => {
      goals = roadmap.goals;
    });

    goals.sort(goalSorter);

    return goals;
  } catch (error) {
    throw error;
  }
}