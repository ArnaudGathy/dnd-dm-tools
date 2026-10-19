import { Armor, ArmorType, Character, Classes } from "@prisma/client";
import {
  BARBARIAN_FAST_MOVEMENT_LEVEL,
  BARBARIAN_SPEED_BONUS_IN_SQUARE,
  MONK_SPEED_IN_SQUARE,
  RANGER_ROVING_LEVEL,
  RANGER_SPEED_BONUS_IN_SQUARE,
  SPEED_BY_RACE_MAP,
} from "@/constants/maps";
import { convertFeetDistanceIntoSquares } from "@/utils/utils";

type CharacterWithArmors = Character & { armors: Armor[] };

export const getClassSpeed = (character: CharacterWithArmors) => {
  if (character.className === Classes.MONK) {
    return MONK_SPEED_IN_SQUARE[character.level];
  }
  if (character.className === Classes.RANGER && character.level >= RANGER_ROVING_LEVEL) {
    return RANGER_SPEED_BONUS_IN_SQUARE;
  }
  if (
    character.className === Classes.BARBARIAN &&
    character.level >= BARBARIAN_FAST_MOVEMENT_LEVEL &&
    !character.armors.some(({ isEquipped, type }) => isEquipped && type === ArmorType.HEAVY)
  ) {
    return BARBARIAN_SPEED_BONUS_IN_SQUARE;
  }
  return 0;
};

export const getMovementSpeed = (character: CharacterWithArmors) => {
  const raceSpeed = convertFeetDistanceIntoSquares(SPEED_BY_RACE_MAP[character.race]);
  const movementSpeedBonus = convertFeetDistanceIntoSquares(character.movementSpeedBonus);
  const classSpeed = getClassSpeed(character);

  return {
    raceSpeed,
    movementSpeedBonus,
    classSpeed,
    total: raceSpeed + movementSpeedBonus + classSpeed,
  };
};
