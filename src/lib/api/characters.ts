import prisma from "@/lib/prisma";

export const getCharacters = async () => {
  return prisma.character.findMany();
};
