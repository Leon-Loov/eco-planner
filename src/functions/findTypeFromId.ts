import prisma from "@/prismaClient";

export default async function findTypeFromId(id: string): Promise<string> {
  const [action, goal, roadmap] = await Promise.all([
    prisma.action.findUnique({
      where: {
        id: id
      }
    }),
    prisma.goal.findUnique({
      where: {
        id: id
      }
    }),
    prisma.roadmap.findUnique({
      where: {
        id: id
      }
    }),
  ])
  if (action) {
    return "action"
  } else if (goal) {
    return "goal"
  } else if (roadmap) {
    return "roadmap"
  } else {
    throw new Error("No object found with given id")
  }
}