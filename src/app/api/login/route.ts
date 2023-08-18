import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  let { username, password }: { username: string, password: string } = await request.json();

  // Validate request body
  if (!username || !password) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Username and password are required' }),
      { status: 400 }
    );
  }

  // Validate credentials
  let user: { id: string; username: string; password: string; isAdmin: boolean };

  try {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        isAdmin: true,
      }
    });
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: 'User not found' }),
      { status: 400 }
    );
  }

  // Check password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return createResponse(
      response,
      JSON.stringify({ message: 'Incorrect password' }),
      { status: 400 }
    );
  }

  // Set session
  session.user = {
    id: user.id,
    username: user.username,
    isLoggedIn: true,
    isAdmin: user.isAdmin,
  };

  await session.save();

  return createResponse(
    response,
    JSON.stringify({ message: 'Login successful' }),
    { status: 200 }
  );
}