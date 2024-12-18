export type ParticipantToAdd = {
  name: string;
  init: string;
  hp: string;
  color: string;
};

export type Participant = ParticipantToAdd & {
  currentHp: string;
  id: string;
  isPlayer?: boolean;
};

export type Character = {
  name: string;
  player: string;
  color: string;
};

export type Party = {
  name: string;
  id: number;
  characters: Character[];
};

export type Encounter = {
  id: number;
  scenario: string;
  name: string;
  location: {
    name: string;
    mapMarker: string;
  };
  ennemies: {
    [key: string]: number[];
  };
  informations: string[];
  loots?: string[];
};

export enum Characteristics {
  STR = "strength",
  DEX = "dexterity",
  CON = "constitution",
  INT = "intelligence",
  WIS = "wisdom",
  CHA = "charisma",
}

export type Creature = {
  name: string;
  id: number;
  type: string;
  size: string;
  alignment: string;
  armorClass: number;
  hitPoints: string;
  speed: {
    walk: string;
    swim?: string;
    fly?: string;
  };
  abilities: Record<Characteristics, number>;
  immunities?: string[];
  vulnerabilities?: string[];
  resistances?: string[];
  savingThrows?: Partial<Record<Characteristics, string>>;
  senses: {
    blindSight?: string;
    darkvision?: string;
    passivePerception: number;
  };
  languages?: string[];
  challengeRating: number;
  actions: Array<{
    name: string;
    description?: string;
    type?: string;
    modifier?: string;
    reach?: string;
    target?: string;
    hit?: string;
  }>;
  traits?: Array<{
    name: string;
    description: string;
  }>;
};
