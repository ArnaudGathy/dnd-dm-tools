import prisma from "@/lib/prisma";
import { groupBy as groupByRemeda, prop, uniqueBy } from "remeda";
import { Spell, Classes, SpellAction, SpellsOnCharacters } from "@prisma/client";
import { getMaxCastableSpellLevel, isPreparedListClass } from "@/utils/stats/spells";

export enum SPELLS_GROUP_BY {
  CHARACTER = "character",
  LEVEL = "level",
  ALPHABETICAL = "alphabetical",
  NONE = "none",
}

// Single-group key used when grouping is disabled — all spells land in one flat,
// name-sorted list.
export const SPELLS_NO_GROUP_KEY = "all";

// The character-specific flags carried by a SpellsOnCharacters row. For
// prepared-from-list classes, an auto-listed spell that has no row gets all
// flags defaulted to false.
export type SpellFlags = Pick<
  SpellsOnCharacters,
  | "isFavorite"
  | "isPrepared"
  | "isAlwaysPrepared"
  | "hasLongRestCast"
  | "canBeSwappedOnLongRest"
  | "canBeSwappedOnLevelUp"
>;

// `canDelete` tells the UI whether the trash button should be offered:
// - known classes / off-list manual spells → always deletable (their only
//   reason to appear is the row itself);
// - prepared-from-list on-list spells → deletable only when a row exists but
//   carries no meaningful flag (a legacy "added everything" leftover). A row
//   with any truthy flag is intentional config and is managed via the toggle.
export type SpellWithFlags = Spell & SpellFlags & { canDelete: boolean };

const DEFAULT_FLAGS: SpellFlags = {
  isFavorite: false,
  isPrepared: false,
  isAlwaysPrepared: false,
  hasLongRestCast: false,
  canBeSwappedOnLongRest: false,
  canBeSwappedOnLevelUp: false,
};

const pickFlags = (row: SpellsOnCharacters): SpellFlags => ({
  isFavorite: row.isFavorite,
  isPrepared: row.isPrepared,
  isAlwaysPrepared: row.isAlwaysPrepared,
  hasLongRestCast: row.hasLongRestCast,
  canBeSwappedOnLongRest: row.canBeSwappedOnLongRest,
  canBeSwappedOnLevelUp: row.canBeSwappedOnLevelUp,
});

const hasAnyFlag = (flags: SpellFlags) =>
  flags.isFavorite ||
  flags.isPrepared ||
  flags.isAlwaysPrepared ||
  flags.hasLongRestCast ||
  flags.canBeSwappedOnLongRest ||
  flags.canBeSwappedOnLevelUp;

const getGroupedSpells = (
  spells: SpellWithFlags[],
  groupBy?: SPELLS_GROUP_BY,
  characterName?: string,
) => {
  if (groupBy === SPELLS_GROUP_BY.CHARACTER) {
    return { [characterName ?? SPELLS_NO_GROUP_KEY]: spells };
  }

  const unique = uniqueBy(spells, prop("id"));

  if (groupBy === SPELLS_GROUP_BY.LEVEL) {
    return groupByRemeda(unique, prop("level"));
  }

  return groupByRemeda(unique, (spell) => spell.name[0]);
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
  levels,
  schools,
  search,
  spellClass,
}: {
  groupBy?: SPELLS_GROUP_BY;
  ritualOnly?: boolean;
  concentrationOnly?: boolean;
  actionTypes?: SpellAction[];
  levels?: number[];
  schools?: string[];
  search?: string;
  spellClass?: Classes;
} = {}) => {
  const spells = (
    await prisma.spell.findMany({
      where: {
        ...(ritualOnly ? { isRitual: true } : {}),
        ...(concentrationOnly ? { concentration: true } : {}),
        ...(actionTypes && actionTypes.length > 0 ? { actionType: { in: actionTypes } } : {}),
        ...(levels && levels.length > 0 ? { level: { in: levels } } : {}),
        ...(schools && schools.length > 0 ? { school: { in: schools } } : {}),
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

  if (groupBy === SPELLS_GROUP_BY.NONE) {
    return { [SPELLS_NO_GROUP_KEY]: spells };
  }

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
  className,
  characterLevel,
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
  characterId: number;
  className?: Classes;
  characterLevel?: number;
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
  // Every spell explicitly attached to the character — for known classes this is
  // the whole list; for prepared-from-list classes it's only the prepared /
  // configured / manually-added spells.
  const rows = await prisma.spellsOnCharacters.findMany({
    where: { characterId },
    include: { spell: true, character: { select: { name: true } } },
  });
  const characterName = rows[0]?.character?.name;
  const rowsBySpellId = new Map(rows.map((row) => [row.spellId, row]));

  const isListClass = className ? isPreparedListClass(className) : false;

  const merged: SpellWithFlags[] = [];

  if (isListClass && className && characterLevel) {
    // Auto-list the whole class spell list up to the highest castable spell
    // level. Cantrips (level 0) stay "known" — they only appear via a row.
    const maxLevel = getMaxCastableSpellLevel({ className, level: characterLevel });
    const autoSpells =
      maxLevel > 0
        ? await prisma.spell.findMany({
            where: { classes: { has: className }, level: { gte: 1, lte: maxLevel } },
          })
        : [];
    const autoIds = new Set(autoSpells.map((spell) => spell.id));

    for (const spell of autoSpells) {
      const row = rowsBySpellId.get(spell.id);
      const flags = row ? pickFlags(row) : DEFAULT_FLAGS;
      // On-list: a row with no truthy flag is a legacy leftover → deletable so
      // it can be cleaned up; anything intentional is managed via the toggle.
      merged.push({ ...spell, ...flags, canDelete: !!row && !hasAnyFlag(flags) });
    }

    // Off-list rows (cantrips, other-class spells, levels above the cap) are
    // always manual additions and remain freely deletable.
    for (const row of rows) {
      if (autoIds.has(row.spellId)) {
        continue;
      }
      merged.push({ ...row.spell, ...pickFlags(row), canDelete: true });
    }
  } else {
    // Known classes / non-casters: the list is exactly the attached spells.
    for (const row of rows) {
      merged.push({ ...row.spell, ...pickFlags(row), canDelete: true });
    }
  }

  const searchTerm = search?.toLowerCase();
  const filtered = merged
    .filter((spell) => {
      // Spell-property filters.
      if (searchTerm && !spell.name.toLowerCase().includes(searchTerm)) return false;
      if (level !== undefined && spell.level !== level) return false;
      if (ritualOnly && !spell.isRitual) return false;
      if (concentrationOnly && !spell.concentration) return false;
      if (actionTypes && actionTypes.length > 0) {
        if (!spell.actionType || !actionTypes.includes(spell.actionType)) return false;
      }
      // Config-flag filters (live on the row; default false when synthesized).
      if (hasLongRestCast && !spell.hasLongRestCast) return false;
      if (canBeSwappedOnLongRest && !spell.canBeSwappedOnLongRest) return false;
      if (canBeSwappedOnLevelUp && !spell.canBeSwappedOnLevelUp) return false;
      // "Usable" mirrors isSpellUsable: prepared, always prepared, a free
      // long-rest cast, or (for wizards) a ritual.
      if (usableOnly) {
        const usable =
          spell.isPrepared ||
          spell.isAlwaysPrepared ||
          spell.hasLongRestCast ||
          (isWizard && spell.isRitual);
        if (!usable) return false;
      }
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));

  return {
    spells: getGroupedSpells(filtered, groupBy, characterName),
    name: characterName,
  };
};
