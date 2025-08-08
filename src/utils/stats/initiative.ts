import { Capacity, Character } from "@prisma/client";
import { addSignToNumber, getModifier } from "@/utils/utils";
import { PROFICIENCY_BONUS_BY_LEVEL } from "@/constants/maps";

export const getInitiativeModifier = (
  character: Character & { capacities: Capacity[] },
) => {
  const initiativeBonus = character.initiativeBonus;
  const dexterityModifier = getModifier(character.dexterity);

  const hasAlertFeat = !!character.capacities.find(
    ({ name }) =>
      name.toLowerCase().includes("vigilant") ||
      name.toLowerCase().includes("alert"),
  );
  const alertModifier = hasAlertFeat
    ? PROFICIENCY_BONUS_BY_LEVEL[character.level]
    : 0;

  return {
    initiativeBonus,
    dexterityModifier,
    alertModifier,
    total: addSignToNumber(initiativeBonus + dexterityModifier + alertModifier),
  };
};
