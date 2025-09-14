"use client";

import { Button } from "@/components/ui/button";
import { FlameKindling, Settings, Tent } from "lucide-react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import RessourceConfigItem from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourceConfigItem";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import { RessourceStorage } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import { mapToObj } from "remeda";
import { PopoverClose } from "@radix-ui/react-popover";
import { DisplayRessource } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessourceData";

export default function RessourcesConfigMenu({
  ressources,
  shortRestAction,
  longRestAction,
  sortRessourcesAction,
}: {
  ressources: DisplayRessource[];
  shortRestAction: () => void;
  longRestAction: () => void;
  sortRessourcesAction: (ressources: RessourceStorage["ressources"]) => void;
}) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id && over?.id && active.id !== over.id) {
      const oldIndex = ressources.findIndex(
        (ressource) => ressource.name === active.id,
      );
      const newIndex = ressources.findIndex(
        (ressource) => ressource.name === over.id,
      );

      const newArray = arrayMove(ressources, oldIndex, newIndex);
      const storageRessources = mapToObj(newArray, (ressource, index) => [
        ressource.ressourceName,
        { ...ressource.useRessource[0], order: index },
      ]);
      sortRessourcesAction(storageRessources);
    }
  };

  const canShortRest = ressources.some(
    (ressource) => ressource.useRessource[0].canShortRest,
  );

  return (
    <div>
      <PopoverComponent
        asChild
        side="top"
        noFocus
        definition={
          <div className="flex min-w-[300px] flex-col gap-4">
            <div>
              <span className="mb-2 block text-lg font-bold">
                Réinitialiser
              </span>

              <div className="flex gap-2">
                <PopoverClose asChild>
                  <Button size="sm" onClick={longRestAction}>
                    <Tent /> Long repos
                  </Button>
                </PopoverClose>
                {canShortRest && (
                  <PopoverClose asChild>
                    <Button theme="neutral" size="sm" onClick={shortRestAction}>
                      <FlameKindling /> Court repos
                    </Button>
                  </PopoverClose>
                )}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-lg font-bold">
                Configuration
              </span>
              <div className="flex flex-col gap-2">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={ressources.map((ressource) => ressource.name)}
                    strategy={verticalListSortingStrategy}
                  >
                    {ressources.map((ressource) => {
                      return (
                        <RessourceConfigItem
                          key={ressource.name}
                          id={ressource.name}
                          displayRessource={ressource}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
        }
      >
        <Button theme="neutral">
          <Settings />
        </Button>
      </PopoverComponent>
    </div>
  );
}
