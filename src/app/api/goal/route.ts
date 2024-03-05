import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessControlled, AccessLevel, ClientError, GoalInput } from "@/types";
import { Prisma } from "@prisma/client";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";
import dataSeriesPrep from "./dataSeriesPrep";

/**
 * Handles POST requests to the goal API
 */
export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let goal: GoalInput & { roadmapId: string } = await request.json();

  // Validate request body
  if (!goal.indicatorParameter || !goal.dataUnit || !goal.dataSeries) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  if (!goal.roadmapId) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing parent. Please report this problem unless you are sending custom requests.' }),
      { status: 400 }
    );
  }

  // Validate session
  if (!session.user?.id) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401, headers: { 'Location': '/login' } }
    );
  }

  try {
    // Get user by ID in session cookie
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, isAdmin: true, userGroups: true }
    })
    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'goal' });
    }

    // Get the roadmap to check if the user has access to it
    let roadmap = await prisma.roadmap.findUnique({
      where: { id: goal.roadmapId },
      include: {
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });

    if (!roadmap) {
      throw new Error(ClientError.AccessDenied, { cause: 'goal' });
    }

    let accessFields: AccessControlled = {
      author: roadmap.author,
      editors: roadmap.editors,
      viewers: roadmap.viewers,
      editGroups: roadmap.editGroups,
      viewGroups: roadmap.viewGroups,
    }
    let accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(ClientError.AccessDenied, { cause: 'goal' });
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message == ClientError.BadSession) {
        // Remove session to log out. The client should redirect to login page.
        await session.destroy();
        return createResponse(
          response,
          JSON.stringify({ message: ClientError.BadSession }),
          { status: 400, headers: { 'Location': '/login' } }
        );
      }
      return createResponse(
        response,
        JSON.stringify({ message: ClientError.AccessDenied }),
        { status: 403 }
      );
    } else {
      // If non-error is thrown, log it and return a generic error message
      console.log(e);
      return createResponse(
        response,
        JSON.stringify({ message: "Unknown internal server error" }),
        { status: 500 }
      );
    }
  }

  // Prepare for creating data series
  let dataValues: Prisma.DataSeriesCreateWithoutGoalInput | null = dataSeriesPrep(goal, session.user!.id);
  // If the data series is invalid, return an error
  if (dataValues === null) {
    return createResponse(
      response,
      JSON.stringify({
        message: 'Invalid data series'
      }),
      { status: 400 }
    );
  }

  // Create goal
  try {
    const newGoal = await prisma.goal.create({
      data: {
        name: goal.name,
        description: goal.description,
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
    return createResponse(
      response,
      JSON.stringify({ message: "Goal created", id: newGoal.id }),
      { status: 201, headers: { 'Location': `/roadmap/${goal.roadmapId}/goal/${newGoal.id}` } }
    );
  } catch (e: any) {
    console.log(e);
    if (e?.code == 'P2025') {
      return createResponse(
        response,
        JSON.stringify({ message: 'Failed to connect records. Given roadmap might not exist' }),
        { status: 400 }
      );
    }
    return createResponse(
      response,
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to the goal API
 */
export async function PUT(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let goal: GoalInput & { goalId: string, timestamp?: number } = await request.json();

  // Validate request body
  if (!goal.indicatorParameter || !goal.dataUnit || !goal.dataSeries || !goal.goalId) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // Validate session
  if (!session.user?.id) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401, headers: { 'Location': '/login' } }
    );
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, isAdmin: true, userGroups: true }
    })
    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'goal' });
    }

    let currentGoal = await prisma.goal.findUnique({
      where: { id: goal.goalId },
      include: {
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
    });

    if (!currentGoal) {
      throw new Error(ClientError.AccessDenied, { cause: 'goal' });
    }

    let accessFields: AccessControlled = {
      author: currentGoal.roadmap.author,
      editors: currentGoal.roadmap.editors,
      viewers: currentGoal.roadmap.viewers,
      editGroups: currentGoal.roadmap.editGroups,
      viewGroups: currentGoal.roadmap.viewGroups,
    }
    let accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(ClientError.AccessDenied, { cause: 'goal' });
    }

    if (!goal.timestamp || (currentGoal?.updatedAt?.getTime() || 0) > goal.timestamp) {
      throw new Error(ClientError.StaleData, { cause: 'goal' });
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e.message == ClientError.BadSession) {
        // Remove session to log out. The client should redirect to login page.
        await session.destroy();
        return createResponse(
          response,
          JSON.stringify({ message: ClientError.BadSession }),
          { status: 400, headers: { 'Location': '/login' } }
        );
      }
      if (e.message == ClientError.StaleData) {
        return createResponse(
          response,
          JSON.stringify({ message: ClientError.StaleData }),
          { status: 409 }
        );
      }
      return createResponse(
        response,
        JSON.stringify({ message: ClientError.AccessDenied }),
        { status: 403 }
      );
    } else {
      // If non-error is thrown, log it and return a generic error message
      console.log(e);
      return createResponse(
        response,
        JSON.stringify({ message: "Unknown internal server error" }),
        { status: 500 }
      );
    }
  }

  // Prepare for creating data series
  let dataValues: Prisma.DataSeriesCreateWithoutGoalInput | null = dataSeriesPrep(goal, session.user!.id);
  // If the data series is invalid, return an error
  if (dataValues === null) {
    return createResponse(
      response,
      JSON.stringify({
        message: 'Invalid data series'
      }),
      { status: 400 }
    );
  }

  // Edit goal
  try {
    const editedGoal = await prisma.goal.update({
      where: { id: goal.goalId },
      data: {
        name: goal.name,
        description: goal.description,
        indicatorParameter: goal.indicatorParameter,
        dataSeries: {
          upsert: {
            create: dataValues,
            update: dataValues,
          }
        },
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
    // Invalidate old cache
    revalidateTag('goal');
    // Return the edited goal's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Goal updated", id: editedGoal.id }),
      { status: 200, headers: { 'Location': `/roadmap/${editedGoal.roadmap.id}/goal/${editedGoal.id}` } }
    );
  } catch (e: any) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}