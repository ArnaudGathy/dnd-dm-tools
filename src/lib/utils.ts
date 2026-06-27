import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { auth } from "@/../auth";
import { notFound, redirect } from "next/navigation";
import { getCharacterById } from "@/lib/api/characters";
import {
  Armor,
  Campaign,
  Capacity,
  Character,
  InventoryItem,
  MagicItem,
  Money,
  Party,
  SavingThrow,
  Skill,
  Spell,
  SpellsOnCharacters,
  Weapon,
  WeaponDamage,
} from "@prisma/client";

// Register our custom `text-tiny` font size so tailwind-merge treats it as a
// font-size (not a text-color). Without this, `cn("text-tiny", "text-sky-400")`
// would wrongly drop `text-tiny`, since `tiny` isn't a size it knows by default.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["tiny"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getSessionData() {
  const session = await auth();
  const admins = ["arno.firefox@gmail.com"];

  return {
    userName: session?.user?.name?.split(" ")[0],
    userMail: session?.user?.email || undefined,
    isLoggedIn: !!session,
    isAdmin: !!session?.user?.email && admins.includes(session.user.email),
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
    magicItems: MagicItem[];
    wealth: Money[];
  };

export type CharacterByOwner = Character &
  SpellsCreaturesCount & {
    campaign: Campaign & { party: Party };
  };

export async function getValidCharacter(characterId: string) {
  const { userMail, isAdmin } = await getSessionData();
  const character = await getCharacterById({
    characterId: parseInt(characterId, 10),
  });

  if (!character) {
    notFound();
  }

  if (
    isAdmin ||
    userMail === character.owner ||
    (!!userMail && character.campaign.owner.includes(userMail))
  ) {
    return character;
  }

  return redirect("/");
}
