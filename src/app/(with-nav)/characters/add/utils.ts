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
  MagicItemDice,
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

export const formRequiredString = z.string().min(1, "Requis");
export const optionalNumberStringNotZero = z
  .string()
  .refine((val) => val === "" || /^\d+$/.test(val), {
    message: "Chiffre",
  })
  .refine((val) => val === "" || parseInt(val, 10) > 0, {
    message: "Doit être > 0",
  })
  .optional();
export function minMax(min: number, max?: number) {
  return formRequiredString.regex(/^\d+$/, "Chiffre").refine(
    (val) => {
      const numberVal = parseInt(val, 10);
      return numberVal >= min && (!max || numberVal <= max);
    },
    {
      message: max ? `${min} à ${max}` : `Min ${min}`,
    },
  );
}

export const inventoryItemFormSchema = z.object({
  name: formRequiredString,
  description: z.string().nullish(),
  quantity: z.union([z.number(), z.string().regex(/^\d+$/, "Chiffre")]).optional(),
  value: z.string().nullish(),
  isAttuned: z.boolean(),
});
export type InventoryFormSchema = z.infer<typeof inventoryItemFormSchema>;

export const magicItemFormSchema = z.object({
  name: formRequiredString,
  description: z.string().nullish(),
  charges: z.string().nullish(),
  dice: z.nativeEnum(MagicItemDice).nullish(),
  rarity: z.nativeEnum(MagicItemRarity),
  isAttuned: z.boolean(),
});
export type MagicItemFormSchema = z.infer<typeof magicItemFormSchema>;

export const signUpFormSchema = z.object({
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
  age: minMax(1),
  height: minMax(1),
  weight: minMax(1),
  eyeColor: formRequiredString,
  hair: formRequiredString,
  skin: formRequiredString,
  alignment: z.nativeEnum(Alignment),
  personalityTraits: formRequiredString,
  physicalTraits: z.string().optional(),
  ideals: formRequiredString,
  bonds: formRequiredString,
  flaws: formRequiredString,
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
        message: "Requis",
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
            message: "Chiffre",
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
                  message: "Chiffre",
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

export const signupFormDefaultValues = {
  status: CharacterStatus.ACTIVE,
  level: "1",
  name: "",
  campaign: CampaignId.TOMB,
  party: PartyId.MIFA,
  className: Classes.ARTIFICER,
  subclassName: null,
  race: Races.AASIMAR,
  background: Backgrounds.ACOLYTE,
  strength: "",
  dexterity: "",
  constitution: "",
  intelligence: "",
  wisdom: "",
  charisma: "",
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
  inventory: [
    {
      name: "Le bon 15m de corde",
      description: "L'outil essentiel de tout aventurier",
      quantity: "1",
      value: "25po",
      isAttuned: false,
    },
  ],
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
const backendStringToNumber = z.coerce.number();

export const backendInventoryItemSchema = z.object({
  name: backendRequiredString,
  description: optionalNullableString,
  quantity: backendStringToNumber.optional(),
  value: optionalNullableString,
  isAttuned: z.boolean(),
});

export const backendMagicItemSchema = z.object({
  name: backendRequiredString,
  description: z.string().optional(),
  charges: optionalNullableString,
  dice: z.nativeEnum(MagicItemDice).nullable(),
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
  age: backendStringToNumber.min(1),
  height: backendStringToNumber.min(1),
  weight: backendStringToNumber.min(1),
  eyeColor: backendRequiredString,
  hair: backendRequiredString,
  skin: backendRequiredString,
  alignment: z.nativeEnum(Alignment),
  personalityTraits: backendRequiredString,
  physicalTraits: z.string().optional(),
  ideals: backendRequiredString,
  bonds: backendRequiredString,
  flaws: backendRequiredString,
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
    age: String(character.age),
    height: String(character.height),
    weight: String(character.weight),
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
      isAttuned: item.isAttuned,
    })),
    magicItems: character.magicItems.map((item) => ({
      name: item.name,
      description: item.description,
      charges: item.charges ?? undefined,
      dice: item.dice,
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
