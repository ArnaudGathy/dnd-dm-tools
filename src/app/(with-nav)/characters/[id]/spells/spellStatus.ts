import { SpellWithFlags } from "@/lib/api/spells";
import { ChevronsUp, MessageCircleMore, Moon, Sparkle, Zap, type LucideIcon } from "lucide-react";
import { SpellAction } from "@prisma/client";

// A spell row carries three INDEPENDENT kinds of information:
//
//   A. Usability   → the pastille (left). Colour = budget cost. Interactive.
//   B. Config      → planning markers (right). Recessive grey — character-specific.
//   C. Spell facts → the same colourful icon/tag language as the /spells list.

// ---- A. Usability (the interactive pastille) ------------------------------
// "free" = usable without spending one of the character's daily prepared slots,
// and locked from the row (you change the underlying flags via the gear).

export type Usability = "none" | "prepared" | "free";

export const isSpellFree = (spell: SpellWithFlags, isWizard: boolean) =>
  spell.isAlwaysPrepared || spell.hasLongRestCast || (isWizard && spell.isRitual);

export const isSpellUsable = (spell: SpellWithFlags, isWizard: boolean) =>
  spell.isPrepared || isSpellFree(spell, isWizard);

export const getUsability = (spell: SpellWithFlags, isWizard: boolean): Usability => {
  if (isSpellFree(spell, isWizard)) {
    return "free";
  }
  if (spell.isPrepared) {
    return "prepared";
  }
  return "none";
};

export const USABILITY_CONFIG: Record<Usability, { label: string; hint: string }> = {
  prepared: { label: "Préparé", hint: "Compte dans le budget de sorts préparés" },
  free: {
    label: "Toujours disponible",
    hint: "Utilisable gratuitement, ne compte pas dans le budget",
  },
  none: { label: "Non préparé", hint: "Non utilisable pour l'instant" },
};

// ---- B. Character config / planning markers (recessive grey) --------------
// Choices the player makes about THIS spell on THIS character. De-emphasised so
// they don't compete with the spell facts; distinguished by icon, not colour.

export type PlanningFlag = "hasLongRestCast" | "canBeSwappedOnLongRest" | "canBeSwappedOnLevelUp";

export const PLANNING_MARKERS: {
  flag: PlanningFlag;
  Icon: LucideIcon;
  label: string;
  explanation: string;
}[] = [
  {
    flag: "hasLongRestCast",
    Icon: Zap,
    label: "1 lancement / long repos",
    explanation:
      "Peut être lancé une fois gratuitement (sans emplacement) par long repos. Rend le sort toujours disponible.",
  },
  {
    flag: "canBeSwappedOnLongRest",
    Icon: Moon,
    label: "Échangeable lors d'un long repos",
    explanation: "Ce sort peut être échangé contre un autre lors d'un long repos.",
  },
  {
    flag: "canBeSwappedOnLevelUp",
    Icon: ChevronsUp,
    label: "Échangeable lors d'un passage de niveau",
    explanation: "Ce sort peut être échangé contre un autre lors d'un passage de niveau.",
  },
];

export const PLANNING_ACCENT = "text-muted-foreground";

// ---- C. Intrinsic spell facts (same language as /spells) ------------------
export const FACT_ICONS = {
  concentration: {
    Icon: MessageCircleMore,
    className: "text-yellow-500",
    label: "Concentration",
    explanation:
      "Nécessite de la concentration : un seul sort de concentration peut être maintenu à la fois.",
  },
  ritual: {
    Icon: Sparkle,
    className: "text-emerald-500",
    label: "Rituel",
    explanation: "Peut être lancé comme rituel : sans emplacement de sort, mais +10 minutes.",
  },
} as const;

export const ACTION_TAGS: Partial<
  Record<SpellAction, { label: string; className: string; explanation: string }>
> = {
  [SpellAction.BONUS_ACTION]: {
    label: "Bonus",
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    explanation: "Se lance avec une action bonus.",
  },
  [SpellAction.REACTION]: {
    label: "Réaction",
    className: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    explanation: "Se lance avec une réaction.",
  },
};
