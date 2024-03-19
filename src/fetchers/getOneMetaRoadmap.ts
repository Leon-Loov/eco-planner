import { getSessionData } from "@/lib/session";
import { metaRoadmapSorter } from "@/lib/sorters";
import prisma from "@/prismaClient";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

/**
 * Gets specified meta roadmap and all versions for that meta roadmap.
 * 
 * Returns null if metaq roadmap is not found or user does not have access to it. Also returns null on error.
 * @returns Meta roadmap object with roadmap versions
 */
export default async function getOneMetaRoadmap(id: string) {
  const session = await getSessionData(cookies());
  return getCachedMetaRoadmap(id, session.user?.id ?? '');
}

/**
 * Caches the specified meta roadmap.
 * Cache is invalidated when `revalidateTag()` is called on one of its tags `['database', 'metaRoadmap', 'roadmap']`, which is done in relevant API routes.
 * @param userId ID of user. Isn't passed in, but is used to associate the cache with the user.
 */
const getCachedMetaRoadmap = unstable_cache(
  async (id: string, userId) => {
    const session = await getSessionData(cookies());

    let metaRoadmap: Prisma.MetaRoadmapGetPayload<{
      include: {
        roadmapVersions: {
          select: {
            version: true,
            id: true,
            metaRoadmap: true,
            _count: { select: { goals: true } },
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          }
        },
        comments: {
          include: {
            author: { select: { id: true, username: true } },
          },
        },
        links: true,
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    }> | null = null;

    // If user is admin, get all meta roadmaps
    if (session.user?.isAdmin) {
      try {
        metaRoadmap = await prisma.metaRoadmap.findUnique({
          where: { id },
          include: {
            roadmapVersions: {
              select: {
                version: true,
                id: true,
                metaRoadmap: true,
                _count: { select: { goals: true } },
                author: { select: { id: true, username: true } },
                editors: { select: { id: true, username: true } },
                viewers: { select: { id: true, username: true } },
                editGroups: { include: { users: { select: { id: true, username: true } } } },
                viewGroups: { include: { users: { select: { id: true, username: true } } } },
              }
            },
            comments: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
            links: true,
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          },
        });
      } catch (error) {
        console.log(error);
        console.log('Error fetching admin meta roadmaps');
        return null;
      }

      return metaRoadmap;
    }

    // If user is logged in, get all meta roadmaps they have access to
    if (session.user?.isLoggedIn) {
      try {
        metaRoadmap = await prisma.metaRoadmap.findUnique({
          where: {
            id,
            OR: [
              { authorId: userId },
              { editors: { some: { id: userId } } },
              { viewers: { some: { id: userId } } },
              { editGroups: { some: { users: { some: { id: userId } } } } },
              { viewGroups: { some: { users: { some: { id: userId } } } } },
            ]
          },
          include: {
            roadmapVersions: {
              where: {
                OR: [
                  { authorId: userId },
                  { editors: { some: { id: userId } } },
                  { viewers: { some: { id: userId } } },
                  { editGroups: { some: { users: { some: { id: userId } } } } },
                  { viewGroups: { some: { users: { some: { id: userId } } } } },
                ]
              },
              select: {
                version: true,
                id: true,
                metaRoadmap: true,
                _count: { select: { goals: true } },
                author: { select: { id: true, username: true } },
                editors: { select: { id: true, username: true } },
                viewers: { select: { id: true, username: true } },
                editGroups: { include: { users: { select: { id: true, username: true } } } },
                viewGroups: { include: { users: { select: { id: true, username: true } } } },
              },
            },
            comments: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
            links: true,
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          },
        });
      } catch (error) {
        console.log(error);
        console.log('Error fetching meta roadmaps');
        return null;
      }

      return metaRoadmap;
    }

    // Get all public meta roadmaps
    try {
      metaRoadmap = await prisma.metaRoadmap.findUnique({
        where: {
          id,
          viewGroups: { some: { name: 'Public' } }
        },
        include: {
          roadmapVersions: {
            where: {
              viewGroups: { some: { name: 'Public' } }
            },
            select: {
              version: true,
              id: true,
              metaRoadmap: true,
              _count: { select: { goals: true } },
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { include: { users: { select: { id: true, username: true } } } },
              viewGroups: { include: { users: { select: { id: true, username: true } } } },
            },
          },
          comments: {
            include: {
              author: { select: { id: true, username: true } },
            },
          },
          links: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        },
      });
    } catch (error) {
      console.log(error);
      console.log('Error fetching public meta roadmaps');
      return null;
    }

    return metaRoadmap;
  },
  ['getOneMetaRoadmap'],
  { revalidate: 600, tags: ['database', 'metaRoadmap', 'roadmap'] },
);