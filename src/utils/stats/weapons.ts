import { Character, Weapon, WeaponDamage, WeaponDamageType } from "@prisma/client";
import {
  ABILITIES_MAP_TO_NAME,
  PROFICIENCY_BONUS_BY_LEVEL,
  WEAPON_DICE_MAP,
} from "@/constants/maps";
import { addSignToNumber, getModifier } from "@/utils/utils";
import {
  AudioLines,
  Droplet,
  Droplets,
  Eye,
  Flame,
  Gavel,
  Skull,
  Snowflake,
  Sun,
  Sword,
  Target,
  Wand2,
  Zap,
} from "lucide-react";

const getWeaponAbilityModifier = (character: Character, weapon: Weapon) => {
  const modifierName = weapon.abilityModifier;
  const abilityModifier = getModifier(character[ABILITIES_MAP_TO_NAME[weapon.abilityModifier]]);
  return { abilityModifier, modifierName };
};

export const getWeaponAttackBonus = (character: Character, weapon: Weapon) => {
  const proficiencyBonus = weapon.isProficient ? PROFICIENCY_BONUS_BY_LEVEL[character.level] : 0;
  const attackBonus = weapon.attackBonus ?? 0;
  const { modifierName, abilityModifier } = getWeaponAbilityModifier(character, weapon);

  return {
    proficiencyBonus,
    attackBonus,
    abilityModifier,
    modifierName,
    total: addSignToNumber(proficiencyBonus + abilityModifier + attackBonus),
  };
};

export const getWeaponDamage = (character: Character, damage: WeaponDamage, weapon: Weapon) => {
  const dices = `${damage.numberOfDices}${WEAPON_DICE_MAP[damage.dice]}`;
  const { modifierName: baseModifierName, abilityModifier: baseAbilityModifier } =
    getWeaponAbilityModifier(character, weapon);
  const modifierName = damage.isBaseDamage ? baseModifierName : null;
  const abilityModifier = damage.isBaseDamage ? baseAbilityModifier : 0;
  const flatBonus = damage.flatBonus ?? 0;
  const damageBonus = flatBonus + abilityModifier;

  return {
    flatBonus,
    modifierName,
    abilityModifier,
    totalString: `${dices}${damageBonus >= 1 ? `+${damageBonus}` : damageBonus < 0 ? damageBonus : ""}`,
  };
};
const DAMAGE_TYPE_KEYWORDS: { type: WeaponDamageType; keywords: string[] }[] = [
  { type: WeaponDamageType.BLUDGEONING, keywords: ["bludgeoning", "contondant"] },
  { type: WeaponDamageType.SLASHING, keywords: ["slashing", "tranchant"] },
  { type: WeaponDamageType.PIERCING, keywords: ["piercing", "perçant", "percant"] },
  { type: WeaponDamageType.ACID, keywords: ["acid", "acide"] },
  { type: WeaponDamageType.COLD, keywords: ["cold", "froid", "givre"] },
  { type: WeaponDamageType.FIRE, keywords: ["fire", "feu"] },
  { type: WeaponDamageType.FORCE, keywords: ["force"] },
  { type: WeaponDamageType.LIGHTNING, keywords: ["lightning", "foudre", "éclair", "eclair"] },
  { type: WeaponDamageType.NECROTIC, keywords: ["necrotic", "nécrotique", "necrotique"] },
  { type: WeaponDamageType.POISON, keywords: ["poison"] },
  { type: WeaponDamageType.PSYCHIC, keywords: ["psychic", "psychique", "psi"] },
  { type: WeaponDamageType.RADIANT, keywords: ["radiant", "radieux"] },
  { type: WeaponDamageType.THUNDER, keywords: ["thunder", "tonnerre"] },
];

// Damage keywords can pick up plural/feminine forms ("tranchants", "froide") but must NOT
// bleed into status effects ("poison" damage vs the "poisoned"/"empoisonné" condition).
const DAMAGE_KEYWORD_SUFFIXES = ["", "s", "e", "es"];

// Resistance/immunity/vulnerability labels are free-form (mixed FR/EN, e.g. "Feu (voir
// trait)"), so match a damage type by whole word and return its icon/color, or undefined
// for condition immunities and other non-damage entries.
export const getDamageTypeStyleFromLabel = (label: string) => {
  const tokens = label
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter(Boolean);
  const match = DAMAGE_TYPE_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) =>
      tokens.some((token) => DAMAGE_KEYWORD_SUFFIXES.some((suffix) => token === keyword + suffix)),
    ),
  );
  return match ? getDamageTypeIconAndColor(match.type) : undefined;
};

export const getDamageTypeIconAndColor = (damageType: WeaponDamageType) => {
  switch (damageType) {
    case WeaponDamageType.BLUDGEONING:
      return { icon: Gavel, color: "oklch(0.704 0.04 256.788)" };
    case WeaponDamageType.SLASHING:
      return { icon: Sword, color: "oklch(0.704 0.04 256.788)" };
    case WeaponDamageType.PIERCING:
      return { icon: Target, color: "oklch(0.704 0.04 256.788)" };
    case WeaponDamageType.ACID:
      return { icon: Droplet, color: "oklch(0.841 0.238 128.85)" };
    case WeaponDamageType.COLD:
      return { icon: Snowflake, color: "oklch(0.828 0.111 230.318)" };
    case WeaponDamageType.LIGHTNING:
      return { icon: Zap, color: "oklch(0.546 0.245 262.881)" };
    case WeaponDamageType.POISON:
      return { icon: Droplets, color: "oklch(0.606 0.25 292.717)" };
    case WeaponDamageType.FIRE:
      return { icon: Flame, color: "oklch(0.646 0.222 41.116)" };
    case WeaponDamageType.FORCE:
      return { icon: Wand2, color: "oklch(0.592 0.249 0.584)" };
    case WeaponDamageType.NECROTIC:
      return { icon: Skull, color: "oklch(0.845 0.143 164.978)" };
    case WeaponDamageType.PSYCHIC:
      return { icon: Eye, color: "oklch(0.833 0.145 321.434)" };
    case WeaponDamageType.RADIANT:
      return { icon: Sun, color: "oklch(0.879 0.169 91.605)" };
    case WeaponDamageType.THUNDER:
      return { icon: AudioLines, color: "oklch(0.673 0.182 276.935)" };
  }
};
