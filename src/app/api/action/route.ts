import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessControlled, AccessLevel, ClientError, ActionInput } from "@/types";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";
import pruneOrphans from "@/functions/pruneOrphans";

/**
 * Handles POST requests to the action API
 */
export async function POST(request: NextRequest) {
  const response = new Response();
  const [session, action] = await Promise.all([
    getSession(request, response),
    request.json() as Promise<ActionInput>,
  ]);

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
  if (!session.user?.id) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401, headers: { 'Location': '/login' } }
    );
  }

  try {
    // Get user and goal
    const [user, goal] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.goal.findUnique({
        where: { id: action.goalId },
        include: {
          roadmap: {
            select: {
              author: { select: { id: true, username: true } },
              editors: { select: { id: true, username: true } },
              viewers: { select: { id: true, username: true } },
              editGroups: { include: { users: { select: { id: true, username: true } } } },
              viewGroups: { include: { users: { select: { id: true, username: true } } } },
            }
          }
        }
      })
    ]);

    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'action' });
    }

    // If no goal is found or the user has no access to the goal, return IllegalParent
    if (!goal) {
      throw new Error(ClientError.IllegalParent, { cause: 'action' });
    }
    const accessFields: AccessControlled = {
      author: goal.roadmap.author,
      editors: goal.roadmap.editors,
      viewers: goal.roadmap.viewers,
      editGroups: goal.roadmap.editGroups,
      viewGroups: goal.roadmap.viewGroups,
    }
    const accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(ClientError.IllegalParent, { cause: 'action' });
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
        JSON.stringify({ message: ClientError.IllegalParent }),
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

  // Create the action
  try {
    const newAction = await prisma.action.create({
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
      },
      select: {
        id: true,
        goal: {
          select: {
            id: true,
            roadmap: {
              select: {
                id: true,
              }
            }
          }
        }
      }
    });
    // Invalidate old cache
    revalidateTag('action');
    // Return the new action's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: 'Action created', id: newAction.id }),
      { status: 201, headers: { 'Location': `/roadmap/${newAction.goal.roadmap.id}/goal/${newAction.goal.id}/action/${newAction.id}` } }
    );
  } catch (error: any) {
    console.log(error);
    if (error?.code == 'P2025') {
      return createResponse(
        response,
        JSON.stringify({ message: 'Failed to connect records. Given goal might not exist' }),
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
 * Handles PUT requests to the action API
 */
export async function PUT(request: NextRequest) {
  const response = new Response();
  const [session, action] = await Promise.all([
    getSession(request, response),
    request.json() as Promise<ActionInput & { actionId: string, timestamp?: number }>
  ]);

  // Validate request body
  if (!action.actionId || !action.name) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }
  if (!action.timestamp) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Potentially stale data. Please refresh and try again.' }),
      { status: 409 }
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
    const [user, currentAction] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.action.findUnique({
        where: { id: action.actionId },
        select: {
          updatedAt: true,
          goal: {
            select: {
              roadmap: {
                select: {
                  author: { select: { id: true, username: true } },
                  editors: { select: { id: true, username: true } },
                  viewers: { select: { id: true, username: true } },
                  editGroups: { include: { users: { select: { id: true, username: true } } } },
                  viewGroups: { include: { users: { select: { id: true, username: true } } } },
                }
              }
            }
          },
        }
      }),
    ]);
    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'goal' });
    }

    // If no action is found or the user has no access to the action, return AccessDenied
    if (!currentAction) {
      throw new Error(ClientError.AccessDenied, { cause: 'action' });
    }
    const accessFields: AccessControlled = {
      author: currentAction.goal.roadmap.author,
      editors: currentAction.goal.roadmap.editors,
      viewers: currentAction.goal.roadmap.viewers,
      editGroups: currentAction.goal.roadmap.editGroups,
      viewGroups: currentAction.goal.roadmap.viewGroups,
    }
    const accessLevel = accessChecker(accessFields, session.user)
    if (accessLevel === AccessLevel.None || accessLevel === AccessLevel.View) {
      throw new Error(ClientError.AccessDenied, { cause: 'action' });
    }

    // Check if the action has been updated since the client last fetched it
    if ((currentAction?.updatedAt?.getTime() || 0) > action.timestamp) {
      throw new Error(ClientError.StaleData, { cause: 'action' });
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
      console.log(e);
      return createResponse(
        response,
        JSON.stringify({ message: "Unknown internal server error" }),
        { status: 500 }
      );
    }
  }

  // Update the action
  try {
    const updatedAction = await prisma.action.update({
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
      },
      select: {
        id: true,
        goal: {
          select: {
            id: true,
            roadmap: {
              select: {
                id: true,
              }
            }
          }
        }
      }
    });
    // Prune any orphaned links and comments
    await pruneOrphans();
    // Invalidate old cache
    revalidateTag('action');
    // Return the new action's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: 'Action updated', id: updatedAction.id }),
      { status: 200, headers: { 'Location': `/roadmap/${updatedAction.goal.roadmap.id}/goal/${updatedAction.goal.id}/action/${updatedAction.id}` } }
    );
  } catch (error: any) {
    console.log(error);
    return createResponse(
      response,
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to the action API
 */
export async function DELETE(request: NextRequest) {
  const response = new Response();
  const [session, action] = await Promise.all([
    getSession(request, response),
    request.json() as Promise<{ actionId: string }>
  ]);

  // Validate request body
  if (!action.actionId) {
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
    const [user, currentAction] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, username: true, isAdmin: true, userGroups: true }
      }),
      prisma.action.findUnique({
        where: {
          id: action.actionId,
          // The user must be admin, or have authored the action or one of its parents
          ...(session.user.isAdmin ? {} : {
            OR: [
              { authorId: session.user.id },
              { goal: { authorId: session.user.id } },
              { goal: { roadmap: { authorId: session.user.id } } },
              { goal: { roadmap: { metaRoadmap: { authorId: session.user.id } } } },
            ]
          })
        },
      }),
    ]);

    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'action' });
    }

    // If the action is not found it eiter does not exist or the user has no access to it
    if (!currentAction) {
      throw new Error(ClientError.AccessDenied, { cause: 'action' });
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
      console.log(e);
      return createResponse(
        response,
        JSON.stringify({ message: "Unknown internal server error" }),
        { status: 500 }
      );
    }
  }

  // Delete the action
  try {
    const deletedAction = await prisma.action.delete({
      where: {
        id: action.actionId
      },
      select: {
        id: true,
        goal: {
          select: {
            id: true,
            roadmap: {
              select: {
                id: true,
              }
            }
          }
        }
      }
    });
    // Prune any orphaned links and comments
    await pruneOrphans();
    // Invalidate old cache
    revalidateTag('action');
    return createResponse(
      response,
      JSON.stringify({ message: 'Action deleted', id: deletedAction.id }),
      // Redirect to the parent goal
      { status: 200, headers: { 'Location': `/roadmap/${deletedAction.goal.roadmap.id}/goal/${deletedAction.goal.id}` } }
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