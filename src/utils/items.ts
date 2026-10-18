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

/** Lowercases and folds typographic apostrophes (’) into plain ones (') for name matching. */
const normalizeItemName = (name: string) => name.toLowerCase().replace(/[’‘]/g, "'");

/** True when the character owns the item, attuned or not. Exact (normalized) name match. */
export const hasMagicItem = (
  character: Character & {
    magicItems: MagicItem[];
  },
  itemName: string,
): boolean => {
  const target = normalizeItemName(itemName);
  return character.magicItems.some(
    (magicItem) => normalizeItemName(magicItem.name.trim()) === target,
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
 * Returns the character with ability scores overridden by magic items
 * (e.g. attuned Amulette de bonne santé → CON 19, owned Bracelets d'archer (Kubazan) → FOR 23,
 * owned Baguette des merveilles (I'jin) → CHA 23).
 * Apply right after loading so every derived stat sees the effective scores; never persist the result.
 */
export const applyMagicItemEffects = <T extends Character & { magicItems: MagicItem[] }>(
  character: T,
): T => {
  const hasHealthAmulet = hasAttunedMagicItem(character, "amulette de bonne santé");
  const hasKubazanBracers = hasMagicItem(character, "bracelets d'archer (kubazan)");
  const hasIjinWand = hasMagicItem(character, "baguette des merveilles (i'jin)");

  return {
    ...character,
    constitution: hasHealthAmulet ? Math.max(character.constitution, 19) : character.constitution,
    strength: hasKubazanBracers ? 23 : character.strength,
    charisma: hasIjinWand ? 23 : character.charisma,
  };
};
