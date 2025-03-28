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

export const getCampaigns = async () => {
  return prisma.campaign.findMany({
    orderBy: { name: "asc" },
    include: { party: true },
    where: {
      status: {
        not: "FINISHED",
      },
    },
  });
};
