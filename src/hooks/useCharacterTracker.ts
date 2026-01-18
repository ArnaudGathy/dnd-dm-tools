import { onValue, ref, set } from "firebase/database";
import { database } from "@/lib/firebase/firebase";
import { useCallback, useEffect, useState } from "react";

export type CharacterTracking = {
  characterName: string;
  success: number;
  failure: number;
  currentHP: number;
  currentTempHP: number;
  maximumHP: number;
};

const character = ref(database, "character");

export const useCharacterTracker = () => {
  const [charactersData, setCharactersData] = useState<CharacterTracking[] | null>(null);

  const updateCharacters = useCallback((char: CharacterTracking[]) => {
    void set(character, char);
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(character, (snapshot) => {
      setCharactersData(snapshot.val());
    });
    return () => unsubscribe();
  }, [setCharactersData]);

  return { charactersData, setCharactersData: updateCharacters };
};
