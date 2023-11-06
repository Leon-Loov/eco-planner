import { getSessionData } from "@/lib/session"
import { actionSorter } from "@/lib/sorters";
import prisma from "@/prismaClient";
import { Action, DataSeries, Goal } from "@prisma/client";
import { cookies } from "next/headers";

/**
 * Gets specified goal and all actions for that goal.
 * 
 * Returns null if goal is not found or user does not have access to it. Also returns null on error.
 * @param id ID of the goal to get
 * @returns Goal object with actions
 */
export default async function getOneGoal(id: string) {
  const session = await getSessionData(cookies());

  let goal: Goal & {
    dataSeries: DataSeries | null,
    actions: Action[],
    author: { id: string, username: string },
    editors: { id: string, username: string }[],
    viewers: { id: string, username: string }[],
    editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  } | null = null;

  // If user is admin, always get the goal
  if (session.user?.isAdmin) {
    try {
      goal = await prisma.goal.findUnique({
        where: { id },
        include: {
          dataSeries: true,
          actions: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching admin goal');
      return null
    }

    goal?.actions.sort(actionSorter)

    return goal;
  }

  // If user is logged in, get the goal if they have access to it
  if (session.user?.isLoggedIn) {
    try {
      goal = await prisma.goal.findUnique({
        where: {
          id,
          OR: [
            { authorId: session.user.id },
            { editors: { some: { id: session.user.id } } },
            { viewers: { some: { id: session.user.id } } },
            { editGroups: { some: { users: { some: { id: session.user.id } } } } },
            { viewGroups: { some: { users: { some: { id: session.user.id } } } } },
            { viewGroups: { some: { name: 'Public' } } }
          ]
        },
        include: {
          dataSeries: true,
          actions: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching user goal');
      return null
    }

    goal?.actions.sort(actionSorter)

    return goal;
  }

  // If user is not logged in, get the goal if it is public
  try {
    goal = await prisma.goal.findUnique({
      where: {
        id,
        OR: [
          { viewGroups: { some: { name: 'Public' } } }
        ]
      },
      include: {
        dataSeries: true,
        actions: true,
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
  } catch (error) {
    console.error(error);
    console.log('Error fetching public goal');
    return null
  }

  goal?.actions.sort(actionSorter)

  return goal;
}