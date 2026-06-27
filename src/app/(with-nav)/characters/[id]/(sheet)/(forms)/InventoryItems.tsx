"use client";

import { CharacterById } from "@/lib/utils";
import AddInventoryItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddInventoryItem";
import { Button } from "@/components/ui/button";
import { Backpack, Plus } from "lucide-react";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

export default function InventoryItems({ character }: { character: CharacterById }) {
  return (
    <SectionPanel
      accent="amber"
      icon={Backpack}
      title="Inventaire"
      contentClassName="gap-0"
      action={
        <AddInventoryItem characterId={character.id} title="Ajouter un objet">
          <Button size="icon">
            <Plus />
          </Button>
        </AddInventoryItem>
      }
    >
      <ul className="flex flex-col">
        {character.inventory.map((inventoryItem) => (
          <AddInventoryItem
            key={inventoryItem.id}
            characterId={character.id}
            item={inventoryItem}
            title="Modifier un objet"
          >
            <li className="flex cursor-pointer gap-1 rounded-md p-2 leading-none hover:bg-white/5">
              <span className="min-w-7 font-bold tabular-nums leading-5 text-muted-foreground">
                {`${inventoryItem.quantity ?? "1"}`}
              </span>
              <div className="space-x-2">
                <span className="leading-5">{`${inventoryItem.name}`}</span>

                {inventoryItem.value && (
                  <span className="text-sm text-slate-400">({inventoryItem.value})</span>
                )}
                {inventoryItem.description && (
                  <span className="text-sm leading-4 text-muted-foreground">
                    {inventoryItem.description}
                  </span>
                )}
              </div>
            </li>
          </AddInventoryItem>
        ))}
      </ul>
    </SectionPanel>
  );
}
