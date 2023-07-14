import { getIronSession, createResponse, unsealData } from "iron-session";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

// The information we store in our cookie
export interface Data {
  user?: {
    id: string;
    username: string;
    isLoggedIn?: boolean;
  };
}

// Config stuff for Iron-Session
const options = {
  password: process.env.IRON_SESSION_PASSWORD!,
  cookieName: "eco_planner",
  cookieOptions: {
    // Uses https in production and http in development
    secure: process.env.NODE_ENV === "production",
  },
}

/**
 * Accepts cookies as input and if our cookie is included the contents of it is returned.
 */
export async function getSessionData(cookies: Pick<RequestCookies, 'get'>) {
  const seal = cookies.get(options.cookieName)?.value
  if (!seal) return {}
  return unsealData<Data>(seal, options)
}

/**
 * Gets our cookie data from an incoming request
 */
export function getSession(req: Request, res: Response) {
  const session = getIronSession<Data>(req, res, options);
  return session;
};

export { createResponse };