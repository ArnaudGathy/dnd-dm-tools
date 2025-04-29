"use server";
import "server-only";

import prisma from "../prisma";
import { z } from "zod";
import { ArmorType, WeaponType } from "@prisma/client";
import { BASE_HP_PER_CLASS_MAP } from "@/constants/maps";
import { CharacterCreationForm } from "@/app/characters/add/CreateCharacterForm";
import { getModifier } from "@/utils/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { backendCharacterSchema } from "@/app/characters/add/utils";

export const createCharacter = async (
  data: CharacterCreationForm,
  owner: string,
) => {
  const validation = backendCharacterSchema.safeParse({
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

export const updateHP = async (
  characterId: number,
  maxHp: number,
  formData: FormData,
) => {
  const validation = z
    .object({
      HP: z.coerce.number().min(0).max(maxHp),
    })
    .safeParse({
      HP: formData.get("HP"),
    });

  if (validation.success) {
    await prisma.character.update({
      where: { id: characterId },
      data: { currentHP: validation.data.HP },
    });
    revalidatePath("/characters");
  } else {
    console.error(validation.error);
  }
};

export const updateInspiration = async (
  characterId: number,
  formData: FormData,
) => {
  const validation = z
    .object({
      inspiration: z.coerce.number().min(0),
    })
    .safeParse({
      inspiration: formData.get("inspiration"),
    });

  if (validation.success) {
    await prisma.character.update({
      where: { id: characterId },
      data: { inspiration: validation.data.inspiration },
    });
    revalidatePath("/characters");
  } else {
    console.error(validation.error);
  }
};

export const updateNotes = async (characterId: number, formData: FormData) => {
  const validation = z
    .object({
      notes: z.string(),
    })
    .safeParse({
      notes: formData.get("notes"),
    });

  if (validation.success) {
    await prisma.character.update({
      where: { id: characterId },
      data: { notes: validation.data.notes },
    });
    revalidatePath("/characters");
  } else {
    console.error(validation.error);
  }
};
