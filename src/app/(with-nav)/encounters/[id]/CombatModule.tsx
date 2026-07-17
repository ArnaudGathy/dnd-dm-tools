"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Condition, Creature, Encounter, Participant, ParticipantToAdd } from "@/types/types";
import {
  getEncounterFromLocation,
  getEncountersFromLocationName,
  getParticipantFromCharacters,
  getParticipantFromEncounter,
  roll,
} from "@/utils/utils";
import { getZoneCreatures } from "@/lib/actions/encounters";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { v4 as uuidv4 } from "uuid";
import { Card } from "@/components/ui/card";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/24/outline";
import { filter, isDefined, map, pipe, prop } from "remeda";
import {
  ChevronRight,
  FastForwardIcon,
  Loader2,
  RefreshCcw,
  SkullIcon,
  Swords,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGroupFromCampaign, Group } from "@/hooks/useGroupFromCampaign";
import {
  useClearCombatTracker,
  useSetParticipantsListTracker,
  useSetTurnsTracker,
} from "@/hooks/useParticipantsListTracker";
import { conditions } from "@/data/conditions";
import { InitiativePrompt } from "@/app/(with-nav)/encounters/[id]/InitiativePrompt";
import { SpellQuickAccess } from "@/app/(with-nav)/encounters/[id]/SpellQuickAccess";
import { DEFAULT_INIT, ParticipantRow } from "@/app/(with-nav)/encounters/[id]/ParticipantRow";

// Local recovery snapshot: the Firebase mirror is intentionally cleared on unmount so the
// /tracker/character view disappears — localStorage is the only place a combat survives.
// Single slot: starting to play another encounter overwrites the previous snapshot.
const COMBAT_SNAPSHOT_KEY = "combat-tracker-snapshot";

type CombatSnapshot = {
  encounterId: number;
  savedAt: number;
  listOfParticipants: Participant[];
  currentTurnIndex: number | null;
  turnsCounter: number;
  anotherEncountersAdded: string[];
};

const loadCombatSnapshot = (encounterId: number): CombatSnapshot | null => {
  try {
    const raw = localStorage.getItem(COMBAT_SNAPSHOT_KEY);
    if (!raw) {
      return null;
    }
    const snapshot = JSON.parse(raw) as CombatSnapshot;
    if (
      snapshot.encounterId !== encounterId ||
      !Array.isArray(snapshot.listOfParticipants) ||
      snapshot.listOfParticipants.length === 0
    ) {
      return null;
    }
    return snapshot;
  } catch {
    return null;
  }
};

// Restored conditions are JSON clones — remap them to the canonical `conditions` objects so
// resumed combats pick up any data fixes (descriptions, bullets) shipped since the snapshot.
const rehydrateConditions = (participant: Participant): Participant =>
  participant.conditions
    ? {
        ...participant,
        conditions: participant.conditions.map(
          (condition) => conditions.find((known) => known.title === condition.title) ?? condition,
        ),
      }
    : participant;

const DEFAULT_STATE = {
  id: "",
  currentHp: "",
  name: "",
  init: DEFAULT_INIT,
  hp: "",
  color: "#DD1D47",
  dexMod: 0,
};

const getNextTurn = ({
  turnsCounter,
  listOfParticipants,
  countTurn,
  startAction,
}: {
  turnsCounter: number | null;
  listOfParticipants: Participant[];
  countTurn?: () => void;
  startAction?: () => void;
}) => {
  if (turnsCounter === null) {
    startAction?.();
  }

  // Combat start lands on index 0 (without counting a new round); the dead/inactive
  // check below still applies so an unplayable first participant is skipped too.
  const nextTurn = turnsCounter === null ? 0 : (turnsCounter + 1) % listOfParticipants.length;
  if (turnsCounter !== null && nextTurn === 0) {
    countTurn?.();
  }

  const nextParticipant = listOfParticipants[nextTurn];
  if (parseInt(nextParticipant.currentHp, 10) <= 0 || nextParticipant.inactive) {
    return getNextTurn({
      turnsCounter: nextTurn,
      listOfParticipants: listOfParticipants,
      countTurn: countTurn,
    });
  }

  return nextTurn;
};

