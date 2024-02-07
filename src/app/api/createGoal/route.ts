import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessControlled, AccessLevel, GoalInput } from "@/types";
import { Prisma } from "@prisma/client";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";
import dataSeriesPrep from "./dataSeriesPrep";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let goal: GoalInput & {roadmapId: string} = await request.json();

  // Validate request body
  if (!goal.indicatorParameter || !goal.dataUnit || !goal.dataSeries) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // TODO: Add a check to make sure user has edit access to parent roadmap to prevent custom requests from creating a goal under a roadmap they don't have access to
  if (!goal.roadmapId) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing parent. Please report this problem unless you are sending custom requests.' }),
      { status: 400 }
    );
  }

  // Validate session
  if (!session.user?.isLoggedIn) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    );
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
    let newGoal = await prisma.goal.create({
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
      { status: 200 }
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

  // If we get here, something went wrong
  return createResponse(
    response,
    JSON.stringify({ message: "Internal server error" }),
    { status: 500 }
  );
}

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
  const accessDenied = "You either don't have access to this entry or are trying to edit an entry that doesn't exist"
  const staleData = "Stale data; please refresh and try again"
  try {
    let accessLevel: AccessLevel = AccessLevel.None;
    let currentGoal = await prisma.goal.findUnique({
      where: { id: goal.goalId },
      include: {
        author: { select: { id: true, username: true } },
        roadmap: {
          select: {
            editors: { select: { id: true, username: true } },
            viewers: { select: { id: true, username: true } },
            editGroups: { include: { users: { select: { id: true, username: true } } } },
            viewGroups: { include: { users: { select: { id: true, username: true } } } },
          }
        },
      }
    });

    if (!currentGoal) {
      throw new Error(accessDenied, { cause: 'goal' });
    }

    let accessFields: AccessControlled = {
      author: currentGoal.author,
      editors: currentGoal.roadmap.editors,
      viewers: currentGoal.roadmap.viewers,
      editGroups: currentGoal.roadmap.editGroups,
      viewGroups: currentGoal.roadmap.viewGroups,
    }
    accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(accessDenied, { cause: 'goal' });
    }

    if (!goal.timestamp || (currentGoal?.updatedAt?.getTime() || 0) > goal.timestamp) {
      throw new Error(staleData, { cause: 'goal' });
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error && e.message == staleData) {
      return createResponse(
        response,
        JSON.stringify({ message: staleData }),
        { status: 409 }
      );
    }
    return createResponse(
      response,
      JSON.stringify({ message: accessDenied }),
      { status: 403 }
    );
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
      }
    });
    // Invalidate old cache
    revalidateTag('goal');
    // Return the edited goal's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Goal edited", id: editedGoal.id }),
      { status: 200 }
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