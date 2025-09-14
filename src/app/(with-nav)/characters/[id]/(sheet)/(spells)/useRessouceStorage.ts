import { useLocalStorage } from "react-use";
import { z } from "zod";
import { mapValues } from "remeda";
import { CharacterById } from "@/lib/utils";
import { Races } from "@prisma/client";
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
] as const;
export type RessourceName = (typeof ressourceNames)[number];

const ressourceSchema = z.object({
  total: z.number(),
  available: z.number(),
  theme: z.enum(themes),
  isEnabled: z.boolean(),
  order: z.number(),
  canShortRest: z.boolean(),
});
export type Ressource = z.infer<typeof ressourceSchema>;
const ressourceStorageSchema = z.object({
  spellsSlots: z.record(z.number(), z.number()),
  ressources: z.record(z.enum(ressourceNames), ressourceSchema),
});
export type RessourceStorage = z.infer<typeof ressourceStorageSchema>;

const initialRessource: Omit<Ressource, "theme"> = {
  total: -1,
  available: -1,
  isEnabled: true,
  order: 0,
  canShortRest: false,
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
      canShortRest: true,
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
      canShortRest: true,
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
      canShortRest: true,
    },
    divineIntervention: {
      ...initialRessource,
      theme: "amber",
    },
    warPriest: {
      ...initialRessource,
      theme: "indigo",
      canShortRest: true,
    },
    magicRestoration: {
      ...initialRessource,
      theme: "sky",
    },
    wildShape: {
      ...initialRessource,
      theme: "blue",
      canShortRest: true,
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
  },
};

export type UseRessource = [Ressource, (ressource: Ressource) => void];

export const useRessourceStorage = (character: CharacterById) => {
  const baseSlots = CLASS_SPELL_PROGRESSION_MAP[character.className];
  const allSlots = baseSlots[character.level - 1];
  const parsedCharacterName = character.name.toLowerCase().replace(/ /g, "_");

  const [store, setStore] = useLocalStorage<RessourceStorage>(
    `${parsedCharacterName}.ressources`,
    { ressources: {}, spellsSlots: allSlots },
  );
  const ressources = store?.ressources;
  const spellSlots = store?.spellsSlots;

  const longRest = (character: CharacterById) => {
    // All ressources are maxed unless specified otherwise
    if (ressources) {
      const newRessources = mapValues(ressources, (value, key) => {
        let newAvailable = value.total;

        /* Human feat : "Ingénieux" */
        if (key === "inspiration") {
          newAvailable =
            character.race === Races.HUMAN
              ? Math.max(1, value.available)
              : value.available;
        }

        return {
          ...value,
          available: newAvailable,
        };
      });
      setStore({ ...store, ressources: newRessources, spellsSlots: allSlots });
    }
  };

  const shortRest = () => {
    // Only specified ressources are reset
    if (ressources) {
      const newRessources = mapValues(ressources, (value, key) => {
        if (!value.canShortRest) {
          return value;
        }

        let available = value.available;

        /* All per short rest */
        if (["focusPoints", "warPriest"].includes(key)) {
          available = value.total;
        }

        /* One per short rest */
        if (["psiDices", "channelDivinity", "wildShape"].includes(key)) {
          available = Math.min(value.available + 1, value.total);
        }

        // const sorceryPointsResetAmount = Math.floor(character.level / 2);
        // if (key === "sorceryPoints" && character.level >= 5 && resetCount < 1) {
        //   available = Math.min(
        //     sorceryPointsResetAmount + value.available,
        //     value.total,
        //   );
        //   resetCount = 1;
        // }

        return {
          ...value,
          available,
        };
      });
      setStore({ ...store, ressources: newRessources });
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
      throw new Error(
        `Ressource ${ressourceName} not found for character ${character.name}`,
      );
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

    if (
      ressource.total === -1 ||
      ressource.total !== total ||
      ressource.available === -1
    ) {
      setSpecificRessource({
        ...ressource,
        total:
          ressource.total === -1 || ressource.total !== total
            ? total
            : ressource.total,
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

  const resetSlots = () => {
    if (store) {
      setStore({ ...store, spellsSlots: allSlots });
    }
  };

  return {
    ressources: { getSpecificRessource, longRest, shortRest, sortRessources },
    spellsSlots: {
      addSlot,
      removeSlot,
      allSlots,
      baseSlots,
      spellSlots,
      resetSlots,
    },
  };
};
