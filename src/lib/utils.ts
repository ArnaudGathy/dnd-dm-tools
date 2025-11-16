import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "@/../auth";
import { notFound, redirect } from "next/navigation";
import { getCharacterById } from "@/lib/api/characters";
import {
  Armor,
  Campaign,
  Capacity,
  Character,
  InventoryItem,
  Money,
  Party,
  SavingThrow,
  Skill,
  Spell,
  SpellsOnCharacters,
  Weapon,
  WeaponDamage,
} from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getSessionData() {
  const session = await auth();
  const admins = ["arnaud.gathy@gmail.com"];
  const superAdmins = ["arno.firefox@gmail.com"];

  return {
    userName: session?.user?.name?.split(" ")[0],
    userMail: session?.user?.email || undefined,
    isLoggedIn: !!session,
    isAdmin: !!session?.user?.email && [...admins, ...superAdmins].includes(session.user.email),
    isSuperAdmin: !!session?.user?.email && superAdmins.includes(session.user.email),
  };
}

export const restrictToAdmins = async () => {
  const { isAdmin } = await getSessionData();

  if (!isAdmin) {
    redirect("/");
  }
};

export type SpellsCreaturesCount = {
  _count: { spellsOnCharacters: number; creaturesOnCharacters: number };
};

export type CharacterById = Character &
  SpellsCreaturesCount & {
    campaign: Campaign & { party: Party };
    spellsOnCharacters: (SpellsOnCharacters & { spell: Spell })[];
    skills: Skill[];
    capacities: Capacity[];
    savingThrows: SavingThrow[];
    armors: Armor[];
    weapons: (Weapon & { damages: WeaponDamage[] })[];
    inventory: InventoryItem[];
    wealth: Money[];
  };

export type CharacterByOwner = Character &
  SpellsCreaturesCount & {
    campaign: Campaign & { party: Party };
  };

export async function getValidCharacter(characterId: string) {
  const { userMail, isSuperAdmin } = await getSessionData();
  const character = await getCharacterById({
    characterId: parseInt(characterId, 10),
  });

  if (!character) {
    notFound();
  }

  if (isSuperAdmin || userMail === character.owner || userMail === character.campaign.owner) {
    return character;
  }

  return redirect("/");
}
