import { getCreatures, getEncounterFromId, getEncounterFromLocation } from "@/utils/utils";
import { notFound } from "next/navigation";
import { InfoModule } from "@/app/(with-nav)/encounters/[id]/InfoModule";
import StatBlocksModule from "@/app/(with-nav)/encounters/[id]/StatBlocksModule";
import { Creature } from "@/types/types";
import { isDefined } from "remeda";

const EncounterById = async ({ params }: { params: Promise<{ id: string }> }) => {
  const CombatModuleWrapper = (await import("./CombatModuleWrapper")).default;

  const encounterId = (await params).id;
  const encounter = getEncounterFromId(encounterId);

  if (!encounter) {
    return notFound();
  }

  const creatures = await getCreatures(encounter);
  const otherZonesCreaturesPromises = (
    await Promise.all(
      (encounter.extraZonesEnnemies ?? []).map(async (mapMarker) => {
        const anotherEncounter = getEncounterFromLocation({
          mapMarker,
          name: encounter?.location.name,
        });

        if (!!anotherEncounter) {
          return [mapMarker, await getCreatures(anotherEncounter)];
        }

        return undefined;
      }, []),
    )
  ).filter(isDefined);
  const otherZonesCreatures: Record<string, Creature[]> = Object.fromEntries(
    otherZonesCreaturesPromises,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex w-[50%] flex-col gap-4">
          <InfoModule encounter={encounter} />
          <StatBlocksModule creatures={creatures} />
        </div>
        <div className="sticky top-4 flex w-[50%] flex-col gap-4">
          <CombatModuleWrapper
            encounter={encounter}
            creatures={creatures}
            otherZonesCreatures={otherZonesCreatures}
          />
        </div>
      </div>
    </div>
  );
};

export default EncounterById;
