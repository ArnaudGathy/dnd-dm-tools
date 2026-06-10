# Creature & Encounter Data Rules

How creature/encounter data flows through the app, plus how to navigate the sibling
`../5etools-src` repo. Learned while importing the ToA "Fane of the Night Serpent"
roster (encounters 99–116).

## Creature id resolution (`getCreature` in src/lib/external-apis/aidedd.ts)

- Id starts with `_` → looked up in `src/data/localCreatures.ts` using the key
  **without** the underscore (entry key `"su-monster"`, id `"_su-monster"`).
  `creatureOverrides` is **never** applied to local creatures.
- Otherwise → fetched online from AideDD by kebab-case **English 2024 (XMM) name**,
  then deep-merged with `src/data/creatureOverrides.ts[id]` if an entry exists.

Decision rule when adding an enemy to an encounter:
1. Creature exists in source `XMM` (2024 Monster Manual)? → use plain kebab-case id
   (e.g. "Yuan-ti Malison (Type 3)" → `yuan-ti-malison-type-3`). No import needed.
2. Not in XMM (VGM/MPMM/MM-2014/adventure-only)? → import into `localCreatures.ts`
   via the `/add-creature` skill and reference it with the `_`-prefixed id.
3. Already in `localCreatures.ts`? → just use its `_` id. Check with
   `grep 'id: "_' src/data/localCreatures.ts`.

Beware 2024 renames: a 2014 name may not exist in XMM ("Swarm of Poisonous Snakes" →
`swarm-of-venomous-snakes`; "Yuan-ti Pureblood" was reworked into "Yuan-ti Infiltrator").
Some 2014 variants are also collapsed in XMM ("Bone Naga (Spirit/Guardian)" → `bone-naga`).
Always verify the source before choosing an id (see 5etools search below).

## creatureOverrides.ts

- Merged **globally per creature id** on top of the AideDD result — affects every
  encounter using that id. Good for renaming a generic statblock that the campaign
  uses for exactly one purpose (e.g. `giant-constrictor-snake` → "Azi Mas").
- Do NOT use it to name an NPC whose statblock is also used generically elsewhere —
  set the `variant` field on the encounter enemy instead (e.g. `variant: "Nahth"`).
- Useless for `_local` creatures (code path bypasses it) — rename in
  `localCreatures.ts` or use `variant`.

## Encounter entries (src/data/encounters.ts)

- `id`: auto-increment from the current max in the file.
- `scenario` / `location.name`: reuse existing strings exactly (grouping keys).
- `location.mapMarker`: short location prefix + number (P1, JC4, O12B, F1…).
- Enemies: `{ id, color, variant }`; `color` placeholder `"#FFF"` until the DM picks
  real ones; `variant` distinguishes duplicates or names NPCs; `inactive: true` for
  enemies that join mid-fight; `shouldHideInInitiativeTracker` for swarms of décor
  entities (see `_statue-archer`).
- `youtubeId`: pick a fitting theme from `src/data/musics.json` (yuan-ti encounters
  use `HOmjkQ_3W5Q`).
- Names and flavor text are in French; ids/lookup keys stay English kebab-case.
- After editing data files run `pnpm typecheck && pnpm lint`.

## Navigating ../5etools-src

- Bestiary: `data/bestiary/bestiary-<source>.json` (source lowercase: `xmm`, `mm`,
  `vgm`, `mpmm`, `toa`…); `index.json` maps source → file. Search across all files
  with a small python loop over `glob("bestiary-*.json")` matching `monster[].name` —
  faster and more reliable than grep for JSON.
- Adventure text/tables: `data/adventure/adventure-<id>.json` (e.g. `adventure-toa.json`).
  Encounter rosters are often `"type": "table"` blocks; area names are
  `"name": "<n>. <Zone Name>"` entries nearby.
- `_copy` monsters: merge the base monster from the referenced source, apply
  `_templates` from `data/bestiary/template.json` (e.g. Sekelok = Champion VGM +
  Yuan-ti Pureblood template), apply top-level overrides, then `_mod`
  `replaceTxt` regex substitutions.
- Lair/legendary group data: `data/bestiary/legendarygroups.json` (match name + source).
- Text uses `{@...}` tags (`{@creature X|SOURCE|display}`, `{@dc 13}`, `{@damage 2d6}`,
  `{@hit 5}`…) — strip to visible text; the part before the first `|` is the canonical
  creature name for source lookup.
