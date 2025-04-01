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
  return {
    userName: session?.user?.name?.split(" ")[0],
    userMail: session?.user?.email || undefined,
    isLoggedIn: !!session,
    isAdmin:
      !!session?.user?.email && session.user.email === "arno.firefox@gmail.com",
  };
}

export type CharacterById = Character & {
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

export async function getValidCharacter(characterId: string) {
  const { userMail, isAdmin } = await getSessionData();
  const character = await getCharacterById({
    characterId: parseInt(characterId, 10),
  });

  if (!character) {
    notFound();
  }

  if (userMail === character.owner || isAdmin) {
    return character;
  }

  return redirect("/");
}
