---
name: add-creature
description: Convert a 5etools monster into a Creature entry in src/data/localCreatures.ts, translated and summarized in French. Use when the user asks to add/create/import a creature, monster, or stat block by its English name.
argument-hint: "<english creature name> [source, e.g. xmm/toa/dosi]"
---

# Add a creature from 5etools to localCreatures.ts

Convert a monster from the sibling repo `../5etools-src` into the `Creature` type
(`src/types/schemas.ts`) and append it to `src/data/localCreatures.ts`.

Input: an English creature name, optionally followed by a source code (the suffix in the
5etools URL hash, e.g. `goblin boss_xmm` → source `xmm`).

## Step 1 — Find the monster JSON

Bestiary data lives in `../5etools-src/data/bestiary/bestiary-<source>.json` (source lowercase).
`index.json` in that folder maps source codes to files. Search across all files, e.g.:

```bash
cd ../5etools-src/data/bestiary && python3 -c "
import json, glob
name = 'goblin boss'.lower()
for f in glob.glob('bestiary-*.json'):
    for m in json.load(open(f)).get('monster', []):
        if m['name'].lower() == name:
            print(f, m.get('source'))
"
```

Then print the full JSON of the chosen entry. Rules:
- If the user gave a source, use that file directly.
- If several sources match, prefer the 2024 rules version (`XMM`) over `MM`, otherwise ask the user.
- If nothing matches exactly, retry with a substring match and show candidates.

### `_copy` entries
Some monsters are defined as a copy of another (`"_copy": {"name": ..., "source": ...}`).
Load the base monster from the referenced source file, apply the overrides present in the
copying entry (any top-level key overrides the base), and apply `_mod` text replacements
(`replaceTxt` = regex replace on all entry text). Then convert the merged result.

### Legendary / lair data
- `legendary` array on the monster → `legendaryActions`.
- If the monster has a `legendaryGroup`, lair actions are in
  `../5etools-src/data/bestiary/legendarygroups.json` (match `name` + `source`) → `lairActions`.

## Step 2 — Convert to the `Creature` type

Read `src/types/schemas.ts` (the `creatureSchema`) and a few recent entries in
`src/data/localCreatures.ts` to match style. Field-by-field mapping:

| Target | Source | Conversion |
|---|---|---|
| record key | `name` | kebab-case English name, e.g. `"goblin-boss"` |
| `id` | `name` | `"_"` + record key, e.g. `"_goblin-boss"` |
| `fiveETools` | `name` + `source` | `{ name: "<English name>", source: "<SOURCE>" }` — copy the **exact** `name` and `source` values from the chosen bestiary JSON (e.g. `{ name: "Su-monster", source: "ToA" }`). Drives the "5e.tools" link in the stat block. **Omit** when `source` is `XMM` (those are fetched from AideDD, not 5etools — and an XMM-based local entry is a custom variant) or when the monster has no real 5etools bestiary entry (pure homebrew). |
| `name` | `name` | **Translated to French** (e.g. "Goblin Boss" → "Chef gobelin") |
| `type` | `type` | Capitalized English. Object form `{type, tags}` → `"Fey (Goblinoid)"` |
| `size` | `size[0]` | `T`→Tiny, `S`→Small, `M`→Medium, `L`→Large, `H`→Huge, `G`→Gargantuan |
| `alignment` | `alignment` | English words: `["C","N"]`→"Chaotic Neutral", `["N","E"]`→"Neutral Evil", `["U"]`→"Unaligned", `["A"]`→"Any alignment" |
| `challengeRating` | `cr` | number: `"1/8"`→0.125, `"1/4"`→0.25, `"1/2"`→0.5, `"4"`→4. If `cr` is an object, use `cr.cr` |
| `armorClass` | `ac[0]` | the number only (drop `from`, e.g. natural armor) |
| `hitPoints` | `hp` | `"${average} (${formula})"`, e.g. `"67 (9d10 + 18)"` |
| `speed` | `speed` | feet → meters (×0.3): 30→`"9 m"`, 25→`"7.5 m"`, 20→`"6 m"`, 40→`"12 m"`. Only `walk`/`swim`/`fly`/`climb` exist in the schema — if the monster burrows or hovers, mention it in a trait instead |
| `abilities` | `str`…`cha` | map to `strength`…`charisma` (raw scores) |
| `savingThrows` | `save` | keys to full names (`dex`→`dexterity`), values as-is (`"+3"`). Omit if absent |
| `skills` | `skill` | camelCase keys: `animal handling`→`animalHandling`, `sleight of hand`→`sleightOfHand`. Values as-is |
| `immunities` | `immune` + `conditionImmune` | merge both arrays, keep English strings |
| `resistances` | `resist` | English strings |
| `vulnerabilities` | `vulnerable` | English strings |
| `languages` | `languages` | as-is |
| `senses` | `senses` + `passive` | parse strings: `"darkvision 60 ft."` → `darkvision: "18 m"`. Keys: `blindSight`, `darkvision`, `trueSight`, `tremorsense`. `passive` → `passivePerception` (number) |
| `traits` | `trait` | `{name, description}` — **translated + summarized French** |
| `actions` | `action` | see action parsing below |
| `bonusActions` | `bonus` | same |
| `reactions` | `reaction` | same |
| `legendaryActions` | `legendary` | same; also set `legendaryActionsSlots` (default `"3"` if the monster has legendary actions and no explicit count; `legendaryActionsLair` overrides in lair) |
| `lairActions` | legendarygroups.json | each list item becomes one `{name, description}` — give each a short French name |
| `spellStats` / `spells` | `spellcasting` | see spellcasting below |

