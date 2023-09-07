import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { ActionInput } from "@/types";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let action: ActionInput = await request.json();

  // Validate request body
  if (!action.name || !action.description || !action.costEfficiency || !action.expectedOutcome || !action.projectManager || !action.relevantActors) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
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

  // Create lists of UUIDs for linking
  let editors: { id: string }[] = [];
  for (let id of action.editors || []) {
    editors.push({ id: id });
  }

  let viewers: { id: string }[] = [];
  for (let id of action.viewers || []) {
    viewers.push({ id: id });
  }

  let editGroups: { id: string }[] = [];
  for (let id of action.editGroups || []) {
    editGroups.push({ id: id });
  }

  let viewGroups: { id: string }[] = [];
  for (let id of action.viewGroups || []) {
    viewGroups.push({ id: id });
  }

  // Create the action
  try {
    let newAction = await prisma.action.create({
      data: {
        name: action.name,
        description: action.description,
        costEfficiency: action.costEfficiency,
        expectedOutcome: action.expectedOutcome,
        projectManager: action.projectManager,
        relevantActors: action.relevantActors,
        goals: {
          connect: {
            id: action.goalId || ""
          }
        },
        author: {
          connect: {
            id: session.user.id
          }
        },
        editors: { connect: editors },
        viewers: { connect: viewers },
        editGroups: { connect: editGroups },
        viewGroups: { connect: viewGroups },
      }
    });
    // Return the new action's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: 'Action created', id: newAction.id }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
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