import { IronSession, getIronSession } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// The information we store in our cookie
export interface Data {
  user?: {
    id: string;
    username: string;
    isLoggedIn?: boolean;
    isAdmin?: boolean;
    userGroups: string[];
  };
}

// Config stuff for Iron-Session
export const options = {
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
export async function getSessionData(cookies: ReadonlyRequestCookies) {
  return getIronSession<Data>(cookies, options);
}

/**
 * Gets our cookie data from an incoming request
 */
export async function getSession(cookies: ReadonlyRequestCookies): Promise<IronSession<Data>> {
  return getIronSession<Data>(cookies, options);
};