import prisma from "@/lib/prisma";
import {
  groupBy as groupByRemeda,
  map,
  pipe,
  prop,
  reduce,
  uniqueBy,
} from "remeda";
import { Spell, Character, SpellsOnCharacters } from "@prisma/client";

export enum SPELLS_GROUP_BY {
  CHARACTER = "character",
  LEVEL = "level",
  ALPHABETICAL = "alphabetical",
}

export enum SPELLS_FILTER_BY {
  FAVORITES = "favorites",
}

export enum SPELLS_VIEW {
  LIST = "list",
  CARDS = "cards",
}

export type SpellWithFavorite = Spell &
  Pick<
    SpellsOnCharacters,
    | "isFavorite"
    | "isAlwaysPrepared"
    | "canBeSwappedOnLongRest"
    | "hasLongRestCast"
    | "canBeSwappedOnLevelUp"
  >;

const getGroupedSpells = (
  response: Array<{ spell: Spell; character: Character } & SpellsOnCharacters>,
  groupBy?: SPELLS_GROUP_BY,
) => {
  const transformedResponse = response.map((r) => ({
    ...r,
    spell: {
      ...r.spell,
      isFavorite: r.isFavorite,
      isAlwaysPrepared: r.isAlwaysPrepared,
      hasLongRestCast: r.hasLongRestCast,
      canBeSwappedOnLongRest: r.canBeSwappedOnLongRest,
      canBeSwappedOnLevelUp: r.canBeSwappedOnLevelUp,
    },
  }));
  if (groupBy === SPELLS_GROUP_BY.CHARACTER) {
    return reduce(
      transformedResponse,
      (acc: { [key: string]: SpellWithFavorite[] }, next) => {
        if (!acc[next.character.name]) {
          acc[next.character.name] = [next.spell];
        } else {
          acc[next.character.name].push(next.spell);
        }
        return acc;
      },
      {},
    );
  }

  const spells = pipe(
    transformedResponse,
    map(prop("spell")),
    uniqueBy(prop("id")),
  );

  if (groupBy === SPELLS_GROUP_BY.LEVEL) {
    return groupByRemeda(spells, prop("level"));
  }

  return groupByRemeda(spells, (spell) => spell.name[0]);
};

export const getSpellById = async (spellId: string) => {
  return prisma.spell.findUnique({
    where: {
      id: spellId,
    },
  });
};

export const getSpellByIds = async (spellIds: string[]) => {
  return prisma.spell.findMany({
    where: {
      id: {
        in: spellIds,
      },
    },
    orderBy: {
      level: "asc",
    },
  });
};

export const getGroupedCharacterSpells = async ({
  characterId,
  search,
  groupBy,
  filterBy,
}: {
  characterId?: number;
  search?: string;
  groupBy?: SPELLS_GROUP_BY;
  filterBy?: SPELLS_FILTER_BY;
}) => {
  const response = await prisma.spellsOnCharacters.findMany({
    where: {
      characterId: characterId,
      isFavorite: filterBy
        ? filterBy === SPELLS_FILTER_BY.FAVORITES
        : undefined,
      spell: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    include: {
      spell: true,
      character: true,
    },
    orderBy: {
      spell: { name: "asc" },
    },
  });

  return {
    spells: getGroupedSpells(response, groupBy),
    name: response[0]?.character?.name,
  };
};

export const getCharacterSpells = async ({
  search,
  characterId,
  filterBy,
}: {
  search?: string;
  characterId?: number;
  filterBy?: SPELLS_FILTER_BY;
}) => {
  return prisma.spellsOnCharacters.findMany({
    where: {
      isFavorite: filterBy
        ? filterBy === SPELLS_FILTER_BY.FAVORITES
        : undefined,
      characterId: characterId,
      spell: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    include: {
      spell: true,
    },
    orderBy: {
      spell: { name: "asc" },
    },
  });
};
