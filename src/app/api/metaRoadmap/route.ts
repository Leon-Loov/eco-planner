import { NextRequest } from "next/server";
import { createResponse, getSession } from "@/lib/session";
import { AccessControlled, AccessLevel, ClientError, MetaRoadmapInput } from "@/types";
import { RoadmapType } from "@prisma/client";
import prisma from "@/prismaClient";
import { revalidateTag } from "next/cache";
import accessChecker from "@/lib/accessChecker";

/**
 * Handles POST requests to the metaRoadmap API
 */
export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  const metaRoadmap: MetaRoadmapInput = await request.json();

  // Validate request body
  if (!metaRoadmap.name || !metaRoadmap.description) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // If given roadmap type is invalid, set it to OTHER
  if (!Object.values(RoadmapType).includes(metaRoadmap.type!)) {
    metaRoadmap.type = RoadmapType.OTHER;
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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, isAdmin: true, userGroups: true }
    })
    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'meta roadmap' });
    }

    // Get the target metaRoadmap (if any) to check if the user has access to it
    if (metaRoadmap.parentRoadmapId) {
      const targetRoadmap = await prisma.metaRoadmap.findUnique({
        where: { id: metaRoadmap.parentRoadmapId },
        include: {
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });

      if (!targetRoadmap) {
        throw new Error(ClientError.IllegalParent, { cause: 'meta roadmap' });
      }

      const accessFields: AccessControlled = {
        author: targetRoadmap.author,
        editors: targetRoadmap.editors,
        viewers: targetRoadmap.viewers,
        editGroups: targetRoadmap.editGroups,
        viewGroups: targetRoadmap.viewGroups,
      }
      const accessLevel = accessChecker(accessFields, session.user)
      // For now, being able to view a meta roadmap is enough to create a new one working towards it.
      if (accessLevel === AccessLevel.None) {
        throw new Error(ClientError.IllegalParent, { cause: 'meta roadmap' });
      }
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

  // Only allow admins to create national roadmaps
  if (metaRoadmap.type == RoadmapType.NATIONAL && !session.user.isAdmin) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Forbidden; only admins may create national roadmaps' }),
      { status: 403 }
    );
  }

  // Create lists of names for linking
  const editors: { username: string }[] = [];
  for (const name of metaRoadmap.editors || []) {
    editors.push({ username: name });
  }

  const viewers: { username: string }[] = [];
  for (const name of metaRoadmap.viewers || []) {
    viewers.push({ username: name });
  }

  const editGroups: { name: string }[] = [];
  for (const name of metaRoadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  const viewGroups: { name: string }[] = [];
  for (const name of metaRoadmap.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Create the new meta roadmap
  try {
    const newMetaRoadmap = await prisma.metaRoadmap.create({
      data: {
        name: metaRoadmap.name,
        description: metaRoadmap.description,
        type: metaRoadmap.type,
        actor: metaRoadmap.actor,
        parentRoadmap: metaRoadmap.parentRoadmapId ? { connect: { id: metaRoadmap.parentRoadmapId } } : undefined,
        links: {
          create: metaRoadmap.links?.map(link => {
            return {
              url: link.url,
              description: link.description || undefined,
            }
          })
        },
        author: { connect: { id: session.user.id } },
        editors: { connect: editors },
        viewers: { connect: viewers },
        editGroups: { connect: editGroups },
        viewGroups: { connect: viewGroups },
      }
    });
    // Invalidate old cache
    revalidateTag('roadmap');
    revalidateTag('metaRoadmap');
    // Return the new meta roadmap's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Roadmap metadata created. \n You will now be sent to another form to add goals and other details for the first version of this roadmap", id: newMetaRoadmap.id }),
      { status: 201, headers: { 'Location': `/roadmap/createRoadmap?metaRoadmapId=${newMetaRoadmap.id}` } }
    );
  } catch (e: any) {
    console.log(e);
    if (e?.code == 'P2025') {
      return createResponse(
        response,
        JSON.stringify({ message: 'Failed to connect records. Probably invalid editor, viewer, editGroup, and/or viewGroup name(s)' }),
        { status: 400 }
      )
    }
    return createResponse(
      response,
      JSON.stringify({ message: 'Failed to create roadmap metadata' }),
      { status: 500 }
    );
  }
}

/**
 * Handles PUT requests to the metaRoadmap API
 */
