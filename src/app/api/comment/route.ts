import findTypeFromId from "@/functions/findTypeFromId";
import { getSession } from "@/lib/session";
import prisma from "@/prismaClient";
import { createResponse } from "iron-session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  // Validate session
  if (!session.user?.isLoggedIn) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Unauthenticated, only registered users can comment' }),
      { status: 401 }
    );
  }

  let comment: { commentText: string, objectId: string } = await request.json();
  let objectType = await findTypeFromId(comment.objectId).catch((err) => { return "" });

  if (comment.commentText == "") {
    return createResponse(
      response,
      JSON.stringify({ message: 'Comment text cannot be empty' }),
      { status: 400 }
    );
  }
  if (objectType == "") {
    return createResponse(
      response,
      JSON.stringify({ message: 'Invalid object id' }),
      { status: 400 }
    );
  }

  // Create comment
  try {
    let newComment = await prisma.comment.create({
      data: {
        commentText: comment.commentText,
        authorId: session.user.id,
        actionId: objectType == "action" ? comment.objectId : undefined,
        goalId: objectType == "goal" ? comment.objectId : undefined,
        roadmapId: objectType == "roadmap" ? comment.objectId : undefined,
      }
    });
    return createResponse(
      response,
      JSON.stringify({ message: 'Comment created', id: newComment.id }),
      { status: 200 }
    );
  } catch (err) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Error creating comment' }),
      { status: 500 }
    );
  }

  // If we get here, something went wrong
  return createResponse(
    response,
    JSON.stringify({ message: 'Internal server error' }),
    { status: 500 }
  )
}