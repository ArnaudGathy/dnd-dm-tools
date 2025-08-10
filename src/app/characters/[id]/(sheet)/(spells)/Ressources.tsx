"use client";

import RessourceTracker from "@/app/characters/[id]/(sheet)/(spells)/RessourceTracker";
import {
  Book,
  Brain,
  BrainCircuit,
  Clover,
  Cross,
  Crosshair,
  Drama,
  EyeOff,
  Flame,
  Gavel,
  GraduationCap,
  HandFist,
  HandHelping,
  Heart,
  HeartPlus,
  Mountain,
  Sparkles,
  Sprout,
  Waves,
} from "lucide-react";
import { CharacterById } from "@/lib/utils";
import {
  RessourceName,
  UseRessource,
  useRessourceStorage,
} from "@/app/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import { Classes, Races, Subclasses } from "@prisma/client";
import { ReactNode } from "react";
import SheetCard from "@/components/ui/SheetCard";
import {
  CLERIC_CHANNEL_DIVINITY_PER_LEVEL,
  PROFICIENCY_BONUS_BY_LEVEL,
  RANGER_HUNTERS_MARK_PER_LEVEL,
  ROGUE_SOULKNIFE_PSI_DICES_PER_LEVEL,
} from "@/constants/maps";
import RessourcesConfigMenu from "@/app/characters/[id]/(sheet)/(spells)/RessourcesConfigMenu";
import { getModifier } from "@/utils/utils";
import { filter, reduce, sortBy } from "remeda";
import dynamic from "next/dynamic";

type CommonRessource = {
  name: string;
  icon: ReactNode;
  ressourceName: RessourceName;
};

type RessourceDefinition = CommonRessource & {
  condition?: boolean;
  total: number;
};

export type DisplayRessource = CommonRessource & {
  useRessource: UseRessource;
};

function Ressources({ character }: { character: CharacterById }) {
  const { getSpecificRessource, longRest, shortRest, sortRessources } =
    useRessourceStorage(character.name);

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
          name.toLowerCase().includes("lucky") ||
          name.toLowerCase().includes("chanceux"),
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
      name: "Rév. Célest.",
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
      name: "Pts de Sorc.",
      icon: <Sparkles />,
      ressourceName: "sorceryPoints",
      total: character.level,
      condition:
        character.className === Classes.SORCERER && character.level >= 2,
    },
    {
      name: "Sorc. innée",
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
      condition:
        character.className === Classes.ROGUE && character.level === 20,
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
      condition:
        character.className === Classes.RANGER && character.level >= 10,
    },
    {
      name: "Voile Nature",
      icon: <EyeOff />,
      ressourceName: "naturesVeil",
      total: Math.max(1, getModifier(character.wisdom)),
      condition:
        character.className === Classes.RANGER && character.level >= 14,
    },
  ];
  const monk: RessourceDefinition[] = [
    {
      name: "Pts de Credo",
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
      condition:
        character.className === Classes.CLERIC && character.level >= 10,
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
          return [
            ...characterRessources,
            { name, icon, useRessource, ressourceName },
          ];
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
    ]),
    ({ useRessource }) => useRessource[0].order,
  );

  const displayedRessources = filter(
    characterRessources,
    ({ useRessource }) => useRessource[0].isEnabled,
  );

  return (
    <SheetCard>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">Ressources</span>
        <RessourcesConfigMenu
          ressources={characterRessources}
          shortRestAction={() => shortRest(character)}
          longRestAction={() => longRest(character)}
          sortRessourcesAction={sortRessources}
        />
      </div>
      {displayedRessources.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {displayedRessources.map(({ name, icon, useRessource }) => (
            <RessourceTracker
              key={name}
              name={name}
              icon={icon}
              useRessource={useRessource}
            />
          ))}
        </div>
      )}
    </SheetCard>
  );
}

export default dynamic(() => Promise.resolve(Ressources), { ssr: false });
