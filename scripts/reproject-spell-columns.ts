/**
 * Re-derive the projected `Spell` columns (concentration, actionType, school,
 * classes) from the already-cached `Spell.data` payload. Reads only from the
 * DB — makes NO AideDD calls. Run this after changing the projection logic, or
 * after a migration that recreated a projected column (e.g. the classes enum
 * switch). Spells with no cached `data` are skipped.
 *
 * Run with: pnpm exec tsx --env-file=.env scripts/reproject-spell-columns.ts
 */
import prisma from "@/lib/prisma";
import { apiSpellSchema } from "@/types/schemas";
import { projectSpellColumns } from "@/lib/spellProjection";

const main = async () => {
  const rows = await prisma.spell.findMany({ select: { id: true, data: true } });
  const withData = rows.filter((r) => r.data != null);
  console.log(`${rows.length} spell(s), ${withData.length} with cached data to reproject.\n`);

  let updated = 0;
  const skipped: string[] = [];

  for (const row of withData) {
    const parsed = apiSpellSchema.safeParse(row.data);
    if (!parsed.success) {
      skipped.push(row.id);
      console.error(`  ✖ ${row.id}: ${parsed.error.message}`);
      continue;
    }

    await prisma.spell.update({
      where: { id: row.id },
      data: projectSpellColumns(parsed.data),
    });
    updated += 1;
  }

  console.log(`\n✔ Reprojected ${updated} spell(s).`);
  if (skipped.length > 0) {
    console.error(`✖ Skipped ${skipped.length} (unparseable data): ${skipped.join(", ")}`);
    process.exitCode = 1;
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
