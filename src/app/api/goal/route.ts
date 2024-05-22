import { NextRequest } from "next/server";
import { getSession } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessControlled, AccessLevel, ClientError, GoalInput } from "@/types";
import { Prisma } from "@prisma/client";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";
import dataSeriesPrep from "./dataSeriesPrep";
import pruneOrphans from "@/functions/pruneOrphans";
import { cookies } from "next/headers";

/**
 * Handles POST requests to the goal API
 */
export async function POST(request: NextRequest) {
  const [session, goal] = await Promise.all([
    getSession(cookies()),
    request.json() as Promise<GoalInput & { roadmapId: string }>,
  ]);

  // Validate request body
  if (!goal.indicatorParameter || !goal.dataUnit || !goal.dataSeries) {
    return Response.json({ message: 'Missing required input parameters' },
      { status: 400 }
    );
  }

  if (!goal.roadmapId) {
    return Response.json({ message: 'Missing parent. Please report this problem unless you are sending custom requests.' },
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
    // Get user and roadmap
    const [user, roadmap] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.roadmap.findUnique({
        where: { id: goal.roadmapId },
        select: {
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      }),
    ]);

    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'goal' });
    }

    // If no roadmap is found or the user has no access to it, return IllegalParent
    if (!roadmap) {
      throw new Error(ClientError.IllegalParent, { cause: 'goal' });
    }
    const accessFields: AccessControlled = {
      author: roadmap.author,
      editors: roadmap.editors,
      viewers: roadmap.viewers,
      editGroups: roadmap.editGroups,
      viewGroups: roadmap.viewGroups,
    }
    const accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(ClientError.IllegalParent, { cause: 'goal' });
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

  // Prepare for creating data series
  const dataValues: Prisma.DataSeriesCreateWithoutGoalInput | null = dataSeriesPrep(goal, session.user!.id);
  // If the data series is invalid, return an error
  if (dataValues === null) {
    return Response.json({
      message: 'Invalid data series'
    },
      { status: 400 }
    );
  }

  // Create goal
  try {
    const newGoal = await prisma.goal.create({
      data: {
        name: goal.name,
        description: goal.description,
        isFeatured: goal.isFeatured,
        indicatorParameter: goal.indicatorParameter,
        author: {
          connect: { id: session.user.id },
        },
        roadmap: {
          connect: { id: goal.roadmapId },
        },
        dataSeries: {
          create: dataValues,
        },
        links: {
          create: goal.links?.map(link => {
            return {
              url: link.url,
              description: link.description || undefined,
            }
          })
        },
      }
    });
    // Invalidate old cache
    revalidateTag('goal');
    // Return the new goal's ID if successful
    return Response.json({ message: "Goal created", id: newGoal.id },
      { status: 201, headers: { 'Location': `/roadmap/${goal.roadmapId}/goal/${newGoal.id}` } }
    );
  } catch (e: any) {
    console.log(e);
    if (e?.code == 'P2025') {
      return Response.json({ message: 'Failed to connect records. Given roadmap might not exist' },
        { status: 400 }
      );
    }
    return Response.json({ message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to the goal API
 */
export async function PUT(request: NextRequest) {
  const [session, goal] = await Promise.all([
    getSession(cookies()),
    request.json() as Promise<GoalInput & { goalId: string, timestamp?: number }>,
  ]);

  // Convert externalSelection to string so it can be stored in the database
  if (goal.externalSelection && typeof goal.externalSelection == "object") {
    goal.externalSelection = JSON.stringify(goal.externalSelection);
  }

  // Validate request body
  if (goal.indicatorParameter === null || goal.dataUnit === null || goal.dataSeries === null || !goal.goalId) {
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
    // Get user and current goal
    const [user, currentGoal] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.goal.findUnique({
        where: { id: goal.goalId },
        select: {
          updatedAt: true,
          roadmap: {
            select: {
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { include: { users: { select: { id: true, username: true } } } },
              viewGroups: { include: { users: { select: { id: true, username: true } } } },
            }
          },
        }
      }),
    ]);

    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'goal' });
    }

    // If no goal is found or the user has no access to it, return AccessDenied
    if (!currentGoal) {
      throw new Error(ClientError.AccessDenied, { cause: 'goal' });
    }
    const accessFields: AccessControlled = {
      author: currentGoal.roadmap.author,
      editors: currentGoal.roadmap.editors,
      viewers: currentGoal.roadmap.viewers,
      editGroups: currentGoal.roadmap.editGroups,
      viewGroups: currentGoal.roadmap.viewGroups,
    }
    const accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(ClientError.AccessDenied, { cause: 'goal' });
    }

    // If the provided timestamp is not up-to-date, return StaleData
    if (!goal.timestamp || (currentGoal?.updatedAt?.getTime() || 0) > goal.timestamp) {
      throw new Error(ClientError.StaleData, { cause: 'goal' });
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

  // Prepare for creating data series
  let dataValues: Prisma.DataSeriesCreateWithoutGoalInput | null | undefined = undefined;
  // Don't try to update if the received data series is undefined (but complain about null)
  if (!goal.dataSeries === undefined) {
    dataValues = dataSeriesPrep(goal, session.user!.id);
    // If the data series is invalid, return an error
    if (dataValues === null) {
      return Response.json({ message: 'Invalid data series' },
        { status: 400 }
      );
    }
  }

  // Edit goal
  try {
    const editedGoal = await prisma.goal.update({
      where: { id: goal.goalId },
      data: {
        name: goal.name,
        description: goal.description,
        isFeatured: goal.isFeatured,
        indicatorParameter: goal.indicatorParameter,
        externalDataset: goal.externalDataset,
        externalTableId: goal.externalTableId,
        externalSelection: goal.externalSelection,
        // Only update the data series if it is not undefined (undefined means no change)
        ...(dataValues ? {
          dataSeries: {
            upsert: {
              create: dataValues,
              update: dataValues,
            }
          }
        } : {}),
        links: {
          set: [],
          create: goal.links?.map(link => {
            return {
              url: link.url,
              description: link.description || undefined,
            }
          })
        },
      },
      select: {
        id: true,
        roadmap: {
          select: { id: true }
        }
      }
    });
    // Prune any orphaned links and comments
    await pruneOrphans();
    // Invalidate old cache
    revalidateTag('goal');
    // Return the edited goal's ID if successful
    return Response.json({ message: "Goal updated", id: editedGoal.id },
      { status: 200, headers: { 'Location': `/roadmap/${editedGoal.roadmap.id}/goal/${editedGoal.id}` } }
    );
  } catch (e: any) {
    console.log(e);
    return Response.json({ message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to the goal API
 */
export async function DELETE(request: NextRequest) {
  const [session, goal] = await Promise.all([
    getSession(cookies()),
    request.json() as Promise<{ id: string }>
  ]);

  // Validate request body
  if (!goal.id) {
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
    const [user, currentGoal] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.goal.findUnique({
        where: {
          id: goal.id,
          ...(session.user.isAdmin ? {} : {
            OR: [
              // Either the goal, roadmap or meta roadmap must be authored by the user unless they are an admin
              { authorId: session.user.id },
              { roadmap: { authorId: session.user.id } },
              { roadmap: { metaRoadmap: { authorId: session.user.id } } },
            ]
          })
        },
      }),
    ]);

    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'goal' });
    }

    // If the goal is not found it eiter does not exist or the user has no access to it
    if (!currentGoal) {
      throw new Error(ClientError.AccessDenied, { cause: 'goal' });
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

  // Delete the goal
  try {
    const deletedGoal = await prisma.goal.delete({
      where: {
        id: goal.id
      },
      select: {
        id: true,
        roadmap: {
          select: {
            id: true,
          }
        }
      }
    });
    // Prune any orphaned links and comments
    await pruneOrphans();
    // Invalidate old cache
    revalidateTag('goal');
    return Response.json({ message: 'Goal deleted', id: deletedGoal.id },
      // Redirect to the parent roadmap
      { status: 200, headers: { 'Location': `/roadmap/${deletedGoal.roadmap.id}` } }
    );
  } catch (e) {
    console.log(e);
    return Response.json({ message: "Internal server error" },
      { status: 500 }
    );
  }
}