import {
  AbilityNameType,
  Condition,
  Creature,
  Encounter,
  EncounterEnemy,
  isEnemyObject,
  Participant,
  Skills,
} from "@/types/types";
import creatures from "@/data/creatures.json";
import encounters from "@/data/encounters.json";
import spells from "@/data/spells.json";
import { v4 as uuidv4 } from "uuid";
import { entries, groupBy, isPlainObject, prop, reduce } from "remeda";
import conditions from "@/data/conditions.json";
import { APISpell } from "@/types/schemas";
import { Group } from "@/hooks/useGroupFromCampaign";

export const typedCreatures: Creature[] = creatures;
export const typedEncounters: Encounter[] = encounters;
export const typedConditions: Condition[] = conditions;
export const typedLocalSpells: APISpell[] = spells;

export const commonCreatureColors = [
  "#ffffff",
  "#ff7f00",
  "#7fff00",
  "#00ffff",
  "#ffd700",
  "#653900",
  "#ee82ee",
];

export const groupEncounters = (encounters: Encounter[]) => {
  return reduce(
    entries(
      groupBy(
        encounters.toSorted((a, b) => {
          // Extract the number out of the mapMarker to avoid lexicographical sorting
          const numA = parseInt(a.location.mapMarker.slice(1), 10);
          const numB = parseInt(b.location.mapMarker.slice(1), 10);
          return numA - numB;
        }),
        prop("scenario"),
      ),
    ),
    (acc: { [key: string]: { [key: string]: Encounter[] } }, current) => {
      const [scenario, encounters] = current;
      if (encounters) {
        return {
          ...acc,
          [scenario]: groupBy(
            encounters,
            (encounter) => encounter.location.name,
          ),
        };
      }
      return acc;
    },
    {},
  );
};

export const translatedSenses = (sense: keyof Creature["senses"]) => {
  const translations = {
    darkvision: "Vision dans le noir",
    passivePerception: "Perception passive",
    blindSight: "Vision aveugle",
    trueSight: "Vision véritable",
  } satisfies Record<keyof Creature["senses"], string>;
  return translations[sense];
};

export const translateSkill = (skill: Skills) => {
  const translations = {
    acrobatics: "Acrobatie",
    animalHandling: "Dressage",
    arcana: "Arcanes",
    athletics: "Athlétisme",
    deception: "Tromperie",
    history: "Histoire",
    insight: "Perspicacité",
    intimidation: "Intimidation",
    investigation: "Investigation",
    medicine: "Médecine",
    nature: "Nature",
    perception: "Perception",
    performance: "Représentation",
    persuasion: "Persuasion",
    religion: "Religion",
    sleightOfHand: "Escamotage",
    stealth: "Discrétion",
    survival: "Survie",
  } satisfies Record<keyof Creature["skills"], string>;
  return translations[skill];
};

export const shortenAbilityName = (ability: string) => {
  return ability
    .replace("strength", "FOR")
    .replace("dexterity", "DEX")
    .replace("constitution", "CON")
    .replace("intelligence", "INT")
    .replace("wisdom", "SAG")
    .replace("charisma", "CHA");
};

export const translateShortenedAbilityName = (ability: string) => {
  return ability
    .replace("str", "FOR")
    .replace("dex", "DEX")
    .replace("con", "CON")
    .replace("int", "INT")
    .replace("wis", "SAG")
    .replace("cha", "CHA");
};

export const getHPAsString = (creature: Creature) => {
  return creature.hitPoints.split("(")[0].trim();
};

export const convertFromFeetToSquares = (distance: string) => {
  // match "feet" or "mile"
  if (!distance.match(/feet|mile/)) {
    return distance;
  }
  return `${getDistanceInSquaresFromUSUnits(distance)} cases`;
};

export const getDistanceInSquares = (distance: string) => {
  if (!distance.match(/m/)) {
    throw new Error("Invalid distance. Speed must be in meters.");
  }
  return parseFloat(distance.split(" m")[0]) / 1.5;
};

export const getDistanceInSquaresFromUSUnits = (distance: string) => {
  if (distance.match(/feet/)) {
    return convertFeetDistanceIntoSquares(
      parseFloat(distance.split(" feet")[0]),
    );
  }
  if (distance.match(/mile/)) {
    return (parseFloat(distance.split(" mile")[0]) * 5280) / 5;
  }
  throw new Error("Invalid distance. Speed must be in feet or mile");
};

export const convertFeetDistanceIntoSquares = (distance: number) => {
  return distance / 5;
};

export const replaceMetersWithSquares = (input: string) => {
  return input.replace(/\b\d+(\.\d+)?\b(?:\s*m)?/g, (match) => {
    const number = parseFloat(match);
    const replacedNumber = (number / 1.5).toString();
    if (match.includes("m")) {
      return replacedNumber + " cases";
    }
    return replacedNumber;
  });
};

export const getModifier = (ability: number) => {
  return Math.floor((ability - 10) / 2);
};

