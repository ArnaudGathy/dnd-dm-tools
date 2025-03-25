import prisma from "@/lib/prisma";
import {
  groupBy as groupByRemeda,
  map,
  pipe,
  prop,
  reduce,
  uniqueBy,
} from "remeda";
import { Spell, Character } from "@prisma/client";

export enum SPELLS_GROUP_BY {
  CHARACTER = "character",
  LEVEL = "level",
  ALPHABETICAL = "alphabetical",
}

export enum SPELLS_VIEW {
  LIST = "list",
  CARDS = "cards",
}

const getGroupedSpells = (
  response: Array<{ spell: Spell; character: Character }>,
  groupBy?: SPELLS_GROUP_BY,
) => {
  if (groupBy === SPELLS_GROUP_BY.CHARACTER) {
    return reduce(
      response,
      (acc: { [key: string]: Spell[] }, next) => {
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

  const spells = pipe(response, map(prop("spell")), uniqueBy(prop("id")));

  if (groupBy === SPELLS_GROUP_BY.LEVEL) {
    return groupByRemeda(spells, prop("level"));
  }

  return groupByRemeda(spells, (spell) => spell.name[0]);
};

export const getSpellById = (spellId: string) => {
  return prisma.spell.findUnique({
    where: {
      id: spellId,
    },
  });
};

export const getSpellByIds = (spellIds: string[]) => {
  return prisma.spell.findMany({
    where: {
      id: {
        in: spellIds,
      },
    },
  });
};

export const getGroupedCharacterSpells = async ({
  characterId,
  search,
  groupBy,
}: {
  characterId?: number;
  search?: string;
  groupBy?: SPELLS_GROUP_BY;
}) => {
  const response = await prisma.spellsOnCharacters.findMany({
    where: {
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

export const getCharactersBySpellId = async (spellId: string) => {
  const charactersWithSpell = await prisma.spellsOnCharacters.findMany({
    where: {
      spellId,
    },
    include: {
      character: true,
    },
  });

  return charactersWithSpell.map((entry) => entry.character);
};

export const getCharacterSpells = async ({
  search,
  characterId,
}: {
  search?: string;
  characterId?: number;
}) => {
  return prisma.spellsOnCharacters.findMany({
    where: {
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
