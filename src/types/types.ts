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
};

type EnemyObject = {
  id: string;
  color?: string;
  variant?: string;
  shouldHideInInitiativeTracker?: boolean;
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

export type Action = {
  name: string;
  description?: string;
  type?: string;
  modifier?: string;
  reach?: string;
  hit?: string;
};

export type Creature = {
  name: string;
  id: string;
  type: string;
  size: string;
  challengeRating: number;
  alignment: string;
  armorClass: number | string;
  hitPoints: string;
  speed: {
    walk: string;
    swim?: string;
    fly?: string;
    climb?: string;
  };
  abilities: Record<AbilityNameType, number>;
  savingThrows?: Partial<Record<AbilityNameType, string>>;
  skills?: Partial<Record<Skills, string>>;
  immunities?: string[];
  vulnerabilities?: string[];
  resistances?: string[];
  languages?: string[];
  senses: {
    blindSight?: string;
    darkvision?: string;
    passivePerception: number;
    trueSight?: string;
  };
  traits?: Array<{
    name: string;
    description: string;
  }>;
  actions: Array<Action>;
  reactions?: Array<Action>;
  legendaryActions?: Array<Action>;
  legendaryActionsSlots?: string;
  lairActions?: Array<Action>;
  bonusActions?: Array<Action>;
  spellStats?: {
    attackMod: number;
    spellDC: number;
    slots?: Partial<Record<string, number>>;
  };
  spells?: Array<{ id: string; summary?: string }>;
  colors?: Array<string>;
};

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
