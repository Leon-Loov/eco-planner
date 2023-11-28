import { getSessionData } from "@/lib/session";
import prisma from "@/prismaClient";
import { Action, Link, Notes, Comment } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

/**
 * Gets specified action.
 * 
 * Returns null if action is not found or user does not have access to it. Also returns null on error.
 * @param id ID of the action to get
 * @returns Action object
 */
export default async function getOneAction(id: string) {
  const session = await getSessionData(cookies());
  return getCachedAction(id, session.user?.id ?? '')
}

/**
 * Caches the specified action.
 * Cache is invalidated when `revalidateTag()` is called on one of its tags `['database', 'action']`, which is done in relevant API routes.
 * @param id ID of the action to cache
 * @param userId ID of user. Isn't passed in, but is used to associate the cache with the user.
 */
const getCachedAction = unstable_cache(
  async (id, userId) => {
    const session = await getSessionData(cookies());

    let action: Action & {
      notes: Notes[],
      links: Link[],
      comments?: (Comment & { author: { id: string, username: string } })[],
      goals: { id: string, name: string | null, indicatorParameter: string }[],
      parent: Action | null,
      author: { id: string, username: string },
      editors: { id: string, username: string }[],
      viewers: { id: string, username: string }[],
      editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    } | null = null;

    // If user is admin, always get the action
    if (session.user?.isAdmin) {
      try {
        action = await prisma.action.findUnique({
          where: { id },
          include: {
            notes: true,
            links: true,
            comments: { include: { author: { select: { id: true, username: true } } } },
            goals: { select: { id: true, name: true, indicatorParameter: true } },
            parent: true,
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          },
        });
      } catch (error) {
        console.error(error);
        console.log('Error fetching admin action');
        return null;
      }

      return action;
    }

    // If user is logged in, get the action if they have access to it
    if (session.user?.isLoggedIn) {
      try {
        action = await prisma.action.findUnique({
          where: {
            id,
            OR: [
              { authorId: session.user.id },
              { editors: { some: { id: userId } } },
              { viewers: { some: { id: userId } } },
              { editGroups: { some: { users: { some: { id: userId } } } } },
              { viewGroups: { some: { users: { some: { id: userId } } } } },
              { viewGroups: { some: { name: 'Public' } } }
            ]
          },
          include: {
            notes: true,
            links: true,
            goals: { select: { id: true, name: true, indicatorParameter: true } },
            parent: true,
            author: { select: { id: true, username: true } },
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          },
        });
      } catch (error) {
        console.error(error);
        console.log('Error fetching action');
        return null;
      }

      return action;
    }

    // If user is not logged in, get the action if it is public
    try {
      action = await prisma.action.findUnique({
        where: {
          id,
          viewGroups: { some: { name: 'Public' } }
        },
        include: {
          notes: true,
          links: true,
          goals: { select: { id: true, name: true, indicatorParameter: true } },
          parent: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
    } catch (error) {
      console.error(error);
      console.log('Error fetching public action');
      return null;
    }

    return action;
  },
  ['getOneAction'],
  { revalidate: 600, tags: ['database', 'action'] }
)