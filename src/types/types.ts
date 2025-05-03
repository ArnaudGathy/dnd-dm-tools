export type Condition = {
  title: string;
  icon: string;
  description: string;
  bullets?: string[];
};

export type ParticipantToAdd = {
  name: string;
  init: string;
  hp: string;
  color?: string;
};

export type Participant = ParticipantToAdd & {
  id?: number;
  currentHp: string;
  uuid: string;
  conditions?: Condition[];
  notes?: string[];
  isNPC: boolean;
};

type EnemyObject = {
  id: number;
  color?: string;
  variant?: string;
  shouldHideInInitiativeTracker?: boolean;
};
export type EncounterEnemy = number | EnemyObject;

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
  target?: string;
  hit?: string;
};

export type Creature = {
  name: string;
  id: number;
  type: string;
  size: string;
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
  skills?: Partial<Record<Skills, string>>;
  immunities?: string[];
  vulnerabilities?: string[];
  resistances?: string[];
  savingThrows?: Partial<Record<AbilityNameType, string>>;
  senses: {
    blindSight?: string;
    darkvision?: string;
    passivePerception: number;
    trueSight?: string;
  };
  languages?: string[];
  challengeRating: number;
  actions: Array<Action>;
  legendaryActions?: Array<Action>;
  legendaryActionsSlots?: number;
  lairActions?: Array<Action>;
  bonusActions?: Array<Action>;
  reactions?: Array<Action>;
  spellStats?: {
    attackMod: number;
    spellDC: number;
    slots?: Partial<Record<string, number>>;
  };
  spells?: Array<{ id: string; summary?: string; version?: string }>;
  traits?: Array<{
    name: string;
    description: string;
  }>;
  colors?: Array<string>;
};
