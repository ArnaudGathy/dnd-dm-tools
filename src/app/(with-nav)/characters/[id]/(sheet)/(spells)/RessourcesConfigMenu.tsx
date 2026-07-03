"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import RessourceConfigItem from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourceConfigItem";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import { RessourceStorage } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import { mapToObj } from "remeda";
import { DisplayRessource } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessourceData";

/** Display config for the Ressources panel: drag rows to reorder, tap the
 *  color dot for an inline swatch strip, tap the eye to show/hide. Presented
 *  as a mini-panel matching the amber accent of its parent section. */
export default function RessourcesConfigMenu({
  ressources,
  sortRessourcesAction,
}: {
  ressources: DisplayRessource[];
  sortRessourcesAction: (ressources: RessourceStorage["ressources"]) => void;
}) {
  const [colorEditFor, setColorEditFor] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id && over?.id && active.id !== over.id) {
      const oldIndex = ressources.findIndex((ressource) => ressource.name === active.id);
      const newIndex = ressources.findIndex((ressource) => ressource.name === over.id);

      const newArray = arrayMove(ressources, oldIndex, newIndex);
      const storageRessources = mapToObj(newArray, (ressource, index) => [
        ressource.ressourceName,
        { ...ressource.useRessource[0], order: index },
      ]);
      sortRessourcesAction(storageRessources);
    }
  };

  return (
    <PopoverComponent
      asChild
      side="top"
      noFocus
      contentClassName="w-80 max-w-[calc(100vw-1rem)] overflow-hidden p-0"
      definition={
        <div className="flex flex-col">
          <header className="flex items-center gap-2 border-l-4 border-l-amber-500 bg-amber-500/[0.07] px-3 py-2">
            <Settings className="size-3.5 shrink-0 stroke-[2.5px] text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/80">
              Affichage des ressources
            </span>
          </header>

          <div className="flex flex-col p-1.5">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={ressources.map((ressource) => ressource.name)}
                strategy={verticalListSortingStrategy}
              >
                {ressources.map((ressource) => (
                  <RessourceConfigItem
                    key={ressource.name}
                    id={ressource.name}
                    displayRessource={ressource}
                    isColorOpen={colorEditFor === ressource.name}
                    onToggleColorAction={() =>
                      setColorEditFor((current) =>
                        current === ressource.name ? null : ressource.name,
                      )
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      }
    >
      <Button theme="neutral" size="icon" title="Configurer l'affichage des ressources">
        <Settings />
      </Button>
    </PopoverComponent>
  );
}
