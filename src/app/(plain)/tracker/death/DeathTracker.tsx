"use client";

import { useDeathTracker } from "@/hooks/useDeathTracker";
import Card from "@/app/(plain)/tracker/initiative/(initiative)/Card";
import { Heart, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function DeathTracker() {
  const { deaths } = useDeathTracker();

  if (!deaths?.length) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4">
      {deaths.map(({ characterName, success, failure }) => (
        <AnimatePresence mode="wait" key={characterName}>
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="flex"
          >
            <Card>
              <div className="flex flex-col p-1">
                <div className="mb-2 truncate text-center text-3xl font-bold">{characterName}</div>
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
            </Card>
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}
