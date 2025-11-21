import { onValue, ref, set } from "firebase/database";
import { database } from "@/lib/firebase/firebase";
import { useCallback, useEffect, useState } from "react";

export type Death = { characterName: string; success: number; failure: number };

const deathRef = ref(database, "death");

export const useDeathTracker = () => {
  const [deathTracker, setDeathTracker] = useState<Death[] | null>(null);

  const setDeaths = useCallback((death: Death[]) => {
    void set(deathRef, death);
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(deathRef, (snapshot) => {
      setDeathTracker(snapshot.val());
    });
    return () => unsubscribe();
  }, [setDeathTracker]);

  return { deaths: deathTracker, setDeaths };
};
