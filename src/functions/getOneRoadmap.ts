import { getSessionData } from "@/lib/session"
import { goalSorter } from "@/lib/sorters";
import prisma from "@/prismaClient";
import { Action, DataSeries, Goal, Roadmap } from "@prisma/client";
import { cookies } from "next/headers";

/**
 * Gets specified roadmap and all goals for that roadmap.
 * 
 * Returns null if roadmap is not found or user does not have access to it. Also returns null on error.
 * @param id ID of the roadmap to get
 * @returns Roadmap object with goals
 */
export default async function getOneRoadmap(id: string) {
  const session = await getSessionData(cookies());

  let roadmap: Roadmap & {
    goals: (Goal & {
      actions: (Action & {
        author: { id: string, username: string },
        editors: { id: string, username: string }[],
        viewers: { id: string, username: string }[],
        editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
        viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      })[],
      dataSeries: DataSeries | null,
      author: { id: string, username: string },
      editors: { id: string, username: string }[],
      viewers: { id: string, username: string }[],
      editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    })[],
    author: { id: string, username: string },
    editors: { id: string, username: string }[],
    viewers: { id: string, username: string }[],
    editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  } | null = null;

  // If user is admin, always get the roadmap
  if (session.user?.isAdmin) {
    try {
      roadmap = await prisma.roadmap.findUnique({
        where: { id },
        include: {
          goals: {
            include: {
              actions: {
                include: {
                  author: { select: { id: true, username: true } },
                  editors: { select: { id: true, username: true } },
                  viewers: { select: { id: true, username: true } },
                  editGroups: { include: { users: { select: { id: true, username: true } } } },
                  viewGroups: { include: { users: { select: { id: true, username: true } } } },
                },
              },
              dataSeries: true,
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { include: { users: { select: { id: true, username: true } } } },
              viewGroups: { include: { users: { select: { id: true, username: true } } } },
            }
          },
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching admin roadmap');
      return null
    }

    roadmap?.goals.sort(goalSorter);

    return roadmap;
  }

  // If user is logged in, get the roadmap if they have access to it
  if (session.user?.isLoggedIn) {
    try {
      roadmap = await prisma.roadmap.findUnique({
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
          goals: {
            include: {
              actions: {
                include: {
                  author: { select: { id: true, username: true } },
                  editors: { select: { id: true, username: true } },
                  viewers: { select: { id: true, username: true } },
                  editGroups: { include: { users: { select: { id: true, username: true } } } },
                  viewGroups: { include: { users: { select: { id: true, username: true } } } },
                },
              },
              dataSeries: true,
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { include: { users: { select: { id: true, username: true } } } },
              viewGroups: { include: { users: { select: { id: true, username: true } } } },
            }
          },
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching user roadmap');
      return null
    }

    roadmap?.goals.sort(goalSorter);

    return roadmap;
  }

  // If user is not logged in, get the roadmap if it is public
  try {
    roadmap = await prisma.roadmap.findUnique({
      where: {
        id,
        OR: [
          { viewGroups: { some: { name: 'Public' } } }
        ]
      },
      include: {
        goals: {
          include: {
            actions: {
              include: {
                author: { select: { id: true, username: true } },
                editors: { select: { id: true, username: true } },
                viewers: { select: { id: true, username: true } },
                editGroups: { include: { users: { select: { id: true, username: true } } } },
                viewGroups: { include: { users: { select: { id: true, username: true } } } },
              },
            },
            dataSeries: true,
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          }
        },
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
  } catch (error) {
    console.error(error);
    console.log('Error fetching public roadmap');
    return null
  }

  roadmap?.goals.sort(goalSorter);

  return roadmap;
}