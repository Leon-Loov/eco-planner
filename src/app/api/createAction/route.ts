import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessLevel, ActionInput } from "@/types";
import accessChecker from "@/lib/accessChecker";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let action: ActionInput = await request.json();

  // Validate request body
  if (!action.name) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  if (!action.goalId) {
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

  // Create lists of UUIDs for linking
  let editors: { username: string }[] = [];
  for (let name of action.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of action.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of action.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of action.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Create the action
  try {
    let newAction = await prisma.action.create({
      data: {
        name: action.name,
        description: action.description,
        costEfficiency: action.costEfficiency,
        expectedOutcome: action.expectedOutcome,
        startYear: action.startYear,
        endYear: action.endYear,
        projectManager: action.projectManager,
        relevantActors: action.relevantActors,
        goals: {
          connect: { id: action.goalId }
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

export async function PUT(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let action: ActionInput & { actionId: string } = await request.json();

  // Validate request body
  if (!action.actionId || !action.name) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // Validate session
  try {
    let accessLevel: AccessLevel = AccessLevel.None;
    let currentAction = await prisma.action.findUnique({
      where: { id: action.actionId },
      include: {
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
    accessLevel = accessChecker(currentAction!, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error('Access denied');
    }
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: "You either don't have access to this action or are trying to edit an action that doesn't exist" }),
      { status: 403 }
    );
  }

  // Create lists of UUIDs for linking
  let editors: { username: string }[] = [];
  for (let name of action.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of action.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of action.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of action.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Update the action
  try {
    let updatedAction = await prisma.action.update({
      where: {
        id: action.actionId
      },
      data: {
        name: action.name,
        description: action.description,
        costEfficiency: action.costEfficiency,
        expectedOutcome: action.expectedOutcome,
        startYear: action.startYear,
        endYear: action.endYear,
        projectManager: action.projectManager,
        relevantActors: action.relevantActors,
        editors: { set: editors },
        viewers: { set: viewers },
        editGroups: { set: editGroups },
        viewGroups: { set: viewGroups },
      }
    });
    // Return the new action's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: 'Action updated', id: updatedAction.id }),
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
}