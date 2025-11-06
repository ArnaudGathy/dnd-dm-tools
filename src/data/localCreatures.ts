import { Creature } from "@/types/types";

export const localCreatures: Record<string, Creature> = {
  pterafolk: {
    name: "Ptérosaurien",
    id: "_pterafolk",
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
        description: "Soit 3 attaques: morsure + 2 griffes. Soit 2 attaques au javelin (piqué)",
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
    id: "_batiri-battle-stack",
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
    id: "_deinonychus",
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
  "assassin-vine": {
    name: "Lianes assassines",
    id: "_assassin-vine",
    type: "Plant",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 13,
    hitPoints: "85 (10d10 + 30)",
    speed: { walk: "1.5 m", climb: "1.5 m" },
    challengeRating: 3,
    abilities: {
      strength: 18,
      dexterity: 10,
      constitution: 16,
      intelligence: 1,
      wisdom: 10,
      charisma: 1,
    },
    resistances: ["Givre", "Feu"],
    immunities: ["Aveuglée", "Assourdie", "Fatiguée", "Au sol"],
    senses: { blindSight: "9 m", passivePerception: 10 },
    traits: [
      {
        name: "Fausse apparence",
        description: "Idétectable tant qu'elle ne bouge pas.",
      },
    ],
    actions: [
      {
        name: "Constriction",
        type: "Melee",
        modifier: "+6",
        reach: "6 m",
        hit: "11 (2d6 + 4) bludgeoning damage, et cible saisie (DD 14) + entravée. Cible 6d6 poison au début de son tour + action pour se libérer (DD 14). 1 cible à la fois.",
      },
      {
        name: "Lianes enchevêtrées",
        description:
          "Créer zone de terrain difficile carrée de 3 cases de côté dans une portée de 6 cases. JdS FOR 13 ou entravée lors de l'apparition. Action Athlétisme DD 13 pour se libérer. 1 zone à la fois",
      },
    ],
  },
  almiraj: {
    name: "Almiraj",
    id: "_almiraj",
    type: "Bête",
    size: "Small",
    alignment: "Non aligné",
    armorClass: 13,
    hitPoints: "3 (1d6)",
    speed: {
      walk: "15 m",
    },
    challengeRating: 0,
    abilities: {
      strength: 2,
      dexterity: 16,
      constitution: 10,
      intelligence: 2,
      wisdom: 14,
      charisma: 10,
    },
    skills: {
      stealth: "+5",
      perception: "+4",
    },
    senses: {
      darkvision: "9 m",
      passivePerception: 14,
    },
    traits: [
      {
        name: "Sens aiguisés",
        description:
          "L’almiraj est avantagé sur les tests de perception basés sur la vue ou l’ouïe.",
      },
    ],
    actions: [
      {
        name: "Corne",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "5 (1d4 + 3) dégâts perforants.",
      },
    ],
  },
  vorn: {
    name: "Vorn",
    id: "_vorn",
    type: "Artificiel",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 17,
    hitPoints: "62",
    challengeRating: 7,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 18,
      dexterity: 8,
      constitution: 18,
      intelligence: 7,
      wisdom: 10,
      charisma: 3,
    },
    savingThrows: {
      strength: "+4",
      dexterity: "-1",
      constitution: "+4",
      intelligence: "-2",
      charisma: "-4",
    },
    immunities: ["poison", "charmé", "fatigue", "Apeuré", "paralysé", "pétrifié", "Empoisonné"],
    languages: ["Comprends les commandes dans n'importe quelle langue, mais ne parle pas."],
    senses: {
      blindSight: "3 m",
      darkvision: "18 m",
      passivePerception: 10,
    },
    traits: [
      {
        name: "Lié",
        description:
          "Le gardien est lié magiquement à une Amulette en Adamantium portant son nom. Tant que le gardien et l’amulette se trouvent sur le même plan d’existence, le porteur de l’amulette peut appeler télépathiquement le gardien pour qu’il le rejoigne, et le gardien connaît alors la distance et la direction de l’amulette. Si le gardien se trouve à moins de 12 cases du porteur de l’amulette, la moitié des dégâts subis par ce dernier (arrondie à l’unité supérieure) est transférée au gardien.",
      },
      {
        name: "Stockage de sorts",
        description:
          "Un lanceur de sorts qui porte l’amulette du gardien peut faire en sorte que le gardien stocke un sort de niveau 4 ou inférieur. Pour ce faire, le porteur doit lancer le sort sur le gardien alors qu’il se trouve à 1 case de lui. Le sort n’a alors aucun effet, mais il est stocké à l’intérieur du gardien. Tout sort précédemment stocké est perdu lorsqu’un nouveau sort est enregistré. Le gardien peut lancer le sort stocké en utilisant tous les paramètres définis par le lanceur de sorts d’origine, sans nécessiter de composantes matérielles et en utilisant la caractéristique d’incantation du lanceur. Le sort stocké est ensuite perdu.",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "Le gardien fait deux attaques de Poing.",
      },
      {
        name: "Poing",
        type: "Melee",
        modifier: "+5",
        reach: "3 m",
        hit: "7 (1d6 cont. + 1d6 force + 4)",
      },
    ],
    reactions: [
      {
        name: "Protection",
        description:
          "Déclencheur : Un jet d’attaque touche le porteur de l’amulette du gardien alors que celui-ci se trouve à 1 case du gardien. Réponse : Le porteur bénéficie d’un bonus de +2 à la CA, y compris contre l’attaque initiale, ce qui peut la faire échouer. Ce bonus dure jusqu’au début du prochain tour du gardien.",
      },
    ],
  },
};
