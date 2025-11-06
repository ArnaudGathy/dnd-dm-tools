"use client";

import RessourceTracker from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourceTracker";
import { CharacterById } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";
import RessourcesConfigMenu from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourcesConfigMenu";
import dynamic from "next/dynamic";
import { resetHp } from "@/lib/actions/characters";
import { RessourcesData } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourcesWrapper";

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
    <SheetCard>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">Ressources</span>
        <RessourcesConfigMenu
          ressources={characterRessources}
          shortRestAction={() => shortRest()}
          longRestAction={() => {
            longRest(character);
            void resetHp(character.id, character.maximumHP);
          }}
          sortRessourcesAction={sortRessources}
        />
      </div>
      {displayedRessources.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {displayedRessources.map(({ name, icon, useRessource }) => (
            <RessourceTracker key={name} name={name} icon={icon} useRessource={useRessource} />
          ))}
        </div>
      )}
    </SheetCard>
  );
}

export default dynamic(() => Promise.resolve(Ressources), { ssr: false });
