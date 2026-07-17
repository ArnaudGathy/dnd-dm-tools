"use server";
import "server-only";

import { getCreatures, getEncounterFromLocation } from "@/utils/utils";
import { Creature } from "@/types/types";
import { restrictToAdmins } from "@/lib/utils";

// Read-only, but it lives here because the combat tracker calls it from a click handler:
// every zone of a location is importable, so resolving them all at render time would pull
// dozens of rosters (and cold-cache AideDD fetches) the DM never asked for.
export const getZoneCreatures = async ({
  locationName,
  mapMarker,
}: {
  locationName: string;
  mapMarker: string;
}): Promise<Creature[]> => {
  await restrictToAdmins();

  const encounter = getEncounterFromLocation({ name: locationName, mapMarker });

  if (!encounter) {
    return [];
  }

  return getCreatures(encounter);
};