### Action parsing

5etools attack entries look like:
`"{@atk mw} {@hit 5} to hit, reach 5 ft., one target. {@h}6 ({@damage 1d6 + 3}) piercing damage, and ..."`
(2024 format: `{@atkr m} {@hit 4}, reach 5 ft. {@h}5 ({@damage 1d6 + 2}) Slashing damage...`)

For attack actions, split into structured fields:
- `type`: `{@atk mw}`/`{@atkr m}` → `"Melee"`; `{@atk rw}`/`{@atkr r}` → `"Ranged"`; both (`m,r`) → `"Melee or Ranged"`
- `modifier`: `{@hit 5}` → `"+5"`
- `reach`: `reach 5 ft.` → `"1.5 m"` (feet ×0.3). Ranged `range 80/320 ft.` → `"24/96 m"`. Melee or ranged → `"1.5 m ou distance 6/18 m"`
- `hit`: everything after `{@h}` — average + dice kept verbatim, damage type and rider effects **translated + summarized in French**, e.g. `"6 (1d6 + 3) dégâts perçants. JdS CON 12 ou 21 (6d6) poison (moitié si réussi)."`

For non-attack actions (Multiattack, breath weapons, auras…): just `name` + `description`
(translated + summarized French).

### 5etools tag cleanup

Strip all `{@...}` tags from text before/while translating:
- `{@damage 1d6 + 3}` → `1d6 + 3` · `{@dice 2d4}` → `2d4` · `{@hit 4}` → `+4`
- `{@dc 13}` → `DD 13`
- `{@condition prone}` → French condition (glossary below)
- `{@spell Fireball|XPHB}` → spell name only
- `{@recharge}` → `(Recharge 6)` · `{@recharge 5}` → `(Recharge 5–6)` — append to the action **name**, e.g. `"Souffle brûlant (Recharge 6)"`
- `{@actTrigger}` → `Déclencheur :` · `{@actResponse}` → `Réponse :`
- `{@skill X}`, `{@action X|XPHB}`, `{@variantrule X|XPHB}`, `{@status X}`, `{@creature X}` → keep the visible text only (drop the `|SOURCE` part)

### Spellcasting