export const addSignToNumber = (number: number) => {
  if (number > 0) {
    return `+${number}`;
  }
  return number;
};

export const getModifierFromCreature = (
  creature: Creature,
  characteristic: AbilityNameType,
) => {
  return getModifier(creature.abilities[characteristic]);
};

export const roll = (value: number) => {
  return Math.floor(Math.random() * value) + 1;
};

export const getInitiative = (creature: Creature) => {
  return (roll(20) + getModifierFromCreature(creature, "dexterity")).toString();
};

export const getParticipantFromCharacters = (group: Group) => {
  return group.map(({ name, id }) => ({
    id,
    name,
    init: "",
    hp: "",
    currentHp: "",
    uuid: uuidv4(),
    isNPC: false,
  }));
};

export const getEncounterFromId = (encounterId: string) => {
  const encId = parseInt(encounterId, 10);
  const encounter = typedEncounters.find(({ id }) => id === encId);

  if (!encounter) {
    return null;
  }

  return encounter;
};

export const getCreatureFromId = (creatureId: number) => {
  return typedCreatures.find((creature) => creature.id === creatureId);
};

const findClosestIndex = (partyLevels: string[], partylevel: string) => {
  const target = parseFloat(partylevel);
  return partyLevels.reduce((closestIndex, level, index) => {
    const levelNumber = parseFloat(level);
    const closestLevelNumber = parseFloat(partyLevels[closestIndex]);
    return Math.abs(levelNumber - target) <
      Math.abs(closestLevelNumber - target)
      ? index
      : closestIndex;
  }, 0);
};

export const getEnnemiesFromEncounter = ({
  encounter,
  partyLevel,
}: {
  encounter: Encounter;
  partyLevel: string;
}) => {
  const ennemiesList = encounter.ennemies;
  const closestIndex = findClosestIndex(Object.keys(ennemiesList), partyLevel);
  return Object.values(ennemiesList)[closestIndex] ?? [];
};

export const getCreaturesFromIds = (creatureIds: number[]) => {
  const creaturesList = creatureIds.reduce((acc: Creature[], id) => {
    const creature = typedCreatures.find((creature) => creature.id === id);
    if (creature) {
      return [...acc, creature];
    }
    return acc;
  }, []);

  if (creaturesList.length === 0) {
    return null;
  }

  return creaturesList;
};

const getCreatureColor = (
  creature: Creature,
  index: number,
  currentColorIndex: { [key: number]: number },
) => {
  if (creature.colors) {
    const newColorIndex =
      currentColorIndex[creature.id] !== undefined
        ? currentColorIndex[creature.id] + 1
        : 0;
    currentColorIndex[creature.id] = newColorIndex;

    return creature.colors[newColorIndex];
  }

  return index > commonCreatureColors.length - 1
    ? "#000000"
    : commonCreatureColors[index];
};

export const getParticipantFromEncounter = ({
  encounter,
  partyLevel,
}: {
  encounter: Encounter;
  partyLevel: string;
}) => {
  const ennemiesIds = getEnnemiesFromEncounter({ encounter, partyLevel });

  const currentColorIndex: { [key: number]: number } = {};
  return ennemiesIds.reduce((acc: Participant[], enemy, index) => {
    const enemyId = getIdFromEnemy(enemy);
    const creature = typedCreatures.find((creature) => creature.id === enemyId);
    const shouldSkip =
      isEnemyObject(enemy) && enemy.shouldHideInInitiativeTracker;

    if (creature && !shouldSkip) {
      const hp = getHPAsString(creature);

      return [
        ...acc,
        {
          id: creature.id,
          name:
            isEnemyObject(enemy) && enemy.variant
              ? `${creature.name} (${enemy.variant})`
              : creature.name,
          init: getInitiative(creature),
          hp,
          currentHp: hp,
          color:
            isEnemyObject(enemy) && enemy.color
              ? enemy.color
              : getCreatureColor(creature, index, currentColorIndex),
          uuid: uuidv4(),
          isNPC: true,
        },
      ];
    }
    return acc;
  }, []);
};

export const getChallengeRatingAsFraction = (
  number: number,
  tolerance = 1e-10,
) => {
  if (Number.isInteger(number)) {
    return number.toString();
  }

  let numerator = 1;
  let denominator = 1;
  let fraction = numerator / denominator;

  while (Math.abs(fraction - number) > tolerance) {
    if (fraction < number) {
      numerator++;
    } else {
      denominator++;
      numerator = Math.round(number * denominator);
    }
    fraction = numerator / denominator;
  }

  return `${numerator}/${denominator}`;
};

export const getYoutubeUrlFromId = (id: string) => {
  return `https://www.youtube.com/embed/${id}?loop=1&playlist=${id}`;
};

export const getIdFromEnemy = (enemy: EncounterEnemy) => {
  if (isPlainObject(enemy)) {
    return enemy.id;
  }
  return enemy;
};
