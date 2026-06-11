"use client";

import { useCharacterTracker } from "@/hooks/useCharacterTracker";
import { useParticipantsListTracker, useTurnsTracker } from "@/hooks/useParticipantsListTracker";
import PlayerInitiativeCard from "@/app/(plain)/tracker/character/PlayerInitiativeCard";
import CombatHPBar from "@/app/(plain)/tracker/character/CombatHPBar";
import { Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import styles from "@/app/(plain)/tracker/character/page.module.css";

// Same subtle top-light treatment as the HP bar's shine strip
const pillDepth = "shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]";
const emptyPill = "bg-stone-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]";

function DeathSaves({
  name,
  success,
  failure,
}: {
  name: string;
  success: number;
  failure: number;
}) {
  // One failed save away from death — sound the alarm
  const isCritical = failure >= 2;

  return (
    <div className="flex h-full items-center justify-between gap-2 px-3">
      <span
        className={cn(
          styles.display,
          "truncate text-xl text-stone-100",
          "[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]",
        )}
      >
        {name}
      </span>
      {/* Solid color pills read better at TV distance than icons: green = successes, red = failures */}
      <div className="flex shrink-0 flex-col gap-1.5">
        <div className="flex gap-1">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-3.5 w-9 rounded-sm transition duration-1000",
                index >= success
                  ? emptyPill
                  : cn("bg-gradient-to-b from-green-500 to-green-800", pillDepth),
              )}
            />
          ))}
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-3.5 w-9 rounded-sm transition duration-1000",
                index >= failure
                  ? emptyPill
                  : cn("bg-gradient-to-b from-red-500 to-red-800", pillDepth, {
                      [styles.deathPulse]: isCritical,
                    }),
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CharacterCombatTracker() {
  const { charactersData } = useCharacterTracker();
  const participantsList = useParticipantsListTracker();
  const turnsTracker = useTurnsTracker();

  // Sort characters by their position in the participants list (initiative order)
  const sortedCharacters = useMemo(() => {
    if (!charactersData?.length || !participantsList?.length) {
      return charactersData ?? [];
    }

    return [...charactersData].sort((a, b) => {
      const indexA = participantsList.findIndex((p) => p.name === a.characterName);
      const indexB = participantsList.findIndex((p) => p.name === b.characterName);
      // Characters not found in the participants list go to the end
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });
  }, [charactersData, participantsList]);

  // Determine if it's an NPC turn and which character is active
  const { isNPCTurn, activeCharacterName } = useMemo(() => {
    if (!participantsList?.length || !turnsTracker?.hasStarted) {
      return { isNPCTurn: false, activeCharacterName: null };
    }

    const activeParticipant = participantsList[turnsTracker.activeParticipantIndex];
    const isNPC = activeParticipant?.isNPC ?? false;

    return {
      isNPCTurn: isNPC,
      activeCharacterName: isNPC ? null : (activeParticipant?.name ?? null),
    };
  }, [participantsList, turnsTracker]);

  return (
    <AnimatePresence mode="wait">
      {turnsTracker?.hasStarted && sortedCharacters.length ? (
        <motion.div
          key="tracker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="flex w-full items-center justify-center gap-3 p-2"
        >
          {/* Enemy turn banner — slides in inline so the tracker stays one row tall */}
          <AnimatePresence>
            {isNPCTurn ? (
              <motion.div
                key="npc-banner"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="shrink-0 overflow-hidden"
              >
                <div className="flex h-14 items-center gap-3 whitespace-nowrap rounded-lg border-2 border-red-800 bg-zinc-900 px-5">
                  <Swords className="size-7 shrink-0 text-red-500" />
                  <span className={cn(styles.display, "text-xl text-red-500")}>
                    {`Tour de l'ennemi`}
                  </span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {sortedCharacters.map(
            ({ characterName, success, failure, currentHP, currentTempHP, maximumHP }) => {
              const hasStartedRollingDeath = currentHP <= 0;
              const isActive = characterName === activeCharacterName;

              return (
                <PlayerInitiativeCard key={characterName} isActive={isActive} isNPCTurn={isNPCTurn}>
                  <AnimatePresence mode="wait">
                    {hasStartedRollingDeath ? (
                      <motion.div
                        key="death-saves"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="h-full w-full"
                      >
                        <DeathSaves name={characterName} success={success} failure={failure} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="hp-bar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="h-full w-full"
                      >
                        <CombatHPBar
                          name={characterName}
                          currentHP={currentHP}
                          maximumHP={maximumHP}
                          currentTempHP={currentTempHP}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </PlayerInitiativeCard>
              );
            },
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
