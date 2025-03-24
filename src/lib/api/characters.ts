import prisma from "@/lib/prisma";

export const getCharactersByOwner = async (ownerEmail?: string) => {
  return prisma.character.findMany({
    where: { owner: ownerEmail },
    include: {
      campaign: {
        include: {
          party: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
};
