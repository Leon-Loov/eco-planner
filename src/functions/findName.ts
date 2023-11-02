import prisma from "@/prismaClient";

export default async function findName(id: string) {
  let [roadmap, goal, action] = await Promise.all([
    prisma.roadmap.findUnique({
      where: { id: id },
      select: { name: true }
    }),
    prisma.goal.findUnique({
      where: { id: id },
      select: { name: true, indicatorParameter: true }
    }),
    prisma.action.findUnique({
      where: { id: id },
      select: { name: true }
    })
  ])

  if(!roadmap && !goal && !action) {
    throw new Error("No roadmap, goal or action found with given ID.")
  }

  return (roadmap?.name || goal?.name || goal?.indicatorParameter || action?.name) as string
}