---
name: translate-readalouds
description: Duplicate every insetReadaloud block of a 5etools adventure chapter with a French translation placed right after the English original. Use when the user asks to translate the readaloud/boxed text of an adventure chapter. Args - adventure name or id (e.g. "toa", "Tomb of Annihilation"), then chapter (e.g. "Chapter 4" or "Fane of the Night Serpent").
---

# Translate chapter readalouds to French

Edits the adventure JSON in the sibling `../5etools-src` repo so that each
`"type": "insetReadaloud"` block in the requested chapter is immediately
followed by a duplicate translated into French. Originals are untouched;
re-running on the same chapter is a no-op (French copies carry an
`id` ending in `-fr` and are skipped).

Helper script: `.claude/skills/translate-readalouds/readaloud_fr.py`
(relative to the dnd-dm-tools repo root). Run it with `python3`.

## Steps

1. **Resolve the adventure file.** Files live at
   `../5etools-src/data/adventure/adventure-<id>.json` with `<id>` lowercase
   (e.g. `toa`). If the user gave a name instead of an id, look it up in
   `../5etools-src/data/adventures.json` (`adventure[].name` → `id`).

2. **Resolve the chapter.** The script matches a case-insensitive substring of
   the section name. If unsure which chapters exist:
   `python3 readaloud_fr.py chapters <adventure.json>`

3. **Extract pending readalouds** (skips already-translated ones):
   ```bash
   python3 readaloud_fr.py extract <adventure.json> "<chapter query>" -o /tmp/pending.json
   ```
   Read `/tmp/pending.json`: a list of `{"key", "entries"}` objects.
   If empty, report that the chapter is already fully translated and stop.

4. **Translate.** Write `/tmp/translations.json` as a single object mapping
   every `key` to the translated `entries`, mirroring the original structure
   exactly (same array length, nested `entries`/`list`/`quote` objects keep
   their shape and `type`; translate their string leaves and `name` headers).
   Translation rules:
   - Natural, literary French as in an official D&D translation (second person
     plural "vous" addressing the players), with correct accents and French
     punctuation.
   - `{@...}` 5etools tags: keep numeric/mechanical tags verbatim
     (`{@dc 13}`, `{@damage 2d6}`, `{@hit 5}`, `{@dice ...}`). For tags with a
     display segment (`{@creature x|SRC|display}`) translate only the display
     segment. For `{@creature x|SRC}` without one, add a French display
     segment (`{@creature x|SRC|nom français}`) when a natural French name
     exists, otherwise leave as is. Never change the lookup part before the
     first `|`.
   - Keep units in feet, rendered as « pieds » (no metric conversion).
   - Proper nouns (NPCs, places, gods) stay unchanged.
   If the chapter has more than ~40 pending readalouds, translate in batches
   or fan out parallel Agent calls (give each agent a slice of the pending
   JSON and the rules above; merge their outputs into one mapping).

5. **Insert** the French copies and rewrite the file (tab-indented, UTF-8,
   matching the repo style):
   ```bash
   python3 readaloud_fr.py insert <adventure.json> "<chapter query>" /tmp/translations.json
   ```
   The script reports inserted/skipped counts and warns about keys you forgot
   to translate — if any are missing, translate them and re-run insert.

6. **Verify.** Re-run `extract` for the same chapter: it must report 0 pending.
   Spot-check one block in the file to confirm the French copy sits directly
   after its English original. The 5etools repo is not ours: do not commit
   there; just report the file modified.
