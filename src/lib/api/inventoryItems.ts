import prisma from "@/lib/prisma";
import { sortByName } from "@/utils/sort";

export const getUnassignedInventoryItems = async () => {
  const items = await prisma.inventoryItem.findMany({
    where: { characterId: null },
  });
  return sortByName(items);
};
