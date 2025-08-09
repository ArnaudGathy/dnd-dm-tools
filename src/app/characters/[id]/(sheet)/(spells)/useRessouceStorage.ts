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
type Ressource = z.infer<typeof ressourceSchema>;
const ressourceStorageSchema = z.record(
  z.enum(ressourceNames),
  ressourceSchema,
);
type RessourceStorage = z.infer<typeof ressourceStorageSchema>;

const initialRessource: Omit<Ressource, "order" | "theme"> = {
  total: -1,
  available: -1,
  isEnabled: true,
  resetCount: 0,
};
const initialValues: RessourceStorage = {
  inspiration: {
    ...initialRessource,
    order: 0,
    theme: "neutral",
    available: 0,
  },
  luckyFeat: { ...initialRessource, order: 1, theme: "green" },
  healthDices: { ...initialRessource, order: 2, theme: "red" },
  sorceryPoints: { ...initialRessource, order: 3, theme: "fuchsia" },
  innateSorcery: {
    ...initialRessource,
    order: 4,
    theme: "violet",
  },
  tidesOfChaos: {
    ...initialRessource,
    order: 5,
    theme: "blue",
  },
  tamedSurge: {
    ...initialRessource,
    order: 6,
    theme: "indigo",
  },
  psiDices: {
    ...initialRessource,
    order: 7,
    theme: "fuchsia",
  },
  spiritualRupture: {
    ...initialRessource,
    order: 8,
    theme: "indigo",
  },
  luckyStrike: {
    ...initialRessource,
    order: 9,
    theme: "green",
  },
  huntersMark: {
    ...initialRessource,
    order: 10,
    theme: "fuchsia",
  },
  tireless: {
    ...initialRessource,
    order: 11,
    theme: "amber",
  },
  naturesVeil: {
    ...initialRessource,
    order: 12,
    theme: "lime",
  },
  focusPoints: {
    ...initialRessource,
    order: 13,
    theme: "white",
  },
  uncannyMetabolism: {
    ...initialRessource,
    order: 14,
    theme: "green",
  },
  flurryOfHealingAndHarm: {
    ...initialRessource,
    order: 15,
    theme: "purple",
  },
  handOfUltimateMercy: {
    ...initialRessource,
    order: 16,
    theme: "yellow",
  },
  giantAncestry: {
    ...initialRessource,
    order: 17,
    theme: "white",
  },
  healingHands: {
    ...initialRessource,
    order: 18,
    theme: "white",
  },
  celestialRevelation: {
    ...initialRessource,
    order: 19,
    theme: "fuchsia",
  },
  channelDivinity: {
    ...initialRessource,
    order: 20,
    theme: "yellow",
  },
  divineIntervention: {
    ...initialRessource,
    order: 21,
    theme: "amber",
  },
  warPriest: {
    ...initialRessource,
    order: 22,
    theme: "indigo",
  },
};

export type UseRessource = [Ressource, (ressource: Ressource) => void];

export const useRessourceStorage = (characterName: string) => {
  const parsedCharacterName = characterName.toLowerCase().replace(/ /g, "_");

  const [ressources, setRessources] = useLocalStorage<RessourceStorage>(
    `${parsedCharacterName}.ressources`,
    initialValues,
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

  const getSpecificRessource = ({
    ressourceName,
    total,
  }: {
    ressourceName: RessourceName;
    total: number;
  }): UseRessource => {
    if (!ressources?.[ressourceName]) {
      setRessources({
        ...ressources,
        [ressourceName]: initialValues[ressourceName],
      });
    }

    if (!ressources?.[ressourceName]) {
      throw new Error(
        `Ressource ${ressourceName} not found for character ${characterName}`,
      );
    }

    const specificRessource = ressources[ressourceName];
    const setSpecificRessource = (ressource: Ressource) => {
      setRessources({
        ...ressources,
        [ressourceName]: ressource,
      });
    };

    if (
      specificRessource.total === -1 ||
      specificRessource.total !== total ||
      specificRessource.available === -1
    ) {
      setSpecificRessource({
        ...specificRessource,
        total:
          specificRessource.total === -1 || specificRessource.total !== total
            ? total
            : specificRessource.total,
        available:
          specificRessource.available === -1
            ? total
            : specificRessource.available,
      });
    }

    return [specificRessource, setSpecificRessource];
  };

  return { getSpecificRessource, longRest, shortRest };
};
