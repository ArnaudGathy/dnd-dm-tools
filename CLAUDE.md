# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Start dev server with Turbopack

# Production
pnpm build        # Run prisma generate + Next.js build
pnpm start        # Start production server

# Code quality
pnpm lint         # ESLint with auto-fix (0 warnings allowed)
pnpm typecheck    # TypeScript type checking

# Database: DATABASE_URL is PRODUCTION, read the warning under Architecture first
pnpm db:backup    # Verified pg_dump to backups/ (scripts/backup-db.sh). Run before ANY DB change
pnpm db:migrate --name <snake_case>  # Backup, then prisma migrate dev (create + apply a new migration)
pnpm db:deploy    # Backup, then prisma migrate deploy (apply pending migrations only, never resets)
pnpm db:restore   # PostgreSQL restore from backup (destructive, only the user runs it)

# Spell cache (AideDD — see .claude/rules/spell-data.md)
pnpm spells:sync          # Insert missing creature-referenced spells into the Spell table
pnpm spells:cache         # Fetch+cache spell data (Spell.data) from AideDD (only missing; resumable)
pnpm spells:cache:refresh # Re-fetch & overwrite ALL cached spell payloads (AideDD data changed)
pnpm spells:reproject     # Re-derive projected columns from Spell.data (no AideDD calls)
```

Pre-commit hooks run lint-staged automatically via Husky.

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Prisma/PostgreSQL + Firebase Realtime DB + NextAuth 5 (Google OAuth)

**Route groups:**
- `(with-nav)/` — Protected routes with navbar: characters, encounters, spells, creatures, death, rules
- `(plain)/` — Routes without navbar: `/tracker/character`, `/responsive`
- `/dm-screen` — DM reference screen (protected)
- `/api` — Auth and character API endpoints

**Data layer pattern:**
- `/src/lib/api/*` — Read-only query functions used by Server Components
- `/src/lib/actions/*` — Server Actions (`"use server"`) for all mutations
- `/src/lib/external-apis/` — Notion (rules/quests), AideDD (creatures/spells)
- `/src/lib/firebase/` — Real-time HP sync during combat

**Auth:** NextAuth with Google OAuth; email whitelist in `auth.ts`; middleware at `src/middleware.ts` protects routes; `getSessionData()` in `/src/lib/api/session.ts` provides isAdmin/isSuperAdmin roles.

**Database:** 21 Prisma models in `prisma/schema.prisma` — core models are Character, Campaign, Party, Creature, Encounter; character stats spread across SavingThrow, Skill, SpellsOnCharacters, CreaturesOnCharacters, Weapon, Armor, MagicItem, InventoryItem, Money.

### ⚠️ `DATABASE_URL` is the PRODUCTION database

There is no local dev database: every Prisma command, script and query in this repo hits
production data.

**Incident (2026-10-19):** after a migration, Claude ran
`prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel … --shadow-database-url "$(grep -E '^SHADOW|^DATABASE_URL' .env | head -1 …)"`
to check the schema. There was no `SHADOW*` variable, so the grep fell back to
`DATABASE_URL`. Prisma **resets the shadow database** before using it, which wiped every
production table. The data had to be restored from a backup.

Rules (no exceptions, even in auto mode or when a command "only verifies"):
- **Never run a command that can reset or drop data:** `prisma migrate reset`, `prisma db push`
  (any flags), `--force-reset`, `--accept-data-loss`, `prisma migrate diff` with
  `--shadow-database-url` or `--from-migrations`, `pnpm db:restore`, and raw
  `DROP`/`TRUNCATE`/`DELETE`/`ALTER` through `prisma db execute`, `psql` or `$executeRaw`.
- **Never build connection strings from `.env`** with grep/cut/fallbacks, and never pass a
  database URL to a CLI flag. Prisma reads the URLs from the datasource config by itself.
- **Use `npx prisma migrate status` to check that schema and migrations match.** It is read-only
  and is the only verification needed.
- **Back up before ANY database change:** migrations, `spells:*` and other bulk scripts,
  manual SQL, or data fixes. Run `pnpm db:backup` (`scripts/backup-db.sh`). It is a read-only
  `pg_dump` into `backups/backup_<timestamp>.sql`. It exits non-zero if the dump lacks pg_dump's
  completion marker or contains 0 `Character` rows. On success it prints
  `backup-db: OK → <file> (<size>, <n> characters)`. Quote that line to the user. If it fails,
  stop and do not touch the database.
- **Claude may create and apply migrations on production without asking,** provided a verified
  dump was taken first. Always go through the wrappers, which back up and then migrate:
  `pnpm db:migrate --name <snake_case>` to create and apply a new migration, and `pnpm db:deploy`
  to apply migrations that already exist. Never call `prisma migrate dev`/`deploy` directly. Report
  the `backup-db: OK` line and the migration name so the dump can be restored if something goes
  wrong. If the output mentions drift, a reset, or data loss, abort and ask. Never accept the prompt.
- These rules are also enforced by `deny` rules in `.claude/settings.json` (migrate reset/diff,
  db push, shadow URL, accept-data-loss, force-reset, db:restore). Do not remove them.
- Bulk-write scripts (`spells:*`, backfills) also write to production. Run them only when the user
  asks.

**Never edit `prisma/schema.prisma` without applying a migration in the same task.** Any schema
change — a new model, column, enum value or default — must be followed in the same task by
`pnpm db:migrate --name <snake_case_name>` (backup + migrate; or the `/db-migrate` command), then
`pnpm typecheck && pnpm lint`. After a migration, tell the user to restart `pnpm dev` (and the IDE TS
server): a running dev server keeps the old Prisma client, so new columns read as `undefined`. Editing the schema and stopping there leaves the generated
client ahead of the real database: the code typechecks, then blows up at runtime on a column
that does not exist. Confirm with `npx prisma migrate status` (expect "Database schema is up
to date!") and report the migration name when done. Do not use `prisma db push` — this
project tracks migrations in `prisma/migrations/`.

**Firebase sync:** Character HP values are bidirectionally synced between PostgreSQL and Firebase Realtime DB to support the `/tracker/character` real-time combat view.

**Path alias:** `@/*` maps to `./src/*`.

## D&D rules: `../5etools-src` is the source of truth

The sibling repo `../5etools-src` (`/Users/arnaudgathy/Documents/projects/5etools-src`) is the
**absolute source of truth for game rules and mechanics**. Before implementing or answering
anything about a class feature, spell, feat, item, condition, action or rule, read it there. Do
not rely on memory, and do not reverse-engineer a rule from existing app code.

- **Edition: 2024 rules.** Prefer entries with source `XPHB` (Player's Handbook 2024), `XDMG` and
  `XMM`. Most files also hold the 2014 version (`PHB`, `DMG`, `MM`); fall back to those only for
  content that has no 2024 version.
- Where to look (all under `data/`):
  - Classes: `class/class-<name>.json` → `class[]` (core table and proficiencies), `subclass[]`,
    `classFeature[]` / `subclassFeature[]` (filter on `source` + `className` + `level`).
    Flavor text is in `fluff-class-<name>.json`.
  - Spells: `spells/spells-<source>.json` (e.g. `spells-xphb.json`).
  - Monsters: `bestiary/` (see `.claude/rules/creature-data.md` for how to navigate it).
  - Everything else: `feats.json`, `items.json` + `items-base.json`, `actions.json`,
    `conditionsdiseases.json`, `variantrules.json`, `races.json`, `backgrounds.json`,
    `optionalfeatures.json`.
- Parse the JSON with a small Python script rather than grep. Text uses `{@tag …}` markup
  (`{@variantrule Short Rest|XPHB}`, `{@damage 1d6}`…): the visible text is the part before the first `|`.

## Rules & Agents

Detailed coding rules: @.claude/rules/server-actions.md · @.claude/rules/auth.md · @.claude/rules/creature-data.md · @.claude/rules/spell-data.md · @.claude/rules/detail-popovers.md

UI work (implementing or redesigning pages/components): read `.claude/rules/detail-popovers.md` first — informational popovers must use the shared `StatBreakdown` component.

Custom agents for scoped work: `prisma-agent` (schema/migrations/queries), `encounter-builder` (encounter data).

Custom commands: `/db-migrate`, `/commit`.

Custom skills: `/add-creature <english name> [source]` — import a monster from the sibling `../5etools-src` repo into `src/data/localCreatures.ts`, converted to the `Creature` type and translated/summarized in French.
Custom skills: `/translate-readalouds <adventure> <chapter>` — translate read-aloud text from `../5etools-src/data/adventure/adventure-<id>.json` and format it for DM use.
Custom skills: `/tomb-level-encounters <level>` — build the encounters of a Tomb of the Nine Gods level from `../5etools-src/tomb-of-the-nine-gods-level-<N>-enemies.md`, importing any missing creature first.
