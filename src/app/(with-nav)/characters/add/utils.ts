import { z } from "zod";
import {
  Abilities,
  Alignment,
  AmmunitionType,
  ArmorType,
  Backgrounds,
  CampaignId,
  CharacterStatus,
  Classes,
  MoneyType,
  MagicItemRarity,
  PartyId,
  Races,
  Skills,
  Subclasses,
  WeaponDamageDices,
  WeaponDamageType,
  WeaponType,
} from "@prisma/client";
import { CharacterById } from "@/lib/utils";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";

export const formRequiredString = z.string().min(1, "Ce champ est requis");
export const optionalNumberStringNotZero = z
  .string()
  .refine((val) => val === "" || /^\d+$/.test(val), {
    message: "Doit être un nombre entier",
  })
  .refine((val) => val === "" || parseInt(val, 10) > 0, {
    message: "Doit être supérieur à 0",
  })
  .optional();
// Shared point-buy config (used by both the schema-level budget check and the
// ability scores builder UI).
export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_BASE_MIN = 8;
export const POINT_BUY_BASE_MAX = 15;
// 2024 point-buy costs (score 8 → 15).
export const POINT_BUY_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};
export const clampPointBuyBase = (score: number) =>
  Math.min(Math.max(score, POINT_BUY_BASE_MIN), POINT_BUY_BASE_MAX);
export const pointBuyCost = (score: number) => POINT_BUY_COST[clampPointBuyBase(score)] ?? 0;
export const POINT_BUY_BASE_KEYS = [
  "strengthBase",
  "dexterityBase",
  "constitutionBase",
  "intelligenceBase",
  "wisdomBase",
  "charismaBase",
] as const;

// Point-buy base score: optional digit string, clamped to 8–15 in the UI. Kept
// lenient here because it's a client-only helper — the persisted total is what
// `minMax(8, 20)` validates.
export const pointBuyString = z.string().regex(/^\d*$/, "Doit être un nombre entier").optional();
// Extra ability points (historique/dons): optional non-negative digit string.
export const abilityBonusString = z
  .string()
  .regex(/^\d*$/, "Doit être un nombre entier")
  .optional();

export function minMax(min: number, max?: number) {
  return z
    .string()
    .min(1, "Ce champ est requis")
    .regex(/^\d+$/, "Doit être un nombre entier")
    .refine(
      (val) => {
        const numberVal = parseInt(val, 10);
        return numberVal >= min && (!max || numberVal <= max);
      },
      {
        message: max ? `Doit être compris entre ${min} et ${max}` : `Doit être au minimum ${min}`,
      },
    );
}

export const inventoryItemFormSchema = z.object({
  name: formRequiredString,
  description: z.string().nullish(),
  quantity: z
    .union([z.number(), z.string().regex(/^\d+$/, "Doit être un nombre entier")])
    .optional(),
  value: z.string().nullish(),
});
export type InventoryFormSchema = z.infer<typeof inventoryItemFormSchema>;

export const magicItemFormSchema = z.object({
  name: formRequiredString,
  description: z.string().nullish(),
  charges: z.string().nullish(),

  rarity: z.nativeEnum(MagicItemRarity),
  isAttuned: z.boolean(),
});
export type MagicItemFormSchema = z.infer<typeof magicItemFormSchema>;

