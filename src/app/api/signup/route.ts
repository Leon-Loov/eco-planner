import { NextRequest, NextResponse } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import { allowedDomains } from "@/lib/allowedDomains";
import prisma from "@/prismaClient"
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let { username, email, password }: { username: string; email: string; password: string; } = await request.json();

  // Validate request body
  if (!username || !email || !password) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Username, email, and password are required' }),
      { status: 400 }
    );
  }

  // Check if email or username already exists; this is implicitly done by Prisma when creating a new user,
  // but we want to return a more specific error message
  const usernameExists = await prisma.user.findUnique({
    where: {
      username: username,
    }
  });

  if (usernameExists) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Username "' + username + '" is already taken' }),
      { status: 400 }
    );
  }

  const emailExists = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (emailExists) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Email "' + email + '" is already in use' }),
      { status: 400 }
    );
  }

  // Check if email belongs to an allowed domain
  // TODO: Add actual email validation by sending a verification email
  if (!allowedDomains.includes(email.split('@')[1])) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Email domain "' + email.split('@')[1] + '" is not allowed' }),
      { status: 400 }
    );
  }

  // Hash password
  const saltRounds: number = 11;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
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
  let user: { id: string; username: string; isAdmin: boolean; userGroups: { name: string; }[]; };
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        isAdmin: true,
        userGroups: {
          select: {
            name: true,
          }
        },
      }
    });
  } catch (e) {
    console.log(e);
    return new NextResponse(
      JSON.stringify({ message: 'Error while retrieving user to set user session' }),
      { status: 500 }
    );
  }

  session.user = {
    id: user.id,
    username: user.username,
    isLoggedIn: true,
    isAdmin: user.isAdmin,
    userGroups: user.userGroups.map(group => group.name),
  };

  await session.save();

  return createResponse(
    response,
    JSON.stringify({ message: 'User created' }),
    { status: 200 }
  )
}