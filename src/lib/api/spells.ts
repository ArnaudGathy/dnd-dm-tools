import prisma from "@/lib/prisma";
import { groupBy as groupByRemeda, map, pipe, prop, reduce, uniqueBy } from "remeda";
import { Spell, Character, Classes, SpellAction, SpellsOnCharacters } from "@prisma/client";

export enum SPELLS_GROUP_BY {
  CHARACTER = "character",
  LEVEL = "level",
  ALPHABETICAL = "alphabetical",
}

export type SpellWithFlags = Spell &
  Pick<
    SpellsOnCharacters,
    | "isFavorite"
    | "isPrepared"
    | "isAlwaysPrepared"
    | "hasLongRestCast"
    | "canBeSwappedOnLongRest"
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
      isPrepared: r.isPrepared,
      hasLongRestCast: r.hasLongRestCast,
      canBeSwappedOnLongRest: r.canBeSwappedOnLongRest,
      canBeSwappedOnLevelUp: r.canBeSwappedOnLevelUp,
    },
  }));
  if (groupBy === SPELLS_GROUP_BY.CHARACTER) {
    return reduce(
      transformedResponse,
      (acc: { [key: string]: SpellWithFlags[] }, next) => {
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

  const spells = pipe(transformedResponse, map(prop("spell")), uniqueBy(prop("id")));

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

export const getAllSpells = async ({
  groupBy = SPELLS_GROUP_BY.LEVEL,
  ritualOnly = false,
  concentrationOnly = false,
  actionTypes,
  level,
  search,
  spellClass,
}: {
  groupBy?: SPELLS_GROUP_BY;
  ritualOnly?: boolean;
  concentrationOnly?: boolean;
  actionTypes?: SpellAction[];
  level?: number;
  search?: string;
  spellClass?: Classes;
} = {}) => {
  const spells = (
    await prisma.spell.findMany({
      where: {
        ...(ritualOnly ? { isRitual: true } : {}),
        ...(concentrationOnly ? { concentration: true } : {}),
        ...(actionTypes && actionTypes.length > 0 ? { actionType: { in: actionTypes } } : {}),
        ...(level !== undefined ? { level } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
        ...(spellClass ? { classes: { has: spellClass } } : {}),
      },
      // Exclude the heavy `data` payload — the list only needs these columns.
      select: {
        id: true,
        name: true,
        level: true,
        isRitual: true,
        concentration: true,
        actionType: true,
        classes: true,
      },
    })
  ).sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));

  if (groupBy === SPELLS_GROUP_BY.LEVEL) {
    return groupByRemeda(spells, (spell) => spell.level.toString());
  }

  return groupByRemeda(spells, (spell) => spell.name[0].toLowerCase());
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
  isWizard = false,
  usableOnly = false,
  level,
  ritualOnly = false,
  concentrationOnly = false,
  actionTypes,
  hasLongRestCast = false,
  canBeSwappedOnLongRest = false,
  canBeSwappedOnLevelUp = false,
}: {
  characterId?: number;
  search?: string;
  groupBy?: SPELLS_GROUP_BY;
  isWizard?: boolean;
  usableOnly?: boolean;
  level?: number;
  ritualOnly?: boolean;
  concentrationOnly?: boolean;
  actionTypes?: SpellAction[];
  hasLongRestCast?: boolean;
  canBeSwappedOnLongRest?: boolean;
  canBeSwappedOnLevelUp?: boolean;
}) => {
  const response = await prisma.spellsOnCharacters.findMany({
    where: {
      characterId,
      // Config flags live on the join row.
      ...(hasLongRestCast ? { hasLongRestCast: true } : {}),
      ...(canBeSwappedOnLongRest ? { canBeSwappedOnLongRest: true } : {}),
      ...(canBeSwappedOnLevelUp ? { canBeSwappedOnLevelUp: true } : {}),
      // Spell properties live on the related Spell.
      spell: {
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
        ...(level !== undefined ? { level } : {}),
        ...(ritualOnly ? { isRitual: true } : {}),
        ...(concentrationOnly ? { concentration: true } : {}),
        ...(actionTypes && actionTypes.length > 0 ? { actionType: { in: actionTypes } } : {}),
      },
      // "Usable" mirrors isSpellUsable: prepared, always prepared, a free
      // long-rest cast, or (for wizards) a ritual.
      ...(usableOnly
        ? {
            OR: [
              { isPrepared: true },
              { isAlwaysPrepared: true },
              { hasLongRestCast: true },
              ...(isWizard ? [{ spell: { isRitual: true } }] : []),
            ],
          }
        : {}),
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
