import { ArmorType } from "@prisma/client";

/**
 * Base armors from the 2024 rules, used to autofill an armor entry. The AC is
 * the base value only — the Dex modifier is derived from the armor type by
 * getTotalAC (src/utils/stats/ac.ts) — and the shield stores its +2 as AC.
 * Weight and cost have no Armor field, so they are not part of the preset.
 */
export type ArmorPreset = {
  name: string;
  type: ArmorType;
  AC: number;
  strengthRequirement?: number;
  stealthDisadvantage: boolean;
};

export const ARMOR_PRESETS: Record<string, ArmorPreset> = {
  padded: {
    name: "Armure matelassée",
    type: ArmorType.LIGHT,
    AC: 11,
    stealthDisadvantage: true,
  },
  leather: {
    name: "Armure de cuir",
    type: ArmorType.LIGHT,
    AC: 11,
    stealthDisadvantage: false,
  },
  "studded-leather": {
    name: "Armure de cuir clouté",
    type: ArmorType.LIGHT,
    AC: 12,
    stealthDisadvantage: false,
  },
  hide: {
    name: "Armure de peaux",
    type: ArmorType.MEDIUM,
    AC: 12,
    stealthDisadvantage: false,
  },
  "chain-shirt": {
    name: "Chemise de mailles",
    type: ArmorType.MEDIUM,
    AC: 13,
    stealthDisadvantage: false,
  },
  "scale-mail": {
    name: "Armure d'écailles",
    type: ArmorType.MEDIUM,
    AC: 14,
    stealthDisadvantage: true,
  },
  breastplate: {
    name: "Cuirasse",
    type: ArmorType.MEDIUM,
    AC: 14,
    stealthDisadvantage: false,
  },
  "half-plate": {
    name: "Demi-plate",
    type: ArmorType.MEDIUM,
    AC: 15,
    stealthDisadvantage: true,
  },
  "ring-mail": {
    name: "Broigne",
    type: ArmorType.HEAVY,
    AC: 14,
    stealthDisadvantage: true,
  },
  "chain-mail": {
    name: "Cotte de mailles",
    type: ArmorType.HEAVY,
    AC: 16,
    strengthRequirement: 13,
    stealthDisadvantage: true,
  },
  splint: {
    name: "Clibanion",
    type: ArmorType.HEAVY,
    AC: 17,
    strengthRequirement: 15,
    stealthDisadvantage: true,
  },
  plate: {
    name: "Harnois",
    type: ArmorType.HEAVY,
    AC: 18,
    strengthRequirement: 15,
    stealthDisadvantage: true,
  },
  shield: {
    name: "Bouclier",
    type: ArmorType.SHIELD,
    AC: 2,
    stealthDisadvantage: false,
  },
};

/** Presets grouped by armor type, for the grouped select in the armor card. */
export const ARMOR_PRESETS_BY_TYPE: { type: ArmorType; keys: string[] }[] = [
  { type: ArmorType.LIGHT, keys: ["padded", "leather", "studded-leather"] },
  {
    type: ArmorType.MEDIUM,
    keys: ["hide", "chain-shirt", "scale-mail", "breastplate", "half-plate"],
  },
  { type: ArmorType.HEAVY, keys: ["ring-mail", "chain-mail", "splint", "plate"] },
  { type: ArmorType.SHIELD, keys: ["shield"] },
];
