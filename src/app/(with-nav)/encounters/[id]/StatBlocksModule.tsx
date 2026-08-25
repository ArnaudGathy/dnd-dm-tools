import { Creature } from "@/types/types";
import { StatBlockSections } from "@/app/(with-nav)/encounters/[id]/StatBlockSections";
import { buildStatBlockEntries } from "@/app/(with-nav)/encounters/[id]/statBlockEntries";

const StatBlocksModule = async ({ creatures }: { creatures: Creature[] }) => (
  <StatBlockSections entries={buildStatBlockEntries(creatures)} />
);

export default StatBlocksModule;
