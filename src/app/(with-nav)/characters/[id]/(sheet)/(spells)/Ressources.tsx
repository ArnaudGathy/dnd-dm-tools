"use client";

import { CharacterById } from "@/lib/utils";
import RessourcesConfigMenu from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/RessourcesConfigMenu";
import dynamic from "next/dynamic";
import { resetHp } from "@/lib/actions/characters";
import { SectionPanel } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import { FlameKindling } from "lucide-react";
import { DisplayRessource } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessourceData";
import { RessourceStorage } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import ResourceRow from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/ResourceRow";
import RestButtons from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/RestButtons";

export type RessourcesData = {
  characterRessources: DisplayRessource[];
  displayedRessources: DisplayRessource[];
  shortRest: () => void;
  longRest: (character: CharacterById) => void;
  sortRessources: (ressources: RessourceStorage["ressources"]) => void;
};

function Ressources({
  character,
  ressources,
}: {
  character: CharacterById;
  ressources: RessourcesData;
}) {
  const { characterRessources, displayedRessources, shortRest, longRest, sortRessources } =
    ressources;

  const canShortRest = characterRessources.some(({ useRessource }) => useRessource[0].canShortRest);

  return (
    <SectionPanel
      accent="amber"
      icon={FlameKindling}
      title="Ressources"
      action={
        <div className="flex items-center gap-1">
          <RestButtons
            canShortRest={canShortRest}
            shortRestAction={() => shortRest()}
            longRestAction={() => {
              longRest(character);
              void resetHp(character.id, character.maximumHP);
            }}
          />
          <RessourcesConfigMenu
            ressources={characterRessources}
            sortRessourcesAction={sortRessources}
          />
        </div>
      }
      contentClassName="gap-1.5"
    >
      {displayedRessources.length === 0 && (
        <span className="text-sm text-muted-foreground">Aucune ressource affichée.</span>
      )}
      {displayedRessources.map(({ name, icon, useRessource }) => (
        <ResourceRow key={name} name={name} icon={icon} useRessource={useRessource} />
      ))}
    </SectionPanel>
  );
}

export default dynamic(() => Promise.resolve(Ressources), { ssr: false });
