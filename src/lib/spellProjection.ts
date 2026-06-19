import { Classes, SpellAction } from "@prisma/client";
import { APISpell } from "@/types/schemas";
import { CLASS_BY_LABEL } from "@/constants/maps";

/**
 * Derive the combat-relevant casting time category from AideDD's French
 * `casting_time` string. Anything that isn't an action / bonus action /
 * reaction (e.g. "1 minute", "10 minutes", "1 heure") maps to OTHER.
 * Order matters: "Action bonus" must be checked before plain "Action".
 */
export const deriveActionType = (castingTime?: string | null): SpellAction => {
  const ct = (castingTime ?? "").trim().toLowerCase();
  if (ct.startsWith("réaction") || ct.startsWith("reaction")) return SpellAction.REACTION;
  if (ct.startsWith("action bonus")) return SpellAction.BONUS_ACTION;
  if (ct.startsWith("action")) return SpellAction.ACTION;
  return SpellAction.OTHER;
};

/** Map AideDD's French class names onto the Classes enum (unknown names dropped). */
export const mapSpellClasses = (classes?: APISpell["classes"]): Classes[] => {
  if (!classes) {
    return [];
  }
  const mapped = classes
    .map((c) => (c.name ? CLASS_BY_LABEL[c.name] : undefined))
    .filter((c): c is Classes => Boolean(c));
  return [...new Set(mapped)];
};

/**
 * Structured columns projected from the full APISpell payload. Used both when
 * caching a freshly-fetched spell and when migrating existing cached data, so
 * the queryable columns always stay in sync with the rendered `data`.
 */
export const projectSpellColumns = (spell: APISpell) => ({
  name: spell.name ?? spell.index ?? "",
  level: spell.level ?? 0,
  isRitual: spell.ritual ?? false,
  concentration: spell.concentration ?? false,
  actionType: deriveActionType(spell.casting_time),
  school: spell.school?.name ?? null,
  classes: mapSpellClasses(spell.classes),
});
