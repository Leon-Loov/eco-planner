import { getIronSession, createResponse, unsealData } from "iron-session";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export interface Data {
  user?: {
    id: string;
    username: string;
    isLoggedIn?: boolean;
  };
}

const options = {
  password: process.env.IRON_SESSION_PASSWORD!,
  cookieName: "eco_planner",
  cookieOptions: {
    // Uses https in production and http in development
    secure: process.env.NODE_ENV === "production",
  },
}

export async function getSessionData(cookies: Pick<RequestCookies, 'get'>) {
  const seal = cookies.get(options.cookieName)?.value
  if (!seal) return {}
  return unsealData<Data>(seal, options)
}

export const getSession = (req: Request, res: Response) => {
  const session = getIronSession<Data>(req, res, options);

  return session;
};

export { createResponse };