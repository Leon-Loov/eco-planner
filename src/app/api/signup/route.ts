import { NextRequest, NextResponse } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient"

export async function POST(request: NextRequest) {
  let req: { username: string; email: string; password: string; } = await request.json();
  const response = new Response();
  const session = await getSession(request, response);

  // Check if request body is valid
  if (typeof req.username !== 'string' || !req.username) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Username is required' }),
      { status: 400 }
    );
  }

  if (typeof req.email !== 'string' || !req.email) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Email is required' }),
      { status: 400 }
    );
  }

  if (typeof req.password !== 'string' || !req.password) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Password is required' }),
      { status: 400 }
    );
  }


  // Check if email or username already exists; this is implicitly done by Prisma when creating a new user,
  // but we want to return a more specific error message
  const emailExists = await prisma.user.findUnique({
    where: {
      email: req.email,
    }
  });

  if (emailExists) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Email ' + req.email + ' is already in use' }),
      { status: 400 }
    );
  }

  const usernameExists = await prisma.user.findUnique({
    where: {
      username: req.username,
    }
  });

  if (usernameExists) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Username "' + req.username + '" is already taken' }),
      { status: 400 }
    );
  }

  // Create user
  try {
    await prisma.user.create({
      data: {
        username: req.username,
        email: req.email,
        password: req.password,
      }
    });
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: 'Error creating user' }),
      { status: 500 }
    );
  }

  // Set user session
  let user: { id: string; username: string; };
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        username: req.username,
      },
      select: {
        id: true,
        username: true,
      }
    });
  } catch (e) {
    console.log(e);
    return new NextResponse(
      JSON.stringify({ message: 'Error retrieving user to set user session' }),
      { status: 500 }
    );
  }

  session.user = {
    id: user.id,
    username: user.username,
    isLoggedIn: true,
  };

  await session.save();

  return createResponse(
    response,
    JSON.stringify({ message: 'User created' }),
    { status: 200 }
  )
}