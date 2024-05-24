import { NextRequest } from "next/server";
import { getSession } from "@/lib/session"
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const session = await getSession(cookies());

  // Remove session to log out
  session.destroy();

  return Response.json({ message: 'Logged out' },
    { status: 200 }
  );
}