import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import { RoadmapInput } from "@/types";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let roadmap: RoadmapInput = await request.json();

  // Validate request body
  if (!roadmap.name || (!roadmap.county && !roadmap.isNational)) {
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

  // Only admins can create national roadmaps
  if (roadmap.isNational && !session.user?.isAdmin) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Forbidden; only admins can create national roadmaps' }),
      { status: 403 }
    );
  }

  // Create lists of UUIDs for linking
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
        name: roadmap.name,
        isNational: roadmap.isNational,
        county: roadmap.county,
        municipality: roadmap.municipality,
        author: { connect: { id: session.user.id } },
        editors: { connect: editors },
        viewers: { connect: viewers },
        editGroups: { connect: editGroups },
        viewGroups: { connect: viewGroups },
      },
    });
    // Return the new roadmap's ID if successful
    return createResponse(
      response,
      JSON.stringify({ message: "Roadmap created", id: newRoadmap.id }),
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