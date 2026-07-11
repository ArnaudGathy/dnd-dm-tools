import {
  Abilities,
  AmmunitionType,
  WeaponDamageDices,
  WeaponDamageType,
  WeaponType,
} from "@prisma/client";

/**
 * Base weapons from the 2024 rules (French names and "bottes d'armes" per
 * AideDD, https://www.aidedd.org/regles-24/equipement/armes/), used to
 * autofill a weapon entry. Distances are in cases (feet / 5). Properties that
 * have no dedicated field (polyvalente, lourde, chargement, maîtrise 2024…)
 * land in extraEffects. Weight and cost have no Weapon field.
 */
export type WeaponPreset = {
  name: string;
  type: WeaponType;
  abilityModifier: Abilities;
  damage: {
    numberOfDices: string;
    dice: WeaponDamageDices;
    type: WeaponDamageType;
  };
  reach?: number;
  range?: number;
  longRange?: number;
  ammunitionType?: AmmunitionType;
  extraEffects?: string;
};

const melee = (
  name: string,
  damage: WeaponPreset["damage"],
  extraEffects: string,
  reach = 1,
): WeaponPreset => ({
  name,
  type: WeaponType.MELEE,
  abilityModifier: Abilities.STRENGTH,
  damage,
  reach,
  extraEffects,
});

const thrown = (
  name: string,
  damage: WeaponPreset["damage"],
  extraEffects: string,
  range: number,
  longRange: number,
): WeaponPreset => ({
  name,
  type: WeaponType.THROWN,
  abilityModifier: Abilities.STRENGTH,
  damage,
  reach: 1,
  range,
  longRange,
  extraEffects,
});

const ranged = (
  name: string,
  damage: WeaponPreset["damage"],
  extraEffects: string,
  range: number,
  longRange: number,
  ammunitionType: AmmunitionType,
): WeaponPreset => ({
  name,
  type: WeaponType.RANGED,
  abilityModifier: Abilities.DEXTERITY,
  damage,
  range,
  longRange,
  ammunitionType,
  extraEffects,
});

const d = (
  numberOfDices: number,
  dice: WeaponDamageDices,
  type: WeaponDamageType,
): WeaponPreset["damage"] => ({
  numberOfDices: String(numberOfDices),
  dice,
  type,
});

const { D4, D6, D8, D10, D12 } = WeaponDamageDices;
const { BLUDGEONING, PIERCING, SLASHING } = WeaponDamageType;
const DEX = Abilities.DEXTERITY;

