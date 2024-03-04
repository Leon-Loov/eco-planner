import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessControlled, AccessLevel, ActionInput } from "@/types";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";

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

  // TODO: Make sure user has access to the parent goal (declared in goal's parent roadmap)
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
        isSufficiency: action.isSufficiency,
        isEfficiency: action.isEfficiency,
        isRenewables: action.isRenewables,
        links: {
          create: action.links?.map(link => {
            return {
              url: link.url,
              description: link.description || undefined,
            }
          })
        },
        // TODO: Add `Note`s
        goal: {
          connect: { id: action.goalId }
        },
        author: {
          connect: {
            id: session.user.id
          }
        },
      }
    });
    // Invalidate old cache
    revalidateTag('action');
    // Return the new action's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: 'Action created', id: newAction.id }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    if (error?.code == 'P2025') {
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

  let action: ActionInput & { actionId: string, timestamp?: number } = await request.json();

  // Validate request body
  if (!action.actionId || !action.name) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // Validate session
  const accessDenied = "You either don't have access to this entry or are trying to edit an entry that doesn't exist";
  const staleData = "Stale data; please refresh and try again";
  try {
    let accessLevel: AccessLevel = AccessLevel.None;
    let currentAction = await prisma.action.findUnique({
      where: { id: action.actionId },
      include: {
        author: { select: { id: true, username: true } },
        goal: {
          select: {
            roadmap: {
              select: {
                editors: { select: { id: true, username: true } },
                viewers: { select: { id: true, username: true } },
                editGroups: { include: { users: { select: { id: true, username: true } } } },
                viewGroups: { include: { users: { select: { id: true, username: true } } } },
              }
            }
          }
        },
      }
    });

    if (!currentAction) {
      throw new Error(accessDenied, { cause: 'action' });
    }

    let accessFields: AccessControlled = {
      author: currentAction.author,
      editors: currentAction.goal.roadmap.editors,
      viewers: currentAction.goal.roadmap.viewers,
      editGroups: currentAction.goal.roadmap.editGroups,
      viewGroups: currentAction.goal.roadmap.viewGroups,
    }
    accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(accessDenied, { cause: 'action' });
    }

    if (!action.timestamp || (currentAction?.updatedAt?.getTime() || 0) > action.timestamp) {
      throw new Error(staleData, { cause: 'action' });
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
        isSufficiency: action.isSufficiency,
        isEfficiency: action.isEfficiency,
        isRenewables: action.isRenewables,
        links: {
          set: [],
          create: action.links?.map(link => {
            return {
              url: link.url,
              description: link.description || undefined,
            }
          })
        },
      }
    });
    // Invalidate old cache
    revalidateTag('action');
    // Return the new action's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: 'Action updated', id: updatedAction.id }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    if (error?.code == 'P2025') {
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