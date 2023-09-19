import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { GoalInput } from "@/types";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let goal: GoalInput = await request.json();

  // Validate request body
  if (!goal.name || !goal.goalObject || !goal.indicatorParameter) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
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
  goal.dataSeriesId = goal.dataSeriesId || "";

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

  // Prepare for creating data series
  let dataValues: Prisma.DataSeriesCreateWithoutGoalsInput = {
    author: { connect: { id: session.user.id } },
    unit: goal.dataUnit!,
  };

  if (goal.dataSeries?.length) {
    let keys = Object.keys(dataValues);
    // By selecting the keys containing numbers, we can assign data values to the correct fields in
    // the database.
    keys.filter(key => /\d/.test(key)).sort().forEach((key, index) => {
      // This godawful mess assures TypeScript that we are not trying to assign numbers to any of the
      // other fields in the dataSeries object.
      dataValues[key as keyof Omit<
        Prisma.DataSeriesCreateWithoutGoalsInput,
        'author' | 'unit' | 'id' | 'createdAt' | 'updatedAt' |
        'editors' | 'viewers' | 'editGroups' | 'viewGroups'
      >] = parseFloat(goal.dataSeries![index]);
    });
  }

  // Create goal
  try {
    let newGoal = await prisma.goal.create({
      data: {
        name: goal.name,
        goalObject: goal.goalObject,
        nationalRoadmapId: goal.nationalRoadmapId || null,
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
          connect: {
            id: goal.roadmapId ? goal.roadmapId : undefined,
          },
        },
        dataSeries: {
          connectOrCreate: {
            where: {
              id: goal.dataSeriesId,
            },
            create: dataValues,
          }
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