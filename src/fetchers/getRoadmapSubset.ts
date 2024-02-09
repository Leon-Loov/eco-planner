import { getSessionData } from "@/lib/session";
import { roadmapSorter } from "@/lib/sorters";
import prisma from "@/prismaClient";
import { MetaRoadmap, Roadmap } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

/**
 * Gets a subset of roadmaps the user has access to, based on the parameters passed to the function.
 * 
 * Returns an empty array if no roadmaps are found or user does not have access to any. Also returns an empty array on error.
 * @param county County to filter by
 * @param municipality Municipality to filter by
 * @returns Array of roadmaps
 */
export default async function getRoadmapSubset(actor?: string) {
  const session = await getSessionData(cookies());
  return getCachedRoadmapSubset(session.user?.id ?? '', actor);
}

/**
 * Caches a subset of roadmaps the user has access to, based on the parameters passed to the function.
 * Cache is invalidated when `revalidateTag()` is called on one of its tags `['database', 'roadmap']`, which is done in relevant API routes.
 * @param userId ID of user. Isn't passed in, but is used to associate the cache with the user.
 * @param county County to filter by
 * @param municipality Municipality to filter by
 */
const getCachedRoadmapSubset = unstable_cache(
  async (userId: any, actor?: string) => {
    const session = await getSessionData(cookies());

    let roadmaps: (
      Roadmap & {
        _count: { goals: number },
        metaRoadmap: MetaRoadmap,
        // Goal IDs are returned in order to later fetch these goals individually
        goals: { id: string }[],
        author: { id: string, username: string },
        editors: { id: string, username: string }[],
        viewers: { id: string, username: string }[],
        editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
        viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      }
    )[] = [];

    // If user is admin, get all relevant roadmaps
    if (session.user?.isAdmin) {
      try {
        roadmaps = await prisma.roadmap.findMany({
          where: {
            metaRoadmap: { actor: actor ?? undefined },
          },
          include: {
            _count: {
              select: { goals: true }
            },
            metaRoadmap: true,
            goals: { select: { id: true } },
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          },
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

    // If user is logged in, get all relevant roadmaps they have access to
    if (session.user?.isLoggedIn) {
      try {
        roadmaps = await prisma.roadmap.findMany({
          where: {
            metaRoadmap: { actor: actor ?? undefined },
            OR: [
              { authorId: session.user.id },
              { editors: { some: { id: session.user.id } } },
              { viewers: { some: { id: session.user.id } } },
              { editGroups: { some: { users: { some: { id: session.user.id } } } } },
              { viewGroups: { some: { users: { some: { id: session.user.id } } } } },
            ]
          },
          include: {
            _count: {
              select: { goals: true }
            },
            metaRoadmap: true,
            goals: { select: { id: true } },
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          },
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

    // If user is not logged in, get all public roadmaps
    try {
      roadmaps = await prisma.roadmap.findMany({
        where: {
          metaRoadmap: { actor: actor ?? undefined },
          viewGroups: { some: { name: 'Public' } }
        },
        include: {
          _count: {
            select: { goals: true }
          },
          metaRoadmap: true,
          goals: { select: { id: true } },
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        },
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
  ['getRoadmapSubset'],
  { revalidate: 600, tags: ['database', 'roadmap'] },
);