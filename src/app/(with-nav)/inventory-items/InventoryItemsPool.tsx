"use client";

import SheetCard from "@/components/ui/SheetCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InventoryItem } from "@prisma/client";
import AddInventoryItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddInventoryItem";
import AssignInventoryItem from "@/app/(with-nav)/inventory-items/AssignInventoryItem";
import { useGroupFromCampaign } from "@/hooks/useGroupFromCampaign";

export default function InventoryItemsPool({ items }: { items: InventoryItem[] }) {
  const hasItems = items.length > 0;
  const characters = useGroupFromCampaign();

  return (
    <SheetCard className="relative flex flex-col gap-4">
      <AddInventoryItem characterId={null} className="absolute right-4" title="Créer un objet">
        <Button size="sm">
          <Plus />
        </Button>
      </AddInventoryItem>
      <span className="mb-2 flex self-center text-2xl font-bold">Objets non assignés</span>

      <ul className="flex flex-col divide-y divide-white/10">
        {!hasItems && (
          <li className="flex self-center p-2 leading-none">
            <span className="text-sm text-muted-foreground">Aucun objet en attente</span>
          </li>
        )}
        {hasItems &&
          items.map((inventoryItem) => (
            <li
              key={inventoryItem.id}
              className="flex flex-col gap-2 py-3 md:flex-row md:items-start md:justify-between"
            >
              <AddInventoryItem
                characterId={null}
                item={inventoryItem}
                title="Modifier un objet"
                className="text-left"
              >
                <div className="cursor-pointer space-x-2 rounded p-2 hover:bg-white/5">
                  <span className="leading-5">{`${inventoryItem.quantity ?? "1"}`}</span>
                  <span className="leading-5">{inventoryItem.name}</span>
                  {inventoryItem.value && (
                    <span className="text-sm text-slate-400">({inventoryItem.value})</span>
                  )}
                  {inventoryItem.description && (
                    <span className="mt-1 block text-sm leading-4 text-muted-foreground">
                      {inventoryItem.description}
                    </span>
                  )}
                </div>
              </AddInventoryItem>

              <AssignInventoryItem itemId={inventoryItem.id} characters={characters} />
            </li>
          ))}
      </ul>
    </SheetCard>
  );
}
