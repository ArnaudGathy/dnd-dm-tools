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

export type DisplayRessource = {
  name: string;
  icon: ReactNode;
  condition?: boolean;
  useRessource: UseRessource;
};

export default function Ressources({
  character,
}: {
  character: CharacterById;
}) {
  const { getSpecificRessource, longRest, shortRest } = useRessourceStorage(
    character.name,
  );

  const general = [
    {
      name: "Inspiration",
      icon: <Book />,
      useRessource: getSpecificRessource({
        ressourceName: "inspiration",
        total: character.race === Races.HUMAN ? 2 : 1,
      }),
    },
    {
      name: "Dés de vie",
      icon: <Heart />,
      useRessource: getSpecificRessource({
        ressourceName: "healthDices",
        total: character.level,
      }),
    },
  ];
  const races = [
    {
      name: "Asc. Géants",
      icon: <Mountain />,
      useRessource: getSpecificRessource({
        ressourceName: "giantAncestry",
        total: PROFICIENCY_BONUS_BY_LEVEL[character.level],
      }),
      condition: character.race === Races.GOLIATH,
    },
    {
      name: "Mains Guéri.",
      icon: <HandHelping />,
      useRessource: getSpecificRessource({
        ressourceName: "healingHands",
        total: 1,
      }),
      condition: character.race === Races.AASIMAR,
    },
    {
      name: "Rév. Célest.",
      icon: <Drama />,
      useRessource: getSpecificRessource({
        ressourceName: "celestialRevelation",
        total: 1,
      }),
      condition: character.race === Races.AASIMAR && character.level >= 3,
    },
  ];
  const feats = [
    {
      name: "Chance",
      icon: <Clover />,
      useRessource: getSpecificRessource({
        ressourceName: "luckyFeat",
        total: PROFICIENCY_BONUS_BY_LEVEL[character.level],
      }),
      condition: character.capacities.some(
        ({ name }) =>
          name.toLowerCase().includes("lucky") ||
          name.toLowerCase().includes("chanceux"),
      ),
    },
  ];
  const sorcerer = [
    {
      name: "Pts de Sorc.",
      icon: <Sparkles />,
      useRessource: getSpecificRessource({
        ressourceName: "sorceryPoints",
        total: character.level,
      }),
      condition:
        character.className === Classes.SORCERER && character.level >= 2,
    },
    {
      name: "Sorc. innée",
      icon: <Flame />,
      useRessource: getSpecificRessource({
        ressourceName: "innateSorcery",
        total: 2,
      }),
      condition: character.className === Classes.SORCERER,
    },
    {
      name: "Marée",
      icon: <Waves />,
      useRessource: getSpecificRessource({
        ressourceName: "tidesOfChaos",
        total: 1,
      }),
      condition:
        character.className === Classes.SORCERER &&
        character.subclassName === Subclasses.WILD_MAGIC &&
        character.level >= 3,
    },
    {
      name: "Bouffée",
      icon: <GraduationCap />,
      useRessource: getSpecificRessource({
        ressourceName: "tamedSurge",
        total: 1,
      }),
      condition:
        character.className === Classes.SORCERER &&
        character.subclassName === Subclasses.WILD_MAGIC &&
        character.level >= 18,
    },
  ];
  const rogue = [
    {
      name: "Dés Psi",
      icon: <Brain />,
      useRessource: getSpecificRessource({
        ressourceName: "psiDices",
        total: ROGUE_SOULKNIFE_PSI_DICES_PER_LEVEL[character.level],
      }),
      condition:
        character.className === Classes.ROGUE &&
        character.subclassName === Subclasses.SOULKNIFE &&
        character.level >= 3,
    },
    {
      name: "Rupture spi.",
      icon: <BrainCircuit />,
      useRessource: getSpecificRessource({
        ressourceName: "spiritualRupture",
        total: 1,
      }),
      condition:
        character.className === Classes.ROGUE &&
        character.subclassName === Subclasses.SOULKNIFE &&
        character.level >= 17,
    },
    {
      name: "Coup de chance",
      icon: <Clover />,
      useRessource: getSpecificRessource({
        ressourceName: "luckyStrike",
        total: 1,
      }),
      condition:
        character.className === Classes.ROGUE && character.level === 20,
    },
  ];
  const ranger = [
    {
      name: "Ennemi juré",
      icon: <Crosshair />,
      useRessource: getSpecificRessource({
        ressourceName: "huntersMark",
        total: RANGER_HUNTERS_MARK_PER_LEVEL[character.level],
      }),
      condition: character.className === Classes.RANGER,
    },
    {
      name: "Infatiguable",
      icon: <HeartPlus />,
      useRessource: getSpecificRessource({
        ressourceName: "tireless",
        total: Math.max(1, getModifier(character.wisdom)),
      }),
      condition:
        character.className === Classes.RANGER && character.level >= 10,
    },
    {
      name: "Voile Nature",
      icon: <EyeOff />,
      useRessource: getSpecificRessource({
        ressourceName: "naturesVeil",
        total: Math.max(1, getModifier(character.wisdom)),
      }),
      condition:
        character.className === Classes.RANGER && character.level >= 14,
    },
  ];
  const monk = [
    {
      name: "Pts de Credo",
      icon: <HandFist />,
      useRessource: getSpecificRessource({
        ressourceName: "focusPoints",
        total: character.level,
      }),
      condition: character.className === Classes.MONK,
    },
    {
      name: "Métabolisme",
      icon: <Sprout />,
      useRessource: getSpecificRessource({
        ressourceName: "uncannyMetabolism",
        total: 1,
      }),
      condition: character.className === Classes.MONK && character.level >= 2,
    },
    {
      name: "Déluge",
      icon: <HandHelping />,
      useRessource: getSpecificRessource({
        ressourceName: "flurryOfHealingAndHarm",
        total: Math.max(1, getModifier(character.wisdom)),
      }),
      condition:
        character.className === Classes.MONK &&
        character.subclassName === Subclasses.WAY_OF_MERCY &&
        character.level >= 11,
    },
    {
      name: "Ult. Miséri.",
      icon: <Cross />,
      useRessource: getSpecificRessource({
        ressourceName: "handOfUltimateMercy",
        total: 1,
      }),
      condition:
        character.className === Classes.MONK &&
        character.subclassName === Subclasses.WAY_OF_MERCY &&
        character.level >= 17,
    },
  ];
  const cleric = [
    {
      name: "Cond. Divin",
      icon: <Cross />,
      useRessource: getSpecificRessource({
        ressourceName: "channelDivinity",
        total: CLERIC_CHANNEL_DIVINITY_PER_LEVEL[character.level],
      }),
      condition: character.className === Classes.CLERIC,
    },
    {
      name: "Prêtre de guerre",
      icon: <Gavel />,
      useRessource: getSpecificRessource({
        ressourceName: "warPriest",
        total: Math.max(1, getModifier(character.wisdom)),
      }),
      condition:
        character.className === Classes.CLERIC &&
        character.subclassName === Subclasses.WAR_DOMAIN &&
        character.level >= 2,
    },
    {
      name: "Inter. Divine",
      icon: <Sparkles />,
      useRessource: getSpecificRessource({
        ressourceName: "divineIntervention",
        total: 1,
      }),
      condition:
        character.className === Classes.CLERIC && character.level >= 10,
    },
  ];

  const characterRessources = [
    ...general,
    ...races,
    ...feats,
    ...sorcerer,
    ...rogue,
    ...ranger,
    ...monk,
    ...cleric,
  ].filter(
    (ressource: DisplayRessource) =>
      ressource.condition === undefined || ressource.condition,
  );

  const enabledRessources = characterRessources.filter(
    ({ useRessource }) => useRessource[0].isEnabled,
  );

  return (
    <SheetCard>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">Ressources</span>
        <RessourcesConfigMenu
          ressources={characterRessources}
          shortRest={() => shortRest(character)}
          longRest={() => longRest(character)}
        />
      </div>
      {enabledRessources.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {enabledRessources.map(({ name, icon, useRessource }) => (
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
