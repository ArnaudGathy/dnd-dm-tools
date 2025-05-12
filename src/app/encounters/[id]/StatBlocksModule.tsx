import { Encounter } from "@/types/types";
import {
  getCreaturesFromIds,
  getEnnemiesFromEncounter,
  getIdFromEnemy,
} from "@/utils/utils";
import { isNumber, isString, map, unique } from "remeda";
import { StatBlock } from "@/app/creatures/StatBlock";
import { get2024Creature } from "@/lib/external-apis/aidedd";

const getCreatures = async (encounter: Encounter) => {
  const enemiesIds = unique(
    map(getEnnemiesFromEncounter({ encounter, partyLevel: "1" }), (enemy) =>
      getIdFromEnemy(enemy),
    ),
  );

  // 2014 ennemies have number ids
  if (enemiesIds.every(isNumber)) {
    return getCreaturesFromIds(enemiesIds) ?? [];
  }

  // 2024 ennemies have string ids (creature name)
  if (enemiesIds.every(isString)) {
    return Promise.all(enemiesIds.map((name) => get2024Creature(name)));
  }

  return [];
};

const StatBlocksModule = async ({ encounter }: { encounter: Encounter }) => {
  const creatures = await getCreatures(encounter);

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
