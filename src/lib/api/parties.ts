import prisma from "@/lib/prisma";

export const getOwnersParties = async ({
  ownerEmail,
}: {
  ownerEmail?: string;
}) => {
  return prisma.party.findMany({
    where: {
      OR: [
        {
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
        {
          campaigns: {
            some: {
              owner: ownerEmail,
            },
          },
        },
      ],
    },
  });
};
