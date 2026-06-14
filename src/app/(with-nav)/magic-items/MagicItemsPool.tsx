"use client";

import SheetCard from "@/components/ui/SheetCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Sparkle } from "lucide-react";
import { MagicItem } from "@prisma/client";
import { MAGIC_ITEM_RARITY_COLOR_MAP } from "@/constants/maps";
import AddMagicItem from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddMagicItem";
import AssignMagicItem from "@/app/(with-nav)/magic-items/AssignMagicItem";
import { useGroupFromCampaign } from "@/hooks/useGroupFromCampaign";

export default function MagicItemsPool({ items }: { items: MagicItem[] }) {
  const hasItems = items.length > 0;
  const characters = useGroupFromCampaign();

  return (
    <SheetCard className="relative flex flex-col gap-4">
      <AddMagicItem characterId={null} className="absolute right-4" title="Créer un objet magique">
        <Button size="sm">
          <Plus />
        </Button>
      </AddMagicItem>
      <span className="mb-2 flex self-center text-2xl font-bold">Objets magiques non assignés</span>

      <ul className="flex flex-col divide-y divide-white/10">
        {!hasItems && (
          <li className="flex self-center p-2 leading-none">
            <span className="text-sm text-muted-foreground">Aucun objet magique en attente</span>
          </li>
        )}
        {hasItems &&
          items.map((magicItem) => (
            <li
              key={magicItem.id}
              className="flex flex-col gap-2 py-3 md:flex-row md:items-start md:justify-between"
            >
              <AddMagicItem
                characterId={null}
                item={magicItem}
                title="Modifier un objet magique"
                className="text-left"
              >
                <div className="cursor-pointer space-x-2 rounded p-2 hover:bg-white/5">
                  <span className={cn("leading-5", MAGIC_ITEM_RARITY_COLOR_MAP[magicItem.rarity])}>
                    {magicItem.name}
                  </span>
                  {magicItem.isAttuned && (
                    <span className="inline-block">
                      <Sparkle className="size-3 text-sky-400" />
                    </span>
                  )}
                  {magicItem.charges && (
                    <span className="text-sm text-indigo-400">({magicItem.charges})</span>
                  )}
                  {magicItem.description && (
                    <span className="mt-1 block text-sm leading-4 text-muted-foreground">
                      {magicItem.description}
                    </span>
                  )}
                </div>
              </AddMagicItem>

              <AssignMagicItem itemId={magicItem.id} characters={characters} />
            </li>
          ))}
      </ul>
    </SheetCard>
  );
}
