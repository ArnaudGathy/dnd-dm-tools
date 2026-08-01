import { useLocalStorage } from "react-use";
import { z } from "zod";
import { mapValues } from "remeda";
import { CharacterById } from "@/lib/utils";
import { Classes, Races } from "@prisma/client";
import { CLASS_SPELL_PROGRESSION_MAP } from "@/constants/maps";

const themes = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "neutral",
  "white",
] as const;
export type Themes = (typeof themes)[number];

const ressourceNames = [
  "sorceryPoints",
  "innateSorcery",
  "inspiration",
  "healthDices",
  "luckyFeat",
  "psiDices",
  "tidesOfChaos",
  "tamedSurge",
  "spiritualRupture",
  "luckyStrike",
  "huntersMark",
  "tireless",
  "naturesVeil",
  "focusPoints",
  "uncannyMetabolism",
  "flurryOfHealingAndHarm",
  "handOfUltimateMercy",
  "giantAncestry",
  "healingHands",
  "celestialRevelation",
  "channelDivinity",
  "divineIntervention",
  "warPriest",
  "magicRestoration",
  "wildShape",
  "wildResurgence",
  "natureMagician",
  "starMap",
  "cosmicOmen",
  "secondWind",
  "actionSurge",
  "unyielding",
  "superiorityDice",
  "observeEnemy",
  "layOfHands",
  "divineConduit",
  "draconicBreath",
  "draconicFlight",
  "bardicInspiration",
] as const;
export type RessourceName = (typeof ressourceNames)[number];

const ressourceSchema = z.object({
  total: z.number(),
  available: z.number(),
  theme: z.enum(themes),
  isEnabled: z.boolean(),
  order: z.number(),
});
export type Ressource = z.infer<typeof ressourceSchema>;
const ressourceStorageSchema = z.object({
  spellsSlots: z.record(z.number(), z.number()),
  ressources: z.record(z.enum(ressourceNames), ressourceSchema),
  // Spell ids whose free once-per-long-rest cast has been used since the last
  // long rest / slot reset (spells flagged `hasLongRestCast`).
  usedFreeCasts: z.array(z.string()).optional(),
  // Whether the sorcerer already spent his "Restauration" on a short rest since
  // the last long rest.
  usedSorceryRestoration: z.boolean().optional(),
});
export type RessourceStorage = z.infer<typeof ressourceStorageSchema>;

const initialRessource: Omit<Ressource, "theme"> = {
  total: -1,
  available: -1,
  isEnabled: true,
  order: 0,
};

