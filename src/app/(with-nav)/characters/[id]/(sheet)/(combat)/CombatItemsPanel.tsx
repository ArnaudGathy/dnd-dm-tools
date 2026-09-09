"use client";

import { CharacterById, cn } from "@/lib/utils";
import { Swords, Zap } from "lucide-react";
import { MAGIC_ITEM_RARITY_COLOR_MAP } from "@/constants/maps";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import AddInventoryItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddInventoryItem";
import AddMagicItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddMagicItem";
import CombatRelevanceToggle from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/CombatRelevanceToggle";
import { setInventoryItemCombatRelevance } from "@/lib/actions/InventoryItems";
import { setMagicItemCombatRelevance } from "@/lib/actions/MagicItems";

const rowClassName =
  "grid cursor-pointer grid-cols-[1fr_auto] items-baseline gap-x-2 rounded-md px-2 py-1.5 text-left hover:bg-white/5";

/**
 * Items the player pinned from the Inventaire / Objets Magiques lists, mirrored
 * here so a fight never needs a tab switch. Deliberately strips price and
 * attunement — mid-combat you only need the name, how many are left, and what
 * the thing does. Clicking a row opens the same edit popover as the inventory
 * (edit + delete); the swords icon only unpins it from this view.
 */
export default function CombatItemsPanel({ character }: { character: CharacterById }) {
  const magicItems = character.magicItems.filter((item) => item.isCombatRelevant);
  const inventoryItems = character.inventory.filter((item) => item.isCombatRelevant);

  if (magicItems.length === 0 && inventoryItems.length === 0) {
    return null;
  }

  return (
    <SectionPanel accent="red" icon={Swords} title="Objets de combat" contentClassName="gap-0 p-2">
      <ul className="flex flex-col divide-y divide-white/5">
        {magicItems.map((magicItem) => (
          <AddMagicItem
            key={`magic-${magicItem.id}`}
            characterId={character.id}
            campaignId={character.campaignId}
            item={magicItem}
            title="Modifier un objet magique"
          >
            <li className={rowClassName}>
              <span
                className={cn(
                  "min-w-0 font-medium leading-snug",
                  MAGIC_ITEM_RARITY_COLOR_MAP[magicItem.rarity],
                )}
              >
                {magicItem.name}
              </span>
              <div className="flex shrink-0 items-center gap-1.5 self-center">
                {magicItem.charges && (
                  <span className="flex items-center gap-0.5 text-sm tabular-nums text-indigo-400">
                    <Zap className="size-3.5" />
                    {magicItem.charges}
                  </span>
                )}
                <CombatRelevanceToggle
                  isCombatRelevant
                  toggleAction={async (isCombatRelevant) => {
                    await setMagicItemCombatRelevance({
                      itemId: magicItem.id,
                      characterId: character.id,
                      isCombatRelevant,
                    });
                  }}
                />
              </div>
              {magicItem.description && (
                <span className="col-start-1 text-sm leading-snug text-muted-foreground">
                  {magicItem.description}
                </span>
              )}
            </li>
          </AddMagicItem>
        ))}

        {inventoryItems.map((inventoryItem) => (
          <AddInventoryItem
            key={`inventory-${inventoryItem.id}`}
            characterId={character.id}
            campaignId={character.campaignId}
            item={inventoryItem}
            title="Modifier un objet"
          >
            <li className={rowClassName}>
              <span className="min-w-0 font-medium leading-snug">
                {inventoryItem.quantity > 1 && (
                  <span className="mr-1.5 text-sm font-semibold tabular-nums text-muted-foreground">
                    {inventoryItem.quantity}×
                  </span>
                )}
                {inventoryItem.name}
              </span>
              <CombatRelevanceToggle
                className="self-center"
                isCombatRelevant
                toggleAction={async (isCombatRelevant) => {
                  await setInventoryItemCombatRelevance({
                    itemId: inventoryItem.id,
                    characterId: character.id,
                    isCombatRelevant,
                  });
                }}
              />
              {inventoryItem.description && (
                <span className="col-start-1 text-sm leading-snug text-muted-foreground">
                  {inventoryItem.description}
                </span>
              )}
            </li>
          </AddInventoryItem>
        ))}
      </ul>
    </SectionPanel>
  );
}
