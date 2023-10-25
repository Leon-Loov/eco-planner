import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessLevel, GoalInput } from "@/types";
import { Prisma } from "@prisma/client";
import accessChecker from "@/lib/accessChecker";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let goal: GoalInput = await request.json();

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
  /*
  else if (goal.dataSeries && goal.dataSeriesId) {
    return createResponse(
      response,
      JSON.stringify({
        message: 'Cannot create a new data series and reference an existing one at the same time'
      }),
      { status: 400 }
    );
  }
  */
  // dataSeriesId is currently disabled
  // goal.dataSeriesId = goal.dataSeriesId || "";

  // Validate session
  if (!session.user?.isLoggedIn) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    );
  }

  // Create lists of UUIDs for linking
  let editors: { username: string }[] = [];
  for (let name of goal.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of goal.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of goal.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of goal.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // This code also exists in src/app/api/createRoadmap/roadmapGoalCreator.ts, if one changes the other should be changed as well
  // Prepare for creating data series
  let dataValues: Prisma.DataSeriesCreateWithoutGoalsInput = {
    author: { connect: { id: session.user.id } },
    unit: goal.dataUnit,
    scale: goal.dataScale,
  };

  if (goal.dataSeries?.length && goal.dataSeries.length <= 31) {
    // The keys for the data values are `val2020`, `val2021`, etc. up to `val2050
    let keys = goal.dataSeries.map((_, index) => `val${index + 2020}`);
    keys.forEach((key, index) => {
      let value = parseFloat(goal.dataSeries![index]);
      // If the value is a number, add it to the dataValues object
      if (!isNaN(value)) {
        // This mess assures TypeScript that we are not trying to assign numbers to any of the
        // other fields in the dataSeries object.
        dataValues[key as keyof Omit<
          Prisma.DataSeriesCreateWithoutGoalsInput,
          'author' | 'unit' | 'scale' | 'id' | 'createdAt' | 'updatedAt' |
          'editors' | 'viewers' | 'editGroups' | 'viewGroups'
        >] = value;
      }
    });
  }
  // If the data series is invalid, return an error
  else if (!goal.dataSeries?.length || goal.dataSeries!.length > 31) {
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
        nationalRoadmapId: goal.nationalRoadmapId || undefined,
        nationalGoalId: goal.nationalGoalId || undefined,
        indicatorParameter: goal.indicatorParameter,
        author: {
          connect: {
            id: session.user.id,
          },
        },
        editors: {
          connect: editors,
        },
        viewers: {
          connect: viewers,
        },
        editGroups: {
          connect: editGroups,
        },
        viewGroups: {
          connect: viewGroups,
        },
        roadmaps: {
          connect: { id: goal.roadmapId },
        },
        dataSeries: {
          // The ability to connect to an existing data series is currently disabled
          // connectOrCreate: {
          //   where: {
          //     id: goal.dataSeriesId,
          //   },
          create: dataValues,
          // }
        },
      }
    });
    // Return the new goal's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Goal created", id: newGoal.id }),
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
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

  let goal: GoalInput & { goalId: string } = await request.json();

  // Validate request body
  if (!goal.indicatorParameter || !goal.dataUnit || !goal.dataSeries || !goal.goalId) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // Validate session
  try {
    let accessLevel: AccessLevel = AccessLevel.None;
    let currentGoal = await prisma.goal.findUnique({
      where: { id: goal.goalId },
      include: {
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
    accessLevel = accessChecker(currentGoal!, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error('Access denied');
    }
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: "You either don't have access to this goal or are trying to edit a goal that doesn't exist" }),
      { status: 403 }
    );
  }

  // Create lists of UUIDs for linking
  let editors: { username: string }[] = [];
  for (let name of goal.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of goal.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of goal.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of goal.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // This code also exists in src/app/api/createRoadmap/roadmapGoalCreator.ts, if one changes the other should be changed as well
  // Prepare for creating data series
  let dataValues: Prisma.DataSeriesCreateWithoutGoalsInput = {
    author: { connect: { id: session.user!.id } },
    unit: goal.dataUnit,
    scale: goal.dataScale,
  };

  if (goal.dataSeries?.length && goal.dataSeries.length <= 31) {
    // The keys for the data values are `val2020`, `val2021`, etc. up to `val2050
    let keys = goal.dataSeries.map((_, index) => `val${index + 2020}`);
    keys.forEach((key, index) => {
      let value = parseFloat(goal.dataSeries![index]);
      // If the value is a number, add it to the dataValues object
      if (!isNaN(value)) {
        // This mess assures TypeScript that we are not trying to assign numbers to any of the
        // other fields in the dataSeries object.
        dataValues[key as keyof Omit<
          Prisma.DataSeriesCreateWithoutGoalsInput,
          'author' | 'unit' | 'scale' | 'id' | 'createdAt' | 'updatedAt' |
          'editors' | 'viewers' | 'editGroups' | 'viewGroups'
        >] = value;
      }
    });
  }
  // If the data series is invalid, return an error
  else if (!goal.dataSeries?.length || goal.dataSeries!.length > 31) {
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
    let editedGoal = await prisma.goal.update({
      where: { id: goal.goalId },
      data: {
        name: goal.name,
        description: goal.description,
        nationalRoadmapId: goal.nationalRoadmapId,
        nationalGoalId: goal.nationalGoalId,
        indicatorParameter: goal.indicatorParameter,
        editors: { set: editors },
        viewers: { set: viewers },
        editGroups: { set: editGroups },
        viewGroups: { set: viewGroups },
        dataSeries: {
          upsert: {
            create: dataValues,
            update: dataValues,
          }
        },
      }
    });
    // Return the edited goal's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Goal edited", id: editedGoal.id }),
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}