import prisma from "@/lib/prisma";

export const getOwnersParties = async ({
  ownerEmail,
}: {
  ownerEmail?: string;
}) => {
  return prisma.party.findMany({
    where: {
      campaigns: {
        some: {
          character: {
            some: {
              owner: ownerEmail,
            },
          },
        },
      },
    },
  });
};
