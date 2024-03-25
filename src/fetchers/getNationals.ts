'use server';

import { getSessionData } from "@/lib/session"
import prisma from "@/prismaClient";
import { roadmapSorter } from "@/lib/sorters";
import { MetaRoadmap, Roadmap, RoadmapType } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

/**
 * Gets all national roadmaps the user has access to, as well as the ids, names, and indicator parameters of all goals in those roadmaps.
 * 
 * Returns an empty array if no roadmaps are found or user does not have access to any. Also returns an empty array on error.
 * @returns Array of roadmaps
 */
export default async function getNationals() {
  const session = await getSessionData(cookies());
  return getCachedRoadmaps(session.user?.id ?? '');
}

/**
 * Caches all national roadmaps the user has access to.
 * Cache is invalidated when `revalidateTag()` is called on one of its tags `['database', 'roadmap', 'goal']`, which is done in relevant API routes.
 * @param userId ID of user. Isn't passed in, but is used to associate the cache with the user.
 */
const getCachedRoadmaps = unstable_cache(
  async (userId) => {
    const session = await getSessionData(cookies());

    let roadmaps: (
      Roadmap & {
        metaRoadmap: MetaRoadmap
        goals: {
          id: string,
          name: string | null,
          indicatorParameter: string,
        }[],
        author: { id: string, username: string },
        editors: { id: string, username: string }[],
        viewers: { id: string, username: string }[],
        editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
        viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      }
    )[] = [];

    // If user is admin, get all roadmaps
    if (session.user?.isAdmin) {
      try {
        roadmaps = await prisma.roadmap.findMany({
          where: { metaRoadmap: { type: RoadmapType.NATIONAL } },
          include: {
            metaRoadmap: true,
            goals: { select: { id: true, name: true, indicatorParameter: true } },
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          }
        });
      } catch (error) {
        console.log(error);
        console.log('Error fetching admin roadmaps');
        return [];
      }

      // Sort roadmaps
      roadmaps.sort(roadmapSorter);

      return roadmaps;
    }

    // If user is logged in, get all roadmaps they have access to
    if (session.user?.isLoggedIn) {
      try {
        roadmaps = await prisma.roadmap.findMany({
          where: {
            metaRoadmap: { type: RoadmapType.NATIONAL },
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
            metaRoadmap: true,
            goals: {
              select: { id: true, name: true, indicatorParameter: true }
            },
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          }
        });
      } catch (error) {
        console.log(error);
        console.log('Error fetching user roadmaps');
        return [];
      }

      // Sort roadmaps
      roadmaps.sort(roadmapSorter);

      return roadmaps;
    }

    // Get all public roadmaps
    try {
      roadmaps = await prisma.roadmap.findMany({
        where: {
          metaRoadmap: { type: RoadmapType.NATIONAL },
          viewGroups: { some: { name: 'Public' } }
        },
        include: {
          metaRoadmap: true,
          goals: {
            select: { id: true, name: true, indicatorParameter: true }
          },
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.log(error);
      console.log('Error fetching public roadmaps');
      return [];
    }

    // Sort roadmaps
    roadmaps.sort(roadmapSorter);

    return roadmaps;
  },
  ['getNationals'],
  { revalidate: 600, tags: ['database', 'roadmap', 'goal'] },
);