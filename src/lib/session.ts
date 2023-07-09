import { getIronSession, createResponse } from "iron-session";

export interface Data {
  user?: {
    id: string;
    username: string;
    isLoggedIn?: boolean;
    isAdmin?: boolean;
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

export const getSession = (req: Request, res: Response) => {
  const session = getIronSession<Data>(req, res, options);

  return session;
};

export { createResponse };