const initialValues: RessourceStorage = {
  spellsSlots: {},
  ressources: {
    inspiration: {
      ...initialRessource,
      theme: "neutral",
      available: 0,
    },
    luckyFeat: { ...initialRessource, theme: "green" },
    healthDices: { ...initialRessource, theme: "red" },
    sorceryPoints: { ...initialRessource, theme: "fuchsia" },
    innateSorcery: {
      ...initialRessource,
      theme: "violet",
    },
    tidesOfChaos: {
      ...initialRessource,
      theme: "blue",
    },
    tamedSurge: {
      ...initialRessource,
      theme: "indigo",
    },
    psiDices: {
      ...initialRessource,
      theme: "fuchsia",
    },
    spiritualRupture: {
      ...initialRessource,
      theme: "indigo",
    },
    luckyStrike: {
      ...initialRessource,
      theme: "green",
    },
    huntersMark: {
      ...initialRessource,
      theme: "fuchsia",
    },
    tireless: {
      ...initialRessource,
      theme: "amber",
    },
    naturesVeil: {
      ...initialRessource,
      theme: "lime",
    },
    focusPoints: {
      ...initialRessource,
      theme: "white",
    },
    uncannyMetabolism: {
      ...initialRessource,
      theme: "green",
    },
    flurryOfHealingAndHarm: {
      ...initialRessource,
      theme: "purple",
    },
    handOfUltimateMercy: {
      ...initialRessource,
      theme: "yellow",
    },
    giantAncestry: {
      ...initialRessource,
      theme: "white",
    },
    healingHands: {
      ...initialRessource,
      theme: "white",
    },
    celestialRevelation: {
      ...initialRessource,
      theme: "fuchsia",
    },
    channelDivinity: {
      ...initialRessource,
      theme: "yellow",
    },
    divineIntervention: {
      ...initialRessource,
      theme: "amber",
    },
    warPriest: {
      ...initialRessource,
      theme: "indigo",
    },
    magicRestoration: {
      ...initialRessource,
      theme: "sky",
    },
    wildShape: {
      ...initialRessource,
      theme: "blue",
    },
    wildResurgence: {
      ...initialRessource,
      theme: "cyan",
    },
    natureMagician: {
      ...initialRessource,
      theme: "green",
    },
    starMap: {
      ...initialRessource,
      theme: "yellow",
    },
    cosmicOmen: {
      ...initialRessource,
      theme: "orange",
    },
    secondWind: {
      ...initialRessource,
      theme: "green",
    },
    actionSurge: {
      ...initialRessource,
      theme: "fuchsia",
    },
    unyielding: {
      ...initialRessource,
      theme: "blue",
    },
    superiorityDice: {
      ...initialRessource,
      theme: "orange",
    },
    observeEnemy: {
      ...initialRessource,
      theme: "teal",
    },
    layOfHands: {
      ...initialRessource,
      theme: "emerald",
    },
    divineConduit: {
      ...initialRessource,
      theme: "yellow",
    },
    draconicBreath: {
      ...initialRessource,
      theme: "orange",
    },
    draconicFlight: {
      ...initialRessource,
      theme: "sky",
    },
    bardicInspiration: {
      ...initialRessource,
      theme: "amber",
    },
  },
};

export type UseRessource = [Ressource, (ressource: Ressource) => void];

