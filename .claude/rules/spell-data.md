# Spell Data & Caching Rules

How spell data flows from AideDD into the app, and how it's cached so we hit
AideDD as rarely as possible.

## One consolidated `Spell` table

There is a single `Spell` table (no separate cache table). `id` is the kebab-case
**English** name (e.g. `shield-of-faith`); it's the FK target for
`SpellsOnCharacters` and the source of truth for "which spells exist".

Columns:
- Summary/identity: `name` (French), `level`, `isRitual`.
- Queryable projection (for list filters/sort): `concentration` (Boolean),
  `actionType` (`SpellAction` enum), `school` (String), `classes` (`Classes[]` —
  the **shared** class enum, not a bespoke one).
- `data` (`Json?`): the full `APISpell` payload used to render the details page.
  Null until fetched from AideDD; acts as the render cache.

Populated by: `/add-creature` → `pnpm spells:sync` (creates summary rows for
creature-referenced spells), and `getSpellDetails` / the backfill script (fills
`data` + the projected columns).

## Fetch + cache flow (`getSpellDetails` in src/lib/external-apis/aidedd.ts)

`getSpellDetails(enSpellName, { force? })` is the single source of truth for
reading a full spell:

1. Default mode reads the `Spell` row; if `data` is present it returns the parsed
   `APISpell` (no network) — so **a spell is fetched from AideDD only once, ever**.
2. On a miss it fetches from AideDD (two requests: the EN page to resolve the FR
   slug, then the FR page to parse), then upserts the row with `data` **and** the
   projected columns via `projectSpellColumns` (src/lib/spellProjection.ts).
3. `{ force: true }` skips the cache read and overwrites the row — used to rebuild
   the cache after an AideDD change or a parsing fix.

An in-flight request map dedupes concurrent reads (forced refreshes bypass it).

`clearSpellCache` (admin-only `ClearSpellCacheButton` in `SpellHeader`) sets
`Spell.data = NULL` so the next render refetches and repopulates. The row itself
is never deleted (FK target).

## Projection & enums (src/lib/spellProjection.ts)

`projectSpellColumns(APISpell)` derives the queryable columns from the payload:
- `actionType`: `deriveActionType` maps the French `casting_time` → `SpellAction`
  (`ACTION` / `BONUS_ACTION` / `REACTION`, everything else `OTHER`). Check "Action
  bonus" before plain "Action".
- `classes`: `mapSpellClasses` maps AideDD's French class names → the shared
  `Classes` enum via `CLASS_BY_LABEL` (reverse of `CLASS_MAP` in constants/maps).
  Unknown names are dropped.
- `concentration`, `school` come straight off the payload. The raw `casting_time`
  string is **not** a column — it stays in `data` for the details page.

Display config lives in `src/constants/maps.ts`: `SPELL_ACTION_CONFIG` (colored
tag per action type — green/orange/purple; OTHER has no tag) and `CLASS_MAP` (FR
labels for the class filter).

## Parsing notes

- Spell `classes` live in the parentheses of the `.ecole` block on the AideDD page
  (e.g. `Abjuration de niveau 1 (Clerc, Paladin)`, `Évocation de niveau 0 (Clerc)`
  for cantrips) — **not** a `.classe` div. Parsed in `parseSpellFromAideDD`
  (src/lib/aideDDParseSpellPageContent.ts).
- Names/flavor are French; ids/lookup keys stay English kebab-case.

## AideDD is a public website, not an API — don't get banned

All AideDD requests (spells AND creatures) go through the shared `aideDDClient`
axios instance in `aidedd.ts`, which sends realistic browser headers (real Chrome
User-Agent, `Accept-Language`, `Sec-Fetch-*`/`Sec-Ch-Ua` hints). Never call AideDD
with bare `axios` — the default `axios/x.x.x` User-Agent flags us as a scraper.

## Maintenance scripts

`scripts/backfill-spell-cache.ts` is **human-like by design** (strictly
sequential, jittered 3–8s pauses with occasional 20–45s breaks, exponential
backoff with extra patience on 429/503, auto-aborts after 4 consecutive failures
assuming a block). "Missing" = `Spell.data` is null.

| Command | What it does |
|---|---|
| `pnpm spells:cache` | Fetch `data` only for spells not yet cached (resumable) |
| `pnpm spells:cache 10` | Same, capped at 10 (batching) |
| `pnpm spells:cache:refresh` | **Re-fetch & overwrite ALL** spell payloads from AideDD |
| `pnpm spells:cache:refresh 10` | Re-fetch at most 10 (batch a refresh) |
| `pnpm spells:reproject` | Re-derive the projected columns from `Spell.data` — **no AideDD calls** |

Use `spells:reproject` after changing projection logic (`projectSpellColumns`) or a
migration that recreated a projected column — it rebuilds `actionType`/`classes`/etc.
from the cached `data` without touching AideDD. Use `spells:cache:refresh` only when
the underlying AideDD data itself changed. Never run two AideDD-hitting instances
concurrently — it doubles the load on AideDD.
