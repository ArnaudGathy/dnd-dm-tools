import {
  RessourceName,
  UseRessource,
  useRessourceStorage,
} from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import {
  Book,
  Brain,
  BrainCircuit,
  Clover,
  CopyCheck,
  Cross,
  Crosshair,
  Drama,
  Eye,
  EyeOff,
  Flame,
  Gavel,
  GraduationCap,
  HandFist,
  HandHelping,
  Heart,
  HeartPlus,
  Mountain,
  PawPrint,
  RefreshCcw,
  RefreshCcwDot,
  Sparkles,
  Sprout,
  Star,
  Waves,
} from "lucide-react";
import { Classes, Races, Subclasses } from "@prisma/client";
import {
  CLERIC_CHANNEL_DIVINITY_PER_LEVEL,
  DRUID_WILD_SHAPE_PER_LEVEL,
  PROFICIENCY_BONUS_BY_LEVEL,
  RANGER_HUNTERS_MARK_PER_LEVEL,
  ROGUE_SOULKNIFE_PSI_DICES_PER_LEVEL,
} from "@/constants/maps";
import { getModifier } from "@/utils/utils";
import { filter, reduce, sortBy } from "remeda";
import { ReactNode } from "react";
import { CharacterById } from "@/lib/utils";

export type DisplayRessource = CommonRessource & {
  useRessource: UseRessource;
};

type CommonRessource = {
  name: string;
  icon: ReactNode;
  ressourceName: RessourceName;
};

type RessourceDefinition = CommonRessource & {
  condition?: boolean;
  total: number;
};