const signUpFormBaseSchema = z.object({
  campaign: z.nativeEnum(CampaignId),
  party: z.nativeEnum(PartyId),
  status: z.nativeEnum(CharacterStatus),
  level: minMax(1, 20),
  name: formRequiredString,
  className: z.nativeEnum(Classes),
  subclassName: z.nativeEnum(Subclasses).nullable(),
  race: z.nativeEnum(Races),
  background: z.nativeEnum(Backgrounds),
  strength: minMax(8, 20),
  dexterity: minMax(8, 20),
  constitution: minMax(8, 20),
  intelligence: minMax(8, 20),
  wisdom: minMax(8, 20),
  charisma: minMax(8, 20),
  // Only used by classes with no innate spellcasting (species/feat casters) —
  // ignored otherwise, see getSpellCastingStat.
  spellCastingAbility: z.nativeEnum(Abilities).nullish(),
  // Point-buy helper fields (creation only, never persisted). The `*Base` values
  // are the 8–15 point-buy scores; the `*Bonus` values are extra points from
  // historique/dons. Their sum is written into the persisted ability fields above.
  strengthBase: pointBuyString,
  dexterityBase: pointBuyString,
  constitutionBase: pointBuyString,
  intelligenceBase: pointBuyString,
  wisdomBase: pointBuyString,
  charismaBase: pointBuyString,
  strengthBonus: abilityBonusString,
  dexterityBonus: abilityBonusString,
  constitutionBonus: abilityBonusString,
  intelligenceBonus: abilityBonusString,
  wisdomBonus: abilityBonusString,
  charismaBonus: abilityBonusString,
  age: optionalNumberStringNotZero,
  height: optionalNumberStringNotZero,
  weight: optionalNumberStringNotZero,
  eyeColor: z.string().optional(),
  hair: z.string().optional(),
  skin: z.string().optional(),
  alignment: z.nativeEnum(Alignment),
  personalityTraits: z.string().optional(),
  physicalTraits: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
  lore: z.string().optional(),
  allies: z.string().optional(),
  notes: z.string().optional(),
  proficiencies: z.array(z.object({ name: formRequiredString })).nonempty(),
  capacities: z
    .array(
      z.object({
        name: formRequiredString,
        description: z.string().optional(),
      }),
    )
    .nonempty(),
  savingThrows: z
    .array(
      z.object({
        ability: z.nativeEnum(Abilities),
        isProficient: z.boolean(),
      }),
    )
    .nonempty(),
  skills: z
    .array(
      z.object({
        skill: z.nativeEnum(Skills),
        isProficient: z.boolean(),
        isExpert: z.boolean(),
      }),
    )
    .nonempty(),
  inventory: z.array(inventoryItemFormSchema),
  magicItems: z.array(magicItemFormSchema),
  wealth: z.array(
    z.object({
      type: z.nativeEnum(MoneyType),
      quantity: minMax(0),
    }),
  ),
  armors: z.array(
    z
      .object({
        type: z.nativeEnum(ArmorType),
        name: formRequiredString,
        AC: minMax(2, 20),
        extraEffects: z.string().optional(),
        strengthRequirement: optionalNumberStringNotZero,
        isEquipped: z.boolean(),
        isProficient: z.boolean(),
        stealthDisadvantage: z.boolean(),
      })
      .refine((armor) => armor.type !== ArmorType.HEAVY || !!armor.strengthRequirement, {
        message: "Requis pour une armure lourde",
        path: ["strengthRequirement"],
      }),
  ),
  weapons: z.array(
    z
      .object({
        name: formRequiredString,
        type: z.nativeEnum(WeaponType),
        isProficient: z.boolean(),
        abilityModifier: z.nativeEnum(Abilities),
        attackBonus: z
          .string()
          .refine((val) => val === "" || /^\d+$/.test(val), {
            message: "Doit être un nombre entier",
          })
          .optional(),
        reach: optionalNumberStringNotZero,
        range: optionalNumberStringNotZero,
        longRange: optionalNumberStringNotZero,
        ammunitionType: z.nativeEnum(AmmunitionType).optional(),
        ammunitionCount: optionalNumberStringNotZero,
        extraEffects: z.string().optional(),
        damages: z
          .array(
            z.object({
              isBaseDamage: z.boolean(),
              type: z.nativeEnum(WeaponDamageType),
              dice: z.nativeEnum(WeaponDamageDices),
              numberOfDices: minMax(1),
              flatBonus: z
                .string()
                .refine((val) => val === "" || /^\d+$/.test(val), {
                  message: "Doit être un nombre entier",
                })
                .optional(),
            }),
          )
          .nonempty(),
      })
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.MELEE && weapon.type !== WeaponType.THROWN) || weapon.reach,
        {
          message: "Requise pour une arme de mêlée ou de lancer",
          path: ["reach"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED && weapon.type !== WeaponType.THROWN) || weapon.range,
        {
          message: "Requise pour une arme à distance ou de lancer",
          path: ["range"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED && weapon.type !== WeaponType.THROWN) ||
          weapon.longRange,
        {
          message: "Requise pour une arme à distance ou de lancer",
          path: ["longRange"],
        },
      )
      .refine((weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionType, {
        message: "Requis pour une arme à distance",
        path: ["ammunitionType"],
      })
      .refine((weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionCount, {
        message: "Requise pour une arme à distance",
        path: ["ammunitionCount"],
      }),
  ),
});

export const signUpFormSchema = signUpFormBaseSchema.superRefine((data, ctx) => {
  // Point-buy budget check (creation only; base fields are empty in edit mode, so
  // this is a no-op there). The whole budget must be spent exactly — no more, no
  // less. Blocks submission and surfaces one issue in the validation list rather
  // than colouring the form.
  const allBasesEmpty = POINT_BUY_BASE_KEYS.every((key) => !data[key]);
  if (allBasesEmpty) {
    return;
  }
  const spent = POINT_BUY_BASE_KEYS.reduce((total, key) => {
    const score = parseInt(data[key] ?? "", 10);
    return Number.isNaN(score) ? total : total + pointBuyCost(score);
  }, 0);
  if (spent !== POINT_BUY_BUDGET) {
    const diff = Math.abs(spent - POINT_BUY_BUDGET);
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pointBuyBudget"],
      message:
        spent > POINT_BUY_BUDGET
          ? `Budget d'acquisition par points dépassé de ${diff} point${diff > 1 ? "s" : ""} (${spent} / ${POINT_BUY_BUDGET}).`
          : `Il reste ${diff} point${diff > 1 ? "s" : ""} à dépenser (${spent} / ${POINT_BUY_BUDGET}). Les ${POINT_BUY_BUDGET} points doivent être dépensés entièrement.`,
    });
  }
});

