import prisma from "@/lib/prisma";

export const getUnassignedInventoryItems = async () => {
  return prisma.inventoryItem.findMany({
    where: { characterId: null },
    orderBy: [{ name: "asc" }],
  });
};
