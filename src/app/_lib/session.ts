import { getIronSession, createResponse } from "iron-session";

export interface Data {
  user?: {
    id: string;
    username: string;
    isLoggedIn?: boolean;
    isAdmin?: boolean;
  };
}

export const getSession = (req: Request, res: Response) => {
  const session = getIronSession<Data>(req, res, {
    password: process.env.IRON_SESSION_PASSWORD!,
    cookieName: "eco_planner_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  });

  return session;
};

export { createResponse };