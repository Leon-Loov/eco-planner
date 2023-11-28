import { getSessionData } from "@/lib/session";
import prisma from "@/prismaClient";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

/**
 * Gets names and ids of all roadmaps, goals, and actions. Mainly intended for breadcrumbs, but could be useful for other things too.
 * 
 * Returns an empty array if user does not have access to any roadmaps. Also returns an empty array on error.
 * @returns Nested array of roadmaps, goals, and actions (just ids and names, plus indicator parameter for goals)
 */
export default async function getNames() {
  const session = await getSessionData(cookies());
  return getCachedNames(session.user?.id ?? '');
}

/**
 * Caches names and ids of all roadmaps, goals, and actions.
 * Cache is invalidated when `revalidateTag()` is called on one of its tags `['database', 'roadmap', 'goal', 'action']`, which is done in relevant API routes.
 * @param userId ID of user. Isn't passed in, but is used to associate the cache with the user.
 */
const getCachedNames = unstable_cache(
  async (userId: string) => {
    const session = await getSessionData(cookies());

    let names: {
      name: string,
      id: string,
      goals: {
        name: string | null,
        indicatorParameter: string,
        id: string,
        actions: {
          name: string,
          id: string,
        }[],
      }[],
    }[] = [];

    // If user is admin, get all roadmaps
    if (session.user?.isAdmin) {
      try {
        names = await prisma.roadmap.findMany({
          select: {
            name: true,
            id: true,
            goals: {
              select: {
                name: true,
                indicatorParameter: true,
                id: true,
                actions: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
        console.log('Error fetching admin names');
        return [];
      }

      return names;
    }

    // If user is logged in, get all roadmaps they have access to
    if (session.user?.isLoggedIn) {
      try {
        // Get all roadmaps authored by the user
        names = await prisma.roadmap.findMany({
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
          select: {
            name: true,
            id: true,
            goals: {
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
              select: {
                name: true,
                indicatorParameter: true,
                id: true,
                actions: {
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
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
        console.log('Error fetching user names');
        return [];
      }

      return names;
    }

    // If user is not logged in, get all public roadmaps
    try {
      names = await prisma.roadmap.findMany({
        where: { viewGroups: { some: { name: 'Public' } } },
        select: {
          name: true,
          id: true,
          goals: {
            where: { viewGroups: { some: { name: 'Public' } } },
            select: {
              name: true,
              indicatorParameter: true,
              id: true,
              actions: {
                where: { viewGroups: { some: { name: 'Public' } } },
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching public names');
      return [];
    }

    return names;
  },
  ['getNames'],
  { revalidate: 600, tags: ['database', 'roadmap', 'goal', 'action'] },
);