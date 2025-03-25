import prisma from "@/lib/prisma";
import {
  groupBy as groupByRemeda,
  map,
  pipe,
  prop,
  reduce,
  uniqueBy,
} from "remeda";
import { Spell } from "@prisma/client";

export enum SPELLS_GROUP_BY {
  CHARACTER = "character",
  LEVEL = "level",
  ALPHABETICAL = "alphabetical",
}

export const getCharacterSpellsByLevel = async ({
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
