import { Character, InventoryItem, MagicItem } from "@prisma/client";

/**
 * True only when the character is attuned to the item — used for item-granted bonuses.
 * Matches on a case-insensitive "contains" so suffixed names like "… (Tombeau)" still count.
 */
export const hasAttunedMagicItem = (
  character: Character & {
    magicItems: MagicItem[];
  },
  itemName: string,
): boolean => {
  return character.magicItems.some(
    (magicItem) =>
      magicItem.isAttuned && magicItem.name.toLowerCase().includes(itemName.toLowerCase()),
  );
};

export const hasInventoryItem = (
  character: Character & {
    inventory: InventoryItem[];
  },
  itemName: string,
): boolean => {
  return character.inventory.some(
    (inventoryItem) => inventoryItem.name.toLowerCase() === itemName.toLowerCase(),
  );
};

/**
 * Returns the character with ability scores overridden by attuned magic items
 * (e.g. Amulette de bonne santé → CON 19). Apply right after loading so every
 * derived stat sees the effective scores; never persist the result.
 */
export const applyMagicItemEffects = <T extends Character & { magicItems: MagicItem[] }>(
  character: T,
): T => {
  const hasHealthAmulet = hasAttunedMagicItem(character, "amulette de bonne santé");

  return {
    ...character,
    constitution: hasHealthAmulet ? Math.max(character.constitution, 19) : character.constitution,
  };
};
