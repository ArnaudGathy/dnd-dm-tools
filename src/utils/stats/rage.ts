import { Abilities, Character, Classes, Skills, Subclasses, Weapon } from "@prisma/client";
import {
  BARBARIAN_PRIMAL_KNOWLEDGE_LEVEL,
  BARBARIAN_PRIMAL_KNOWLEDGE_SKILLS,
  BARBARIAN_RAGE_DAMAGE_PER_LEVEL,
  BARBARIAN_WORLD_TREE_LEVEL,
} from "@/constants/maps";

// The Rage on/off flag lives in the device's localStorage (see useRageStatus),
// so every helper takes it as an argument.
type RageCharacter = Pick<Character, "className" | "subclassName" | "level">;

export const canRage = (character: Pick<Character, "className">) =>
  character.className === Classes.BARBARIAN;

/** Rage Damage: only on attacks that use Strength (weapon or Unarmed Strike). */
export const getRageDamageBonus = (character: RageCharacter, weapon: Weapon, isRaging: boolean) =>
  isRaging && canRage(character) && weapon.abilityModifier === Abilities.STRENGTH
    ? BARBARIAN_RAGE_DAMAGE_PER_LEVEL[character.level]
    : 0;

/** Primal Knowledge: while raging, these skills may be rolled as Strength checks. */
export const hasPrimalKnowledge = (character: RageCharacter, skill: Skills, isRaging: boolean) =>
  isRaging &&
  canRage(character) &&
  character.level >= BARBARIAN_PRIMAL_KNOWLEDGE_LEVEL &&
  BARBARIAN_PRIMAL_KNOWLEDGE_SKILLS.includes(skill);

/** World Tree "Vitality Surge": temp HP granted on entering Rage (0 if not applicable). */
export const getRageTempHP = (character: RageCharacter) =>
  canRage(character) &&
  character.subclassName === Subclasses.PATH_OF_THE_WORLD_TREE &&
  character.level >= BARBARIAN_WORLD_TREE_LEVEL
    ? character.level
    : 0;
