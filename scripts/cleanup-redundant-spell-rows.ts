/**
 * Clean up redundant SpellsOnCharacters rows left over from the old "add every
 * spell manually" system, now that prepared-from-list classes auto-show their
 * whole class list.
 *
 * A row is deleted ONLY when ALL of these hold (it is a pure legacy leftover —
 * the spell is auto-listed anyway, so the row carries no information):
 *   - the character's class is a prepared-from-list class
 *     (Cleric, Druid, Artificer, Paladin, Ranger — NOT Wizard, NOT known
 *     classes; see isPreparedListClass);
 *   - the spell is ON the auto-list: its `classes` includes the character's
 *     class AND its level is between 1 and the character's highest castable
 *     spell level (so cantrips / level 0 are NEVER touched, and spells above the
 *     castable cap are kept as manual additions);
 *   - the row has NO meaningful flag set (isFavorite, isPrepared,
 *     isAlwaysPrepared, hasLongRestCast, canBeSwappedOnLongRest,
 *     canBeSwappedOnLevelUp are all false).
 *
 * Everything else is preserved: off-list / above-cap / cantrip rows (manual
 * additions), any row with a truthy flag (intentional config), and every row of
 * Wizards and known classes (no auto-listing).
 *
 * Dry run by default — run with `--delete` to actually remove the rows.
 *   tsx --env-file=.env scripts/cleanup-redundant-spell-rows.ts            (dry run)
 *   tsx --env-file=.env scripts/cleanup-redundant-spell-rows.ts --delete   (execute)
 */
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getMaxCastableSpellLevel, isPreparedListClass } from "@/utils/stats/spells";

const apply = process.argv.includes("--delete");

async function main() {
  const characters = await prisma.character.findMany({
    select: { id: true, name: true, className: true, level: true },
  });

  const targets = characters.filter((c) => isPreparedListClass(c.className));

  console.log(
    `Mode: ${apply ? "DELETE" : "DRY RUN"} — ${targets.length} prepared-from-list character(s) to inspect.\n`,
  );

  let grandTotal = 0;

  for (const character of targets) {
    const maxLevel = getMaxCastableSpellLevel(character);
    if (maxLevel < 1) {
      continue;
    }

    // On-list, level 1..maxLevel, all flags false → redundant leftover.
    const where: Prisma.SpellsOnCharactersWhereInput = {
      characterId: character.id,
      isFavorite: false,
      isPrepared: false,
      isAlwaysPrepared: false,
      hasLongRestCast: false,
      canBeSwappedOnLongRest: false,
      canBeSwappedOnLevelUp: false,
      spell: {
        level: { gte: 1, lte: maxLevel },
        classes: { has: character.className },
      },
    };

    const redundant = await prisma.spellsOnCharacters.findMany({
      where,
      include: { spell: { select: { id: true, name: true, level: true } } },
      orderBy: { spell: { level: "asc" } },
    });

    if (redundant.length === 0) {
      continue;
    }

    grandTotal += redundant.length;
    console.log(
      `• ${character.name} (${character.className}, lvl ${character.level}, max spell lvl ${maxLevel}): ${redundant.length} row(s)`,
    );
    for (const row of redundant) {
      console.log(`    - [L${row.spell.level}] ${row.spell.name} (${row.spell.id})`);
    }

    if (apply) {
      const { count } = await prisma.spellsOnCharacters.deleteMany({ where });
      console.log(`    → deleted ${count} row(s)`);
    }
  }

  console.log(
    `\n${apply ? "Deleted" : "Would delete"} ${grandTotal} redundant SpellsOnCharacters row(s) total.`,
  );
  if (!apply && grandTotal > 0) {
    console.log("Re-run with --delete to apply.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
