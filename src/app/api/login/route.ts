import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"
import prisma from "@/prismaClient";

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
  let user: { id: string; username: string; };

  try {
    user = await prisma.user.findFirstOrThrow({
      where: {
        username: username,
        // TODO: Hash password
        password: password,
      },
      select: {
        id: true,
        username: true,
      }
    });
  } catch (e) {
    console.log(e);
    return createResponse(
      response,
      JSON.stringify({ message: 'Invalid username or password' }),
      { status: 400 }
    );
  }

  // Set session
  session.user = {
    id: user.id,
    username: user.username,
    isLoggedIn: true,
  };

  await session.save();

  return createResponse(
    response,
    JSON.stringify({ message: 'Login successful' }),
    { status: 200 }
  );
}