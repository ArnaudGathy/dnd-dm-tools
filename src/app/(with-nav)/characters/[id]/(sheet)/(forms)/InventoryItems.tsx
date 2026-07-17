"use client";

import { CharacterById } from "@/lib/utils";
import AddInventoryItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddInventoryItem";
import { Button } from "@/components/ui/button";
import { Backpack, Plus } from "lucide-react";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

export default function InventoryItems({ character }: { character: CharacterById }) {
  const hasItems = character.inventory.length > 0;

  return (
    <SectionPanel
      accent="amber"
      icon={Backpack}
      title="Inventaire"
      contentClassName="gap-0 p-2"
      action={
        <AddInventoryItem characterId={character.id} title="Ajouter un objet">
          <Button size="icon">
            <Plus />
          </Button>
        </AddInventoryItem>
      }
    >
      {!hasItems && (
        <span className="p-2 text-center text-sm text-muted-foreground">Aucun objet</span>
      )}
      <ul className="flex flex-col divide-y divide-white/5">
        {character.inventory.map((inventoryItem) => (
          <AddInventoryItem
            key={inventoryItem.id}
            characterId={character.id}
            campaignId={character.campaignId}
            item={inventoryItem}
            title="Modifier un objet"
          >
            <li className="grid cursor-pointer grid-cols-[2rem_1fr_auto] items-baseline gap-x-2 rounded-md px-2 py-1.5 hover:bg-white/5">
              <span className="text-right text-sm font-semibold tabular-nums text-muted-foreground">
                {inventoryItem.quantity}×
              </span>
              <span className="min-w-0 font-medium leading-snug">{inventoryItem.name}</span>
              {inventoryItem.value ? (
                <span className="text-sm tabular-nums text-amber-300/80">
                  {inventoryItem.value}
                </span>
              ) : (
                <span />
              )}
              {inventoryItem.description && (
                <span className="col-span-2 col-start-2 text-sm leading-snug text-muted-foreground">
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