export const useRessourceStorage = (character: CharacterById) => {
  const baseSlots = CLASS_SPELL_PROGRESSION_MAP[character.className];
  const allSlots = baseSlots[character.level - 1];
  const parsedCharacterName = character.name.toLowerCase().replace(/ /g, "_");

  /** Which ressources a short rest gives back, and how much: "all" refills to
   *  the total, "one" hands back a single charge. Absent = long rest only.
   *  Derived from the character rather than stored, so level-gated rules stay
   *  correct as the character levels up. */
  const shortRestReset: Partial<Record<RessourceName, "all" | "one">> = {
    focusPoints: "all",
    warPriest: "all",
    superiorityDice: "all",
    /* Bardic inspiration only comes back on a short rest from level 5 */
    bardicInspiration: character.level >= 5 ? "all" : undefined,

    psiDices: "one",
    channelDivinity: "one",
    wildShape: "one",
    secondWind: "one",
    actionSurge: "one",
    divineConduit: "one",
  };

  const [store, setStore] = useLocalStorage<RessourceStorage>(`${parsedCharacterName}.ressources`, {
    ressources: {},
    spellsSlots: allSlots,
  });
  const ressources = store?.ressources;
  const spellSlots = store?.spellsSlots;

  /** Sorcerer "Restauration" : from level 5, one short rest per long rest gives
   *  back half the sorcerer level in sorcery points. The player picks which
   *  short rest, so it is offered as an option instead of applied every time. */
  const sorceryRestoration = {
    isAvailable:
      character.className === Classes.SORCERER &&
      character.level >= 5 &&
      !store?.usedSorceryRestoration,
    amount: Math.floor(character.level / 2),
  };

  const longRest = (character: CharacterById) => {
    // All ressources are maxed unless specified otherwise
    if (ressources) {
      const newRessources = mapValues(ressources, (value, key) => {
        let newAvailable = value.total;

        /* Human feat : "Ingénieux" */
        if (key === "inspiration") {
          newAvailable =
            character.race === Races.HUMAN ? Math.max(1, value.available) : value.available;
        }

        return {
          ...value,
          available: newAvailable,
        };
      });
      setStore({
        ...store,
        ressources: newRessources,
        spellsSlots: allSlots,
        usedFreeCasts: [],
        usedSorceryRestoration: false,
      });
    }
  };

  const shortRest = ({
    useSorceryRestoration = false,
  }: { useSorceryRestoration?: boolean } = {}) => {
    // Only the ressources listed in `shortRestReset` are reset
    if (ressources) {
      const restoresSorceryPoints = useSorceryRestoration && sorceryRestoration.isAvailable;

      const newResources = mapValues(ressources, (value, key) => {
        if (key === "sorceryPoints" && restoresSorceryPoints) {
          return {
            ...value,
            available: Math.min(value.available + sorceryRestoration.amount, value.total),
          };
        }

        const reset = shortRestReset[key];
        if (!reset) {
          return value;
        }

        return {
          ...value,
          available: reset === "all" ? value.total : Math.min(value.available + 1, value.total),
        };
      });

      setStore({
        ...store,
        ressources: newResources,
        usedSorceryRestoration: store?.usedSorceryRestoration || restoresSorceryPoints,
      });
    }
  };

  const sortRessources = (ressources: RessourceStorage["ressources"]) => {
    if (store) {
      setStore({ ...store, ressources });
    }
  };

  const getSpecificRessource = ({
    ressourceName,
    total,
    index,
  }: {
    ressourceName: RessourceName;
    total: number;
    index: number;
  }): UseRessource => {
    let ressource = ressources?.[ressourceName];
    if (!ressource && store) {
      const newRessource = initialValues.ressources[ressourceName];
      setStore({
        ...store,
        ressources: {
          ...ressources,
          [ressourceName]: newRessource,
        },
      });
      ressource = newRessource;
    }

    if (!ressource) {
      throw new Error(`Ressource ${ressourceName} not found for character ${character.name}`);
    }

    const setSpecificRessource = (ressource: Ressource) => {
      if (store) {
        setStore({
          ...store,
          ressources: {
            ...ressources,
            [ressourceName]: ressource,
          },
        });
      }
    };

    if (ressource.total === -1 || ressource.total !== total || ressource.available === -1) {
      setSpecificRessource({
        ...ressource,
        total: ressource.total === -1 || ressource.total !== total ? total : ressource.total,
        available: ressource.available === -1 ? total : ressource.available,
        order: index,
      });
    }

    return [ressource, setSpecificRessource];
  };

  const addSlot = (spellLevel: number) => {
    const maxSlots = allSlots[spellLevel];
    if (store) {
      setStore({
        ...store,
        spellsSlots: !spellSlots
          ? allSlots
          : {
              ...spellSlots,
              [spellLevel]: Math.min(maxSlots, spellSlots[spellLevel] + 1),
            },
      });
    }
  };

  const removeSlot = (spellLevel: number) => {
    if (store) {
      setStore({
        ...store,
        spellsSlots: !spellSlots
          ? allSlots
          : {
              ...spellSlots,
              [spellLevel]: Math.max(0, spellSlots[spellLevel] - 1),
            },
      });
    }
  };

  // Resetting the slots is a "daily magic reset" — free long-rest casts come back too.
  const resetSlots = () => {
    if (store) {
      setStore({ ...store, spellsSlots: allSlots, usedFreeCasts: [] });
    }
  };

  const usedFreeCasts = store?.usedFreeCasts ?? [];

  const spendFreeCast = (spellId: string) => {
    if (store && !usedFreeCasts.includes(spellId)) {
      setStore({ ...store, usedFreeCasts: [...usedFreeCasts, spellId] });
    }
  };

  const regainFreeCast = (spellId: string) => {
    if (store) {
      setStore({ ...store, usedFreeCasts: usedFreeCasts.filter((id) => id !== spellId) });
    }
  };

  return {
    ressources: {
      getSpecificRessource,
      longRest,
      shortRest,
      sortRessources,
      shortRestReset,
      sorceryRestoration,
    },
    spellsSlots: {
      addSlot,
      removeSlot,
      allSlots,
      baseSlots,
      spellSlots,
      resetSlots,
      usedFreeCasts,
      spendFreeCast,
      regainFreeCast,
    },
  };
};