export const WEAPON_PRESETS: Record<string, WeaponPreset> = {
  // Armes courantes — mêlée
  club: melee("Gourdin", d(1, D4, BLUDGEONING), "Légère · Maîtrise : Ralentissement"),
  dagger: {
    ...thrown("Dague", d(1, D4, PIERCING), "Finesse, légère · Maîtrise : Coup double", 4, 12),
    abilityModifier: DEX,
  },
  greatclub: melee("Massue", d(1, D8, BLUDGEONING), "À deux mains · Maîtrise : Poussée"),
  handaxe: thrown("Hachette", d(1, D6, SLASHING), "Légère · Maîtrise : Ouverture", 4, 12),
  javelin: thrown("Javeline", d(1, D6, PIERCING), "Maîtrise : Ralentissement", 6, 24),
  "light-hammer": thrown(
    "Marteau léger",
    d(1, D4, BLUDGEONING),
    "Légère · Maîtrise : Coup double",
    4,
    12,
  ),
  mace: melee("Masse d'armes", d(1, D6, BLUDGEONING), "Maîtrise : Sape"),
  quarterstaff: melee(
    "Bâton de combat",
    d(1, D6, BLUDGEONING),
    "Polyvalente (1d8) · Maîtrise : Renversement",
  ),
  sickle: melee("Serpe", d(1, D4, SLASHING), "Légère · Maîtrise : Coup double"),
  spear: thrown("Lance", d(1, D6, PIERCING), "Polyvalente (1d8) · Maîtrise : Sape", 4, 12),

  // Armes courantes — distance
  dart: {
    ...thrown("Fléchette", d(1, D4, PIERCING), "Finesse · Maîtrise : Ouverture", 4, 12),
    abilityModifier: DEX,
  },
  "light-crossbow": ranged(
    "Arbalète légère",
    d(1, D8, PIERCING),
    "Chargement, à deux mains · Maîtrise : Ralentissement",
    16,
    64,
    AmmunitionType.BOLT,
  ),
  shortbow: ranged(
    "Arc court",
    d(1, D6, PIERCING),
    "À deux mains · Maîtrise : Ouverture",
    16,
    64,
    AmmunitionType.ARROW,
  ),
  sling: ranged(
    "Fronde",
    d(1, D4, BLUDGEONING),
    "Maîtrise : Ralentissement",
    6,
    24,
    AmmunitionType.SLING_BULLET,
  ),

  // Armes de guerre — mêlée
  battleaxe: melee(
    "Hache d'armes",
    d(1, D8, SLASHING),
    "Polyvalente (1d10) · Maîtrise : Renversement",
  ),
  flail: melee("Fléau d'armes", d(1, D8, BLUDGEONING), "Maîtrise : Sape"),
  glaive: melee(
    "Coutille",
    d(1, D10, SLASHING),
    "Lourde, allonge, à deux mains · Maîtrise : Écorchure",
    2,
  ),
  greataxe: melee(
    "Hache à deux mains",
    d(1, D12, SLASHING),
    "Lourde, à deux mains · Maîtrise : Enchaînement",
  ),
  greatsword: melee(
    "Épée à deux mains",
    d(2, D6, SLASHING),
    "Lourde, à deux mains · Maîtrise : Écorchure",
  ),
  halberd: melee(
    "Hallebarde",
    d(1, D10, SLASHING),
    "Lourde, allonge, à deux mains · Maîtrise : Enchaînement",
    2,
  ),
  lance: melee(
    "Lance d'arçon",
    d(1, D10, PIERCING),
    "Lourde, allonge, à deux mains (sauf à cheval) · Maîtrise : Renversement",
    2,
  ),
  longsword: melee("Épée longue", d(1, D8, SLASHING), "Polyvalente (1d10) · Maîtrise : Sape"),
  maul: melee(
    "Maillet d'armes",
    d(2, D6, BLUDGEONING),
    "Lourde, à deux mains · Maîtrise : Renversement",
  ),
  morningstar: melee("Morgenstern", d(1, D8, PIERCING), "Maîtrise : Sape"),
  pike: melee(
    "Pique",
    d(1, D10, PIERCING),
    "Lourde, allonge, à deux mains · Maîtrise : Poussée",
    2,
  ),
  rapier: {
    ...melee("Rapière", d(1, D8, PIERCING), "Finesse · Maîtrise : Ouverture"),
    abilityModifier: DEX,
  },
  scimitar: {
    ...melee("Cimeterre", d(1, D6, SLASHING), "Finesse, légère · Maîtrise : Coup double"),
    abilityModifier: DEX,
  },
  shortsword: {
    ...melee("Épée courte", d(1, D6, PIERCING), "Finesse, légère · Maîtrise : Ouverture"),
    abilityModifier: DEX,
  },
  trident: thrown(
    "Trident",
    d(1, D8, PIERCING),
    "Polyvalente (1d10) · Maîtrise : Renversement",
    4,
    12,
  ),
  warhammer: melee(
    "Marteau de guerre",
    d(1, D8, BLUDGEONING),
    "Polyvalente (1d10) · Maîtrise : Poussée",
  ),
  "war-pick": melee("Pic de guerre", d(1, D8, PIERCING), "Polyvalente (1d10) · Maîtrise : Sape"),
  whip: {
    ...melee("Fouet", d(1, D4, SLASHING), "Finesse, allonge · Maîtrise : Ralentissement", 2),
    abilityModifier: DEX,
  },

  // Armes de guerre — distance
  blowgun: ranged(
    "Sarbacane",
    d(1, D4, PIERCING),
    "Chargement · Dégâts fixes : 1 perforant · Maîtrise : Ouverture",
    5,
    20,
    AmmunitionType.NEEDLES,
  ),
  "hand-crossbow": ranged(
    "Arbalète de poing",
    d(1, D6, PIERCING),
    "Légère, chargement · Maîtrise : Ouverture",
    6,
    24,
    AmmunitionType.BOLT,
  ),
  "heavy-crossbow": ranged(
    "Arbalète lourde",
    d(1, D10, PIERCING),
    "Lourde, chargement, à deux mains · Maîtrise : Poussée",
    20,
    80,
    AmmunitionType.BOLT,
  ),
  longbow: ranged(
    "Arc long",
    d(1, D8, PIERCING),
    "Lourde, à deux mains · Maîtrise : Ralentissement",
    30,
    120,
    AmmunitionType.ARROW,
  ),
  musket: ranged(
    "Mousquet",
    d(1, D12, PIERCING),
    "Chargement, à deux mains · Maîtrise : Ralentissement",
    8,
    24,
    AmmunitionType.FIREARM_BULLET,
  ),
  pistol: ranged(
    "Pistolet",
    d(1, D10, PIERCING),
    "Chargement · Maîtrise : Ouverture",
    6,
    18,
    AmmunitionType.FIREARM_BULLET,
  ),
};

/** Presets grouped for the weapon-card select. */
export const WEAPON_PRESET_GROUPS: { label: string; keys: string[] }[] = [
  {
    label: "Armes courantes — mêlée",
    keys: [
      "quarterstaff",
      "dagger",
      "club",
      "handaxe",
      "javelin",
      "spear",
      "light-hammer",
      "mace",
      "greatclub",
      "sickle",
    ],
  },
  {
    label: "Armes courantes — distance",
    keys: ["light-crossbow", "shortbow", "dart", "sling"],
  },
  {
    label: "Armes de guerre — mêlée",
    keys: [
      "scimitar",
      "glaive",
      "greatsword",
      "shortsword",
      "longsword",
      "flail",
      "whip",
      "greataxe",
      "battleaxe",
      "halberd",
      "lance",
      "maul",
      "warhammer",
      "morningstar",
      "war-pick",
      "pike",
      "rapier",
      "trident",
    ],
  },
  {
    label: "Armes de guerre — distance",
    keys: ["hand-crossbow", "heavy-crossbow", "longbow", "musket", "pistol", "blowgun"],
  },
];
