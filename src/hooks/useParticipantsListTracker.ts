import { database } from "@/lib/firebase/firebase";
import { onValue, ref, set, update } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { Participant } from "@/types/types";

const participantsRef = ref(database, "participants");
export const useSetParticipantsListTracker = () => {
  const setParticipantsTracker = useCallback((participants: Participant[]) => {
    void set(participantsRef, participants);
  }, []);

  return { setParticipantsTracker };
};
export const useParticipantsListTracker = () => {
  const [initiativeTracker, setInitiativeTracker] = useState<Participant[] | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(participantsRef, (snapshot) => {
      setInitiativeTracker(snapshot.val());
    });
    return () => unsubscribe();
  }, [setInitiativeTracker]);

  return initiativeTracker;
};

const turnsRef = ref(database, "turns");
export type Turns = {
  activeParticipantIndex: number;
  numberOfTurns: number;
  hasStarted: boolean;
};
export const useSetTurnsTracker = () => {
  const setActiveParticipantTracker = useCallback(
    (activeParticipantIndex: Turns["activeParticipantIndex"]) => {
      void update(turnsRef, { activeParticipantIndex });
    },
    [],
  );

  const setNumberOfTurnsTracker = useCallback((numberOfTurns: Turns["numberOfTurns"]) => {
    void update(turnsRef, { numberOfTurns });
  }, []);

  const setHasStartedTracker = useCallback((hasStarted: Turns["hasStarted"]) => {
    void update(turnsRef, { hasStarted });
  }, []);

  return {
    setActiveParticipantTracker,
    setNumberOfTurnsTracker,
    setHasStartedTracker,
  };
};

export const useTurnsTracker = () => {
  const [turnsTracker, setTurnsTracker] = useState<Turns | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(turnsRef, (snapshot) => {
      setTurnsTracker(snapshot.val());
    });
    return () => unsubscribe();
  }, [setTurnsTracker]);

  return turnsTracker;
};
