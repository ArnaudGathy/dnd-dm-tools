import { useCallback, useSyncExternalStore } from "react";
import { Character } from "@prisma/client";
import { canRage } from "@/utils/stats/rage";

// Same-tab writes don't fire "storage", so notify the other readers ourselves.
const RAGE_CHANGE_EVENT = "rage-status-change";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(RAGE_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(RAGE_CHANGE_EVENT, onChange);
  };
};

const readFlag = (key: string) => {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

/**
 * Barbarian Rage on/off, stored per device in localStorage. Every component
 * using it stays in sync (weapons, skills, HUD toggle). Server render and
 * non-barbarians always read `false`.
 */
export const useRageStatus = (character: Pick<Character, "name" | "className">) => {
  const key = `${character.name.toLowerCase().replace(/ /g, "_")}.rage`;
  const isStored = useSyncExternalStore(
    subscribe,
    () => readFlag(key),
    () => false,
  );

  const setIsRaging = useCallback(
    (isRaging: boolean) => {
      try {
        localStorage.setItem(key, String(isRaging));
      } catch {
        // Storage blocked (private mode…): the toggle just won't stick.
      }
      window.dispatchEvent(new Event(RAGE_CHANGE_EVENT));
    },
    [key],
  );

  return [canRage(character) && isStored, setIsRaging] as const;
};
