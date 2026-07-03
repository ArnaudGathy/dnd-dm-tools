"use client";

import { CharacterById } from "@/lib/utils";
import { ChevronDown, Sparkles } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";

/** Traits as an accordion: every name visible at a glance, tap to read the
 *  full description — mid-combat you scan for the trait first, then read. */
export default function TraitsPanel({ character }: { character: CharacterById }) {
  return (
    <SectionPanel
      accent="emerald"
      icon={Sparkles}
      title="Traits & capacités"
      contentClassName="gap-1.5"
    >
      {character.capacities.length === 0 && (
        <span className="text-sm text-muted-foreground">Aucun trait.</span>
      )}
      {character.capacities.map((capacity) => {
        if (!capacity.description) {
          return (
            <div key={capacity.id} className="rounded-lg bg-muted px-3 py-2">
              <span className="text-sm font-bold leading-tight">{capacity.name}</span>
            </div>
          );
        }

        return (
          <Collapsible key={capacity.id} className="rounded-lg bg-muted">
            <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5">
              <span className="text-sm font-bold leading-tight">{capacity.name}</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="whitespace-pre-line px-3 pb-2.5 text-sm leading-snug text-muted-foreground">
                {capacity.description}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </SectionPanel>
  );
}
