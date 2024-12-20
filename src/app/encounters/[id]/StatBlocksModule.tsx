"use client";

import { Encounter } from "@/types/types";
import { getCreaturesFromIds, getEnnemiesFromEncounter } from "@/utils/utils";
import { unique } from "remeda";
import { notFound } from "next/navigation";
import { getPartyLevel } from "@/utils/localStorageUtils";
import { StatBlock } from "@/app/creatures/StatBlock";

export const StatBlocksModule = ({ encounter }: { encounter: Encounter }) => {
  const partyLevel = getPartyLevel();
  const creatures = getCreaturesFromIds(
    unique(getEnnemiesFromEncounter({ encounter, partyLevel })),
  );

  if (!creatures) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      {creatures.map((creature) => (
        <StatBlock key={creature.id} creature={creature} />
      ))}
    </div>
  );
};
