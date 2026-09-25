import prisma from "@/lib/prisma";
import {
  Armor,
  CampaignId,
  Capacity,
  Character,
  CharacterStatus,
  InventoryItem,
  MagicItem,
  PartyId,
  Skill,
} from "@prisma/client";
import { applyMagicItemEffects } from "@/utils/items";
import { compareLocale, sortByName } from "@/utils/sort";

const STATUS_ORDER = Object.values(CharacterStatus);

const sortCharacters = <T extends { status: CharacterStatus; name: string }>(characters: T[]) =>
  characters.toSorted(
    (a, b) =>
      STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
      compareLocale(a.name, b.name),
  );

export const getNumberOfCharactersByOwner = async ({ ownerEmail }: { ownerEmail?: string }) => {
  return prisma.character.count({
    where: {
      OR: [{ owner: ownerEmail }, { campaign: { owner: { has: ownerEmail } } }],
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
  const characters = await prisma.character.findMany({
    where: {
      OR: [{ owner: ownerEmail }, { campaign: { owner: { has: ownerEmail } } }],
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
  });
  return sortCharacters(characters);
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
  const characters = await prisma.character.findMany({
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
  });
  return sortCharacters(characters);
};

export const getCharacterById = async ({ characterId }: { characterId: number }) => {
  const character = await prisma.character.findUnique({
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
      capacities: true,
      savingThrows: {
        orderBy: [{ ability: "asc" }],
      },
      armors: true,
      weapons: {
        include: {
          damages: true,
        },
      },
      inventory: true,
      wealth: {
        orderBy: [{ id: "asc" }],
      },
      magicItems: true,
      _count: {
        select: {
          spellsOnCharacters: true,
          creaturesOnCharacters: true,
        },
      },
    },
  });

  return (
    character && {
      ...character,
      capacities: sortByName(character.capacities),
      armors: sortByName(character.armors),
      weapons: sortByName(character.weapons),
      inventory: sortByName(character.inventory),
      magicItems: sortByName(character.magicItems),
    }
  );
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

export type DMScreenCharacter = Character & {
  armors: Armor[];
  skills: Skill[];
  capacities: Capacity[];
  inventory: InventoryItem[];
  magicItems: MagicItem[];
};
export const getDMScreenCharactersFromCampaignId = async (
  campaignName = CampaignId.TOMB,
  partyName = PartyId.MIFA,
) => {
  const party = await prisma.party.findFirst({
    where: {
      name: partyName,
    },
  });

  if (party) {
    const campaign = await prisma.campaign.findUnique({
      where: {
        name_partyId: {
          partyId: party.id,
          name: campaignName,
        },
      },
    });

    if (campaign) {
      const characters = await prisma.character.findMany({
        where: {
          campaignId: campaign.id,
          status: CharacterStatus.ACTIVE,
        },
        include: {
          armors: true,
          skills: true,
          capacities: true,
          inventory: true,
          magicItems: true,
        },
      });
      return characters.map(applyMagicItemEffects);
    }
  }

  throw new Error(`Character not found for party ${partyName} and the campaign ${campaignName}`);
};
