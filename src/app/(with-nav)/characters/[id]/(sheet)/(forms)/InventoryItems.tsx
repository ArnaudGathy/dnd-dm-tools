"use client";

import SheetCard from "@/components/ui/SheetCard";
import { CharacterById, cn } from "@/lib/utils";
import AddInventoryItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddInventoryItem";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Sparkle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function InventoryItems({
  character,
  numberOfAttunedItems,
}: {
  character: CharacterById;
  numberOfAttunedItems: number;
}) {
  const hasTooManyAttunedItems = numberOfAttunedItems > 3;
  return (
    <SheetCard className={cn("relative flex flex-col gap-4")}>
      <AddInventoryItem character={character} className="absolute right-4" title="Ajouter un objet">
        <Button size="sm">
          <Plus />
        </Button>
      </AddInventoryItem>
      <span className="mb-2 flex self-center text-2xl font-bold">Inventaire</span>
      {hasTooManyAttunedItems && (
        <Alert className="bg-red-900">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle>Trop d&apos;objets magique harmonisés</AlertTitle>
          <AlertDescription>Il y en a {numberOfAttunedItems} sur un maximum de 3</AlertDescription>
        </Alert>
      )}
      <ul className="flex flex-col">
        {character.inventory.map((inventoryItem) => (
          <AddInventoryItem
            key={inventoryItem.id}
            character={character}
            item={inventoryItem}
            title="Modifier un objet"
          >
            <li className="flex cursor-pointer p-2 leading-none hover:bg-white/5">
              <span className="min-w-7 leading-5">{`${inventoryItem.quantity ?? "1"}`}</span>
              <div className="space-x-2">
                <span className="leading-5">{`${inventoryItem.name}`}</span>
                {inventoryItem.isAttuned && (
                  <span className="inline-block">
                    <Sparkle className="size-3 text-sky-400" />
                  </span>
                )}
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
    </SheetCard>
  );
}
