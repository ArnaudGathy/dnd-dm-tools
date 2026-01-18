"use client";

import { useCharacterTracker } from "@/hooks/useCharacterTracker";
import PlayerInitiativeCard from "@/app/(plain)/tracker/initiative/(initiative)/PlayerInitiativeCard";
import { Heart, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function CharacterCombatTracker() {
  const { charactersData } = useCharacterTracker();

  if (!charactersData?.length) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4">
      {charactersData.map(
        ({ characterName, success, failure, currentHP, currentTempHP, maximumHP }) => {
          const hasStartedRollingDeath = failure > 0 || success > 0;
          return (
            <PlayerInitiativeCard key={characterName}>
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
                    <div className="my-2 flex w-full flex-col items-center justify-center">
                      <div className="text-xl">{`${currentHP}/${maximumHP} ${currentTempHP && currentTempHP > 0 ? `(+${currentTempHP})` : ""}`}</div>
                      <Progress
                        value={Math.round((currentHP / maximumHP) * 100)}
                        className="bg-neutral-300"
                        classNameTop="bg-rose-600"
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </PlayerInitiativeCard>
          );
        },
      )}
    </div>
  );
}
