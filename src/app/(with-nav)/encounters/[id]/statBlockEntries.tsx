import { Creature } from "@/types/types";
import { StatBlock } from "@/components/statblocks/StatBlock";
import { prop, uniqueBy } from "remeda";
import { StatBlockEntry } from "@/app/(with-nav)/encounters/[id]/StatBlockSections";

// Server-side only (StatBlock is an async server component): builds the stat block column
// entries for a roster. Used both by the page and by the reinforcement action, so an imported
// zone gets stat blocks rendered exactly like the encounter's own.
export const buildStatBlockEntries = (creatures: Creature[], keyPrefix = ""): StatBlockEntry[] =>
  uniqueBy(creatures, prop("name")).map((creature) => ({
    key: `${keyPrefix}${creature.id}`,
    name: creature.name,
    creatureIds: creatures.filter(({ name }) => name === creature.name).map(prop("id")),
    statBlock: <StatBlock creature={creature} />,
  }));
