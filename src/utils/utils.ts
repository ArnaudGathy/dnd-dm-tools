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
import encounters from "@/data/encounters.json";
import { v4 as uuidv4 } from "uuid";
import {
  entries,
  groupBy,
  isNumber,
  isPlainObject,
  map,
  prop,
  reduce,
  values,
} from "remeda";
import conditions from "@/data/conditions.json";
import { Group } from "@/hooks/useGroupFromCampaign";
import { getCreature } from "@/lib/external-apis/aidedd";
import { Classes } from "@prisma/client";

export const typedEncounters: Encounter[] = encounters;
export const typedConditions: Condition[] = conditions;

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

export const getEncounterFromLocation = (location: Encounter["location"]) => {
  const encounter = typedEncounters.find(
    ({ location: { name, mapMarker } }) =>
      name === location.name && mapMarker === location.mapMarker,
  );

  if (!encounter) {
    return null;
  }

  return encounter;
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
  const ennemiesList = encounter.ennemies ?? [];
  const closestIndex = findClosestIndex(Object.keys(ennemiesList), partyLevel);
  return values(ennemiesList)[closestIndex] ?? [];
};

const getCreatureColor = (
  creature: Creature,
  index: number,
  currentColorIndex: { [key: number]: number },
) => {
  if (creature.colors && isNumber(creature.id)) {
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

export const getCreatures = async (encounter: Encounter) => {
  const enemiesIds = map(
    getEnnemiesFromEncounter({ encounter, partyLevel: "1" }),
    (enemy) => getIdFromEnemy(enemy),
  );

  return Promise.all(enemiesIds.map((name) => getCreature(name)));
};

export const getParticipantFromEncounter = ({
  creatures,
  encounter,
}: {
  creatures: Creature[];
  encounter: Encounter;
}) => {
  const currentColorIndex: { [key: number]: number } = {};
  return creatures.reduce((acc: Participant[], creature, index) => {
    const enemyData = encounter?.ennemies?.["1"]?.[index];
    const shouldSkip =
      isEnemyObject(enemyData) && enemyData.shouldHideInInitiativeTracker;

    if (creature && !shouldSkip) {
      const hp = getHPAsString(creature);

      return [
        ...acc,
        {
          id: creature.id,
          name:
            isEnemyObject(enemyData) && enemyData.variant
              ? `${creature.name} (${enemyData.variant})`
              : creature.name,
          init: getInitiative(creature),
          hp,
          currentHp: hp,
          color:
            isEnemyObject(enemyData) && enemyData.color
              ? enemyData.color
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
  if (Number.isInteger(number) || number === 0) {
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

export const hasCreatures = (className: Classes) => {
  return (
    className === Classes.WIZARD ||
    className === Classes.DRUID ||
    className === Classes.RANGER
  );
};

export const kebabCaseify = (input: string) => {
  return input
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, "") // Trim leading/trailing dashes
    .replace(/--+/g, "-") // Replace multiple dashes with a single one
    .toLowerCase(); // Convert to lowercase
};
