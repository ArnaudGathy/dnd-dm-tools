import { Backpack, ChartNoAxesColumn, ScrollText, Swords, User } from "lucide-react";
import { ElementType } from "react";
import { FieldErrors } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { ABILITIES_MAP } from "@/constants/maps";

/**
 * Layout config of the character form: which tab owns which fields, and how
 * validation errors are labelled in the sticky error summary. Every tab is
 * always reachable — the mapping only routes error badges and "go to field"
 * navigation, it never gates anything.
 */

export const FORM_TABS = [
  "identity",
  "background",
  "proficiencies",
  "inventory",
  "combat",
] as const;
export type FormTabId = (typeof FORM_TABS)[number];

export const FORM_TAB_CONFIG: Record<FormTabId, { label: string; icon: ElementType }> = {
  identity: { label: "Identité", icon: User },
  background: { label: "Apparence & histoire", icon: ScrollText },
  proficiencies: { label: "Maîtrises", icon: ChartNoAxesColumn },
  inventory: { label: "Inventaire", icon: Backpack },
  combat: { label: "Combat", icon: Swords },
};

const TAB_BY_FIELD: Record<keyof CharacterCreationForm, FormTabId> = {
  party: "identity",
  campaign: "identity",
  status: "identity",
  name: "identity",
  level: "identity",
  className: "identity",
  subclassName: "identity",
  race: "identity",
  background: "identity",
  alignment: "identity",
  strength: "identity",
  dexterity: "identity",
  constitution: "identity",
  intelligence: "identity",
  wisdom: "identity",
  charisma: "identity",
  strengthBase: "identity",
  dexterityBase: "identity",
  constitutionBase: "identity",
  intelligenceBase: "identity",
  wisdomBase: "identity",
  charismaBase: "identity",
  strengthBonus: "identity",
  dexterityBonus: "identity",
  constitutionBonus: "identity",
  intelligenceBonus: "identity",
  wisdomBonus: "identity",
  charismaBonus: "identity",
  age: "background",
  height: "background",
  weight: "background",
  eyeColor: "background",
  hair: "background",
  skin: "background",
  physicalTraits: "background",
  personalityTraits: "background",
  ideals: "background",
  bonds: "background",
  flaws: "background",
  allies: "background",
  notes: "background",
  lore: "background",
  savingThrows: "proficiencies",
  skills: "proficiencies",
  proficiencies: "proficiencies",
  capacities: "proficiencies",
  wealth: "inventory",
  inventory: "inventory",
  magicItems: "inventory",
  weapons: "combat",
  armors: "combat",
};

export function tabForField(path: string): FormTabId {
  const root = path.split(".")[0] as keyof CharacterCreationForm;
  return TAB_BY_FIELD[root] ?? "identity";
}

const TOP_LABELS: Record<string, string> = {
  party: "Groupe",
  campaign: "Campagne",
  status: "Statut",
  name: "Nom du personnage",
  level: "Niveau",
  className: "Classe",
  subclassName: "Sous-classe",
  race: "Race",
  background: "Historique",
  alignment: "Alignement",
  ...ABILITIES_MAP,
  strengthBase: "Force (base)",
  dexterityBase: "Dextérité (base)",
  constitutionBase: "Constitution (base)",
  intelligenceBase: "Intelligence (base)",
  wisdomBase: "Sagesse (base)",
  charismaBase: "Charisme (base)",
  strengthBonus: "Force (bonus)",
  dexterityBonus: "Dextérité (bonus)",
  constitutionBonus: "Constitution (bonus)",
  intelligenceBonus: "Intelligence (bonus)",
  wisdomBonus: "Sagesse (bonus)",
  charismaBonus: "Charisme (bonus)",
  pointBuyBudget: "Acquisition par points",
  age: "Âge",
  height: "Taille",
  weight: "Poids",
  eyeColor: "Yeux",
  hair: "Cheveux",
  skin: "Peau",
  physicalTraits: "Traits physiques",
  personalityTraits: "Traits de personnalité",
  ideals: "Idéaux",
  bonds: "Liens",
  flaws: "Défauts",
  allies: "Alliés et organisations",
  notes: "Notes",
  lore: "Lore",
  savingThrows: "Jets de sauvegarde",
  skills: "Compétences",
  proficiencies: "Maîtrises générales",
  capacities: "Capacités",
  wealth: "Monnaies",
  inventory: "Inventaire",
  magicItems: "Objets magiques",
  weapons: "Armes",
  armors: "Armures",
};

const ITEM_LABELS: Record<string, string> = {
  savingThrows: "Sauvegarde",
  skills: "Compétence",
  proficiencies: "Maîtrise",
  capacities: "Capacité",
  wealth: "Monnaie",
  inventory: "Objet",
  magicItems: "Objet magique",
  weapons: "Arme",
  armors: "Armure",
  damages: "Dégâts",
};

const LEAF_LABELS: Record<string, string> = {
  name: "Nom",
  description: "Description",
  quantity: "Quantité",
  value: "Valeur",
  type: "Type",
  AC: "CA",
  extraEffects: "Effets supplémentaires",
  strengthRequirement: "Force minimum",
  abilityModifier: "Caractéristique",
  attackBonus: "Bonus d'attaque",
  reach: "Allonge",
  range: "Portée",
  longRange: "Portée longue",
  ammunitionType: "Type de munitions",
  ammunitionCount: "Quantité de munitions",
  numberOfDices: "Nombre de dés",
  dice: "Dé",
  flatBonus: "Bonus fixe",
  ability: "Caractéristique",
  skill: "Compétence",
};

function labelForPath(path: string): string {
  const segments = path.split(".");
  if (segments.length === 1) {
    return TOP_LABELS[segments[0]] ?? segments[0];
  }

  const parts: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const next = segments[i + 1];
    if (next !== undefined && /^\d+$/.test(next)) {
      parts.push(`${ITEM_LABELS[segment] ?? TOP_LABELS[segment] ?? segment} ${Number(next) + 1}`);
      i++;
    } else if (/^\d+$/.test(segment)) {
      continue;
    } else {
      parts.push(LEAF_LABELS[segment] ?? TOP_LABELS[segment] ?? segment);
    }
  }
  return parts.join(" · ");
}

export type FlatFormError = {
  path: string;
  label: string;
  message: string;
  tab: FormTabId;
};

/** Walks the nested react-hook-form error tree into a flat, labelled list. */
export function flattenFormErrors(errors: FieldErrors<CharacterCreationForm>): FlatFormError[] {
  const out: FlatFormError[] = [];

  const walk = (node: unknown, path: string[]) => {
    if (!node || typeof node !== "object") {
      return;
    }
    const record = node as Record<string, unknown>;
    if (typeof record.message === "string" && ("type" in record || "ref" in record)) {
      const joined = path.join(".");
      out.push({
        path: joined,
        label: labelForPath(joined),
        message: record.message,
        tab: tabForField(joined),
      });
      return;
    }
    for (const [key, value] of Object.entries(record)) {
      if (key === "ref" || key === "types") {
        continue;
      }
      // `root` carries array-level errors (e.g. nonempty) — keep the array path.
      walk(value, key === "root" ? path : [...path, key]);
    }
  };

  walk(errors, []);
  return out;
}
