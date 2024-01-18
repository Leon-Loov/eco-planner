import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { AccessLevel, GoalInput, RoadmapInput } from "@/types";
import roadmapGoalCreator from "./roadmapGoalCreator";
import accessChecker from "@/lib/accessChecker";
import { revalidateTag } from "next/cache";
import goalInputFromRoadmap from "@/functions/goalInputFromRoadmap.ts";
import getOneRoadmap from "@/fetchers/getOneRoadmap";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let roadmap: RoadmapInput & { goals?: GoalInput[] } = await request.json();

  // Validate request body
  if (!roadmap.metaRoadmapId) {
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

  // If a parent roadmap is defined to be inherited from, append its goals to the new roadmap's goals
  if (roadmap.inheritFromId) {
    try {
      const parentRoadmap = await getOneRoadmap(roadmap.inheritFromId);
      if (parentRoadmap) {
        roadmap.goals = [...(roadmap.goals || []), ...goalInputFromRoadmap(parentRoadmap)];
      }
    } catch (e) {
      console.log(e);
      return createResponse(
        response,
        JSON.stringify({ message: 'Failed to fetch roadmap to inherit from' }),
        { status: 400 }
      );
    }
  }

  // Get the highest existing version number for this meta roadmap, defaulting to 0
  let latestVersion: number;
  try {
    latestVersion = (await prisma.roadmap.aggregate({
      where: { metaRoadmapId: roadmap.metaRoadmapId },
      _max: { version: true },
    }))._max.version || 0;
  } catch {
    return createResponse(
      response,
      JSON.stringify({ message: 'Failed to fetch latest roadmap version' }),
      { status: 500 }
    );
  }

  // Create lists of names for linking
  let editors: { username: string }[] = [];
  for (let name of roadmap.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of roadmap.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of roadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of roadmap.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Create the roadmap
  try {
    let newRoadmap = await prisma.roadmap.create({
      data: {
        description: roadmap.description,
        version: latestVersion + 1,
        targetVersion: roadmap.targetVersion,
        author: { connect: { id: session.user.id } },
        editors: { connect: editors },
        viewers: { connect: viewers },
        editGroups: { connect: editGroups },
        viewGroups: { connect: viewGroups },
        metaRoadmap: { connect: { id: roadmap.metaRoadmapId } },
        goals: {
          create: roadmapGoalCreator(roadmap, session.user.id),
        },
      },
    });
    // Invalidate old cache
    revalidateTag('roadmap');
    // Return the new roadmap's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Roadmap created", id: newRoadmap.id }),
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    // Custom error if there are errors in the nested goal creation
    if (e instanceof Error) {
      e = e as Error
      if (e.cause == 'nestedGoalCreation') {
        return createResponse(
          response,
          JSON.stringify({ message: e.message }),
          { status: 400 }
        );
      }
    }
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

  // The version number is not allowed to be changed
  let roadmap: Omit<RoadmapInput, 'version'> & { goals?: GoalInput[], roadmapId: string, timestamp?: number } = await request.json();

  // Validate request body
  if (!roadmap.metaRoadmapId) {
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
    let access: AccessLevel = AccessLevel.None;
    let currentRoadmap = await prisma.roadmap.findUnique({
      where: { id: roadmap.roadmapId },
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

    if (!roadmap.timestamp || (currentRoadmap?.updatedAt?.getTime() || 0) > roadmap.timestamp) {
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

  // Create lists of names for linking
  let editors: { username: string }[] = [];
  for (let name of roadmap.editors || []) {
    editors.push({ username: name });
  }

  let viewers: { username: string }[] = [];
  for (let name of roadmap.viewers || []) {
    viewers.push({ username: name });
  }

  let editGroups: { name: string }[] = [];
  for (let name of roadmap.editGroups || []) {
    editGroups.push({ name: name });
  }

  let viewGroups: { name: string }[] = [];
  for (let name of roadmap.viewGroups || []) {
    viewGroups.push({ name: name });
  }

  // Update the roadmap
  try {
    // Update roadmap, goals, and actions in a single transaction
    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmap.roadmapId },
      data: {
        description: roadmap.description,
        targetVersion: roadmap.targetVersion,
        editors: { set: editors },
        viewers: { set: viewers },
        editGroups: { set: editGroups },
        viewGroups: { set: viewGroups },
        goals: {
          create: roadmapGoalCreator(roadmap, session.user!.id),
        }
      },
    });
    // Invalidate old cache
    revalidateTag('roadmap');
    // Return the new roadmap's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Roadmap updated", id: updatedRoadmap.id }),
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    // Custom error if there are errors in the nested goal creation
    if (e instanceof Error) {
      e = e as Error
      if (e.cause == 'nestedGoalCreation') {
        return createResponse(
          response,
          JSON.stringify({ message: e.message }),
          { status: 400 }
        );
      }
    }
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