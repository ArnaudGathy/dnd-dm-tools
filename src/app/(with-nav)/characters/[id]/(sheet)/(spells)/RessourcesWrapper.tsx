"use client";

import Ressources from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/Ressources";
import { CharacterById } from "@/lib/utils";
import { DisplayRessource } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessourceData";
import { RessourceStorage } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";

export type RessourcesData = {
  characterRessources: DisplayRessource[];
  displayedRessources: DisplayRessource[];
  shortRest: () => void;
  longRest: (character: CharacterById) => void;
  sortRessources: (ressources: RessourceStorage["ressources"]) => void;
};

export default function RessourcesWrapper({
  character,
  ressources,
}: {
  character: CharacterById;
  ressources: RessourcesData;
}) {
  return <Ressources character={character} ressources={ressources} />;
}
