import { NextRequest } from "next/server";
import { getSession, createResponse } from "@/lib/session"

export async function POST(request: NextRequest) {
  const response = new Response();
  const session = await getSession(request, response);

  session.destroy();

  return createResponse(
    response,
    JSON.stringify({ message: 'Logged out' }),
    { status: 200 }
  );
}