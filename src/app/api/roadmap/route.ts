import { NextRequest } from "next/server";
import { getSession } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessControlled, AccessLevel, ClientError, GoalInput, RoadmapInput } from "@/types";
import roadmapGoalCreator from "./roadmapGoalCreator";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";
import goalInputFromGoalArray from "@/functions/goalInputFromGoalArray";
import getOneGoal from "@/fetchers/getOneGoal";
import pruneOrphans from "@/functions/pruneOrphans";
import { cookies } from "next/headers";

/**
 * Handles POST requests to the roadmap API
 */
export async function POST(request: NextRequest) {
  const [session, roadmap] = await Promise.all([
    getSession(cookies()),
    request.json() as Promise<RoadmapInput & { goals?: GoalInput[] }>,
  ]);

  // Validate request body
  if (!roadmap.metaRoadmapId) {
    return Response.json({ message: 'Missing required input parameters' },
      { status: 400 }
    );
  }

  // Validate session
  if (!session.user?.id) {
    return Response.json({ message: 'Unauthorized' },
      { status: 401, headers: { 'Location': '/login' } }
    );
  }

  let originalAuthor: { id: string, username: string };

  try {
    // Get user and parent roadmap
    const [user, metaRoadmap] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.metaRoadmap.findUnique({
        where: { id: roadmap.metaRoadmapId },
        include: {
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      })
    ]);
    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'roadmap' });
    }

    // Check if the parent roadmap exists and the user has access to it
    if (!metaRoadmap) {
      throw new Error(ClientError.IllegalParent, { cause: 'roadmap' });
    }
    originalAuthor = metaRoadmap.author;
    const accessFields: AccessControlled = {
      author: metaRoadmap.author,
      editors: metaRoadmap.editors,
      viewers: metaRoadmap.viewers,
      editGroups: metaRoadmap.editGroups,
      viewGroups: metaRoadmap.viewGroups,
      isPublic: metaRoadmap.isPublic,
    }
    const accessLevel = accessChecker(accessFields, session.user);
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(ClientError.IllegalParent, { cause: 'roadmap' });
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message == ClientError.BadSession) {
        // Remove session to log out. The client should redirect to login page.
        session.destroy();
        return Response.json({ message: ClientError.BadSession },
          { status: 400, headers: { 'Location': '/login' } }
        );
      }
      return Response.json({ message: ClientError.IllegalParent },
        { status: 403 }
      );
    } else {
      // If non-error is thrown, log it and return a generic error message
      console.log(e);
      return Response.json({ message: "Unknown internal server error" },
        { status: 500 }
      );
    }
  }

  // If a parent roadmap is defined to be inherited from, append its goals to the new roadmap's goals
  if (roadmap.inheritFromIds) {
    try {
      const goalArray = await Promise.all(roadmap.inheritFromIds.map(async (id) => await getOneGoal(id)));
      //getOneRoadmap(roadmap.inheritFromId);
      if (goalArray) {
        roadmap.goals = [...(roadmap.goals || []), ...goalInputFromGoalArray(goalArray)];
      }
    } catch (e) {
      console.log(e);
      return Response.json({ message: 'Failed to fetch roadmap to inherit from' },
        { status: 400 }
      );
    }
  }

  // Get the highest existing version number for this meta roadmap, defaulting to 0
  let latestVersion: number;
  try {
    latestVersion = (await prisma.roadmap.aggregate({
      where: { metaRoadmapId: roadmap.metaRoadmapId },
      _max: { version: true },
    }))._max.version || 0;
  } catch {
    return Response.json({ message: 'Failed to fetch latest roadmap version' },
      { status: 500 }
    );
  }

  // Create lists of names for linking
  const editors: { username: string }[] = [];
  for (const name of [...(roadmap.editors || []), originalAuthor.username]) {
    editors.push({ username: name });
  }

  const viewers: { username: string }[] = [];
  for (const name of roadmap.viewers || []) {
    viewers.push({ username: name });
  }

  const editGroups: { name: string }[] = [];
  for (const name of roadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  const viewGroups: { name: string }[] = [];
  for (const name of roadmap.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Create the roadmap
  try {
    const newRoadmap = await prisma.roadmap.create({
      data: {
        description: roadmap.description,
        version: latestVersion + 1,
        targetVersion: roadmap.targetVersion,
        author: { connect: { id: session.user.id } },
        editors: { connect: editors },
        viewers: { connect: viewers },
        editGroups: { connect: editGroups },
        viewGroups: { connect: viewGroups },
        isPublic: roadmap.isPublic,
        metaRoadmap: { connect: { id: roadmap.metaRoadmapId } },
        goals: {
          create: roadmapGoalCreator(roadmap, session.user.id),
        },
      },
      select: { id: true },
    });
    // Invalidate old cache
    revalidateTag('roadmap');
    // Return the new roadmap's ID if successful
    return Response.json({ message: "Roadmap created", id: newRoadmap.id },
      { status: 201, headers: { 'Location': `/roadmap/${newRoadmap.id}` } }
    );
  } catch (e: any) {
    // Custom error if there are errors in the nested goal creation
    if (e instanceof Error) {
      if (e.cause == 'nestedGoalCreation') {
        return Response.json({ message: e.message },
          { status: 400 }
        );
      }
    }
    if (e?.code == 'P2025') {
      return Response.json({ message: 'Failed to connect records. Probably invalid editor, viewer, editGroup, and/or viewGroup name(s)' },
        { status: 400 }
      );
    }
    console.log(e);
    return Response.json({ message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to the roadmap API
 */
export async function PUT(request: NextRequest) {
  const [session, roadmap] = await Promise.all([
    getSession(cookies()),
    // The version number is not allowed to be changed
    request.json() as Promise<Omit<RoadmapInput, 'version'> & { goals?: GoalInput[], roadmapId: string, timestamp?: number }>,
  ]);

  // Validate request body
  if (!roadmap.metaRoadmapId) {
    return Response.json({ message: 'Missing required input parameters' },
      { status: 400 }
    );
  }

  // Validate session
  if (!session.user?.id) {
    return Response.json({ message: 'Unauthorized' },
      { status: 401, headers: { 'Location': '/login' } }
    );
  }

  try {
    // Get user and current roadmap
    const [user, currentRoadmap] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.roadmap.findUnique({
        where: { id: roadmap.roadmapId },
        select: {
          updatedAt: true,
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
          isPublic: true,
        }
      })
    ]);
    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'roadmap' });
    }

    // Check if the roadmap exists and the user has access to it
    const access = accessChecker(currentRoadmap, session.user)
    if (access === AccessLevel.None || access === AccessLevel.View) {
      throw new Error(ClientError.AccessDenied, { cause: 'roadmap' });
    }

    // Check if the client's data is stale
    if (!roadmap.timestamp || (currentRoadmap?.updatedAt?.getTime() || 0) > roadmap.timestamp) {
      throw new Error(ClientError.StaleData, { cause: 'roadmap' });
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message == ClientError.BadSession) {
        // Remove session to log out. The client should redirect to login page.
        await session.destroy();
        return Response.json({ message: ClientError.BadSession },
          { status: 400, headers: { 'Location': '/login' } }
        );
      }
      if (e.message == ClientError.StaleData) {
        return Response.json({ message: ClientError.StaleData },
          { status: 409 }
        );
      }
      return Response.json({ message: ClientError.AccessDenied },
        { status: 403 }
      );
    } else {
      // If non-error is thrown, log it and return a generic error message
      console.log(e);
      return Response.json({ message: "Unknown internal server error" },
        { status: 500 }
      );
    }
  }

  // Create lists of names for linking
  const editors: { username: string }[] = [];
  for (const name of roadmap.editors || []) {
    editors.push({ username: name });
  }

  const viewers: { username: string }[] = [];
  for (const name of roadmap.viewers || []) {
    viewers.push({ username: name });
  }

  const editGroups: { name: string }[] = [];
  for (const name of roadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  const viewGroups: { name: string }[] = [];
  for (const name of roadmap.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Update the roadmap
  try {
    // Update roadmap, goals, and actions in a single transaction
    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmap.roadmapId },
      data: {
        description: roadmap.description,
        targetVersion: roadmap.targetVersion,
        editors: { set: editors },
        viewers: { set: viewers },
        editGroups: { set: editGroups },
        viewGroups: { set: viewGroups },
        isPublic: roadmap.isPublic,
        goals: {
          create: roadmapGoalCreator(roadmap, session.user!.id),
        }
      },
      select: { id: true },
    });
    // Prune any orphaned links and comments
    await pruneOrphans();
    // Invalidate old cache
    revalidateTag('roadmap');
    // Return the new roadmap's ID if successful
    return Response.json({ message: "Roadmap updated", id: updatedRoadmap.id },
      { status: 200, headers: { 'Location': `/roadmap/${updatedRoadmap.id}` } }
    );
  } catch (e: any) {
    console.log(e);
    // Custom error if there are errors in the nested goal creation
    if (e instanceof Error) {
      e = e as Error
      if (e.cause == 'nestedGoalCreation') {
        return Response.json({ message: e.message },
          { status: 400 }
        );
      }
    }
    if (e?.code == 'P2025') {
      return Response.json({ message: 'Failed to connect records. Probably invalid editor, viewer, editGroup, and/or viewGroup name(s)' },
        { status: 400 }
      );
    }
    return Response.json({ message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to the roadmap API
 */
export async function DELETE(request: NextRequest) {
  const [session, roadmap] = await Promise.all([
    getSession(cookies()),
    request.json() as Promise<{ id: string }>
  ]);

  // Validate request body
  if (!roadmap.id) {
    return Response.json({ message: 'Missing required input parameters' },
      { status: 400 }
    );
  }

  // Validate session
  if (!session.user?.id) {
    return Response.json({ message: 'Unauthorized' },
      { status: 401, headers: { 'Location': '/login' } }
    );
  }

  try {
    const [user, currentRoadmap] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.roadmap.findUnique({
        where: {
          id: roadmap.id,
          ...(session.user.isAdmin ? {} : {
            OR: [
              { authorId: session.user.id },
              { metaRoadmap: { authorId: session.user.id } },
            ]
          })
        },
      }),
    ]);

    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'roadmap' });
    }

    // If the roadmap is not found it eiter does not exist or the user has no access to it
    if (!currentRoadmap) {
      throw new Error(ClientError.AccessDenied, { cause: 'roadmap' });
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message == ClientError.BadSession) {
        // Remove session to log out. The client should redirect to login page.
        await session.destroy();
        return Response.json({ message: ClientError.BadSession },
          { status: 400, headers: { 'Location': '/login' } }
        );
      }
      return Response.json({ message: ClientError.AccessDenied },
        { status: 403 }
      );
    } else {
      console.log(e);
      return Response.json({ message: "Unknown internal server error" },
        { status: 500 }
      );
    }
  }

  // Delete the roadmap
  try {
    const deletedRoadmap = await prisma.roadmap.delete({
      where: {
        id: roadmap.id
      },
      select: {
        id: true,
        metaRoadmapId: true,
      }
    });
    // Prune any orphaned links and comments
    await pruneOrphans();
    // Invalidate old cache
    revalidateTag('roadmap');
    return Response.json({ message: 'Roadmap deleted', id: deletedRoadmap.id },
      // Redirect to the parent meta roadmap
      { status: 200, headers: { 'Location': `/metaRoadmap/${deletedRoadmap.metaRoadmapId}` } }
    );
  } catch (e) {
    console.log(e);
    return Response.json({ message: "Internal server error" },
      { status: 500 }
    );
  }
}