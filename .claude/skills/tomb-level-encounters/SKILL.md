---
name: tomb-level-encounters
description: Build encounters in src/data/encounters.ts from a "tomb-of-the-nine-gods-level-N-enemies.md" roster in ../5etools-src, importing any missing creature into localCreatures.ts. Use when the user asks to create/import the encounters of a Tomb of the Nine Gods level.
argument-hint: "<level number, e.g. 3>"
---

# Import a Tomb of the Nine Gods level roster into encounters.ts

Input: a level number `N`. Source file:
`../5etools-src/tomb-of-the-nine-gods-level-<N>-enemies.md` — a markdown table
`| Zone | Creatures |` where each row is `<zone number>. <English Zone Name>` and a
`·`-separated creature list. Italic notes in `*(…)*` carry conditions (dormant,
conditional, harmless, delayed arrival, "X statistics").

Level 1 (zones 1–17, ids 201–217) is already done — read those entries in
`src/data/encounters.ts` as the reference for shape and tone.

## Step 1 — Parse the roster

Read the whole `.md` file. Keep only the rows that list at least one creature
(skip `none`). For each kept row note: zone number, English zone name, each
creature with its count and its italic note.

Ignore the `## Totals` section — it is a recap, not a roster.

## Step 2 — Resolve every creature id

For each distinct creature, decide the id:

1. **Plain 2024 monster** → use the kebab-case **English XMM name** as the id
   (`shadow-demon`, `swarm-of-bats`, `wight`, `mimic`). It is fetched from AideDD and
   cached in the DB on first use. Verify it really exists in XMM before choosing this:

   ```bash
   cd ../5etools-src && python3 -c "
   import json
   d=json.load(open('data/bestiary/bestiary-xmm.json'))
   print([m['name'] for m in d['monster'] if 'wight' in m['name'].lower()])
   "
   ```

   Beware 2024 renames/merges ("Swarm of Poisonous Snakes" → `swarm-of-venomous-snakes`,
   "Bone Naga (Spirit)" → `bone-naga`).

2. **Already in `src/data/localCreatures.ts`** → use its `_` id.
   Check with `grep 'id: "_' src/data/localCreatures.ts`.

3. **Anything else** — no XMM statblock, an adventure-only monster, or a *variation*
   of an existing one (a named NPC using another creature's statistics, a reflavoured
   swarm, a monster carrying a magic item) → import it into `localCreatures.ts` with
   the **`/add-creature` skill** and reference it with the `_`-prefixed id.

   Source preference when several exist: **XMM first, then ToA**, then MM/VGM/MPMM.
   A named NPC defined as `_copy` (e.g. Nepartak = Flameskull) still gets its own
   local entry, with `fiveETools: { name: "<NPC name>", source: "ToA" }`.
   For a variant built on an XMM statblock, omit `fiveETools` (per `/add-creature`).
   Pull the missing flavour/mechanics (magic item, dormancy, susceptibility) from
   `../5etools-src/data/adventure/adventure-toa.json` and fold it into a trait or an
   action so the DM sees it on the stat block.

Import every missing creature **before** writing the encounters, and run
`pnpm spells:sync` if any imported creature has `spells`.

## Step 3 — Write the encounters

Append one `Encounter` per kept zone, inserted in id order among the other
`Tombeau des neuf dieux` entries in `src/data/encounters.ts`:

```ts
{
  name: "<zone name translated to French>",
  id: 2NN,                       // 2 + zero-padded zone number: zone 3 → 203, zone 13 → 213
  scenario: "La tombe de l'annihilation",
  location: {
    name: "Tombeau des neuf dieux",
    mapMarker: "T<zone number>",
  },
  ennemies: {
    "1": [
      { id: "<resolved id>", color: "", variant: "" },
      // one object per individual creature — 3 gargoyles = 3 entries
    ],
  },
  youtubeId: "",
},
```

Rules:
- `color` and `variant` are always present and always `""` — the DM fills them in later.
- `youtubeId` is always present and `""`.
- One entry per individual creature, never a count.
- Add `inactive: true` to creatures the roster marks as **conditional or arriving
  late** ("only if…", "pour out the round after…", reinforcements). Creatures merely
  *dormant* that are the encounter's whole point (a mummy in its sarcophagus, wights on
  their thrones) stay active.
- Encounter names are French; ids and lookup keys stay English kebab-case.

## Step 4 — Verify

1. `pnpm typecheck && pnpm lint` — both must pass.
2. Re-read the roster and confirm every zone with at least one creature produced
   exactly one encounter, and that the creature counts match.
3. Flag to the user: any zone that already had an encounter under a different id
   (level 1 zone 1 already existed as id 90), any creature whose statblock you had to
   approximate, and any translation choice you were unsure about.
