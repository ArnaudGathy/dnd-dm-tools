import { getEncounterFromId } from "@/utils/utils";
import { notFound } from "next/navigation";
import { InfoModule } from "@/app/encounters/[id]/InfoModule";
import { StatBlocksModule } from "@/app/encounters/[id]/StatBlocksModule";

const EncounterById = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const CombatModuleWrapper = (await import("./CombatModuleWrapper")).default;

  const encounterId = (await params).id;
  const encounter = getEncounterFromId(encounterId);

  if (!encounter) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex w-[50%] flex-col gap-4">
          <InfoModule encounter={encounter} />
          <StatBlocksModule encounter={encounter} />
        </div>
        <div className="sticky top-4 flex w-[50%] flex-col gap-4">
          <CombatModuleWrapper encounter={encounter} />
        </div>
      </div>
    </div>
  );
};

export default EncounterById;
