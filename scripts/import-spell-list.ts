/**
 * Import a list of spells (from an AideDD-exported XML <spelllist>) into the
 * `Spell` table, fetching full details from AideDD for any spell that isn't
 * already cached.
 *
 * Reuses `getSpellDetails`, which upserts the row (creating it if it doesn't
 * exist yet) with the full payload + projected columns — so spells that aren't
 * even in the `Spell` table yet get created here.
 *
 * Like the backfill script, this behaves like a human casually browsing AideDD
 * (a public website, not an API): strictly sequential, jittered pauses with
 * occasional longer breaks, exponential backoff on errors, and it aborts after
 * a few consecutive failures (assume we've been blocked). It's resumable —
 * already-cached spells are skipped.
 *
 * Run with:
 *   pnpm spells:import <xml-path>          (fetch every missing spell)
 *   pnpm spells:import <xml-path> --dry    (report only — nothing fetched)
 *   pnpm spells:import <xml-path> 10       (cap at 10 — useful for batching)
 */
import { readFileSync } from "node:fs";
import prisma from "@/lib/prisma";
import { getSpellDetails } from "@/lib/external-apis/aidedd";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomBetween = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

const humanPause = async () => {
  const takesABreak = Math.random() < 0.12;
  const ms = takesABreak ? randomBetween(20_000, 45_000) : randomBetween(3_000, 8_000);
  if (takesABreak) {
    console.log(`  … taking a longer break (${Math.round(ms / 1000)}s)`);
  }
  await sleep(ms);
};

const isRateLimited = (error: unknown) => {
  const status =
    typeof error === "object" && error && "response" in error
      ? (error as { response?: { status?: number } }).response?.status
      : undefined;
  return status === 429 || status === 503 || status === 403;
};

const MAX_RETRIES = 3;
const MAX_CONSECUTIVE_FAILURES = 4;

const parseSpellIds = (xmlPath: string): string[] => {
  const xml = readFileSync(xmlPath, "utf8");
  const ids = [...xml.matchAll(/<spell>([^<]+)<\/spell>/g)].map((m) => m[1].trim());
  // De-dupe while preserving order.
  return [...new Set(ids)];
};

const main = async () => {
  const args = process.argv.slice(2);
  const xmlPath = args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a));
  if (!xmlPath) {
    console.error("Usage: import-spell-list.ts <xml-path> [--dry] [limit]");
    process.exitCode = 1;
    return;
  }
  const dry = args.includes("--dry");
  const limitArg = Number(args.find((a) => /^\d+$/.test(a)));
  const hasLimit = Number.isFinite(limitArg) && limitArg > 0;

  // 1. Parse the requested ids from the XML.
  const requestedIds = parseSpellIds(xmlPath);

  // 2. Find which ones are already cached (row exists AND data is non-null).
  const existing = await prisma.spell.findMany({
    where: { id: { in: requestedIds } },
    select: { id: true, data: true },
  });
  const cachedIds = new Set(existing.filter((s) => s.data != null).map((s) => s.id));

  const candidates = requestedIds.filter((id) => !cachedIds.has(id));
  const todo = hasLimit ? candidates.slice(0, limitArg) : candidates;

  console.log(
    `Requested: ${requestedIds.length} spell(s) in XML, ${cachedIds.size} already cached, ` +
      `${candidates.length} to fetch` +
      (todo.length < candidates.length ? `, fetching ${todo.length} this run.` : `.`),
  );

  if (todo.length === 0) {
    console.log("✔ Nothing to do — every requested spell is already cached.");
    return;
  }

  if (dry) {
    console.log("\nSpells that would be fetched from AideDD:");
    todo.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));
    console.log(`\n(dry run — nothing fetched. Total: ${todo.length})`);
    return;
  }

  const done: string[] = [];
  const failed: string[] = [];
  let consecutiveFailures = 0;

  for (const [index, id] of todo.entries()) {
    const position = `[${index + 1}/${todo.length}]`;
    let succeeded = false;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await getSpellDetails(id, { force: false });
        console.log(`  + ${position} ${id} — ${result.name ?? ""}`);
        done.push(id);
        succeeded = true;
        consecutiveFailures = 0;
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const rateLimited = isRateLimited(error);

        if (attempt < MAX_RETRIES) {
          const backoff = rateLimited
            ? randomBetween(60_000, 120_000) * attempt
            : randomBetween(8_000, 15_000) * attempt;
          console.warn(
            `  ! ${position} ${id} attempt ${attempt}/${MAX_RETRIES} failed${
              rateLimited ? " (rate-limited)" : ""
            }: ${message} — retrying in ${Math.round(backoff / 1000)}s`,
          );
          await sleep(backoff);
        } else {
          console.error(`  ✖ ${position} ${id} gave up after ${MAX_RETRIES} attempts: ${message}`);
        }
      }
    }

    if (!succeeded) {
      failed.push(id);
      consecutiveFailures += 1;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(
          `\n✖ ${MAX_CONSECUTIVE_FAILURES} spells failed in a row — assuming we've been blocked. Stopping now.`,
        );
        console.error("Wait a while (hours), then re-run to resume.");
        break;
      }
    }

    if (index < todo.length - 1) {
      await humanPause();
    }
  }

  console.log(`\n✔ Fetched & cached ${done.length} spell(s).`);
  if (failed.length > 0) {
    console.error(`✖ ${failed.length} spell(s) failed:`);
    failed.forEach((id) => console.error(`  - ${id}`));
    console.error("Re-run to retry the ones that failed.");
    process.exitCode = 1;
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
