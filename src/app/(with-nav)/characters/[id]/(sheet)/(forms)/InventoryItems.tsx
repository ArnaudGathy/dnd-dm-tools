import SheetCard from "@/components/ui/SheetCard";
import { CharacterById } from "@/lib/utils";
import AddInventoryItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddInventoryItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InventoryItems({
  character,
}: {
  character: CharacterById;
}) {
  return (
    <SheetCard className="relative flex flex-col gap-4">
      <AddInventoryItem
        character={character}
        className="absolute right-4"
        title="Ajouter un objet"
      >
        <Button size="sm">
          <Plus />
        </Button>
      </AddInventoryItem>
      <span className="mb-2 flex self-center text-2xl font-bold">
        Inventaire
      </span>
      <ul className="flex flex-col">
        {character.inventory.map((inventoryItem) => (
          <AddInventoryItem
            key={inventoryItem.id}
            character={character}
            item={inventoryItem}
            title="Modifier un objet"
          >
            <li className="cursor-pointer p-2 hover:bg-white/5">
              <div className="flex leading-none">
                <div>
                  <span className="inline-block min-w-7 font-mono">{`${inventoryItem.quantity ?? "1"}`}</span>
                </div>
                <div className="space-x-2">
                  <span>{`${inventoryItem.name}`}</span>
                  {inventoryItem.value && (
                    <span className="text-sm text-slate-400">
                      ({inventoryItem.value})
                    </span>
                  )}
                  {inventoryItem.description && (
                    <span className="text-sm leading-4 text-muted-foreground">
                      {inventoryItem.description}
                    </span>
                  )}
                </div>
              </div>
            </li>
          </AddInventoryItem>
        ))}
      </ul>
    </SheetCard>
  );
}
