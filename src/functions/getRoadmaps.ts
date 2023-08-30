import { getSessionData } from "@/lib/session"
import prisma from "@/prismaClient";
import { roadmapSorter } from "@/lib/sorters";
import { Goal, Roadmap } from "@prisma/client";
import { cookies } from "next/headers";

export default async function getRoadmaps() {
  const session = await getSessionData(cookies());

  let roadmaps: (
    Roadmap & {
      goals: Goal[],
      author: { id: string, username: string },
      editors: { id: string, username: string }[],
      viewers: { id: string, username: string }[],
      editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    })[] = [];

  // If user is admin, get all roadmaps
  if (session.user?.isAdmin) {
    try {
      roadmaps = await prisma.roadmap.findMany({
        include: {
          goals: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching admin roadmaps');
      return []
    }

    // Sort roadmaps
    roadmaps.sort(roadmapSorter);

    return roadmaps;
  }

  // If user is logged in, get all roadmaps they have access to
  if (session.user?.isLoggedIn) {
    try {
      // Get all roadmaps authored by the user
      roadmaps = await prisma.roadmap.findMany({
        where: {
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
          goals: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching user roadmaps');
      return []
    }

    // Sort roadmaps
    roadmaps.sort(roadmapSorter);

    return roadmaps;
  }

  // Get all public roadmaps
  try {
    roadmaps = await prisma.roadmap.findMany({
      where: {
        viewGroups: { some: { name: 'Public' } }
      },
      include: {
        goals: true,
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
  } catch (error) {
    console.error(error);
    console.log('Error fetching public roadmaps');
    return []
  }

  // Sort roadmaps
  roadmaps.sort(roadmapSorter);

  return roadmaps;
}