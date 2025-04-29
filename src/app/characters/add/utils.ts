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
  PartyId,
  Races,
  Skills,
  Subclasses,
  WeaponDamageDices,
  WeaponDamageType,
  WeaponType,
} from "@prisma/client";

export const formRequiredString = z.string().min(1, "Requis");
export const optionalNumberString = z
  .string()
  .regex(/^\d+$/, "Chiffre")
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
  quantity: z
    .union([z.number(), z.string().regex(/^\d+$/, "Chiffre")])
    .optional(),
  value: z.string().nullish(),
});
export type InventoryFormSchema = z.infer<typeof inventoryItemFormSchema>;

export const signUpFormSchema = z.object({
  campaign: z.nativeEnum(CampaignId),
  party: z.nativeEnum(PartyId),
  status: z.nativeEnum(CharacterStatus),
  name: formRequiredString,
  className: z.nativeEnum(Classes),
  subclassName: z.nativeEnum(Subclasses).nullable(),
  race: z.nativeEnum(Races),
  background: z.nativeEnum(Backgrounds),
  strength: minMax(8, 17),
  dexterity: minMax(8, 17),
  constitution: minMax(8, 17),
  intelligence: minMax(8, 17),
  wisdom: minMax(8, 17),
  charisma: minMax(8, 17),
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
        strengthRequirement: optionalNumberString,
        isEquipped: z.boolean(),
        isProficient: z.boolean(),
        stealthDisadvantage: z.boolean(),
      })
      .refine(
        (armor) =>
          armor.type !== ArmorType.HEAVY || !!armor.strengthRequirement,
        { message: "Requis", path: ["strengthRequirement"] },
      ),
  ),
  weapons: z.array(
    z
      .object({
        name: formRequiredString,
        type: z.nativeEnum(WeaponType),
        isProficient: z.boolean(),
        abilityModifier: z.nativeEnum(Abilities),
        attackBonus: optionalNumberString,
        reach: optionalNumberString,
        range: optionalNumberString,
        longRange: optionalNumberString,
        ammunitionType: z.nativeEnum(AmmunitionType).optional(),
        ammunitionCount: optionalNumberString,
        extraEffects: z.string().optional(),
        damages: z
          .array(
            z.object({
              isBaseDamage: z.boolean(),
              type: z.nativeEnum(WeaponDamageType),
              dice: z.nativeEnum(WeaponDamageDices),
              numberOfDices: minMax(1),
              flatBonus: optionalNumberString,
            }),
          )
          .nonempty(),
      })
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.MELEE &&
            weapon.type !== WeaponType.THROWN) ||
          weapon.reach,
        {
          message: "Requis",
          path: ["reach"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED &&
            weapon.type !== WeaponType.THROWN) ||
          weapon.range,
        {
          message: "Requis",
          path: ["range"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED &&
            weapon.type !== WeaponType.THROWN) ||
          weapon.longRange,
        {
          message: "Requis",
          path: ["longRange"],
        },
      )
      .refine(
        (weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionType,
        {
          message: "Requis",
          path: ["ammunitionType"],
        },
      )
      .refine(
        (weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionCount,
        {
          message: "Requis",
          path: ["ammunitionCount"],
        },
      ),
  ),
});

export const signupFormDefaultValues = {
  status: CharacterStatus.ACTIVE,
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
  proficiencies: [
    { name: "Langues: " },
    { name: "Armures : " },
    { name: "Armes : " },
  ],
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
    },
  ],
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
});
export const backendCharacterSchema = z.object({
  owner: backendRequiredString,
  campaign: z.nativeEnum(CampaignId),
  party: z.nativeEnum(PartyId),
  status: z.nativeEnum(CharacterStatus),
  name: backendRequiredString,
  className: z.nativeEnum(Classes),
  subclassName: z.nativeEnum(Subclasses).nullable(),
  race: z.nativeEnum(Races),
  background: z.nativeEnum(Backgrounds),
  strength: backendStringToNumber.min(8).max(17),
  dexterity: backendStringToNumber.min(8).max(17),
  constitution: backendStringToNumber.min(8).max(17),
  intelligence: backendStringToNumber.min(8).max(17),
  wisdom: backendStringToNumber.min(8).max(17),
  charisma: backendStringToNumber.min(8).max(17),
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
    .array(
      z.object({ ability: z.nativeEnum(Abilities), isProficient: z.boolean() }),
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
  inventory: z.array(backendInventoryItemSchema),
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
      .refine(
        (armor) =>
          armor.type !== ArmorType.HEAVY || !!armor.strengthRequirement,
        { message: "Requis", path: ["strengthRequirement"] },
      ),
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
          (weapon.type !== WeaponType.MELEE &&
            weapon.type !== WeaponType.THROWN) ||
          weapon.reach,
        {
          message: "Requis",
          path: ["reach"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED &&
            weapon.type !== WeaponType.THROWN) ||
          weapon.range,
        {
          message: "Requis",
          path: ["range"],
        },
      )
      .refine(
        (weapon) =>
          (weapon.type !== WeaponType.RANGED &&
            weapon.type !== WeaponType.THROWN) ||
          weapon.longRange,
        {
          message: "Requis",
          path: ["longRange"],
        },
      )
      .refine(
        (weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionType,
        {
          message: "Requis",
          path: ["ammunitionType"],
        },
      )
      .refine(
        (weapon) => weapon.type !== WeaponType.RANGED || weapon.ammunitionCount,
        {
          message: "Requis",
          path: ["ammunitionCount"],
        },
      ),
  ),
});