export const signupFormDefaultValues = {
  status: CharacterStatus.ACTIVE,
  level: "1",
  name: "",
  campaign: CampaignId.TOMB,
  party: PartyId.MIFA,
  className: Classes.BARBARIAN,
  subclassName: null,
  race: Races.AASIMAR,
  background: Backgrounds.ACOLYTE,
  strength: "",
  dexterity: "",
  constitution: "",
  intelligence: "",
  wisdom: "",
  charisma: "",
  spellCastingAbility: null,
  strengthBase: "8",
  dexterityBase: "8",
  constitutionBase: "8",
  intelligenceBase: "8",
  wisdomBase: "8",
  charismaBase: "8",
  strengthBonus: "",
  dexterityBonus: "",
  constitutionBonus: "",
  intelligenceBonus: "",
  wisdomBonus: "",
  charismaBonus: "",
  age: "",
  height: "",
  weight: "",
  eyeColor: "",
  hair: "",
  skin: "",
  alignment: Alignment.NEUTRAL,
  personalityTraits: "",
  physicalTraits: "",
  ideals: "",
  bonds: "",
  flaws: "",
  lore: "",
  allies: "",
  notes: "",
  proficiencies: [{ name: "Langues: " }, { name: "Armures : " }, { name: "Armes : " }],
  capacities: [
    {
      name: "",
      description: "",
    },
  ],
  savingThrows: [
    { ability: Abilities.STRENGTH, isProficient: true },
    { ability: Abilities.DEXTERITY, isProficient: true },
  ],
  skills: [
    { skill: Skills.ATHLETICS, isProficient: true, isExpert: false },
    { skill: Skills.ARCANA, isProficient: true, isExpert: false },
  ],
  inventory: [],
  magicItems: [],
  wealth: [
    { type: MoneyType.GOLD, quantity: "0" },
    { type: MoneyType.SILVER, quantity: "0" },
    { type: MoneyType.COPPER, quantity: "0" },
  ],
  armors: [],
  weapons: [],
};

const backendRequiredString = z.string().min(1);
const optionalNullableString = z
  .string()
  .nullable()
  .optional()
  .transform((v) => (v === null ? undefined : v));
// Optional persisted string: empty string or null/undefined all collapse to null
// so the column stores NULL rather than "".
const backendOptionalString = z
  .string()
  .nullish()
  .transform((v) => (v == null || v === "" ? null : v));
const backendStringToNumber = z.coerce.number();
// Optional persisted number from a form string: "" / null / undefined → null.
const backendOptionalNumber = z
  .union([z.literal(""), backendStringToNumber.min(1)])
  .nullish()
  .transform((v) => (v == null || v === "" ? null : v));

export const backendInventoryItemSchema = z.object({
  name: backendRequiredString,
  description: optionalNullableString,
  quantity: backendStringToNumber.optional(),
  value: optionalNullableString,
});

