import { Character, Classes } from "@prisma/client";
import { MONK_SPEED_IN_SQUARE, SPEED_BY_RACE_MAP } from "@/constants/maps";
import { convertFeetDistanceIntoSquares } from "@/utils/utils";

export const getClassSpeed = (character: Character) => {
  if (character.className === Classes.MONK) {
    return MONK_SPEED_IN_SQUARE[character.level];
  }
  return 0;
};

export const getMovementSpeed = (character: Character) => {
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
