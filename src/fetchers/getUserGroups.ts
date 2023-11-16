import prisma from "@/prismaClient";

export default async function getUserGroups(id: string) {
  let user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      userGroups: {
        select: {
          name: true
        }
      },
    },
  });

  let groupNames = [];
  for (let group of user?.userGroups ?? []) {
    groupNames.push(group.name);
  }

  return groupNames;
}