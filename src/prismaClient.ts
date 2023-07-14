// This file makes it so we can use a single instance of PrismaClient across the entire application.
// There will still be multiple instances running in dev environment, but it's not really a problem.
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export default prisma;