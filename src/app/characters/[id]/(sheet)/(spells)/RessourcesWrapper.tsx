"use client";

import Ressources from "@/app/characters/[id]/(sheet)/(spells)/Ressources";
import { CharacterById } from "@/lib/utils";

export default function RessourcesWrapper({
  character,
}: {
  character: CharacterById;
}) {
  return <Ressources character={character} />;
}
