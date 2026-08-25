"use client";

import { Fragment, ReactNode, useMemo, useState } from "react";
import { Hourglass, SkullIcon } from "lucide-react";
import {
  CombatStatus,
  mergeStatuses,
  useCombatStatuses,
  useReinforcementStatBlocks,
} from "@/app/(with-nav)/encounters/[id]/CombatStatusContext";
import { PileToggle } from "@/app/(with-nav)/encounters/[id]/PileToggle";

export type StatBlockEntry = {
  key: string;
  // Dedupe key across the encounter's own roster and the imported reinforcements.
  name: string;
  // Every creature id displayed by this stat block: stat blocks are deduped by name, so two
  // roster entries of the same monster share one block and its status is the best of the two.
  creatureIds: string[];
  statBlock: ReactNode;
};

export const StatBlockSections = ({ entries }: { entries: StatBlockEntry[] }) => {
  const statusByCreatureId = useCombatStatuses();
  const reinforcementEntries = useReinforcementStatBlocks();
  const [showInactivePile, setShowInactivePile] = useState(false);
  const [showDeadPile, setShowDeadPile] = useState(false);

  // The encounter's roster first, then the reinforcements — a monster already displayed keeps
  // its single stat block and only collects the imported creature ids (for status grouping).
  const allEntries = useMemo(
    () =>
      [...entries, ...reinforcementEntries].reduce<StatBlockEntry[]>((acc, entry) => {
        const index = acc.findIndex(({ name }) => name === entry.name);
        if (index === -1) {
          return [...acc, entry];
        }
        return acc.with(index, {
          ...acc[index],
          creatureIds: [...new Set([...acc[index].creatureIds, ...entry.creatureIds])],
        });
      }, []),
    [entries, reinforcementEntries],
  );

  const getEntryStatus = (entry: StatBlockEntry): CombatStatus =>
    entry.creatureIds.reduce<CombatStatus | undefined>(
      (status, creatureId) =>
        statusByCreatureId[creatureId] === undefined
          ? status
          : mergeStatuses(status, statusByCreatureId[creatureId]),
      undefined,
      // Creatures hidden from the tracker (décor swarms) never get a status — they stay visible.
    ) ?? "active";

  const activeEntries = allEntries.filter((entry) => getEntryStatus(entry) === "active");
  const inactiveEntries = allEntries.filter((entry) => getEntryStatus(entry) === "inactive");
  const deadEntries = allEntries.filter((entry) => getEntryStatus(entry) === "dead");

  const renderEntries = (list: StatBlockEntry[]) =>
    list.map((entry) => <Fragment key={entry.key}>{entry.statBlock}</Fragment>);

  return (
    <div className="flex flex-col gap-4">
      {renderEntries(activeEntries)}

      {inactiveEntries.length > 0 && (
        <div className="flex flex-col gap-4">
          <PileToggle
            label="Inactifs"
            count={inactiveEntries.length}
            icon={Hourglass}
            isOpen={showInactivePile}
            onToggle={() => setShowInactivePile((current) => !current)}
            className="px-0"
          />
          {showInactivePile && renderEntries(inactiveEntries)}
        </div>
      )}

      {deadEntries.length > 0 && (
        <div className="flex flex-col gap-4">
          <PileToggle
            label="Morts"
            count={deadEntries.length}
            icon={SkullIcon}
            isOpen={showDeadPile}
            onToggle={() => setShowDeadPile((current) => !current)}
            className="px-0"
          />
          {showDeadPile && renderEntries(deadEntries)}
        </div>
      )}

      <div className="h-[800px]" />
    </div>
  );
};