export default function useRessourceData({ character }: { character: CharacterById }) {
  const {
    ressources: { getSpecificRessource, longRest, shortRest, sortRessources },
    spellsSlots,
  } = useRessourceStorage(character);

  const general: RessourceDefinition[] = [
    {
      name: "Inspiration",
      icon: <Book />,
      ressourceName: "inspiration",
      total: character.race === Races.HUMAN ? 2 : 1,
    },
    {
      name: "Dés de vie",
      icon: <Heart />,
      ressourceName: "healthDices",
      total: character.level,
    },
  ];
  const feats: RessourceDefinition[] = [
    {
      name: "Chance",
      icon: <Clover />,
      ressourceName: "luckyFeat",
      total: PROFICIENCY_BONUS_BY_LEVEL[character.level],
      condition: character.capacities.some(
        ({ name }) =>
          name.toLowerCase().includes("lucky") || name.toLowerCase().includes("chanceux"),
      ),
    },
  ];

  const aasimar: RessourceDefinition[] = [
    {
      name: "Mains Guéri.",
      icon: <HandHelping />,
      ressourceName: "healingHands",
      total: 1,
      condition: character.race === Races.AASIMAR,
    },
    {
      name: "Révélation Cél.",
      icon: <Drama />,
      ressourceName: "celestialRevelation",
      total: 1,
      condition: character.race === Races.AASIMAR && character.level >= 3,
    },
  ];
  const goliath: RessourceDefinition[] = [
    {
      name: "Asc. Géants",
      icon: <Mountain />,
      ressourceName: "giantAncestry",
      total: PROFICIENCY_BONUS_BY_LEVEL[character.level],
      condition: character.race === Races.GOLIATH,
    },
  ];

  const sorcerer: RessourceDefinition[] = [
    {
      name: "Pts de Sorcell.",
      icon: <Sparkles />,
      ressourceName: "sorceryPoints",
      total: character.level,
      condition: character.className === Classes.SORCERER && character.level >= 2,
    },
    {
      name: "Sorcell. innée",
      icon: <Flame />,
      ressourceName: "innateSorcery",
      total: 2,
      condition: character.className === Classes.SORCERER,
    },
    {
      name: "Marée",
      icon: <Waves />,
      ressourceName: "tidesOfChaos",
      total: 1,
      condition:
        character.className === Classes.SORCERER &&
        character.subclassName === Subclasses.WILD_MAGIC &&
        character.level >= 3,
    },
    {
      name: "Bouffée",
      icon: <GraduationCap />,
      ressourceName: "tamedSurge",
      total: 1,
      condition:
        character.className === Classes.SORCERER &&
        character.subclassName === Subclasses.WILD_MAGIC &&
        character.level >= 18,
    },
  ];
  const rogue: RessourceDefinition[] = [
    {
      name: "Dés Psi",
      icon: <Brain />,
      ressourceName: "psiDices",
      total: ROGUE_SOULKNIFE_PSI_DICES_PER_LEVEL[character.level],
      condition:
        character.className === Classes.ROGUE &&
        character.subclassName === Subclasses.SOULKNIFE &&
        character.level >= 3,
    },
    {
      name: "Rupture spi.",
      icon: <BrainCircuit />,
      ressourceName: "spiritualRupture",
      total: 1,
      condition:
        character.className === Classes.ROGUE &&
        character.subclassName === Subclasses.SOULKNIFE &&
        character.level >= 17,
    },
    {
      name: "Coup de chance",
      icon: <Clover />,
      ressourceName: "luckyStrike",
      total: 1,
      condition: character.className === Classes.ROGUE && character.level === 20,
    },
  ];
  const ranger: RessourceDefinition[] = [
    {
      name: "Ennemi juré",
      icon: <Crosshair />,
      ressourceName: "huntersMark",
      total: RANGER_HUNTERS_MARK_PER_LEVEL[character.level],
      condition: character.className === Classes.RANGER,
    },
    {
      name: "Infatiguable",
      icon: <HeartPlus />,
      ressourceName: "tireless",
      total: Math.max(1, getModifier(character.wisdom)),
      condition: character.className === Classes.RANGER && character.level >= 10,
    },
    {
      name: "Voile Nature",
      icon: <EyeOff />,
      ressourceName: "naturesVeil",
      total: Math.max(1, getModifier(character.wisdom)),
      condition: character.className === Classes.RANGER && character.level >= 14,
    },
  ];
  const monk: RessourceDefinition[] = [
    {
      name: "Points de Credo",
      icon: <HandFist />,
      ressourceName: "focusPoints",
      total: character.level,
      condition: character.className === Classes.MONK,
    },
    {
      name: "Métabolisme",
      icon: <Sprout />,
      ressourceName: "uncannyMetabolism",
      total: 1,
      condition: character.className === Classes.MONK && character.level >= 2,
    },
    {
      name: "Déluge",
      icon: <HandHelping />,
      ressourceName: "flurryOfHealingAndHarm",
      total: Math.max(1, getModifier(character.wisdom)),
      condition:
        character.className === Classes.MONK &&
        character.subclassName === Subclasses.WAY_OF_MERCY &&
        character.level >= 11,
    },
    {
      name: "Ult. Miséri.",
      icon: <Cross />,
      ressourceName: "handOfUltimateMercy",
      total: 1,
      condition:
        character.className === Classes.MONK &&
        character.subclassName === Subclasses.WAY_OF_MERCY &&
        character.level >= 17,
    },
  ];
  const cleric: RessourceDefinition[] = [
    {
      name: "Cond. Divin",
      icon: <Cross />,
      ressourceName: "channelDivinity",
      total: CLERIC_CHANNEL_DIVINITY_PER_LEVEL[character.level],
      condition: character.className === Classes.CLERIC,
    },
    {
      name: "Prêtre de guerre",
      icon: <Gavel />,
      ressourceName: "warPriest",
      total: Math.max(1, getModifier(character.wisdom)),
      condition:
        character.className === Classes.CLERIC &&
        character.subclassName === Subclasses.WAR_DOMAIN &&
        character.level >= 3,
    },
    {
      name: "Inter. Divine",
      icon: <Sparkles />,
      ressourceName: "divineIntervention",
      total: 1,
      condition: character.className === Classes.CLERIC && character.level >= 10,
    },
  ];
  const wizard: RessourceDefinition[] = [
    {
      name: "Restauration",
      icon: <CopyCheck />,
      ressourceName: "magicRestoration",
      total: Math.ceil(character.level / 2),
      condition: character.className === Classes.WIZARD,
    },
  ];
  const druid: RessourceDefinition[] = [
    {
      name: "Forme sauvage",
      icon: <PawPrint />,
      ressourceName: "wildShape",
      total: DRUID_WILD_SHAPE_PER_LEVEL[character.level],
      condition: character.className === Classes.DRUID && character.level >= 2,
    },
    {
      name: "Regain sauvage",
      icon: <RefreshCcw />,
      ressourceName: "wildResurgence",
      total: 1,
      condition: character.className === Classes.DRUID && character.level >= 4,
    },
    {
      name: "Mage de nature",
      icon: <RefreshCcwDot />,
      ressourceName: "natureMagician",
      total: 1,
      condition: character.className === Classes.DRUID && character.level >= 20,
    },
    {
      name: "Carte Stellaire",
      icon: <Star />,
      ressourceName: "starMap",
      total: Math.max(1, getModifier(character.wisdom)),
      condition:
        character.className === Classes.DRUID &&
        character.subclassName === Subclasses.CIRCLE_OF_THE_STARS &&
        character.level >= 3,
    },
    {
      name: "Présage cosmique",
      icon: <Eye />,
      ressourceName: "cosmicOmen",
      total: Math.max(1, getModifier(character.wisdom)),
      condition:
        character.className === Classes.DRUID &&
        character.subclassName === Subclasses.CIRCLE_OF_THE_STARS &&
        character.level >= 6,
    },
  ];

  const buildRessourceArray = (ressources: RessourceDefinition[]) => {
    return reduce(
      ressources,
      (
        characterRessources: DisplayRessource[],
        { condition, total, ressourceName, icon, name },
        index,
      ) => {
        if (condition === undefined || condition) {
          const useRessource = getSpecificRessource({
            ressourceName,
            total,
            index,
          });
          return [...characterRessources, { name, icon, useRessource, ressourceName }];
        }
        return characterRessources;
      },
      [],
    );
  };

  const characterRessources = sortBy(
    buildRessourceArray([
      ...general,
      ...feats,
      ...aasimar,
      ...goliath,
      ...sorcerer,
      ...rogue,
      ...ranger,
      ...monk,
      ...cleric,
      ...wizard,
      ...druid,
    ]),
    ({ useRessource }) => useRessource[0].order,
  );

  const displayedRessources = filter(
    characterRessources,
    ({ useRessource }) => useRessource[0].isEnabled,
  );

  return {
    ressources: {
      longRest,
      shortRest,
      sortRessources,
      displayedRessources,
      characterRessources,
    },
    spellsSlots,
  };
}
