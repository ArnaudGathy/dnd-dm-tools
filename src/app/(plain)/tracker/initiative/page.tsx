"use client";

import {
  useParticipantsListTracker,
  useTurnsTracker,
} from "@/hooks/useParticipantsListTracker";
import InitiativeTrackerLoader from "@/app/(plain)/tracker/initiative/(initiative)/InitiativeTrackerLoader";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import PlayersList from "@/app/(plain)/tracker/initiative/(initiative)/PlayersList";

export default function InitiativeTracker() {
  const list = useParticipantsListTracker();
  const turnsTracker = useTurnsTracker();

  if (!list || !turnsTracker) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {!turnsTracker.hasStarted ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <InitiativeTrackerLoader />
        </motion.div>
      ) : (
        <motion.div
          key="tracker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeIn" }}
        >
          <PlayersList list={list} turnsTracker={turnsTracker} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
