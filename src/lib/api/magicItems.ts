import prisma from "@/lib/prisma";

export const getUnassignedMagicItems = async () => {
  return prisma.magicItem.findMany({
    where: { characterId: null },
    orderBy: [{ name: "asc" }],
  });
};
