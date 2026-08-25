import { getCreatures, getEncounterFromId, getEncountersFromLocationName } from "@/utils/utils";
import { notFound } from "next/navigation";
import { InfoModule } from "@/app/(with-nav)/encounters/[id]/InfoModule";
import StatBlocksModule from "@/app/(with-nav)/encounters/[id]/StatBlocksModule";
import { CombatStatusProvider } from "@/app/(with-nav)/encounters/[id]/CombatStatusContext";

const EncounterById = async ({ params }: { params: Promise<{ id: string }> }) => {
  const CombatModuleWrapper = (await import("./CombatModuleWrapper")).default;

  const encounterId = (await params).id;
  const encounter = getEncounterFromId(encounterId);

  if (!encounter) {
    return notFound();
  }

  const locationEncounters = getEncountersFromLocationName(encounter.location.name);
  const creatures = await getCreatures(encounter);

  return (
    // The tracker owns the live participant state; the provider lets the stat block column
    // group its blocks by the same active/inactive/dead status.
    <CombatStatusProvider>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex w-[50%] flex-col gap-4">
            <InfoModule encounter={encounter} locationEncounters={locationEncounters} />
            <StatBlocksModule creatures={creatures} />
          </div>
          <div className="sticky top-4 flex w-[50%] flex-col gap-4">
            <CombatModuleWrapper encounter={encounter} creatures={creatures} />
          </div>
        </div>
      </div>
    </CombatStatusProvider>
  );
};

export default EncounterById;
