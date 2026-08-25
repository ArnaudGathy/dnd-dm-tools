"use server";
import "server-only";

import { getCreatures, getEncounterFromLocation } from "@/utils/utils";
import { Creature } from "@/types/types";
import { restrictToAdmins } from "@/lib/utils";
import { buildStatBlockEntries } from "@/app/(with-nav)/encounters/[id]/statBlockEntries";
import type { StatBlockEntry } from "@/app/(with-nav)/encounters/[id]/StatBlockSections";

// Read-only, but it lives here because the combat tracker calls it from a click handler:
// every zone of a location is importable, so resolving them all at render time would pull
// dozens of rosters (and cold-cache AideDD fetches) the DM never asked for.
// Returns the stat blocks already rendered on the server: StatBlock is an async server
// component, so the client tracker cannot build them itself.
export const getZoneReinforcements = async ({
  locationName,
  mapMarker,
}: {
  locationName: string;
  mapMarker: string;
}): Promise<{ creatures: Creature[]; statBlocks: StatBlockEntry[] }> => {
  await restrictToAdmins();

  const encounter = getEncounterFromLocation({ name: locationName, mapMarker });

  if (!encounter) {
    return { creatures: [], statBlocks: [] };
  }

  const creatures = await getCreatures(encounter);

  return { creatures, statBlocks: buildStatBlockEntries(creatures, `${mapMarker}-`) };
};
