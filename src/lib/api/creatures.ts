import prisma from "@/lib/prisma";
import { Creature, CreaturesOnCharacters } from "@prisma/client";
import { groupBy as remedaGroupBy, map, mergeDeep } from "remeda";
import { Creature as FullCreature } from "@/types/types";
import { localCreatures } from "@/data/localCreatures";
import { creatureOverrides } from "@/data/creatureOverrides";
import { creatureSchema } from "@/types/schemas";

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
          isFavorite: filterBy ? filterBy === CREATURES_FILTER_BY.FAVORITE : undefined,
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
    return remedaGroupBy(flattenedCreatures, (creature) => creature.challengeRating.toString());
  }

  return remedaGroupBy(flattenedCreatures, (creature) => creature.name[0].toLowerCase());
}

/**
 * Returns every creature the app can render without a live fetch: the local creatures
 * (src/data/localCreatures.ts) plus every creature already stored in the DB cache
 * (CachedCreature), with creatureOverrides deep-merged on top of the cached ones.
 * Creatures are sorted by name and grouped either alphabetically or by challenge rating.
 */
export async function getAllAvailableCreatures({
  groupBy = CREATURES_GROUP_BY.ALPHABETICAL,
}: {
  groupBy?: CREATURES_GROUP_BY;
}) {
  const local = Object.values(localCreatures);

  const cachedRows = await prisma.cachedCreature.findMany();
  const cached = cachedRows.flatMap((row) => {
    const parsed = creatureSchema.safeParse(row.data);
    if (!parsed.success) {
       
      console.error(`Failed to parse cached creature "${row.id}":`, parsed.error);
      return [];
    }

    const override = creatureOverrides[row.id];
    return [(override ? mergeDeep(parsed.data, override) : parsed.data) as FullCreature];
  });

  const allCreatures = [...local, ...cached].sort((a, b) =>
    a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
  );

  if (groupBy === CREATURES_GROUP_BY.CR) {
    return remedaGroupBy(allCreatures, (creature) => creature.challengeRating.toString());
  }

  return remedaGroupBy(allCreatures, (creature) => creature.name[0].toLowerCase());
}
