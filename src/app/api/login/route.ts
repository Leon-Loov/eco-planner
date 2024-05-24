import { NextRequest } from "next/server";
import { getSession, options } from "@/lib/session"
import prisma from "@/prismaClient";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { username, password, remember }: { username: string, password: string, remember?: boolean } = await request.json();

  // Create session, set maxAge if user toggled remember me
  const session = await getSession(cookies(), remember ? {
    ...options,
    cookieOptions: {
      ...options.cookieOptions,
      maxAge: 14 * 24 * 60 * 60, // 14 days in seconds
    }
  } : options);

  // Validate request body
  if (!username || !password) {
    return Response.json({ message: 'Username and password are required' },
      { status: 400 }
    );
  }

  // Validate credentials
  let user: { id: string; username: string; password: string; isAdmin: boolean; userGroups: { name: string; }[]; };

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
        userGroups: {
          select: {
            name: true,
          }
        },
      }
    });
  } catch (e) {
    console.log(e);
    return Response.json({ message: 'User not found' },
      { status: 400 }
    );
  }

  // Check password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return Response.json({ message: 'Incorrect password' },
      { status: 400 }
    );
  }

  // Set session
  session.user = {
    id: user.id,
    username: user.username,
    isLoggedIn: true,
    isAdmin: user.isAdmin,
    userGroups: user.userGroups.map(group => group.name),
  };

  await session.save();

  // if (remember) {
  //   console.log(typeof session.updateConfig);
  //   session.updateConfig({
  //     ...options,
  //     cookieOptions: {
  //       ...options.cookieOptions,
  //       maxAge: 14 * 24 * 60 * 60, // 14 days in seconds
  //     }
  //   });
  //   session.save();
  // }

  return Response.json({ message: 'Login successful' },
    { status: 200 }
  );
}