export const backendMagicItemSchema = z.object({
  name: backendRequiredString,
  description: z.string().optional(),
  charges: optionalNullableString,

  rarity: z.nativeEnum(MagicItemRarity),
  isAttuned: z.boolean(),
});
export const backendCharacterSchema = z.object({
  owner: backendRequiredString,
  campaign: z.nativeEnum(CampaignId),
  party: z.nativeEnum(PartyId),
  status: z.nativeEnum(CharacterStatus),
  level: backendStringToNumber.min(1).max(20),
  name: backendRequiredString,
  className: z.nativeEnum(Classes),
  subclassName: z.nativeEnum(Subclasses).nullable(),
  race: z.nativeEnum(Races),
  background: z.nativeEnum(Backgrounds),
  strength: backendStringToNumber.min(8).max(20),
  dexterity: backendStringToNumber.min(8).max(20),
  constitution: backendStringToNumber.min(8).max(20),
  intelligence: backendStringToNumber.min(8).max(20),
  wisdom: backendStringToNumber.min(8).max(20),
  charisma: backendStringToNumber.min(8).max(20),
  spellCastingAbility: z
    .nativeEnum(Abilities)
    .nullish()
    .transform((v) => v ?? null),
  age: backendOptionalNumber,
  height: backendOptionalNumber,
  weight: backendOptionalNumber,
  eyeColor: backendOptionalString,
  hair: backendOptionalString,
  skin: backendOptionalString,
  alignment: z.nativeEnum(Alignment),
  personalityTraits: backendOptionalString,
  physicalTraits: z.string().optional(),
  ideals: backendOptionalString,
  bonds: backendOptionalString,
  flaws: backendOptionalString,
  lore: z.string().optional(),
  allies: z.string().optional(),
  notes: z.string().optional(),
  proficiencies: z
    .array(z.object({ name: backendRequiredString }))
    .nonempty()
    .transform((val) => val.map((v) => v.name)),
  capacities: z
    .array(
      z.object({
        name: backendRequiredString,
        description: z.string().optional(),
      }),
    )
    .nonempty(),
  savingThrows: z
    .array(z.object({ ability: z.nativeEnum(Abilities), isProficient: z.boolean() }))
    .nonempty(),
  skills: z
    .array(
      z.object({
        skill: z.nativeEnum(Skills),
        isProficient: z.boolean(),
        isExpert: z.boolean(),
      }),
    )
    .nonempty(),
  inventory: z.array(backendInventoryItemSchema),
  magicItems: z.array(backendMagicItemSchema),

  wealth: z.array(
    z.object({
      type: z.nativeEnum(MoneyType),
      quantity: backendStringToNumber.min(0),
    }),
  ),
  armors: z.array(
    z
      .object({
        type: z.nativeEnum(ArmorType),
        name: backendRequiredString,
        AC: backendStringToNumber.min(2).max(20),
        extraEffects: z.string().optional(),
        strengthRequirement: backendStringToNumber.optional(),
        isEquipped: z.boolean(),
        isProficient: z.boolean(),
        stealthDisadvantage: z.boolean(),
      })
      .refine((armor) => armor.type !== ArmorType.HEAVY || !!armor.strengthRequirement, {
        message: "Requis",
        path: ["strengthRequirement"],
      }),
  ),
  weapons: z.array(
    z
      .object({
        name: backendRequiredString,
        type: z.nativeEnum(WeaponType),
        isProficient: z.boolean(),
        abilityModifier: z.nativeEnum(Abilities),
        attackBonus: backendStringToNumber.optional(),
        reach: backendStringToNumber
          .optional()
          .transform((reach) => (reach ? reach * 5 : undefined)),
        range: backendStringToNumber
          .optional()
          .transform((range) => (range ? range * 5 : undefined)),
        longRange: backendStringToNumber
          .optional()
          .transform((longRange) => (longRange ? longRange * 5 : undefined)),
        ammunitionType: z.nativeEnum(AmmunitionType).optional(),
        ammunitionCount: backendStringToNumber.optional(),
        extraEffects: z.string().optional(),
        damages: z
          .array(
            z.object({
              isBaseDamage: z.boolean(),
              type: z.nativeEnum(WeaponDamageType),
              dice: z.nativeEnum(WeaponDamageDices),
              numberOfDices: backendStringToNumber.min(1),
              flatBonus: backendStringToNumber.optional(),
            }),
          )
          .nonempty(),
      })
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.MELEE && weapon.type !== WeaponType.THROWN) || weapon.reach,
        {
          message: "Requis",
          path: ["reach"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED && weapon.type !== WeaponType.THROWN) || weapon.range,
        {
          message: "Requis",
          path: ["range"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED && weapon.type !== WeaponType.THROWN) ||
          weapon.longRange,
        {
          message: "Requis",
          path: ["longRange"],
        },
      )
      .refine((weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionType, {
        message: "Requis",
        path: ["ammunitionType"],
      })
      .refine((weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionCount, {
        message: "Requis",
        path: ["ammunitionCount"],
      }),
  ),
});

export function dataToForm(character: CharacterById): CharacterCreationForm {
  const proficiencies = character.proficiencies.map((p) => ({ name: p })) as [
    { name: string },
    ...{ name: string }[],
  ];
  const capacities = character.capacities.map((capacity) => ({
    name: capacity.name,
    description: capacity.description ?? undefined,
  })) as [{ name: string; description?: string }, ...{ name: string; description?: string }[]];
  const savingThrows = character.savingThrows.map((savingThrow) => ({
    ability: savingThrow.ability,
    isProficient: savingThrow.isProficient,
  })) as [
    { ability: Abilities; isProficient: boolean },
    ...{ ability: Abilities; isProficient: boolean }[],
  ];
  const skills = character.skills.map((skill) => ({
    skill: skill.skill,
    isProficient: skill.isProficient,
    isExpert: skill.isExpert,
  })) as [
    { skill: Skills; isProficient: boolean; isExpert: boolean },
    ...{ skill: Skills; isProficient: boolean; isExpert: boolean }[],
  ];
  const weapons = character.weapons.map((weapon) => ({
    name: weapon.name,
    type: weapon.type,
    isProficient: weapon.isProficient,
    abilityModifier: weapon.abilityModifier,
    attackBonus: weapon.attackBonus?.toString() ?? undefined,
    reach: weapon.reach ? (weapon.reach / 5).toString() : undefined,
    range: weapon.range ? (weapon.range / 5).toString() : undefined,
    longRange: weapon.longRange ? (weapon.longRange / 5).toString() : undefined,
    ammunitionType: weapon.ammunitionType ?? undefined,
    ammunitionCount: weapon.ammunitionCount?.toString() ?? undefined,
    extraEffects: weapon.extraEffects ?? undefined,
    damages: weapon.damages.map((weaponDamage) => ({
      isBaseDamage: weaponDamage.isBaseDamage,
      type: weaponDamage.type,
      dice: weaponDamage.dice,
      numberOfDices: String(weaponDamage.numberOfDices),
      flatBonus: weaponDamage.flatBonus?.toString() ?? undefined,
    })) as [
      {
        isBaseDamage: boolean;
        type: WeaponDamageType;
        dice: WeaponDamageDices;
        numberOfDices: string;
        flatBonus: string | "";
      },
      ...{
        isBaseDamage: boolean;
        type: WeaponDamageType;
        dice: WeaponDamageDices;
        numberOfDices: string;
        flatBonus: string | "";
      }[],
    ],
  }));

  return {
    ...character,
    level: String(character.level),
    campaign: character.campaign.name,
    party: character.campaign.party.name,
    strength: String(character.strength),
    dexterity: String(character.dexterity),
    constitution: String(character.constitution),
    intelligence: String(character.intelligence),
    wisdom: String(character.wisdom),
    charisma: String(character.charisma),
    age: character.age?.toString() ?? "",
    height: character.height?.toString() ?? "",
    weight: character.weight?.toString() ?? "",
    eyeColor: character.eyeColor ?? "",
    hair: character.hair ?? "",
    skin: character.skin ?? "",
    personalityTraits: character.personalityTraits ?? "",
    ideals: character.ideals ?? "",
    bonds: character.bonds ?? "",
    flaws: character.flaws ?? "",
    physicalTraits: character.physicalTraits ?? undefined,
    lore: character.lore ?? undefined,
    allies: character.allies ?? undefined,
    notes: character.notes ?? undefined,
    proficiencies,
    capacities,
    savingThrows,
    skills,
    weapons,
    inventory: character.inventory.map((item) => ({
      name: item.name,
      description: item.description ?? undefined,
      quantity: item.quantity?.toString() ?? "1",
      value: item.value ?? undefined,
    })),
    magicItems: character.magicItems.map((item) => ({
      name: item.name,
      description: item.description,
      charges: item.charges ?? undefined,

      rarity: item.rarity,
      isAttuned: item.isAttuned,
    })),
    wealth: character.wealth.map((w) => ({
      type: w.type,
      quantity: String(w.quantity),
    })),
    armors: character.armors.map((a) => ({
      type: a.type,
      name: a.name,
      AC: String(a.AC),
      extraEffects: a.extraEffects ?? undefined,
      strengthRequirement: a.strengthRequirement?.toString() ?? undefined,
      isEquipped: a.isEquipped,
      isProficient: a.isProficient,
      stealthDisadvantage: a.stealthDisadvantage,
    })),
  };
}
