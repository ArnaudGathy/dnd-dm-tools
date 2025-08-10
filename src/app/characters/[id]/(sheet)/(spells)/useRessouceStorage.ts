import { useLocalStorage } from "react-use";
import { z } from "zod";
import { mapValues } from "remeda";
import { CharacterById } from "@/lib/utils";
import { Races } from "@prisma/client";

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
] as const;
export type RessourceName = (typeof ressourceNames)[number];

const ressourceSchema = z.object({
  total: z.number(),
  available: z.number(),
  theme: z.enum(themes),
  isEnabled: z.boolean(),
  order: z.number(),
  resetCount: z.number(),
});
export type Ressource = z.infer<typeof ressourceSchema>;
const ressourceStorageSchema = z.record(
  z.enum(ressourceNames),
  ressourceSchema,
);
export type RessourceStorage = z.infer<typeof ressourceStorageSchema>;

const initialRessource: Omit<Ressource, "theme"> = {
  total: -1,
  available: -1,
  isEnabled: true,
  resetCount: 0,
  order: 0,
};
const initialValues: RessourceStorage = {
  inspiration: {
    ...initialRessource,
    theme: "neutral",
    available: 0,
  },
  luckyFeat: { ...initialRessource, order: 1, theme: "green" },
  healthDices: { ...initialRessource, order: 2, theme: "red" },
  sorceryPoints: { ...initialRessource, order: 3, theme: "fuchsia" },
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
};

export type UseRessource = [Ressource, (ressource: Ressource) => void];

export const useRessourceStorage = (characterName: string) => {
  const parsedCharacterName = characterName.toLowerCase().replace(/ /g, "_");

  const [ressources, setRessources] = useLocalStorage<RessourceStorage>(
    `${parsedCharacterName}.ressources`,
    {},
  );

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
          resetCount: 0,
        };
      });
      setRessources(newRessources);
    }
  };

  const shortRest = (character: CharacterById) => {
    // Only specified ressources are reset
    if (ressources) {
      const newRessources = mapValues(ressources, (value, key) => {
        let available = value.available;
        let resetCount = value.resetCount;

        /* All per short rest */
        if (["focusPoints", "warPriest"].includes(key)) {
          available = value.total;
        }

        /* One per short rest */
        if (["psiDices", "channelDivinity"].includes(key)) {
          available = Math.min(value.available + 1, value.total);
        }

        /* Specific */
        const sorceryPointsResetAmount = Math.floor(character.level / 2);
        if (key === "sorceryPoints" && character.level >= 5 && resetCount < 1) {
          available = Math.min(
            sorceryPointsResetAmount + value.available,
            value.total,
          );
          resetCount = 1;
        }
        return {
          ...value,
          available,
          resetCount,
        };
      });
      setRessources(newRessources);
    }
  };

  const sortRessources = (ressources: RessourceStorage) => {
    setRessources(ressources);
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
    if (!ressource) {
      const newRessource = initialValues[ressourceName];
      setRessources({
        ...ressources,
        [ressourceName]: newRessource,
      });
      ressource = newRessource;
    }

    if (!ressource) {
      throw new Error(
        `Ressource ${ressourceName} not found for character ${characterName}`,
      );
    }

    const setSpecificRessource = (ressource: Ressource) => {
      setRessources({
        ...ressources,
        [ressourceName]: ressource,
      });
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

  return { getSpecificRessource, longRest, shortRest, sortRessources };
};
