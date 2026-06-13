/**
 * Sync every spell referenced by a local creature into the `Spell` table.
 *
 * Creature spell ids (in src/data/localCreatures.ts) are English kebab-case
 * names (e.g. "fireball", "bigby-s-hand") — exactly what AideDD expects. The
 * StatBlock spell list only renders spells that exist in the DB, so any spell
 * missing from the `Spell` table silently vanishes from the list. This script
 * fills the table from AideDD for any missing spell.
 *
 * Apostrophe rule: a quote in a spell name becomes a dash, not nothing
 * (e.g. "Bigby's Hand" => "bigby-s-hand"). A dropped apostrophe produces a
 * structurally valid but wrong id that only AideDD can reject — so an
 * unresolvable id is reported as a hard error for the developer to fix.
 *
 * Run with: pnpm spells:sync
 */
import prisma from "@/lib/prisma";
import { localCreatures } from "@/data/localCreatures";
import { getSpellDataFromFrName, getSummarySpellFromFR } from "@/lib/external-apis/aidedd";
import { SummaryAPISpell } from "@/types/schemas";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchSpellSummary = async (spellId: string): Promise<SummaryAPISpell | null> => {
  // The id is the English AideDD name; resolve its French page to read
  // name/level/isRitual, but keep the English id as the stored id.
  const { frId } = await getSpellDataFromFrName(spellId);
  const frSummary = frId ? await getSummarySpellFromFR(frId) : null;
  return frSummary ? { ...frSummary, id: spellId } : null;
};

const main = async () => {
  // 1. Collect every unique spell id across all local creatures.
  const spellIds = [
    ...new Set(
      Object.values(localCreatures).flatMap((creature) =>
        (creature.spells ?? []).map((spell) => spell.id),
      ),
    ),
  ].sort();

  // 2. Structural lint of the ids (catches stray chars / bad dashes early).
  const malformed = spellIds.filter((id) => id !== id.toLowerCase() || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id));
  if (malformed.length > 0) {
    console.error("\n✖ Malformed spell ids (must be lowercase kebab-case):");
    malformed.forEach((id) => console.error(`  - ${id}`));
  }

  // 3. Diff against the DB.
  const existing = await prisma.spell.findMany({
    where: { id: { in: spellIds } },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((s) => s.id));
  const missingIds = spellIds.filter((id) => !existingIds.has(id));

  console.log(
    `Spells: ${spellIds.length} referenced, ${existingIds.size} already in DB, ${missingIds.length} to fetch.`,
  );

  // 4. Fetch + upsert each missing spell, collecting unresolvable ids.
  const added: string[] = [];
  const failed: string[] = [];

  for (const spellId of missingIds) {
    let summary: SummaryAPISpell | null = null;
    try {
      summary = await fetchSpellSummary(spellId);
    } catch (error) {
      console.error(`  ! ${spellId}: ${error instanceof Error ? error.message : error}`);
    }

    if (!summary) {
      failed.push(spellId);
      continue;
    }

    await prisma.spell.upsert({
      where: { id: summary.id },
      update: {},
      create: summary,
    });
    added.push(summary.id);
    console.log(`  + ${summary.id} — ${summary.name} (N${summary.level})`);
    await sleep(200); // be polite to AideDD
  }

  if (added.length > 0) {
    console.log(`\n✔ Added ${added.length} spell(s) to the DB.`);
  } else {
    console.log("\n✔ Nothing to add — all referenced spells were already in the DB.");
  }

  if (failed.length > 0 || malformed.length > 0) {
    console.error(
      `\n✖ Could not resolve ${failed.length} spell id(s) on AideDD — fix these ids in src/data/localCreatures.ts:`,
    );
    failed.forEach((id) => console.error(`  - ${id}`));
    console.error(
      "\nReminder: an apostrophe in the name becomes a dash, e.g. \"Bigby's Hand\" => bigby-s-hand.",
    );
    process.exitCode = 1;
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