From the `spellcasting` array:
- `spellStats.attackMod`: the number in `{@hit X}` of the header (omit `+`)
- `spellStats.spellDC`: the number in `{@dc X}` of the header
- `spellStats.slots`: from leveled casting `spells: {"1": {"slots": 4}}` → `{"1": 4}`. At-will (`will`) spells the creature relies on → use `Infinity` as the slot value (see `meme-poupou`)
- `spells`: one `{id, summary}` per spell. `id` = kebab-case **English** spell name
  (e.g. `"ray-of-sickness"`, `"hypnotic-pattern"` — it's a lookup key, do NOT translate).
  An **apostrophe becomes a dash**, not nothing: "Bigby's Hand" → `"bigby-s-hand"`,
  "Melf's Acid Arrow" → `"melf-s-acid-arrow"` (matches AideDD's url ids).
  `summary` = very short French gist of the spell's combat effect
  (e.g. `"Désavantage des attaques adverses (concentration, 1m)"`).
- **Never put the spell level in the summary** (no `"Niv 3."` prefix). The `id`
  fetches the spell's level, so it's redundant. Likewise, **don't write `"À volonté"`
  for cantrips** (level 0) — being at-will is implied by the level.
- Do keep usage info that is NOT derivable from the level: `(1/jour)`, `(Recharge 5–6)`,
  `(réaction)`/`(action bonus)` cast time, and `"À volonté"` only when a *leveled* spell
  is cast at will (innate at-will casting) — that's special and not implied by the level.

## Step 3 — Translation & summarization rules (French)

Translate to French: `name`, all `traits`/`actions`/`reactions`/`bonusActions`/
`legendaryActions`/`lairActions` names and descriptions, and `hit` rider text.
Do NOT translate: `type`, `size`, `alignment`, `immunities`, `resistances`,
`vulnerabilities`, `languages`, skill/save keys, spell `id`s.

Summarize aggressively — DM-screen style, telegraphic French — but **never drop mechanical
data**: every DC, dice formula, range, duration, condition, usage limit and trigger must
survive. Compare `kamadan`/`vorn`/`almiraj` in localCreatures.ts with their 5etools source
to calibrate.

Shorthand conventions (from existing entries):
- Saving throw: `JdS` + ability + DC → "DC 13 Strength saving throw" → `JdS FOR 13`
  (abilities: FOR, DEX, CON, INT, SAG, CHA). Standalone DC → `DD 13`
- Hit points → `PV`, armor class → `CA`
- Distances: structured fields in meters; inside descriptions prefer squares: `cases`
  (1 case = 1.5 m = 5 ft), e.g. "moves at least 20 feet" → "se déplace d'au moins 4 cases"
- Usage limits: `(3/jour)`, `(1/jour)`, `(Recharge 5–6)`
- "Multiattack" → `Attaques multiples`; list the combo tersely: `"2x griffes + 1x morsure"`

Condition glossary: prone→`au sol`, grappled→`agrippé` (escape DC → `DD X pour se libérer`),
restrained→`entravé`, blinded→`aveuglé`, deafened→`assourdi`, charmed→`charmé`,
frightened→`effrayé`, poisoned→`empoisonné`, stunned→`étourdi`, paralyzed→`paralysé`,
petrified→`pétrifié`, unconscious→`inconscient`, incapacitated→`incapacité`,
exhaustion→`fatigue`, invisible→`invisible`.

Damage types: slashing→`tranchants`, piercing→`perçants`, bludgeoning→`contondants`,
fire→`feu`, cold→`froid`, lightning→`foudre`, thunder→`tonnerre`, acid→`acide`,
poison→`poison`, necrotic→`nécrotiques`, radiant→`radiants`, psychic→`psychiques`,
force→`force`.

## Step 4 — Write & verify

1. Append the new entry at the end of the `localCreatures` object in
   `src/data/localCreatures.ts` (before the closing `};`). Key order follows existing
   entries: name, id, fiveETools, type, size, alignment, armorClass, hitPoints, speed,
   challengeRating, abilities, savingThrows, skills, resistances, immunities,
   vulnerabilities, languages, senses, traits, actions, bonusActions, reactions,
   legendaryActions, legendaryActionsSlots, lairActions, spellStats, spells.
   Omit any field absent from the source — most are optional.
2. If a creature with the same key already exists, ask before overwriting.
3. Run `pnpm lint` and `pnpm typecheck` and fix any issue.
4. If the creature has any `spells`, run `pnpm spells:sync` to insert any new
   spell into the `Spell` table (the stat block only lists spells present in the
   DB). The script fails loudly listing any spell id it cannot resolve on AideDD
   — fix those ids (usually a missing apostrophe-as-dash) and re-run.
5. Show the user the final entry and flag anything you were unsure about
   (translation choices, summarization that compressed a lot, missing schema fields
   like burrow speed).
