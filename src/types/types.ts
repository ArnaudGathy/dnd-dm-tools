export type Condition = {
  title: string;
  icon: string;
  description: string;
  bullets?: string[];
};

export type ParticipantToAdd = {
  name: string;
  init: number;
  hp: string;
  color?: string;
  dexMod: number;
};

export type Participant = ParticipantToAdd & {
  id?: number | string;
  currentHp: string;
  uuid: string;
  conditions?: Condition[];
  notes?: string[];
  isNPC: boolean;
  inactive?: boolean;
};

type EnemyObject = {
  id: string;
  color?: string;
  variant?: string;
  shouldHideInInitiativeTracker?: boolean;
  inactive?: true;
};
export type EncounterEnemy = string | EnemyObject;

export type Encounter = {
  id: number;
  scenario: string;
  name: string;
  location: {
    name: string;
    mapMarker: string;
  };
  youtubeId?: string;
  ennemies?: Partial<{
    [key: string]: Array<EncounterEnemy>;
  }>;
  extraZonesEnnemies?: string[];
  informations?: string[];
  loots?: string[];
  environmentTurnInitiative?: string;
};

export const isEnemyObject = (enemy: unknown): enemy is EnemyObject => {
  return (enemy as EnemyObject)?.id !== undefined;
};

export type AbilityNameType =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type Skills =
  | "acrobatics"
  | "animalHandling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleightOfHand"
  | "stealth"
  | "survival";

import { Creature } from "@/types/schemas";
export type { Creature } from "@/types/schemas";

export type Action = Creature["actions"][number];

export type SummaryCreature = {
  id: string;
  name: string;
  challengeRating: number;
};

export enum SHEETS_TABS {
  GENERAL = "general",
  COMBAT = "combat",
  SKILLS = "skills",
  INVENTORY = "inventory",
  BIO = "bio",
  QUESTS = "quests",
  SETTINGS = "settings",
}
