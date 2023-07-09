// This file makes it so we can use a single instance of PrismaClient across the entire application.
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export default prisma;