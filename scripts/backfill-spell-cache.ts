/**
 * Backfill / refresh cached spell payloads (`Spell.data`) from AideDD.
 *
 * Default mode fetches the full data (via `getSpellDetails`, which also writes
 * the cache) for every spell in the `Spell` table that isn't cached yet, so the
 * app never has to hit AideDD again for that spell.
 *
 * Refresh mode (--refresh) re-fetches EVERY spell from AideDD and overwrites its
 * cached entry. Use it after a major AideDD update, or when a field was parsed
 * incorrectly (e.g. the spell classes) and the cache needs rebuilding.
 *
 * AideDD is a public website, NOT an API — it can rate-limit or ban scrapers.
 * This script therefore behaves like a human casually browsing:
 *   - strictly sequential (never concurrent),
 *   - randomized "reading" pauses between spells, with longer breaks now and then,
 *   - exponential backoff on errors, with extra patience on 429/503,
 *   - aborts after a few consecutive failures (assume we've been blocked),
 *   - resumable: in default mode already-cached spells are skipped.
 * Realistic browser headers live on the shared client in `aidedd.ts`.
 *
 * Run with: pnpm spells:cache               (cache everything still missing)
 *           pnpm spells:cache 10            (cache at most 10 — useful for batching)
 *           pnpm spells:cache:refresh       (re-fetch & overwrite ALL cached spells)
 *           pnpm spells:cache:refresh 10    (re-fetch at most 10 — batch a refresh)
 */
import prisma from "@/lib/prisma";
import { getSpellDetails } from "@/lib/external-apis/aidedd";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Random integer in [min, max] — jitter so our cadence isn't a robotic constant.
const randomBetween = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

// Pause between two consecutive spells: usually a few seconds, occasionally a
// much longer "stepped away from the keyboard" break.
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

const main = async () => {
  // Parse args (order-independent): a `--refresh`/`--force` flag and an optional
  // numeric limit for batching.
  const args = process.argv.slice(2);
  const refresh = args.some((a) => a === "--refresh" || a === "--force");
  const limitArg = Number(args.find((a) => /^\d+$/.test(a)));
  const hasLimit = Number.isFinite(limitArg) && limitArg > 0;

  // 1. Build the work list.
  // - default mode: only spells whose payload isn't cached yet (data is null).
  // - refresh mode: every spell, re-fetched and overwritten.
  const allSpells = await prisma.spell.findMany({
    select: { id: true, name: true, data: true },
    orderBy: { id: "asc" },
  });
  const cachedCount = allSpells.filter((s) => s.data != null).length;

  const candidates = refresh ? allSpells : allSpells.filter((s) => s.data == null);
  const todo = hasLimit ? candidates.slice(0, limitArg) : candidates;

  console.log(
    refresh
      ? `Refresh mode: re-fetching ${todo.length}${
          todo.length < candidates.length ? ` of ${candidates.length}` : ""
        } spell(s) from AideDD.\n`
      : `Spells: ${allSpells.length} total, ${cachedCount} already cached, ${candidates.length} missing` +
          (todo.length < candidates.length ? `, fetching ${todo.length} this run.\n` : `.\n`),
  );

  if (todo.length === 0) {
    console.log("✔ Nothing to do — every spell is already cached.");
    return;
  }

  const done: string[] = [];
  const failed: string[] = [];
  let consecutiveFailures = 0;

  for (const [index, spell] of todo.entries()) {
    const position = `[${index + 1}/${todo.length}]`;
    let succeeded = false;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await getSpellDetails(spell.id, { force: refresh });
        console.log(`  ${refresh ? "↻" : "+"} ${position} ${spell.id} — ${result.name ?? spell.name}`);
        done.push(spell.id);
        succeeded = true;
        consecutiveFailures = 0;
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const rateLimited = isRateLimited(error);

        if (attempt < MAX_RETRIES) {
          // Back off harder when we look rate-limited; otherwise a modest pause.
          const backoff = rateLimited
            ? randomBetween(60_000, 120_000) * attempt
            : randomBetween(8_000, 15_000) * attempt;
          console.warn(
            `  ! ${position} ${spell.id} attempt ${attempt}/${MAX_RETRIES} failed${
              rateLimited ? " (rate-limited)" : ""
            }: ${message} — retrying in ${Math.round(backoff / 1000)}s`,
          );
          await sleep(backoff);
        } else {
          console.error(`  ✖ ${position} ${spell.id} gave up after ${MAX_RETRIES} attempts: ${message}`);
        }
      }
    }

    if (!succeeded) {
      failed.push(spell.id);
      consecutiveFailures += 1;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(
          `\n✖ ${MAX_CONSECUTIVE_FAILURES} spells failed in a row — assuming we've been blocked. Stopping now.`,
        );
        console.error(
          `Wait a while (hours), then re-run \`pnpm ${refresh ? "spells:cache:refresh" : "spells:cache"}\` to resume.`,
        );
        break;
      }
    }

    // Be polite between spells (only when there's another one coming).
    if (index < todo.length - 1) {
      await humanPause();
    }
  }

  console.log(`\n✔ ${refresh ? "Refreshed" : "Cached"} ${done.length} spell(s).`);
  if (failed.length > 0) {
    console.error(`✖ ${failed.length} spell(s) failed:`);
    failed.forEach((id) => console.error(`  - ${id}`));
    console.error(
      `Re-run \`pnpm ${refresh ? "spells:cache:refresh" : "spells:cache"}\` to retry the ones that failed.`,
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
