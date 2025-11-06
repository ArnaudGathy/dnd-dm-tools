import prisma from "@/lib/prisma";
import { CampaignId, CharacterStatus, PartyId } from "@prisma/client";

export const getNumberOfCharactersByOwner = async ({ ownerEmail }: { ownerEmail?: string }) => {
  return prisma.character.count({
    where: {
      OR: [{ owner: ownerEmail }, { campaign: { owner: ownerEmail } }],
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
      OR: [{ owner: ownerEmail }, { campaign: { owner: ownerEmail } }],
      AND: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          campaign: {
            name: campaign,
            party: {
              name: party,
            },
          },
        },
        {
          status: {
            equals: status,
          },
        },
      ],
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
          creaturesOnCharacters: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
};

export const getAllFilteredCharacters = async ({
  search,
  campaign,
  party,
  status,
}: {
  search?: string;
  campaign?: CampaignId;
  party?: PartyId;
  status?: CharacterStatus;
}) => {
  return prisma.character.findMany({
    where: {
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
          creaturesOnCharacters: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
};

export const getCharacterById = async ({ characterId }: { characterId: number }) => {
  return prisma.character.findUnique({
    where: {
      id: characterId,
    },
    include: {
      campaign: {
        include: {
          party: true,
        },
      },
      spellsOnCharacters: {
        include: {
          spell: true,
        },
      },
      skills: {
        orderBy: [{ skill: "asc" }],
      },
      capacities: {
        orderBy: [{ name: "asc" }],
      },
      savingThrows: {
        orderBy: [{ ability: "asc" }],
      },
      armors: {
        orderBy: [{ name: "asc" }],
      },
      weapons: {
        include: {
          damages: true,
        },
        orderBy: [{ name: "asc" }],
      },
      inventory: {
        orderBy: [{ name: "asc" }],
      },
      wealth: {
        orderBy: [{ id: "asc" }],
      },
      _count: {
        select: {
          spellsOnCharacters: true,
          creaturesOnCharacters: true,
        },
      },
    },
  });
};

export const getCharactersFromCampaignId = (campaignId: number) => {
  return prisma.character.findMany({
    where: {
      campaignId: campaignId,
      status: CharacterStatus.ACTIVE,
    },
    include: {
      spellsOnCharacters: true,
      creaturesOnCharacters: true,
    },
  });
};
