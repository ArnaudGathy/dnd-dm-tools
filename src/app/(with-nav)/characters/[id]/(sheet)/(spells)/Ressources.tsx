"use client";

import RessourceTracker from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourceTracker";
import { CharacterById } from "@/lib/utils";
import RessourcesConfigMenu from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourcesConfigMenu";
import dynamic from "next/dynamic";
import { resetHp } from "@/lib/actions/characters";
import { RessourcesData } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourcesWrapper";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import { FlameKindling } from "lucide-react";

function Ressources({
  character,
  ressources,
}: {
  character: CharacterById;
  ressources: RessourcesData;
}) {
  const { characterRessources, displayedRessources, shortRest, longRest, sortRessources } =
    ressources;

  return (
    <SectionPanel
      accent="emerald"
      icon={FlameKindling}
      title="Ressources"
      action={
        <RessourcesConfigMenu
          ressources={characterRessources}
          shortRestAction={() => shortRest()}
          longRestAction={() => {
            longRest(character);
            void resetHp(character.id, character.maximumHP);
          }}
          sortRessourcesAction={sortRessources}
        />
      }
    >
      {displayedRessources.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {displayedRessources.map(({ name, icon, useRessource }) => (
            <div key={name} className="rounded-lg bg-muted p-3">
              <RessourceTracker name={name} icon={icon} useRessource={useRessource} />
            </div>
          ))}
        </div>
      )}
    </SectionPanel>
  );
}

export default dynamic(() => Promise.resolve(Ressources), { ssr: false });
