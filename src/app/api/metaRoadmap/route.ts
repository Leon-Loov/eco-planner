import { NextRequest } from "next/server";
import { createResponse, getSession } from "@/lib/session";
import { AccessLevel, MetaRoadmapInput } from "@/types";
import { RoadmapType } from "@prisma/client";
import prisma from "@/prismaClient";
import { revalidateTag } from "next/cache";
import accessChecker from "@/lib/accessChecker";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let metaRoadmap: MetaRoadmapInput = await request.json();

  // Validate request body
  if (!metaRoadmap.name || !metaRoadmap.description) {
    return new Response(
      JSON.stringify({ message: 'Missing required input parameters' }),
      { status: 400 }
    );
  }

  // If given roadmap type is invalid, set it to OTHER
  if (!Object.values(RoadmapType).includes(metaRoadmap.type!)) {
    metaRoadmap.type = RoadmapType.OTHER;
  }

  // Validate session
  if (!session.user?.isLoggedIn) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    );
  }

  // Only allow admins to create national roadmaps
  if (metaRoadmap.type == RoadmapType.NATIONAL && !session.user.isAdmin) {
    return new Response(
      JSON.stringify({ message: 'Forbidden; only admins can create national roadmaps' }),
      { status: 403 }
    );
  }

  // Create lists of names for linking
  let editors: { username: string }[] = [];
  for (let name of metaRoadmap.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of metaRoadmap.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of metaRoadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of metaRoadmap.viewGroups || []) {
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
    // Return the new meta roadmap's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Roadmap metadata created", id: newMetaRoadmap.id }),
      { status: 200 }
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

  // If we get here, something went wrong
  return createResponse(
    response,
    JSON.stringify({ message: 'Internal server error' }),
    { status: 500 }
  );
}

export async function PUT(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let metaRoadmap: MetaRoadmapInput & { id: string, timestamp?: number } = await request.json();

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
  const accessDenied = "You either don't have access to this entry or are trying to edit an entry that doesn't exist"
  const staleData = "Stale data; please refresh and try again"
  try {
    let access: AccessLevel = AccessLevel.None;
    let currentRoadmap = await prisma.roadmap.findUnique({
      where: { id: metaRoadmap.id },
      include: {
        author: { select: { id: true, username: true } },
        editors: { select: { id: true, username: true } },
        viewers: { select: { id: true, username: true } },
        editGroups: { include: { users: { select: { id: true, username: true } } } },
        viewGroups: { include: { users: { select: { id: true, username: true } } } },
      }
    });
    access = accessChecker(currentRoadmap, session.user)
    if (access === AccessLevel.None || access === AccessLevel.View) {
      throw new Error(accessDenied, { cause: 'roadmap' });
    }

    if (!metaRoadmap.timestamp || (currentRoadmap?.updatedAt?.getTime() || 0) > metaRoadmap.timestamp) {
      throw new Error(staleData, { cause: 'roadmap' });
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

  // Only allow admins to create national roadmaps
  if (metaRoadmap.type == RoadmapType.NATIONAL && !session.user?.isAdmin) {
    return new Response(
      JSON.stringify({ message: 'Forbidden; only admins can create national roadmaps' }),
      { status: 403 }
    );
  }

  // Create lists of names for linking
  let editors: { username: string }[] = [];
  for (let name of metaRoadmap.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of metaRoadmap.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of metaRoadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of metaRoadmap.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Update the meta roadmap
  try {
    const newMetaRoadmap = await prisma.metaRoadmap.update({
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
    // Return the edited meta roadmap's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Roadmap metadata updated", id: newMetaRoadmap.id }),
      { status: 200 }
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
      JSON.stringify({ message: 'Failed to update roadmap metadata' }),
      { status: 500 }
    );
  }

  // If we get here, something went wrong
  return createResponse(
    response,
    JSON.stringify({ message: 'Internal server error' }),
    { status: 500 }
  );
}