import findTypeFromId from "@/functions/findTypeFromId";
import { getSession } from "@/lib/session";
import prisma from "@/prismaClient";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getSession(cookies());

  // Validate session
  if (!session.user?.isLoggedIn) {
    return Response.json({ message: 'Unauthenticated, only registered users can comment' },
      { status: 401 }
    );
  }

  const comment: { commentText: string, objectId: string } = await request.json();
  const objectType = await findTypeFromId(comment.objectId).catch((err) => { return "" });

  if (comment.commentText == "") {
    return Response.json({ message: 'Comment text cannot be empty' },
      { status: 400 }
    );
  }
  if (objectType == "") {
    return Response.json({ message: 'Invalid object id' },
      { status: 400 }
    );
  }

  // Create comment
  try {
    const newComment = await prisma.comment.create({
      data: {
        commentText: comment.commentText,
        authorId: session.user.id,
        actionId: objectType == "action" ? comment.objectId : undefined,
        goalId: objectType == "goal" ? comment.objectId : undefined,
        roadmapId: objectType == "roadmap" ? comment.objectId : undefined,
      }
    });
    revalidateTag(objectType)
    return Response.json({ message: 'Comment created', id: newComment.id },
      { status: 200 }
    );
  } catch (err) {
    return Response.json({ message: 'Error creating comment' },
      { status: 500 }
    );
  }

  // If we get here, something went wrong
  return Response.json({ message: 'Internal server error' },
    { status: 500 }
  )
}