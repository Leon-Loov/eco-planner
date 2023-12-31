import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessLevel, GoalInput } from "@/types";
import { Prisma } from "@prisma/client";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";

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

  // TODO: Add a check to make sure user has edit access to parent roadmap to prevent custom requests from creating a goal under a roadmap they don't have access to
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

  // Create lists of names for linking
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
      let value: number | null = parseFloat(goal.dataSeries![index]);
      // If the value is empty, set it to null
      if (!goal.dataSeries![index] && goal.dataSeries![index] != "0") {
        value = null;
      }
      // If the value is a number or null, add it to the dataValues object
      if (value === null || !isNaN(value)) {
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
        JSON.stringify({ message: 'Failed to connect records. Probably invalid editor, viewer, editGroup, and/or viewGroup name(s)' }),
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
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
    accessLevel = accessChecker(currentGoal!, session.user)
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

  // Create lists of names for linking
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
      let value: number | null = parseFloat(goal.dataSeries![index]);
      // If the value is empty, set it to null
      if (!goal.dataSeries![index] && goal.dataSeries![index] != "0") {
        value = null;
      }
      // If the value is a number or null, add it to the dataValues object
      if (value === null || !isNaN(value)) {
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
    // Get list of IDs of goals under this goal
    const goalContents = await prisma.goal.findUnique({
      where: { id: goal.goalId },
      select: { actions: { select: { id: true } } }
    });
    const actionIds = goalContents?.actions.map(action => action.id) || [];

    // Update goal and actions in a single transaction
    const [editedGoal] = await prisma.$transaction([
      prisma.goal.update({
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
      }),
      ...actionIds.map(actionId => prisma.action.update({
        where: { id: actionId },
        data: {
          editors: { set: editors },
          viewers: { set: viewers },
          editGroups: { set: editGroups },
          viewGroups: { set: viewGroups },
        }
      })),
    ]);
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
    if (e?.code == 'P2025') {
      return createResponse(
        response,
        JSON.stringify({ message: 'Failed to connect records. Probably invalid editor, viewer, editGroup, and/or viewGroup name(s)' }),
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