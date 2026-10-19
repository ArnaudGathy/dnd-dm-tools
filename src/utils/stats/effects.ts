import { Character, Classes, MagicItem } from "@prisma/client";
import {
  BARBARIAN_PRIMAL_CHAMPION_LEVEL,
  BARBARIAN_PRIMAL_CHAMPION_BONUS,
  BARBARIAN_PRIMAL_CHAMPION_MAX,
} from "@/constants/maps";
import { applyMagicItemEffects } from "@/utils/items";

/**
 * Returns the character with ability scores raised by class features
 * (e.g. Barbarian level 20 Primal Champion → FOR +4, max 25).
 * Never persist the result.
 */
export const applyClassFeatureEffects = <T extends Character>(character: T): T => {
  const hasPrimalChampion =
    character.className === Classes.BARBARIAN && character.level >= BARBARIAN_PRIMAL_CHAMPION_LEVEL;

  return {
    ...character,
    strength: hasPrimalChampion
      ? Math.min(
          character.strength + BARBARIAN_PRIMAL_CHAMPION_BONUS,
          Math.max(character.strength, BARBARIAN_PRIMAL_CHAMPION_MAX),
        )
      : character.strength,
  };
};

/**
 * Class features first, then magic items, so every derived stat sees the effective scores.
 * Apply right after loading; never persist the result.
 */
export const applyCharacterEffects = <T extends Character & { magicItems: MagicItem[] }>(
  character: T,
): T => applyMagicItemEffects(applyClassFeatureEffects(character));
