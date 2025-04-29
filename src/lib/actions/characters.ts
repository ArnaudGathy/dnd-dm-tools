"use server";
import "server-only";

import prisma from "../prisma";
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
import { BASE_HP_PER_CLASS_MAP } from "@/constants/maps";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";
import { getModifier } from "@/utils/utils";
import { redirect } from "next/navigation";

const requiredString = z.string().min(1);
const stringToNumber = z.coerce.number();

const characterSchema = z.object({
  owner: requiredString,
  campaign: z.nativeEnum(CampaignId),
  party: z.nativeEnum(PartyId),
  name: requiredString,
  className: z.nativeEnum(Classes),
  subclassName: z.nativeEnum(Subclasses).nullable(),
  race: z.nativeEnum(Races),
  background: z.nativeEnum(Backgrounds),
  strength: stringToNumber.min(8).max(17),
  dexterity: stringToNumber.min(8).max(17),
  constitution: stringToNumber.min(8).max(17),
  intelligence: stringToNumber.min(8).max(17),
  wisdom: stringToNumber.min(8).max(17),
  charisma: stringToNumber.min(8).max(17),
  age: stringToNumber.min(1),
  height: stringToNumber.min(1),
  weight: stringToNumber.min(1),
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
  proficiencies: z
    .array(z.object({ name: requiredString }))
    .nonempty()
    .transform((val) => val.map((v) => v.name)),
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
  inventory: z.array(
    z.object({
      name: requiredString,
      description: z.string().optional(),
      quantity: stringToNumber.optional(),
      value: z.string().optional(),
    }),
  ),
  wealth: z.array(
    z.object({
      type: z.nativeEnum(MoneyType),
      quantity: stringToNumber.min(0),
    }),
  ),
  armors: z.array(
    z
      .object({
        type: z.nativeEnum(ArmorType),
        name: requiredString,
        AC: stringToNumber.min(2).max(20),
        extraEffects: z.string().optional(),
        strengthRequirement: stringToNumber.optional(),
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
        attackBonus: stringToNumber.optional(),
        reach: stringToNumber
          .optional()
          .transform((reach) => (reach ? reach * 5 : undefined)),
        range: stringToNumber
          .optional()
          .transform((range) => (range ? range * 5 : undefined)),
        longRange: stringToNumber
          .optional()
          .transform((longRange) => (longRange ? longRange * 5 : undefined)),
        ammunitionType: z.nativeEnum(AmmunitionType).optional(),
        ammunitionCount: stringToNumber.optional(),
        extraEffects: z.string().optional(),
        damages: z
          .array(
            z.object({
              isBaseDamage: z.boolean(),
              type: z.nativeEnum(WeaponDamageType),
              dice: z.nativeEnum(WeaponDamageDices),
              numberOfDices: stringToNumber.min(1),
              flatBonus: stringToNumber.optional(),
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

export const createCharacter = async (
  data: CharacterCreationForm,
  owner: string,
) => {
  const validation = characterSchema.safeParse({
    ...data,
    owner,
  });

  if (!validation.success) {
    console.error(validation.error);
    throw new Error(JSON.stringify(validation.error, null, 2));
  }

  let party = await prisma.party.findFirst({
    where: { name: validation.data.party },
  });
  if (!party) {
    party = await prisma.party.create({
      data: { name: validation.data.party },
    });
  }

  const campaign = await prisma.campaign.upsert({
    where: {
      name_partyId: { name: validation.data.campaign, partyId: party.id },
    },
    update: {},
    create: {
      name: validation.data.campaign,
      status: "ACTIVE",
      partyId: party.id,
    },
  });

  const existingCharacter = await prisma.character.findFirst({
    where: { name: validation.data.name },
  });

  if (!existingCharacter) {
    const HP =
      BASE_HP_PER_CLASS_MAP[validation.data.className] +
      getModifier(validation.data.constitution);

    const character = await prisma.character.create({
      data: {
        owner: validation.data.owner,
        maximumHP: HP,
        currentHP: HP,
        campaignId: campaign.id,
        name: validation.data.name,
        className: validation.data.className,
        subclassName: validation.data.subclassName,
        race: validation.data.race,
        background: validation.data.background,
        strength: validation.data.strength,
        dexterity: validation.data.dexterity,
        constitution: validation.data.constitution,
        intelligence: validation.data.intelligence,
        wisdom: validation.data.wisdom,
        charisma: validation.data.charisma,
        age: validation.data.age,
        weight: validation.data.weight,
        height: validation.data.height,
        eyeColor: validation.data.eyeColor,
        hair: validation.data.hair,
        skin: validation.data.skin,
        physicalTraits: validation.data.physicalTraits,
        alignment: validation.data.alignment,
        personalityTraits: validation.data.personalityTraits,
        ideals: validation.data.ideals,
        bonds: validation.data.bonds,
        flaws: validation.data.flaws,
        lore: validation.data.lore,
        allies: validation.data.allies,
        notes: validation.data.notes,
        proficiencies: validation.data.proficiencies,
      },
    });

    // Saving Throws
    for (const st of validation.data.savingThrows || []) {
      await prisma.savingThrow.create({
        data: { ...st, characterId: character.id },
      });
    }

    // Skills
    for (const skill of validation.data.skills || []) {
      await prisma.skill.create({
        data: { ...skill, characterId: character.id },
      });
    }

    // Capacities
    for (const cap of validation.data.capacities || []) {
      await prisma.capacity.create({
        data: { ...cap, characterId: character.id },
      });
    }

    // Armors
    for (const armor of validation.data.armors || []) {
      await prisma.armor.create({
        data: {
          ...armor,
          strengthRequirement:
            armor.type === ArmorType.HEAVY
              ? armor.strengthRequirement
              : undefined,
          characterId: character.id,
        },
      });
    }

    // Weapons and damages
    for (const weapon of validation.data.weapons || []) {
      const { damages, ...weaponData } = weapon;
      const createdWeapon = await prisma.weapon.create({
        data: {
          ...weaponData,
          reach:
            weaponData.type !== WeaponType.RANGED
              ? weaponData.reach
              : undefined,
          range:
            weaponData.type !== WeaponType.MELEE ? weaponData.range : undefined,
          longRange:
            weaponData.type !== WeaponType.MELEE
              ? weaponData.longRange
              : undefined,
          ammunitionCount:
            weaponData.type === WeaponType.RANGED
              ? weaponData.ammunitionCount
              : undefined,
          ammunitionType:
            weaponData.type === WeaponType.RANGED
              ? weaponData.ammunitionType
              : undefined,
          characterId: character.id,
        },
      });

      for (const damage of damages || []) {
        await prisma.weaponDamage.create({
          data: {
            ...damage,
            weaponId: createdWeapon.id,
          },
        });
      }
    }

    // Inventory
    for (const item of validation.data.inventory || []) {
      await prisma.inventoryItem.create({
        data: { ...item, characterId: character.id },
      });
    }

    // Wealth
    for (const coin of validation.data.wealth || []) {
      await prisma.money.create({
        data: { ...coin, characterId: character.id },
      });
    }

    redirect(`/characters/${character.id}`);
  } else {
    throw new Error("Un personnage avec ce nom existe déjà.");
  }
};
