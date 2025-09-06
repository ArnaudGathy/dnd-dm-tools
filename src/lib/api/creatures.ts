import prisma from "@/lib/prisma";
import { Creature, CreaturesOnCharacters } from "@prisma/client";
import { groupBy as remedaGroupBy, map } from "remeda";

export enum CREATURES_GROUP_BY {
  CR = "challengeRating",
  ALPHABETICAL = "alphabetical",
}

export enum CREATURES_FILTER_BY {
  FAVORITE = "favorite",
}

export type FlatCreature = CreaturesOnCharacters & Creature;

export async function getCharacterCreatures({
  characterId,
  groupBy = CREATURES_GROUP_BY.ALPHABETICAL,
  filterBy,
}: {
  characterId: number;
  groupBy: CREATURES_GROUP_BY;
  filterBy?: CREATURES_FILTER_BY;
}) {
  const creaturesList = await prisma.creaturesOnCharacters.findMany({
    where: {
      AND: [
        {
          characterId: characterId,
        },
        {
          isFavorite: filterBy
            ? filterBy === CREATURES_FILTER_BY.FAVORITE
            : undefined,
        },
      ],
    },
    include: {
      creature: true,
    },
    orderBy: {
      creature: { name: "asc" },
    },
  });

  const flattenedCreatures = map(creaturesList, (creatureOnCharacter) => ({
    ...creatureOnCharacter,
    ...creatureOnCharacter.creature,
    creature: undefined,
  })) satisfies FlatCreature[];

  if (groupBy === CREATURES_GROUP_BY.CR) {
    return remedaGroupBy(flattenedCreatures, (creature) =>
      creature.challengeRating.toString(),
    );
  }

  return remedaGroupBy(flattenedCreatures, (creature) =>
    creature.name[0].toLowerCase(),
  );
}
