import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { GoalInput } from "@/types";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let goal: GoalInput = await request.json();
  goal.dataSeries

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
  let editors: { id: string }[] = [];
  for (let id of goal.editors || []) {
    editors.push({ id: id });
  }

  let viewers: { id: string }[] = [];
  for (let id of goal.viewers || []) {
    viewers.push({ id: id });
  }

  let editGroups: { id: string }[] = [];
  for (let id of goal.editGroups || []) {
    editGroups.push({ id: id });
  }

  let viewGroups: { id: string }[] = [];
  for (let id of goal.viewGroups || []) {
    viewGroups.push({ id: id });
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
    await prisma.goal.create({
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
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }

  return createResponse(
    response,
    JSON.stringify({ message: "Goal created successfully" }),
    { status: 200 }
  );
}