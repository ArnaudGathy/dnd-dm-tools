import { Encounter } from "@/types/types";
import {
  getCreaturesFromIds,
  getEnnemiesFromEncounter,
  getIdFromEnemy,
} from "@/utils/utils";
import { map, unique } from "remeda";
import { StatBlock } from "@/app/creatures/StatBlock";

const StatBlocksModule = ({ encounter }: { encounter: Encounter }) => {
  const creatures =
    getCreaturesFromIds(
      unique(
        map(getEnnemiesFromEncounter({ encounter, partyLevel: "1" }), (enemy) =>
          getIdFromEnemy(enemy),
        ),
      ),
    ) ?? [];

  return (
    <div className="flex flex-col gap-4">
      {creatures.map((creature) => (
        <StatBlock key={creature.id} creature={creature} />
      ))}
      <div className="h-[800px]" />
    </div>
  );
};

export default StatBlocksModule;
