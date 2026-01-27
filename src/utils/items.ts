import { Character, InventoryItem, MagicItem } from "@prisma/client";

export const hasMagicItem = (
  character: Character & {
    magicItems: MagicItem[];
  },
  itemName: string,
): boolean => {
  return character.magicItems.some(
    (magicItem) => magicItem.name.toLowerCase() === itemName.toLowerCase(),
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
