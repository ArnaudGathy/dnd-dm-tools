---
description: Generate and run a Prisma migration, then verify the schema
argument-hint: "[migration name]"
allowed-tools: Bash, Read
---

Generate and run a Prisma migration for the dnd-dm-tools project.

⚠️ `DATABASE_URL` is the **production** database. Follow the "DATABASE_URL is the PRODUCTION
database" rules in `CLAUDE.md`. Never use `migrate reset`, `db push`, `migrate diff --shadow-database-url`
or `--accept-data-loss`, and never build a database URL from `.env`.

Steps:
1. Read `prisma/schema.prisma` to understand the current schema and any pending changes.
2. Run the migration through the wrapper. It takes a verified backup first and stops if the backup
   fails. Report its `backup-db: OK → …` line. If the output mentions drift, a reset or data loss,
   abort and ask the user:
   ```
   pnpm db:migrate --name $ARGUMENTS
   ```
   If no migration name is provided in $ARGUMENTS, derive a short snake_case name from the schema diff (e.g. `add_encounter_notes`, `update_character_hp`).
3. After migration succeeds, run `npx prisma generate` to regenerate the client (this also runs as part of `pnpm build`, but run it now for immediate use).
4. Run `pnpm run typecheck` to confirm no type errors from the schema changes.
5. Report what was created/altered in the migration.

If the migration fails, show the error clearly and suggest fixes without retrying automatically.
