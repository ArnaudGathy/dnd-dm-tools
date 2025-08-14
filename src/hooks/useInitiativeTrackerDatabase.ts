import { database } from "@/lib/firebase/firebase";
import { onValue, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { Participant } from "@/types/types";

const dbRef = ref(database, "initiativeTracker");

export const useInitiativeTrackerDatabase = () => {
  const [initiativeTracker, setInitiativeTracker] =
    useState<Participant | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(dbRef, (snapshot) => {
      setInitiativeTracker(snapshot.val());
    });
    return () => unsubscribe();
  }, [setInitiativeTracker]);

  const setDBParticipants = useCallback((participants: Participant[]) => {
    const parti = participants.filter((participant) => !participant.isNPC);
    set(dbRef, parti);
  }, []);

  const setDBStartCombat = useCallback(() => {
    console.log("STARTO");
  }, []);

  return { setDBParticipants, setDBStartCombat };
};