const sortParticipant = (a: Participant, b: Participant) => {
  const aInit = b.init > DEFAULT_INIT ? b.init : Infinity;
  const bInit = a.init > DEFAULT_INIT ? a.init : Infinity;

  if (aInit === bInit) {
    if (!a.isNPC && !b.isNPC) {
      return a.name.localeCompare(b.name);
    }
    if (!a.isNPC && b.isNPC) {
      return -1;
    }
    return 1;
  }

  return aInit - bInit;
};

export const CombatModule = ({
  encounter,
  creatures,
}: {
  encounter: Encounter;
  creatures: Creature[];
}) => {
  const { setParticipantsTracker } = useSetParticipantsListTracker();
  const { setActiveParticipantTracker, setNumberOfTurnsTracker, setHasStartedTracker } =
    useSetTurnsTracker();
  const clearCombatTracker = useClearCombatTracker();

  const router = useRouter();
  const pathName = usePathname();

  const [anotherEncountersAdded, setAnotherEncountersAdded] = useState<Array<string>>([]);
  const [loadingZone, setLoadingZone] = useState<string | null>(null);
  const [showZoneImport, setShowZoneImport] = useState(false);
  const [turnsCounter, setTurnsCounter] = useState(1);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number | null>(null);
  const hasCombatStarted = currentTurnIndex !== null;

  const [shouldShowAddParticipant, setShouldShowAddParticipant] = useState(false);
  const [showDeadPile, setShowDeadPile] = useState(false);
  const [showInitiativePrompt, setShowInitiativePrompt] = useState(false);
  const [listOfParticipants, setListOfParticipants] = useState<Participant[]>(() =>
    filter(
      [
        ...getParticipantFromEncounter({
          creatures,
          encounter,
        }),
        encounter.environmentTurnInitiative
          ? {
              uuid: uuidv4(),
              isNPC: true,
              id: -99,
              name: "Environement",
              hp: "",
              currentHp: "",
              init: Number(encounter.environmentTurnInitiative ?? "0"),
              dexMod: 0,
            }
          : undefined,
      ],
      isDefined,
    ).toSorted(sortParticipant),
  );

  // A fight can spill over anywhere, so every other zone of the location is importable —
  // their rosters are resolved on click, not up front (see getZoneCreatures).
  const importableZones = useMemo(
    () => [
      // Deduped: two encounters can share a mapMarker (split rosters of one zone).
      ...new Set(
        pipe(
          getEncountersFromLocationName(encounter.location.name),
          map(({ location }) => location.mapMarker),
          filter((mapMarker) => mapMarker !== encounter.location.mapMarker),
        ),
      ),
    ],
    [encounter.location.name, encounter.location.mapMarker],
  );

  const [snapshotToRestore, setSnapshotToRestore] = useState<CombatSnapshot | null>(null);
  const isDirtyRef = useRef(false);

  // Read the snapshot after mount: localStorage doesn't exist during SSR, so reading it in
  // the state initializer makes the server and client HTML diverge (hydration mismatch).
  useEffect(() => {
    if (!isDirtyRef.current) {
      setSnapshotToRestore(loadCombatSnapshot(encounter.id));
    }
  }, [encounter.id]);

  const markCombatDirty = useCallback(() => {
    isDirtyRef.current = true;
    setSnapshotToRestore(null);
  }, []);

  const mutateParticipants = useCallback(
    (updater: (current: Participant[]) => Participant[]) => {
      markCombatDirty();
      setListOfParticipants(updater);
    },
    [markCombatDirty],
  );

  // Mirrors listOfParticipants so callers that mutate after an await (importing another
  // zone's enemies) reconcile against the live list rather than their render closure.
  const listOfParticipantsRef = useRef(listOfParticipants);
  useEffect(() => {
    listOfParticipantsRef.current = listOfParticipants;
  }, [listOfParticipants]);

  // For mutations that re-sort the list (initiative edits, mid-combat additions): the
  // active-turn highlight is index-based, so re-anchor currentTurnIndex to the same
  // participant after rows move around.
  const mutateParticipantsPreservingActive = (
    updater: (current: Participant[]) => Participant[],
  ) => {
    markCombatDirty();
    const previous = listOfParticipantsRef.current;
    const next = updater(previous);
    listOfParticipantsRef.current = next;
    setListOfParticipants(next);
    setCurrentTurnIndex((current) => {
      if (current === null) {
        return current;
      }
      const activeUuid = previous[current]?.uuid;
      const newIndex = next.findIndex((p) => p.uuid === activeUuid);
      return newIndex === -1 ? current : newIndex;
    });
  };

  useEffect(() => {
    if (!isDirtyRef.current) {
      return;
    }
    const snapshot: CombatSnapshot = {
      encounterId: encounter.id,
      savedAt: Date.now(),
      listOfParticipants,
      currentTurnIndex,
      turnsCounter,
      anotherEncountersAdded,
    };
    try {
      localStorage.setItem(COMBAT_SNAPSHOT_KEY, JSON.stringify(snapshot));
    } catch {
      // Snapshot is best-effort — a full/blocked localStorage must not break combat.
    }
  }, [encounter.id, listOfParticipants, currentTurnIndex, turnsCounter, anotherEncountersAdded]);

  const handleRestoreSnapshot = () => {
    if (!snapshotToRestore) {
      return;
    }
    isDirtyRef.current = true;
    setListOfParticipants(snapshotToRestore.listOfParticipants.map(rehydrateConditions));
    setCurrentTurnIndex(snapshotToRestore.currentTurnIndex);
    setTurnsCounter(snapshotToRestore.turnsCounter);
    setAnotherEncountersAdded(snapshotToRestore.anotherEncountersAdded ?? []);
    if (snapshotToRestore.currentTurnIndex !== null) {
      setHasStartedTracker(true);
    }
    setSnapshotToRestore(null);
  };

  const handleDiscardSnapshot = () => {
    localStorage.removeItem(COMBAT_SNAPSHOT_KEY);
    setSnapshotToRestore(null);
  };

  useEffect(() => {
    setHasStartedTracker(false);
    return () => {
      clearCombatTracker();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (listOfParticipants) {
      setParticipantsTracker(listOfParticipants);
    }
  }, [setParticipantsTracker, listOfParticipants]);

  useEffect(() => {
    if (currentTurnIndex !== null) {
      setActiveParticipantTracker(currentTurnIndex);
    }
  }, [setActiveParticipantTracker, currentTurnIndex]);

  useEffect(() => {
    if (turnsCounter !== null) {
      setNumberOfTurnsTracker(turnsCounter);
    }
  }, [setNumberOfTurnsTracker, turnsCounter]);

  const group = useGroupFromCampaign({
    groupAction: (group: Group) => {
      const participants = getParticipantFromCharacters(group);
      setListOfParticipants((current) => {
        if (participants.every((participant) => current.some((p) => p.name === participant.name))) {
          return current;
        }
        return [...participants, ...current].toSorted(sortParticipant);
      });
    },
  });

  const handleAddAnotherEncounterParticipants = async (mapMarker: string) => {
    // Already merged in (or being fetched) — a second click would duplicate every enemy.
    if (anotherEncountersAdded.includes(mapMarker) || loadingZone !== null) {
      return;
    }
    const anotherEncounter = getEncounterFromLocation({
      mapMarker,
      name: encounter?.location.name,
    });

    if (!anotherEncounter) {
      return;
    }

    setLoadingZone(mapMarker);
    try {
      const anotherEncounterCreatures = await getZoneCreatures({
        locationName: encounter.location.name,
        mapMarker,
      });

      if (anotherEncounterCreatures.length === 0) {
        return;
      }

      setAnotherEncountersAdded((current) => [...current, mapMarker]);
      mutateParticipantsPreservingActive((current) => {
        return [
          ...getParticipantFromEncounter({
            creatures: anotherEncounterCreatures,
            encounter: anotherEncounter,
          }),
          ...current,
        ].toSorted(sortParticipant);
      });
    } catch (error) {
      console.error("Failed to load the enemies of zone", mapMarker, error);
    } finally {
      setLoadingZone(null);
    }
  };

  const [participant, setParticipant] = useState<ParticipantToAdd>(DEFAULT_STATE);

  const handleAddParticipant = () => {
    if (participant.name && participant.color) {
      mutateParticipantsPreservingActive((current) =>
        [
          ...current,
          {
            ...participant,
            uuid: uuidv4(),
            isNPC: true,
            id: -1,
            currentHp: participant.hp,
            // DEFAULT_INIT means the field was left empty — roll for the newcomer.
            init:
              participant.init === DEFAULT_INIT || !participant.init ? roll(20) : participant.init,
            dexMod: 0,
          },
        ].toSorted(sortParticipant),
      );
      setParticipant(DEFAULT_STATE);
    }
  };

  const handleRemoveParticipant = (participant: Participant) => {
    const removedIndex = listOfParticipants.findIndex((p) => p.uuid === participant.uuid);
    mutateParticipants((current) => current.filter((p) => p.uuid !== participant.uuid));

    // The active-turn highlight is index-based, so removing a row above (or the) active
    // participant would otherwise leave currentTurnIndex pointing at the wrong row.
    if (removedIndex === -1) {
      return;
    }
    setCurrentTurnIndex((current) => {
      if (current === null) {
        return current;
      }
      const newLength = listOfParticipants.length - 1;
      if (newLength === 0) {
        return null;
      }
      if (removedIndex < current) {
        return current - 1;
      }
      if (removedIndex === current) {
        // The active participant was removed: the next one slides into its slot
        // (wrapping to the first if it was last in the order).
        return current % newLength;
      }
      return current;
    });
  };

  // Takes the list explicitly: the initiative prompt starts the combat from the freshly
  // re-sorted list, which the render closure doesn't know about yet.
  const advanceTurn = useCallback(
    (participants: Participant[]) => {
      // getNextTurn recurses until it finds a playable participant — with an empty list or
      // only dead/inactive ones it would crash (index NaN) or recurse forever.
      const hasPlayableParticipant = participants.some(
        (p) => !(parseInt(p.currentHp, 10) <= 0) && !p.inactive,
      );
      if (!hasPlayableParticipant) {
        return;
      }

      markCombatDirty();
      const nexTurn = getNextTurn({
        turnsCounter: currentTurnIndex,
        listOfParticipants: participants,
        countTurn: () => setTurnsCounter((current) => current + 1),
        startAction: () => setHasStartedTracker(true),
      });
      const nextParticipantId = participants[nexTurn].id;
      if (nextParticipantId) {
        router.replace(`${pathName}#${nextParticipantId}`);
      } else {
        router.replace(pathName);
      }

      setCurrentTurnIndex((current) =>
        getNextTurn({
          turnsCounter: current,
          listOfParticipants: participants,
        }),
      );
    },
    [currentTurnIndex, markCombatDirty, pathName, router, setHasStartedTracker],
  );

  const handleNextTurn = useCallback(() => {
    advanceTurn(listOfParticipants);
  }, [advanceTurn, listOfParticipants]);

  const players = useMemo(
    () => listOfParticipants.filter((participant) => !participant.isNPC),
    [listOfParticipants],
  );

  // Starting a combat means collecting the party's initiative first — the prompt is the whole
  // start button, not an extra step: submitting it plays the first turn.
  const handleStartCombat = useCallback(() => {
    if (!hasCombatStarted && players.length > 0) {
      setShowInitiativePrompt(true);
      return;
    }
    handleNextTurn();
  }, [hasCombatStarted, players.length, handleNextTurn]);

  const handleApplyInitiatives = (initiatives: Record<string, number>) => {
    markCombatDirty();
    const next = listOfParticipantsRef.current
      .map((participant) =>
        initiatives[participant.uuid] === undefined
          ? participant
          : { ...participant, init: initiatives[participant.uuid] },
      )
      .toSorted(sortParticipant);
    listOfParticipantsRef.current = next;
    setListOfParticipants(next);
    setShowInitiativePrompt(false);
    advanceTurn(next);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // The prompt owns the keyboard while it's open — space validates a player there.
      if (showInitiativePrompt) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const isTypingInInput =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (e.key === " " && !isTypingInInput) {
        e.preventDefault();
        handleStartCombat();
      }
    },
    [handleStartCombat, showInitiativePrompt],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);

  // When the active turn lands on a dead (0 HP) or inactive participant — mid-turn kill,
  // removal sliding the index onto one — auto-skip to the next one. Only if someone else
  // is still playable, otherwise getNextTurn would loop over an all-dead list.
  useEffect(() => {
    if (currentTurnIndex === null) {
      return;
    }
    const active = listOfParticipants[currentTurnIndex];
    if (!active || (active.currentHp !== "0" && !active.inactive)) {
      return;
    }
    const hasOtherPlayable = listOfParticipants.some(
      (p, index) => index !== currentTurnIndex && p.currentHp !== "0" && !p.inactive,
    );
    if (hasOtherPlayable) {
      handleNextTurn();
    }
  }, [currentTurnIndex, listOfParticipants, handleNextTurn]);

  const playersWithSpells = useMemo(
    () =>
      pipe(
        group,
        filter((character) => character.spellsOnCharacters.length > 0),
        map(prop("name")),
      ),
    [group],
  );

  const handleSetCurrentHp = (participant: Participant, value: number) => {
    if (participant.hp && value <= parseInt(participant.hp) && value >= 0) {
      mutateParticipants((current) =>
        current.map((p) =>
          p.uuid === participant.uuid ? { ...p, currentHp: value.toString() } : p,
        ),
      );
    }
  };

  const handleSetMaxHp = (participant: Participant, value: number) => {
    if (participant.hp && value >= 0) {
      mutateParticipants((current) =>
        current.map((p) => (p.uuid === participant.uuid ? { ...p, hp: value.toString() } : p)),
      );
    }
  };

  const handleUpdateInit = (participant: Participant, value: number) => {
    mutateParticipantsPreservingActive((current) =>
      current
        .map((p) => (p.uuid === participant.uuid ? { ...p, init: value } : p))
        .toSorted(sortParticipant),
    );
  };

  // Both inits must swap in a single mutation: two successive handleUpdateInit calls would
  // each re-sort and re-anchor from a stale snapshot of the list.
  const handleSwapInit = (a: Participant, b: Participant) => {
    mutateParticipantsPreservingActive((current) =>
      current
        .map((p) =>
          p.uuid === a.uuid
            ? { ...p, init: b.init }
            : p.uuid === b.uuid
              ? { ...p, init: a.init }
              : p,
        )
        .toSorted(sortParticipant),
    );
  };

  const handleChangeHp = (participant: Participant, amount: number, mode: "sub" | "add") => {
    if (isNaN(amount) || amount < 0) {
      return;
    }

    const currentHp = parseInt(participant.currentHp, 10) || 0;
    const maxHp = parseInt(participant.hp, 10);
    const newHp =
      mode === "sub"
        ? Math.max(currentHp - amount, 0)
        : // Heals are capped at max HP, like the direct currentHp input.
          Math.min(currentHp + amount, isNaN(maxHp) ? currentHp + amount : maxHp);
    mutateParticipants((current) =>
      current.map((p) => (p.uuid === participant.uuid ? { ...p, currentHp: newHp.toString() } : p)),
    );
  };

  // Toggle by title (not object reference): condition objects coming from a restored
  // snapshot or built inline are not the canonical `conditions` instances.
  const handleSetCondition = (participant: Participant, condition: Condition) => {
    mutateParticipants((current) =>
      current.map((p) => {
        if (p.uuid !== participant.uuid) {
          return p;
        }
        const newConditions = p.conditions?.some((c) => c.title === condition.title)
          ? p.conditions.filter((c) => c.title !== condition.title)
          : [...(p.conditions || []), condition];
        return { ...p, conditions: newConditions };
      }),
    );
  };

  // Free-text notes are upserted (one "Note" per participant): the toggle semantics of
  // handleSetCondition would remove the note instead of replacing it on a second edit.
  const handleSetNote = (participant: Participant, description: string) => {
    if (!description.trim()) {
      return;
    }
    mutateParticipants((current) =>
      current.map((p) =>
        p.uuid === participant.uuid
          ? {
              ...p,
              conditions: [
                ...(p.conditions || []).filter((c) => c.title !== "Note"),
                { title: "Note", description, icon: "custom" },
              ],
            }
          : p,
      ),
    );
  };

  const handleMarkAsActive = (participant: Participant) => {
    mutateParticipants((current) =>
      current.map((p) => (p.uuid === participant.uuid ? { ...p, inactive: false } : p)),
    );
  };

  // The active-turn highlight is index-based, so rows keep their original index into
  // listOfParticipants. Dead participants (0 HP) collapse into a "Morts" pile instead of
  // taking a full row; the divider entry renders the toggle inline between the two groups.
  const indexedParticipants = listOfParticipants.map((participant, index) => ({
    participant,
    index,
  }));
  const livingParticipants = indexedParticipants.filter(
    ({ participant }) => participant.currentHp !== "0",
  );
  const deadParticipants = indexedParticipants.filter(
    ({ participant }) => participant.currentHp === "0",
  );
  // "En vie" only counts enemies: players never die out of the tracker and the
  // environment row has no HP, so both would pad the number meaninglessly.
  const enemies = listOfParticipants.filter(
    (participant) => participant.isNPC && participant.id !== -99,
  );
  const livingEnemies = enemies.filter((participant) => participant.currentHp !== "0");

  const combatRows: Array<{ participant: Participant; index: number } | { divider: true }> = [
    ...livingParticipants,
    ...(deadParticipants.length > 0 ? [{ divider: true as const }] : []),
    ...(showDeadPile ? deadParticipants : []),
  ];

  const renderRow = (participant: Participant, index: number) => (
    <ParticipantRow
      key={participant.uuid}
      participant={participant}
      isActiveTurn={currentTurnIndex === index}
      otherPlayers={players.filter((p) => p.uuid !== participant.uuid)}
      spellAccess={
        playersWithSpells.includes(participant.name) && participant.id !== undefined ? (
          <SpellQuickAccess characterId={Number(participant.id)} characterName={participant.name} />
        ) : undefined
      }
      onUpdateInit={handleUpdateInit}
      onSwapInit={handleSwapInit}
      onRemove={handleRemoveParticipant}
      onMarkActive={handleMarkAsActive}
      onApplyHpDelta={handleChangeHp}
      onSetCurrentHp={handleSetCurrentHp}
      onSetMaxHp={handleSetMaxHp}
      onToggleCondition={handleSetCondition}
      onSetNote={handleSetNote}
    />
  );

  return (
    <Card className="overflow-hidden">
      {showInitiativePrompt && (
        <InitiativePrompt
          players={players}
          onSubmit={handleApplyInitiatives}
          onClose={() => setShowInitiativePrompt(false)}
        />
      )}

      <Collapsible open={showZoneImport} onOpenChange={setShowZoneImport}>
        <header className="border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {`Combat · ${livingEnemies.length}/${enemies.length} ennemis en vie`}
              </span>
              <span className="text-xl font-bold leading-tight">
                {hasCombatStarted ? (
                  <>
                    {"Tour "}
                    <span className="tabular-nums text-red-500">{`n°${turnsCounter}`}</span>
                  </>
                ) : (
                  "Prêt au combat"
                )}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {importableZones.length > 0 && (
                <CollapsibleTrigger asChild>
                  <Button
                    variant={showZoneImport ? "secondary" : "ghost"}
                    size="xs"
                    title="Importer les ennemis d'une autre zone"
                  >
                    <ChevronRight
                      className={clsx("size-3.5 transition-transform", {
                        "rotate-90": showZoneImport,
                      })}
                    />
                    <Swords className="size-4" />
                    Renforts
                    {anotherEncountersAdded.length > 0 && (
                      <span className="tabular-nums text-muted-foreground">
                        {anotherEncountersAdded.length}
                      </span>
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
              <Button
                variant={shouldShowAddParticipant ? "secondary" : "ghost"}
                size="xs"
                title="Ajouter un participant"
                onClick={() => setShouldShowAddParticipant((current) => !current)}
              >
                <UserPlusIcon className="size-4" />
              </Button>
              <Link target="_blank" href="/dm-tools">
                <Button variant="ghost" size="xs" title="Outils DM">
                  <SkullIcon className="size-4" />
                </Button>
              </Link>
              <Button size="sm" className="ml-1 gap-2" onClick={handleStartCombat}>
                {hasCombatStarted ? (
                  <>
                    <FastForwardIcon className="size-4" />
                    Suivant
                  </>
                ) : (
                  <>
                    <PlayIcon className="size-4" />
                    Lancer
                  </>
                )}
                <kbd className="rounded bg-white/25 px-1.5 py-px font-sans text-[10px] font-semibold">
                  espace
                </kbd>
              </Button>
            </div>
          </div>

          <CollapsibleContent className="flex flex-wrap gap-1.5 pt-3">
            {importableZones.map((zone) => {
              const isAdded = anotherEncountersAdded.includes(zone);
              return (
                <Button
                  key={zone}
                  size="xs"
                  variant={isAdded ? "secondary" : "outline"}
                  disabled={isAdded || loadingZone !== null}
                  onClick={() => {
                    handleAddAnotherEncounterParticipants(zone);
                  }}
                >
                  {loadingZone === zone && <Loader2 className="size-3.5 animate-spin" />}
                  {zone}
                </Button>
              );
            })}
          </CollapsibleContent>
        </header>
      </Collapsible>

      {snapshotToRestore && (
        <div className="flex items-center justify-between gap-3 border-b border-l-4 border-white/[0.06] border-l-amber-500 bg-amber-500/[0.07] px-3 py-2">
          <span className="text-sm">
            {`Combat sauvegardé à ${new Date(snapshotToRestore.savedAt).toLocaleTimeString(
              "fr-FR",
              { hour: "2-digit", minute: "2-digit" },
            )}${
              snapshotToRestore.currentTurnIndex !== null
                ? ` (tour n°${snapshotToRestore.turnsCounter})`
                : ""
            }.`}
          </span>
          <div className="flex shrink-0 gap-1.5">
            <Button size="xs" theme="amber" onClick={handleRestoreSnapshot}>
              <RefreshCcw />
              Reprendre
            </Button>
            <Button size="xs" variant="outline" onClick={handleDiscardSnapshot}>
              Recommencer
            </Button>
          </div>
        </div>
      )}

      {shouldShowAddParticipant && (
        <div
          className="flex items-end gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddParticipant();
            }
          }}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <label
              htmlFor="name"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
            >
              Nom
            </label>
            <Input
              type="text"
              id="name"
              className="h-8"
              value={participant.name}
              onChange={(e) => setParticipant({ ...participant, name: e.target.value })}
            />
          </div>
          <div className="flex w-16 shrink-0 flex-col gap-1">
            <label
              htmlFor="init"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
            >
              Init
            </label>
            <Input
              type="number"
              id="init"
              className="h-8"
              value={participant.init === DEFAULT_INIT ? "" : participant.init}
              onChange={(e) =>
                setParticipant({
                  ...participant,
                  init: e.target.value === "" ? DEFAULT_INIT : Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex w-20 shrink-0 flex-col gap-1">
            <label
              htmlFor="hp"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
            >
              PV
            </label>
            <Input
              type="number"
              id="hp"
              className="h-8"
              value={participant.hp}
              onChange={(e) => setParticipant({ ...participant, hp: e.target.value })}
            />
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <label
              htmlFor="color"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
            >
              Couleur
            </label>
            <Input
              type="color"
              id="color"
              className="h-8 w-10 cursor-pointer p-1"
              value={participant.color}
              onChange={(e) => setParticipant({ ...participant, color: e.target.value })}
            />
          </div>
          <Button
            size="xs"
            className="h-8"
            disabled={!participant.name}
            onClick={handleAddParticipant}
          >
            Ajouter
          </Button>
        </div>
      )}

      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto">
        <div className="divide-y divide-white/[0.05]">
          {combatRows.map((entry) => {
            if ("divider" in entry) {
              return (
                <button
                  key="dead-pile-toggle"
                  type="button"
                  onClick={() => setShowDeadPile((current) => !current)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-white/[0.03] hover:text-foreground"
                >
                  <ChevronRight
                    className={clsx("size-3.5 transition-transform", {
                      "rotate-90": showDeadPile,
                    })}
                  />
                  <SkullIcon className="size-3.5" />
                  {`Morts (${deadParticipants.length})`}
                  <span className="h-px flex-1 bg-white/10" />
                </button>
              );
            }
            return renderRow(entry.participant, entry.index);
          })}
        </div>
      </div>
    </Card>
  );
};

export default CombatModule;
