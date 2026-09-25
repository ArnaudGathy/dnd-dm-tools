import prisma from "@/lib/prisma";
import { sortByName } from "@/utils/sort";

export const getUnassignedMagicItems = async () => {
  const items = await prisma.magicItem.findMany({
    where: { characterId: null },
  });
  return sortByName(items);
};
