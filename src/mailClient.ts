// This file allows us to use a single transport instance across the entire application.
import { createTransport } from "nodemailer";

const mailClient = createTransport({
  host: process.env.MAIL_HOST || "",
  port: 465,
  name: "eco-planner",
  secure: true,
  authMethod: "LOGIN",
  auth: {
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASSWORD || "",
  },
});

export default mailClient;