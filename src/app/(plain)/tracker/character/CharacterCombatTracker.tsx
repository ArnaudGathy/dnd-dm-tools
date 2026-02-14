"use client";

import { useCharacterTracker } from "@/hooks/useCharacterTracker";
import { useParticipantsListTracker, useTurnsTracker } from "@/hooks/useParticipantsListTracker";
import PlayerInitiativeCard from "@/app/(plain)/tracker/character/PlayerInitiativeCard";
import { Heart, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import CombatHPBar from "@/app/(plain)/tracker/character/CombatHPBar";
import { useMemo } from "react";
import styles from "@/app/(plain)/tracker/character/page.module.css";

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
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="flex w-full flex-col items-center justify-center pt-2"
        >
          <div
            className={cn(
              styles.container,
              "duration-[1s] flex w-fit justify-center rounded-xl bg-blue px-4 py-1 opacity-0 transition",
              {
                "opacity-100": isNPCTurn,
              },
            )}
          >
            <span className={cn(styles.antiqua, "text-4xl text-neutral-700")}>
              {`Tour de l'ennemi`}
            </span>
          </div>
          <motion.div className="flex justify-center gap-4 p-2">
            {sortedCharacters.map(
              ({ characterName, success, failure, currentHP, currentTempHP, maximumHP }) => {
                const hasStartedRollingDeath = currentHP <= 0;
                const isActive = characterName === activeCharacterName;

                return (
                  <PlayerInitiativeCard
                    key={characterName}
                    isActive={isActive}
                    isNPCTurn={isNPCTurn}
                  >
                    <div className="flex w-full flex-col p-1">
                      <div className="truncate text-center text-3xl font-bold">{characterName}</div>
                      <AnimatePresence mode="wait">
                        {hasStartedRollingDeath ? (
                          <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="flex justify-center"
                          >
                            <div className="mt-2">
                              <div className="flex gap-1">
                                {[...Array(3)].map((_, index) => (
                                  <Heart
                                    key={index}
                                    className={cn(
                                      "size-10 stroke-cyan-700 stroke-[2.5px] transition duration-1000",
                                      {
                                        "stroke-stone-600/20": index >= success,
                                      },
                                    )}
                                  />
                                ))}
                              </div>
                              <div className="flex gap-1">
                                {[...Array(3)].map((_, index) => (
                                  <Skull
                                    key={index}
                                    className={cn(
                                      "size-10 stroke-red-700 stroke-[2.5px] transition duration-1000",
                                      {
                                        "stroke-stone-600/20": index >= failure,
                                      },
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <CombatHPBar
                            currentHP={currentHP}
                            maximumHP={maximumHP}
                            currentTempHP={currentTempHP}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </PlayerInitiativeCard>
                );
              },
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
