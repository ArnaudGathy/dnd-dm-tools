"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { Participant } from "@/types/types";
import { StatBlockEntry } from "@/app/(with-nav)/encounters/[id]/StatBlockSections";

// The stat block column (server-rendered) and the combat tracker (client state) live in two
// separate branches of the page. The tracker publishes a creature-id → status map here so the
// stat blocks can be grouped exactly like the participant rows are.
export type CombatStatus = "active" | "inactive" | "dead";

// Lower rank wins when several participants share a stat block: one living Yuan-ti keeps its
// stat block fully displayed even if its siblings are dead.
const STATUS_RANK: Record<CombatStatus, number> = { active: 0, inactive: 1, dead: 2 };

export const getParticipantStatus = (participant: Participant): CombatStatus => {
  if (participant.currentHp === "0") {
    return "dead";
  }
  return participant.inactive ? "inactive" : "active";
};

export const mergeStatuses = (a: CombatStatus | undefined, b: CombatStatus): CombatStatus =>
  a === undefined || STATUS_RANK[b] < STATUS_RANK[a] ? b : a;

type CombatStatusContextValue = {
  statusByCreatureId: Record<string, CombatStatus>;
  publishStatuses: (statuses: Record<string, CombatStatus>) => void;
  // Stat blocks of the zones imported as reinforcements, keyed by mapMarker. The tracker
  // imports them mid-combat, so they cannot be part of the page's server render.
  statBlocksByZone: Record<string, StatBlockEntry[]>;
  publishZoneStatBlocks: (mapMarker: string, entries: StatBlockEntry[]) => void;
};

const CombatStatusContext = createContext<CombatStatusContextValue | null>(null);

const areStatusesEqual = (
  a: Record<string, CombatStatus>,
  b: Record<string, CombatStatus>,
): boolean => {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key]);
};

export const CombatStatusProvider = ({ children }: { children: ReactNode }) => {
  const [statusByCreatureId, setStatusByCreatureId] = useState<Record<string, CombatStatus>>({});
  const [statBlocksByZone, setStatBlocksByZone] = useState<Record<string, StatBlockEntry[]>>({});

  const publishZoneStatBlocks = useCallback((mapMarker: string, entries: StatBlockEntry[]) => {
    setStatBlocksByZone((current) => ({ ...current, [mapMarker]: entries }));
  }, []);

  // Guarded against value-equal updates: the tracker republishes on every HP keystroke and an
  // unconditional setState would re-render the whole page for nothing.
  const publishStatuses = useCallback((statuses: Record<string, CombatStatus>) => {
    setStatusByCreatureId((current) => (areStatusesEqual(current, statuses) ? current : statuses));
  }, []);

  const value = useMemo(
    () => ({ statusByCreatureId, publishStatuses, statBlocksByZone, publishZoneStatBlocks }),
    [statusByCreatureId, publishStatuses, statBlocksByZone, publishZoneStatBlocks],
  );

  return <CombatStatusContext.Provider value={value}>{children}</CombatStatusContext.Provider>;
};

const EMPTY_STATUSES: Record<string, CombatStatus> = {};

export const useCombatStatuses = () =>
  useContext(CombatStatusContext)?.statusByCreatureId ?? EMPTY_STATUSES;

export const usePublishCombatStatuses = () => useContext(CombatStatusContext)?.publishStatuses;

const EMPTY_STAT_BLOCKS: StatBlockEntry[] = [];

// Flattened in mapMarker order so an imported zone's stat blocks keep a stable position.
export const useReinforcementStatBlocks = (): StatBlockEntry[] => {
  const statBlocksByZone = useContext(CombatStatusContext)?.statBlocksByZone;
  return useMemo(
    () =>
      statBlocksByZone === undefined
        ? EMPTY_STAT_BLOCKS
        : Object.keys(statBlocksByZone)
            .toSorted()
            .flatMap((mapMarker) => statBlocksByZone[mapMarker]),
    [statBlocksByZone],
  );
};

export const usePublishZoneStatBlocks = () =>
  useContext(CombatStatusContext)?.publishZoneStatBlocks;
