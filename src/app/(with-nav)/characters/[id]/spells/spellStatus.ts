import { SpellWithFlags } from "@/lib/api/spells";

// The character spell list encodes two orthogonal ideas:
//   1. STATE — is the spell prepared / usable right now? (toggle filled vs empty)
//   2. CATEGORY — the dominant reason it's usable, which drives the toggle color.
// Orthogonal spell properties (ritual, 1/long-rest, swappable) are surfaced
// separately as right-aligned chips, not folded into the toggle color.

export type SpellCategory =
  | "prepared"
  | "always"
  | "longRest"
  | "ritual"
  | "swapLongRest"
  | "swapLevelUp"
  | "none";

// Tailwind needs static class strings, so each category lists its own classes.
export const CATEGORY_CONFIG: Record<SpellCategory, { fill: string; text: string; label: string }> =
  {
    prepared: { fill: "bg-sky-500", text: "text-sky-500", label: "Préparé" },
    always: { fill: "bg-amber-500", text: "text-amber-500", label: "Toujours préparé" },
    longRest: { fill: "bg-lime-500", text: "text-lime-500", label: "1 lancement / long repos" },
    ritual: { fill: "bg-emerald-500", text: "text-emerald-500", label: "Rituel" },
    swapLongRest: { fill: "bg-rose-500", text: "text-rose-500", label: "Échangeable / long repos" },
    swapLevelUp: {
      fill: "bg-purple-500",
      text: "text-purple-500",
      label: "Échangeable / level up",
    },
    none: { fill: "bg-transparent", text: "text-muted-foreground", label: "Non préparé" },
  };

export const isSpellUsable = (spell: SpellWithFlags, isWizard: boolean) =>
  spell.isPrepared || spell.isAlwaysPrepared || (isWizard && spell.isRitual);

// Priority chain (most specific first) — mirrors the legend ordering.
export const getSpellCategory = (spell: SpellWithFlags, isWizard: boolean): SpellCategory => {
  if (!isSpellUsable(spell, isWizard)) {
    return "none";
  }
  if (spell.canBeSwappedOnLongRest) {
    return "swapLongRest";
  }
  if (spell.canBeSwappedOnLevelUp) {
    return "swapLevelUp";
  }
  if (spell.isAlwaysPrepared) {
    return "always";
  }
  if (spell.hasLongRestCast) {
    return "longRest";
  }
  if (spell.isRitual) {
    return "ritual";
  }
  return "prepared";
};
