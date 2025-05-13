import { Creature } from "@/types/types";
import { StatBlock } from "@/app/creatures/StatBlock";
import { prop, uniqueBy } from "remeda";

const StatBlocksModule = async ({ creatures }: { creatures: Creature[] }) => {
  const uniqueCreatures = uniqueBy(creatures, prop("name"));
  return (
    <div className="flex flex-col gap-4">
      {uniqueCreatures.map((creature) => (
        <StatBlock key={creature.id} creature={creature} />
      ))}
      <div className="h-[800px]" />
    </div>
  );
};

export default StatBlocksModule;
