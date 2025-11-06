"use server";
import "server-only";

import prisma from "../prisma";
import { z } from "zod";
import { ArmorType, Classes, WeaponType } from "@prisma/client";
import { BASE_HP_PER_CLASS_MAP, LEVEL_UP_HP_MAP } from "@/constants/maps";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { getModifier } from "@/utils/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { backendCharacterSchema } from "@/app/(with-nav)/characters/add/utils";
import { CharacterById } from "@/lib/utils";

import { getBonusHP } from "@/utils/stats/hp";

const getBaseHP = (
  {
    className,
    capacities,
    constitution,
  }: {
    className: Classes;
    capacities: { name: string }[];
    constitution: number;
  },
  level = 1,
) => {
  return (
    BASE_HP_PER_CLASS_MAP[className] +
    (getBonusHP(capacities, level) ?? 0) +
    getModifier(constitution)
  );
};

export const createCharacter = async (data: CharacterCreationForm, owner: string) => {
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
    const HP = getBaseHP(validation.data);

    const character = await prisma.character.create({
      data: {
        owner: validation.data.owner,
        status: validation.data.status,
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

    for (const savingThrow of validation.data.savingThrows || []) {
      await prisma.savingThrow.create({
        data: { ...savingThrow, characterId: character.id },
      });
    }

    for (const skill of validation.data.skills || []) {
      await prisma.skill.create({
        data: { ...skill, characterId: character.id },
      });
    }

    for (const capacity of validation.data.capacities || []) {
      await prisma.capacity.create({
        data: { ...capacity, characterId: character.id },
      });
    }

    for (const armor of validation.data.armors || []) {
      await prisma.armor.create({
        data: {
          ...armor,
          strengthRequirement:
            armor.type === ArmorType.HEAVY ? armor.strengthRequirement : undefined,
          stealthDisadvantage:
            armor.type !== ArmorType.SHIELD ? armor.stealthDisadvantage : undefined,
          characterId: character.id,
        },
      });
    }

    for (const weapon of validation.data.weapons || []) {
      const { damages, ...weaponData } = weapon;
      const createdWeapon = await prisma.weapon.create({
        data: {
          ...weaponData,
          reach: weaponData.type !== WeaponType.RANGED ? weaponData.reach : undefined,
          range: weaponData.type !== WeaponType.MELEE ? weaponData.range : undefined,
          longRange: weaponData.type !== WeaponType.MELEE ? weaponData.longRange : undefined,
          ammunitionCount:
            weaponData.type === WeaponType.RANGED ? weaponData.ammunitionCount : undefined,
          ammunitionType:
            weaponData.type === WeaponType.RANGED ? weaponData.ammunitionType : undefined,
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

    for (const item of validation.data.inventory || []) {
      await prisma.inventoryItem.create({
        data: { ...item, characterId: character.id },
      });
    }

    for (const money of validation.data.wealth || []) {
      await prisma.money.create({
        data: { ...money, characterId: character.id },
      });
    }

    redirect(`/characters/${character.id}`);
  } else {
    throw new Error("Un personnage avec ce nom existe déjà.");
  }
};

async function syncSimpleTable<Existing extends { id: number }, Incoming>(
  existing: Existing[],
  incoming: Incoming[],
  crud: {
    create: (data: Incoming) => Promise<unknown>;
    update: (id: number, data: Incoming) => Promise<unknown>;
    deleteMany: (ids: number[]) => Promise<unknown>;
  },
): Promise<void> {
  const tasks: Promise<unknown>[] = [];

  const minLen = Math.min(existing.length, incoming.length);

  for (let i = 0; i < minLen; i++) {
    tasks.push(crud.update(existing[i].id, incoming[i]));
  }

  for (let i = minLen; i < incoming.length; i++) {
    tasks.push(crud.create(incoming[i]));
  }

  if (existing.length > incoming.length) {
    const toDelete = existing.slice(incoming.length).map((e) => e.id);
    tasks.push(crud.deleteMany(toDelete));
  }

  await Promise.all(tasks);
}

const getNewHP = (character: CharacterById, newLevel: number) => {
  const baseHp = getBaseHP(character, newLevel);

  if (newLevel > 1) {
    return (
      baseHp +
      (newLevel - 1) * (LEVEL_UP_HP_MAP[character.className] + getModifier(character.constitution))
    );
  }

  return baseHp;
};

export const updateCharacter = async (data: CharacterCreationForm, character: CharacterById) => {
  const validation = backendCharacterSchema.safeParse({
    ...data,
    owner: character.owner, // keep original owner
  });

  if (!validation.success) {
    console.error(validation.error);
    throw new Error(JSON.stringify(validation.error, null, 2));
  }

  const party = await prisma.party.upsert({
    where: { id: character.campaign.party.id },
    update: {},
    create: { name: validation.data.party },
  });

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

  const newHP = getNewHP(character, validation.data.level);

  await prisma.character.update({
    where: { id: character.id },
    data: {
      maximumHP: newHP,
      currentHP: newHP,
      level: validation.data.level,
      status: validation.data.status,
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

  await syncSimpleTable(character.savingThrows, validation.data.savingThrows, {
    create: (st) =>
      prisma.savingThrow.create({
        data: { ...st, characterId: character.id },
      }),
    update: (id, st) => prisma.savingThrow.update({ where: { id }, data: st }),
    deleteMany: (ids) => prisma.savingThrow.deleteMany({ where: { id: { in: ids } } }),
  });

  await syncSimpleTable(character.skills, validation.data.skills, {
    create: (sk) => prisma.skill.create({ data: { ...sk, characterId: character.id } }),
    update: (id, sk) => prisma.skill.update({ where: { id }, data: sk }),
    deleteMany: (ids) => prisma.skill.deleteMany({ where: { id: { in: ids } } }),
  });

  await syncSimpleTable(character.capacities, validation.data.capacities, {
    create: (c) => prisma.capacity.create({ data: { ...c, characterId: character.id } }),
    update: (id, c) => prisma.capacity.update({ where: { id }, data: c }),
    deleteMany: (ids) => prisma.capacity.deleteMany({ where: { id: { in: ids } } }),
  });

  await syncSimpleTable(
    character.armors,
    validation.data.armors.map((armor) => ({
      ...armor,
      strengthRequirement: armor.type === ArmorType.HEAVY ? armor.strengthRequirement : null,
      stealthDisadvantage: armor.type !== ArmorType.SHIELD ? armor.stealthDisadvantage : false,
    })),
    {
      create: (a) => prisma.armor.create({ data: { ...a, characterId: character.id } }),
      update: (id, a) => prisma.armor.update({ where: { id }, data: a }),
      deleteMany: (ids) => prisma.armor.deleteMany({ where: { id: { in: ids } } }),
    },
  );

  const weaponOps = [];

  const maxWeapons = Math.max(character.weapons.length, validation.data.weapons.length);

  for (let i = 0; i < maxWeapons; i++) {
    const existingWeapon = character.weapons[i];
    const incoming = validation.data.weapons[i];
    if (existingWeapon && incoming) {
      const { damages, ...weaponData } = incoming;
      weaponOps.push(
        prisma.weapon.update({
          where: { id: existingWeapon.id },
          data: {
            ...weaponData,
            reach: weaponData.type !== WeaponType.RANGED ? weaponData.reach : null,
            range: weaponData.type !== WeaponType.MELEE ? weaponData.range : null,
            longRange: weaponData.type !== WeaponType.MELEE ? weaponData.longRange : null,
            ammunitionCount:
              weaponData.type === WeaponType.RANGED ? weaponData.ammunitionCount : null,
            ammunitionType:
              weaponData.type === WeaponType.RANGED ? weaponData.ammunitionType : null,
          },
        }),
      );

      const maxDamages = Math.max(existingWeapon.damages.length, damages.length);
      for (let j = 0; j < maxDamages; j++) {
        const existingDmg = existingWeapon.damages[j];
        const incomingDamages = damages[j];
        if (existingDmg && incomingDamages) {
          weaponOps.push(
            prisma.weaponDamage.update({
              where: { id: existingDmg.id },
              data: incomingDamages,
            }),
          );
        } else if (!existingDmg && incomingDamages) {
          weaponOps.push(
            prisma.weaponDamage.create({
              data: { ...incomingDamages, weaponId: existingWeapon.id },
            }),
          );
        } else if (existingDmg && !incomingDamages) {
          weaponOps.push(prisma.weaponDamage.delete({ where: { id: existingDmg.id } }));
        }
      }
    } else if (!existingWeapon && incoming) {
      const { damages, ...weaponData } = incoming;
      const newWeapon = await prisma.weapon.create({
        data: {
          ...weaponData,
          reach: weaponData.type !== WeaponType.RANGED ? weaponData.reach : null,
          range: weaponData.type !== WeaponType.MELEE ? weaponData.range : null,
          longRange: weaponData.type !== WeaponType.MELEE ? weaponData.longRange : null,
          ammunitionCount:
            weaponData.type === WeaponType.RANGED ? weaponData.ammunitionCount : null,
          ammunitionType: weaponData.type === WeaponType.RANGED ? weaponData.ammunitionType : null,
          characterId: character.id,
        },
      });
      for (const dmg of damages) {
        weaponOps.push(
          prisma.weaponDamage.create({
            data: { ...dmg, weaponId: newWeapon.id },
          }),
        );
      }
    } else if (existingWeapon && !incoming) {
      weaponOps.push(prisma.weapon.delete({ where: { id: existingWeapon.id } }));
    }
  }

  await Promise.all(weaponOps);

  await syncSimpleTable(character.inventory, validation.data.inventory, {
    create: (inv) =>
      prisma.inventoryItem.create({
        data: { ...inv, characterId: character.id },
      }),
    update: (id, inv) => prisma.inventoryItem.update({ where: { id }, data: inv }),
    deleteMany: (ids) => prisma.inventoryItem.deleteMany({ where: { id: { in: ids } } }),
  });

  await syncSimpleTable(character.wealth, validation.data.wealth, {
    create: (coin) => prisma.money.create({ data: { ...coin, characterId: character.id } }),
    update: (id, coin) => prisma.money.update({ where: { id }, data: coin }),
    deleteMany: (ids) => prisma.money.deleteMany({ where: { id: { in: ids } } }),
  });

  redirect(`/characters/${character.id}`);
};

const getHpWithinBounds = (newHp: number, maxHp: number) => {
  if (newHp > maxHp) {
    return maxHp;
  }
  if (newHp < 0) {
    return 0;
  }
  return newHp;
};

export const setHp = async (characterId: number, maxHp: number, newHp: number) => {
  const hp = getHpWithinBounds(newHp, maxHp);
  await prisma.character.update({
    where: { id: characterId },
    data: { currentHP: hp },
  });
  revalidatePath(`/characters/${characterId}`);
  return hp;
};

export const setTempHp = async (characterId: number, newTempHp: number) => {
  await prisma.character.update({
    where: { id: characterId },
    data: { currentTempHP: newTempHp < 0 ? 0 : newTempHp },
  });
  revalidatePath(`/characters/${characterId}`);
};

export const resetHp = async (characterId: number, maxHp: number) => {
  await prisma.character.update({
    where: { id: characterId },
    data: { currentHP: maxHp },
  });
  revalidatePath(`/characters/${characterId}`);
};

export const updateInspiration = async (characterId: number, inspiration: number) => {
  const validation = z
    .object({
      inspiration: z.number().min(0),
    })
    .safeParse({
      inspiration,
    });

  if (validation.success) {
    await prisma.character.update({
      where: { id: characterId },
      data: { inspiration: validation.data.inspiration },
    });
    revalidatePath(`/characters/${characterId}`);
  } else {
    console.error(validation.error);
  }
};

export const updateNotes = async (characterId: number, notes: string) => {
  const validation = z
    .object({
      notes: z.string(),
    })
    .safeParse({
      notes,
    });

  if (validation.success) {
    await prisma.character.update({
      where: { id: characterId },
      data: { notes: validation.data.notes },
    });
    revalidatePath(`/characters/${characterId}`);
  } else {
    console.error(validation.error);
  }
};
