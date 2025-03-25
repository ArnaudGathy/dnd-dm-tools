import prisma from "@/lib/prisma";
import { CampaignId, CharacterStatus, PartyId } from "@prisma/client";

export const getNumberOfCharactersByOwner = async ({
  ownerEmail,
}: {
  ownerEmail?: string;
}) => {
  return prisma.character.count({
    where: {
      owner: ownerEmail,
    },
  });
};

export const getFilteredCharactersByOwner = async ({
  ownerEmail,
  search,
  campaign,
  party,
  status,
}: {
  ownerEmail?: string;
  search?: string;
  campaign?: CampaignId;
  party?: PartyId;
  status?: CharacterStatus;
}) => {
  return prisma.character.findMany({
    where: {
      owner: ownerEmail,
      name: {
        contains: search,
        mode: "insensitive",
      },
      campaign: {
        name: campaign,
        party: {
          name: party,
        },
      },
      status: {
        equals: status,
      },
    },
    include: {
      campaign: {
        include: {
          party: true,
        },
      },
      _count: {
        select: {
          spellsOnCharacters: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
};
