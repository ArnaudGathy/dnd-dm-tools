import prisma from "@/lib/prisma";

export const getOwnersCampaigns = async ({
  ownerEmail,
}: {
  ownerEmail?: string;
}) => {
  return prisma.campaign.findMany({
    where: {
      character: {
        some: {
          owner: ownerEmail,
        },
      },
    },
  });
};
