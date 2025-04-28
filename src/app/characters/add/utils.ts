import { z } from "zod";
import {
  Abilities,
  Alignment,
  AmmunitionType,
  ArmorType,
  Backgrounds,
  CampaignId,
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

const requiredString = z.string().min(1, "Requis");
export function minMax(min: number, max?: number) {
  return requiredString.refine(
    (val) => {
      const numberVal = parseInt(val, 10);
      return numberVal >= min && (!max || numberVal <= max);
    },
    {
      message: max ? `${min} à ${max}` : `Min ${min}`,
    },
  );
}

export const signUpFormSchema = z.object({
  campaign: z.nativeEnum(CampaignId),
  party: z.nativeEnum(PartyId),
  name: requiredString,
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
  eyeColor: requiredString,
  hair: requiredString,
  skin: requiredString,
  alignment: z.nativeEnum(Alignment),
  personalityTraits: requiredString,
  physicalTraits: z.string().optional(),
  ideals: requiredString,
  bonds: requiredString,
  flaws: requiredString,
  lore: z.string().optional(),
  allies: z.string().optional(),
  notes: z.string().optional(),
  proficiencies: z.array(z.object({ name: requiredString })).nonempty(),
  capacities: z
    .array(
      z.object({
        name: requiredString,
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
  inventory: z.array(
    z.object({
      name: requiredString,
      description: z.string().optional(),
      quantity: z.string().optional(),
      value: z.string().optional(),
    }),
  ),
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
        name: requiredString,
        AC: minMax(2, 20),
        extraEffects: z.string().optional(),
        strengthRequirement: z.string().optional(),
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
        name: requiredString,
        type: z.nativeEnum(WeaponType),
        isProficient: z.boolean(),
        abilityModifier: z.nativeEnum(Abilities),
        attackBonus: z.string().optional(),
        reach: z.string().optional(),
        range: z.string().optional(),
        longRange: z.string().optional(),
        ammunitionType: z.nativeEnum(AmmunitionType).optional(),
        ammunitionCount: z.string().optional(),
        extraEffects: z.string().optional(),
        damages: z
          .array(
            z.object({
              isBaseDamage: z.boolean(),
              type: z.nativeEnum(WeaponDamageType),
              dice: z.nativeEnum(WeaponDamageDices),
              numberOfDices: minMax(1),
              flatBonus: z.string().optional(),
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
