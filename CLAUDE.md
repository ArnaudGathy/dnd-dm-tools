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

# Database
pnpm db:migrate   # Run Prisma migrations
pnpm db:backup    # PostgreSQL backup to backups/
pnpm db:restore   # PostgreSQL restore from backup
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

**Firebase sync:** Character HP values are bidirectionally synced between PostgreSQL and Firebase Realtime DB to support the `/tracker/character` real-time combat view.

**Path alias:** `@/*` maps to `./src/*`.

## Rules & Agents

Detailed coding rules: @.claude/rules/server-actions.md · @.claude/rules/auth.md

Custom agents for scoped work: `prisma-agent` (schema/migrations/queries), `encounter-builder` (encounter data).

Custom commands: `/add-encounter`, `/db-migrate`, `/commit`.
