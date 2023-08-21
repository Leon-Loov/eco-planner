import { getSessionData } from "@/lib/session"
import prisma from "@/prismaClient";
import { roadmapSorter } from "@/lib/sorters";
import { Goal, Roadmap } from "@prisma/client";
import { cookies } from "next/headers";

export default async function getRoadmaps() {
  const session = await getSessionData(cookies());

  let roadmaps: (Roadmap & {goals: Goal[]})[] = [];

  // If user is admin, get all roadmaps
  if (session.user?.isAdmin) {
    try {
      roadmaps = await prisma.roadmap.findMany({
        include: {
          goals: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: true,
          viewGroups: true,
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
      let authoredRoadmaps = await prisma.roadmap.findMany({
        where: {
          authorId: session.user.id
        },
        include: {
          goals: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: true,
          viewGroups: true,
        }
      });

      // Get all roadmaps the user has edit access to
      let editableRoadmaps = await prisma.roadmap.findMany({
        where: {
          OR: [
            { editors: { some: { id: session.user.id } } },
            { editGroups: { some: { users: { some: { id: session.user.id } } } } },
          ]
        },
        include: {
          goals: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
        }
      });

      // Get all roadmaps the user has view access to
      let visibleRoadmaps = await prisma.roadmap.findMany({
        where: {
          OR: [
            { viewers: { some: { id: session.user.id } } },
            { viewGroups: { some: { users: { some: { id: session.user.id } } } } },
          ]
        },
        include: {
          goals: true,
          author: { select: { id: true, username: true } },
        }
      });

      // Join roadmaps into one array, but don't return yet; it's done after fetching public roadmaps
      roadmaps = [...authoredRoadmaps, ...editableRoadmaps, ...visibleRoadmaps]
    } catch (error) {
      console.error(error);
      console.log('Error fetching user roadmaps');
      return []
    }
  }

  // Get all public roadmaps
  try {
    let publicRoadmaps = await prisma.roadmap.findMany({
      where: {
        viewGroups: { some: { name: 'Public' } }
      },
      include: {
        goals: true,
        author: { select: { id: true, username: true } },
      }
    });

    // Join roadmaps into one array
    roadmaps = [...roadmaps, ...publicRoadmaps]
  } catch (error) {
    console.error(error);
    console.log('Error fetching public roadmaps');
    return []
  }

  // Remove duplicate roadmaps
  roadmaps = roadmaps.filter((roadmap, index, self) =>
    index === self.findIndex((t) => (
      t.id === roadmap.id
    ))
  );

  // Sort roadmaps
  roadmaps.sort(roadmapSorter);

  return roadmaps;
}