import { Creature } from "@/types/types";

export const localCreatures: Record<string, Creature> = {
  pterafolk: {
    name: "Ptérosaurien",
    id: "pterafolk",
    type: "Monstrosity",
    size: "Large",
    alignment: "Neutral Evil",
    challengeRating: 1,
    armorClass: 13,
    hitPoints: "31",
    speed: {
      walk: "9 m",
      fly: "15 m",
    },
    abilities: {
      strength: 15,
      dexterity: 13,
      constitution: 12,
      intelligence: 9,
      wisdom: 10,
      charisma: 11,
    },
    skills: {
      perception: "+2",
      survival: "+2",
    },
    languages: ["Common"],
    senses: {
      passivePerception: 12,
    },
    traits: [
      {
        name: "Terror Dive",
        description:
          "Piqué en vol d'au moins 9m de haut, attaque au javelin, cause l'effet frightened si touché.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description:
          "Soit 3 attaques: morsure + 2 griffes. Soit 2 attaques au javelin (piqué)",
      },
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "7 (2d4 + 2) piercing damage.",
      },
      {
        name: "Griffes",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "5 (1d6 + 2) slashing damage.",
      },
      {
        name: "Javelin",
        type: "Melee or Ranged",
        modifier: "+4",
        reach: "1.5 m",
        hit: "9 (2d6 + 2) piercing damage.",
      },
    ],
  },
  "batiri-battle-stack": {
    name: "Totem de guerre Batiri",
    id: "batiri-battle-stack",
    type: "Fey (Goblinoid)",
    size: "Small",
    alignment: "Chaotic Neutral",
    armorClass: "15",
    hitPoints: "40 (3d6)",
    challengeRating: 0.25,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 8,
      dexterity: 15,
      constitution: 10,
      intelligence: 10,
      wisdom: 8,
      charisma: 8,
    },
    savingThrows: {
      strength: "-1",
      dexterity: "+2",
      wisdom: "-1",
      charisma: "-1",
    },
    skills: {
      stealth: "+6",
    },
    languages: ["common", "goblin"],
    senses: {
      darkvision: "18 m",
      passivePerception: 9,
    },
    traits: [
      {
        name: "Totem Batiri",
        description:
          "Sous forme de totem, bénéficie de 2 attaques, l'avantage aux jets d'attaques ainsi que +1d4 dégats.",
      },
      {
        name: "Mort",
        description:
          "Tous les 10 pv perdus, un gobelins du totelm meurt. JdS DEX 10 ou s'éffondre (tous les gobelins à terre). Une action est requise pour reformer le totem",
      },
    ],
    actions: [
      {
        name: "Lance",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "(1d6+1d4+2) Avantage + double attaque",
      },
    ],
    bonusActions: [
      {
        name: "Nimble Escape",
        description: "The goblin takes the Disengage or Hide action.",
      },
    ],
  },
  deinonychus: {
    name: "Deinonychus",
    id: "deinonychus",
    type: "Beast",
    size: "Medium",
    alignment: "Unaligned",
    challengeRating: 1,
    armorClass: 13,
    hitPoints: "26 (4d8 + 8)",
    speed: {
      walk: "12 m",
    },
    abilities: {
      strength: 15,
      dexterity: 15,
      constitution: 14,
      intelligence: 4,
      wisdom: 12,
      charisma: 6,
    },
    skills: {
      perception: "+3",
    },
    senses: {
      passivePerception: 13,
    },
    traits: [
      {
        name: "Pounce",
        description:
          "S'il se déplace au moins 4 case en ligne droite avant d'attaquer, la cible JdS FOR 12 ou tombe prone et subit une morsure action bonus.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description:
          "The deinonychus makes three attacks: one with its bite and two with its claws.",
      },
      {
        name: "Bite",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "6 (1d8 + 2) piercing damage.",
      },
      {
        name: "Claw",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "6 (1d8 + 2) slashing damage.",
      },
    ],
    bonusActions: [
      {
        name: "Bite",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "6 (1d8 + 2) piercing damage.",
      },
    ],
  },
};
