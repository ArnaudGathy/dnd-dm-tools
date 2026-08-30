import { Character } from "@prisma/client";
import { convertFeetDistanceIntoSquares, getModifier } from "@/utils/utils";

/**
 * Jump distances (2024 rules). The rules are feet-native but the sheet is not, so
 * feet never leave this module: `meters` is what the breakdowns display, `squares`
 * is what the panel displays (whole squares you can actually cross) and
 * `squaresExact` keeps that rounding auditable.
 */

/** The sheet's grid convention: 1 square = 5 feet = 1.50 m, so 1 foot = 0.30 m. */
const METERS_PER_FOOT = 0.3;

const convertFeetToMeters = (feet: number) => feet * METERS_PER_FOOT;

/** A running start requires 10 feet of movement immediately before the jump. */
export const JUMP_RUN_UP_IN_SQUARES = convertFeetDistanceIntoSquares(10);

/** Base height of a High Jump, before the Strength modifier. */
const HIGH_JUMP_BASE_IN_FEET = 3;

export const HIGH_JUMP_BASE_IN_METERS = convertFeetToMeters(HIGH_JUMP_BASE_IN_FEET);

/** Reaching with arms extended adds half your height on top of the jump. */
const EXTENDED_ARMS_HEIGHT_RATIO = 1.5;

export type JumpDistance = {
  meters: number;
  /** Unrounded conversion, e.g. 3.2 — shown so the floor below stays auditable. */
  squaresExact: number;
  squares: number;
};

const toJumpDistance = (feet: number): JumpDistance => {
  const squaresExact = convertFeetDistanceIntoSquares(feet);
  return {
    meters: convertFeetToMeters(feet),
    squaresExact,
    squares: Math.floor(squaresExact),
  };
};

export const getJumpDistances = (character: Character) => {
  const strength = character.strength;
  const strengthModifier = getModifier(character.strength);
  // "minimum of 0 feet": a negative Strength modifier cannot make the jump negative.
  const highJumpInFeet = Math.max(0, HIGH_JUMP_BASE_IN_FEET + strengthModifier);

  return {
    strength,
    strengthModifier,
    isHighJumpClamped: HIGH_JUMP_BASE_IN_FEET + strengthModifier < 0,
    longRunning: toJumpDistance(strength),
    longStanding: toJumpDistance(strength / 2),
    highRunning: toJumpDistance(highJumpInFeet),
    highStanding: toJumpDistance(highJumpInFeet / 2),
  };
};

/**
 * How high you can reach at the top of a High Jump, arms extended, in meters
 * (`Character.height` is stored in cm). Null when the height is unknown.
 */
export const getJumpReachInMeters = (jumpInMeters: number, heightInCentimeters: number | null) => {
  if (heightInCentimeters === null) {
    return null;
  }
  return jumpInMeters + EXTENDED_ARMS_HEIGHT_RATIO * (heightInCentimeters / 100);
};