export async function PUT(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  const metaRoadmap: MetaRoadmapInput & { id: string, timestamp?: number } = await request.json();

  // Validate request body
  if (!metaRoadmap.id || !metaRoadmap.name || !metaRoadmap.description) {
    return new Response(
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // If given roadmap type is invalid, set it to OTHER. If type is undefined leave it be; it wont update the existing value in the database
  if (!Object.values(RoadmapType).includes(metaRoadmap.type!) && metaRoadmap.type !== undefined) {
    metaRoadmap.type = RoadmapType.OTHER;
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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, isAdmin: true, userGroups: true }
    })
    // If no user is found or the found user falsely claims to be an admin, they have a bad session cookie and should be logged out
    if (!user || (session.user.isAdmin && !user.isAdmin)) {
      throw new Error(ClientError.BadSession, { cause: 'meta roadmap' });
    }

    // Get the current meta roadmap to check if the user has access to it
    const currentRoadmap = await prisma.metaRoadmap.findUnique({
      where: { id: metaRoadmap.id },
      include: {
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
    const currentAccess = accessChecker(currentRoadmap, session.user)
    if (currentAccess === AccessLevel.None || currentAccess === AccessLevel.View) {
      throw new Error(ClientError.AccessDenied, { cause: 'meta roadmap' });
    }

    // Get the target metaRoadmap (if any) to check if the user has access to it
    if (metaRoadmap.parentRoadmapId) {
      const targetRoadmap = await prisma.metaRoadmap.findUnique({
        where: { id: metaRoadmap.parentRoadmapId },
        include: {
          author: { select: { id: true, username: true } },
          editors: { select: { id: true, username: true } },
          viewers: { select: { id: true, username: true } },
          editGroups: { include: { users: { select: { id: true, username: true } } } },
          viewGroups: { include: { users: { select: { id: true, username: true } } } },
        }
      });
      const targetAccess = accessChecker(targetRoadmap, session.user)
      if (targetAccess === AccessLevel.None) {
        throw new Error(ClientError.IllegalParent);
      }
    }

    if (!metaRoadmap.timestamp || (currentRoadmap?.updatedAt?.getTime() || 0) > metaRoadmap.timestamp) {
      throw new Error(ClientError.StaleData, { cause: 'meta roadmap' });
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
      if (e.message == ClientError.IllegalParent) {
        return createResponse(
          response,
          JSON.stringify({ message: ClientError.IllegalParent }),
          { status: 403 }
        );
      }
      return createResponse(
        response,
        JSON.stringify({ message: ClientError.AccessDenied }),
        { status: 403 }
      );
    }
    // If non-error is thrown, log it and return a generic error message
    else {
      console.log(e);
      return createResponse(
        response,
        JSON.stringify({ message: "Unknown internal server error" }),
        { status: 500 }
      );
    }
  }

  // Only allow admins to create national roadmaps
  if (metaRoadmap.type == RoadmapType.NATIONAL && !session.user?.isAdmin) {
    return new Response(
      JSON.stringify({ message: 'Forbidden; only admins can create national roadmaps' }),
      { status: 403 }
    );
  }

  // Create lists of names for linking
  const editors: { username: string }[] = [];
  for (const name of metaRoadmap.editors || []) {
    editors.push({ username: name });
  }

  const viewers: { username: string }[] = [];
  for (const name of metaRoadmap.viewers || []) {
    viewers.push({ username: name });
  }

  const editGroups: { name: string }[] = [];
  for (const name of metaRoadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  const viewGroups: { name: string }[] = [];
  for (const name of metaRoadmap.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Update the meta roadmap
  try {
    const updatedMetaRoadmap = await prisma.metaRoadmap.update({
      where: { id: metaRoadmap.id },
      data: {
        name: metaRoadmap.name,
        description: metaRoadmap.description,
        type: metaRoadmap.type,
        actor: metaRoadmap.actor,
        parentRoadmap: metaRoadmap.parentRoadmapId ? { connect: { id: metaRoadmap.parentRoadmapId } } : undefined,
        links: {
          set: [],
          create: metaRoadmap.links?.map(link => {
            return {
              url: link.url,
              description: link.description || undefined,
            }
          })
        },
        editors: { set: editors },
        viewers: { set: viewers },
        editGroups: { set: editGroups },
        viewGroups: { set: viewGroups },
      }
    });
    // Invalidate old cache
    revalidateTag('roadmap');
    revalidateTag('metaRoadmap');
    // Return the updated meta roadmap's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Roadmap metadata updated", id: updatedMetaRoadmap.id }),
      { status: 200, headers: { 'Location': `/metaRoadmap/${updatedMetaRoadmap.id}` } }
    );
  } catch (e: any) {
    console.log(e);
    if (e?.code == 'P2025') {
      return createResponse(
        response,
        JSON.stringify({ message: 'Failed to connect records. Probably invalid editor, viewer, editGroup, and/or viewGroup name(s)' }),
        { status: 400 }
      )
    }
    return createResponse(
      response,
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}