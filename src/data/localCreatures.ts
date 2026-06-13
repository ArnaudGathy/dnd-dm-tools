import { Creature } from "@/types/types";

export const localCreatures: Record<string, Creature> = {
  pterafolk: {
    name: "Ptérosaurien",
    id: "_pterafolk",
    fiveETools: { name: "Pterafolk", source: "ToA" },
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
    fiveETools: { name: "Deinonychus", source: "VGM" },
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
    fiveETools: { name: "Assassin Vine", source: "ToA" },
    type: "Plant",
    size: "Medium",
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
        description: "Indétectable tant qu'elle ne bouge pas.",
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
    fiveETools: { name: "Almiraj", source: "ToA" },
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
  "yellow-musk-creeper": {
    name: "Lierre musqué",
    id: "_yellow-musk-creeper",
    fiveETools: { name: "Yellow Musk Creeper", source: "ToA" },
    type: "Plant",
    size: "Medium",
    alignment: "Unaligned",
    armorClass: 8,
    hitPoints: "70 (11d8 + 11)",
    speed: { walk: "1.5 m", climb: "1.5 m" },
    challengeRating: 2,
    abilities: {
      strength: 12,
      dexterity: 3,
      constitution: 12,
      intelligence: 1,
      wisdom: 10,
      charisma: 3,
    },
    immunities: ["blinded", "deafened", "exhaustion", "prone"],
    senses: { blindSight: "9 m", passivePerception: 10 },
    traits: [
      {
        name: "Fausse apparence",
        description: "Indétectable tant qu'elle ne bouge pas.",
      },
      {
        name: "Régénération",
        description:
          "+10 pv au début du tour, sauf si sa subit dégâts feu, nécro ou radiant lors du tour. Meurt uniquement au début de son tour, si ne régénère pas.",
      },
    ],
    actions: [
      {
        name: "Toucher",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "13 (3d8) psi. Si la cible tombe a 0 PV, +1 jet de mort et implanté un bulbe. Animation après 24h.",
      },
      {
        name: "Musc jaune (3/j)",
        description:
          "Rayon de 6 cases, humanoïde JdS SAG 13 ou charmé (ne pas agir, et avancer vers la plante). Relancer le JdS à la fin du tour.",
      },
    ],
  },
  "yellow-musk-zombie": {
    name: "Zombie musqué",
    id: "_yellow-musk-zombie",
    fiveETools: { name: "Yellow Musk Zombie", source: "ToA" },
    type: "Undead",
    size: "Medium",
    alignment: "Unaligned",
    armorClass: 9,
    hitPoints: "33 (6d8 + 6)",
    speed: { walk: "6 m" },
    challengeRating: 0.5,
    abilities: {
      strength: 13,
      dexterity: 9,
      constitution: 12,
      intelligence: 1,
      wisdom: 6,
      charisma: 3,
    },
    immunities: ["charmed", "exhaustion"],
    senses: { blindSight: "9 m", passivePerception: 8 },
    traits: [
      {
        name: "Robustess de la non-vie",
        description:
          "A 0 PV : JdS CON DD 5 + dégâts subits, sauf si dégâts de feu ou critique. Si réussi, revient à 1 PV.",
      },
    ],
    actions: [
      {
        name: "Coup",
        type: "Melee",
        modifier: "+3",
        reach: "1.5 m",
        hit: "5 (1d10 + 2) bludgeoning damage.",
      },
    ],
  },
  mantrap: {
    name: "Attrape-homme",
    id: "_mantrap",
    fiveETools: { name: "Mantrap", source: "ToA" },
    type: "Plant",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 12,
    hitPoints: "45 (7d10 + 7)",
    speed: { walk: "1.5 m" },
    challengeRating: 1,
    abilities: {
      strength: 15,
      dexterity: 14,
      constitution: 12,
      intelligence: 1,
      wisdom: 10,
      charisma: 2,
    },
    immunities: ["blinded", "deafened", "exhaustion", "prone"],
    senses: { tremorsense: "9 m", passivePerception: 10 },
    traits: [
      {
        name: "Fausse apparence",
        description: "Indétectable tant qu'elle ne bouge pas.",
      },
    ],
    actions: [
      {
        name: "Engloutir",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "Si touché piégé dans la bouche, aveuglé et entravé. Abri total de l'exérieur. Subit 4d6 dégâts acide début chaque tour. Libération à la mort",
      },
    ],
    reactions: [
      {
        name: "Pollen attractif (1/j)",
        description:
          "Rayon de 6 cases, humanoïde JdS SAG 13 ou charmé (ne pas agir, et avancer vers la plante). Relancer le JdS à la fin du tour.",
      },
    ],
  },
  zalkore: {
    name: "Zalkoré",
    id: "_zalkore",
    fiveETools: { name: "Zalkoré", source: "ToA" },
    type: "Monstrosity",
    size: "Medium",
    alignment: "Lawful Evil",
    armorClass: "15",
    hitPoints: "127 (17d8 + 51)",
    challengeRating: 6,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 10,
      dexterity: 17,
      constitution: 16,
      intelligence: 12,
      wisdom: 13,
      charisma: 15,
    },
    savingThrows: {
      dexterity: "+3",
      constitution: "+3",
      intelligence: "+1",
      wisdom: "+4",
      charisma: "+2",
    },
    skills: {
      deception: "+5",
      perception: "+4",
      stealth: "+6",
    },
    languages: ["common plus one other language"],
    senses: {
      darkvision: "45 m",
      passivePerception: 14,
    },
    traits: [
      {
        name: "Esprit de Thiru-taya",
        description: "A 50% PV (63). Invoque l'esprit de Thiru-taya (active sa réaction)",
      },
    ],
    actions: [
      {
        name: "Attaque multiples",
        description: "2 griffes et 1 serpent OU 3 rayons",
      },
      {
        name: "Griffe",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "(2d6 + 3) tranchants.",
      },
      {
        name: "Chevelure serpents",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "(1d4 tranchants + 4d6 poison + 3)",
      },
      {
        name: "Rayon empoisonné",
        reach: "45 m",
        type: "Distance",
        modifier: "+6",
        hit: "(2d8 + 2) poison",
      },
    ],
    bonusActions: [
      {
        name: "Regard pétrifiant (5–6)",
        description:
          "Cone de 6 cases. JdS CON 13 ou restrained. Relancer JdS à la fin du tour si tjs restrained et devenir Petrified",
      },
    ],
    reactions: [
      {
        name: "Riposte (100%)",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "(1d8 + 3) force",
      },
      {
        name: "Riposte (50%)",
        type: "Melee",
        modifier: "+6",
        reach: "4.5 m",
        hit: "(2d8 + 6) force",
      },
    ],
    behavior:
      "Réaction Thiru > Regard > 2x Griffe + 1x serpent si melee > 3x Rayons si personne en melee",
  },
  eblis: {
    name: "Eblis",
    id: "_eblis",
    fiveETools: { name: "Eblis", source: "ToA" },
    type: "Monstrosity",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: 14,
    hitPoints: "36 (4d10 + 4)",
    speed: { walk: "9 m", fly: "12 m" },
    challengeRating: 1,
    abilities: {
      strength: 11,
      dexterity: 16,
      constitution: 12,
      intelligence: 12,
      wisdom: 14,
      charisma: 11,
    },
    skills: { perception: "+4" },
    senses: { passivePerception: 14 },
    languages: ["Auran", "Common"],
    actions: [
      {
        name: "Attaques multiples",
        description: "2x bec",
      },
      {
        name: "Beak",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "5 (1d6 + 3) piercing damage.",
      },
    ],
    spellStats: {
      attackMod: 3,
      spellDC: 12,
      slots: {
        "2": 1,
        "3": 1,
      },
    },
    spells: [
      {
        id: "blur",
        summary: "Désavantage des attaques adverses (concentration, 1m)",
      },
      {
        id: "hypnotic-pattern",
        summary: "Cube. JdS SAG 12 charmé. Incapacité + 0 Vit. Subir dmg ou aider",
      },
    ],
    behavior: "Flou si attaqué > Motif sur qq personnes > 2x Bec",
  },
  "meme-poupou": {
    name: "Mémé Pou'pou",
    id: "_green-hag",
    type: "Fey",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: "17",
    hitPoints: "82 (11d8 + 33)",
    challengeRating: 3,
    speed: {
      walk: "9 m",
      swim: "9 m",
    },
    abilities: {
      strength: 18,
      dexterity: 12,
      constitution: 16,
      intelligence: 13,
      wisdom: 14,
      charisma: 14,
    },
    savingThrows: {
      strength: "+4",
      dexterity: "+1",
      constitution: "+3",
      intelligence: "+1",
      wisdom: "+2",
      charisma: "+2",
    },
    skills: {
      arcana: "+5",
      deception: "+4",
      perception: "+4",
      stealth: "+3",
    },
    languages: ["common", "elvish", "sylvan"],
    senses: {
      darkvision: "18 m",
      passivePerception: 14,
    },
    actions: [
      {
        name: "Lancer ingrédient",
        description:
          "Ajoute un ingrédient au chaudron via sa main de mage. Peut utiliser invisibilité pour le faire elle même.",
      },
      {
        name: "Attaques multiples",
        description: "3x griffe",
      },
      {
        name: "Griffe",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "8 (1d8 tranchant + 1d6 poison + 4)",
      },
    ],
    spellStats: {
      attackMod: 4,
      spellDC: 12,
      slots: {
        "1": Infinity,
      },
    },
    spells: [
      {
        id: "mage-hand",
        summary: "Déplacement 6 case via une action",
      },
      {
        id: "invisibility",
        summary: "Invisible jusqu'à attaquer (concentration, 1h)",
      },
      {
        id: "ray-of-sickness",
        summary: "Attaque (+4) 4d8 poison + empoisonné jusqu'à fin prochain tour",
      },
    ],
    behavior: "Lancer ingrédient main de main > Invisibilité ingrédients > Rayon > 3x griffe",
  },
  "flesh-golem": {
    name: "Flesh Golem",
    id: "_flesh-golem",
    type: "Construct",
    size: "Medium",
    alignment: "Neutral",
    armorClass: "9",
    hitPoints: "127 (15d8 + 60)",
    challengeRating: 5,
    speed: {
      walk: "6m",
    },
    abilities: {
      strength: 19,
      dexterity: 9,
      constitution: 18,
      intelligence: 6,
      wisdom: 10,
      charisma: 5,
    },
    savingThrows: {
      strength: "+4",
      dexterity: "-1",
      constitution: "+4",
      intelligence: "-2",
      charisma: "-3",
    },
    immunities: [
      "lightning",
      "poison",
      "charmed",
      "exhaustion",
      "frightened",
      "paralyzed",
      "petrified",
      "poisoned",
    ],
    vulnerabilities: ["Feu (voir trait)"],
    languages: ["understands common plus one other language but can't speak"],
    senses: {
      darkvision: "18 m",
      passivePerception: 10,
    },
    traits: [
      {
        name: "Aversion au feu",
        description:
          "Si dégats de feu subits, désavantage attaque et caract. jusqu'à la fin de son prochain tour.",
      },
      {
        name: "Berserk",
        description:
          "A partir de 50% PV, 1d6 au début du tour, sur 6 devenir berserk. Attaquer la cible la plus proche. Soigner > 50% ou Persuasion DD 15 pour arrêter.",
      },
      {
        name: "Forme immuable",
        description: "Ne peut pas être transformé",
      },
      {
        name: "Absorption de foudre",
        description: "Soigné par les dégâts de foudre",
      },
      {
        name: "Résistance magique",
        description: "Avantage JdS effets de sorts.",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "2x Claque",
      },
      {
        name: "Claque",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "13 (2d8 cont. + 1d8 foudre + 4)",
      },
      {
        name: "Claque (berserk)",
        type: "Melee",
        modifier: "+7",
        reach: "1.5 m",
        hit: "13 (2d8 cont. + 1d8 foudre + 1d6 + 4)",
      },
    ],
    behavior: "Berserk 50%, feu, avantage JdS. 2x Claque (bonus berserk) ",
  },
  chaudron: {
    name: "Chaudron",
    id: "_chaudron",
    armorClass: 16,
    hitPoints: "50",
    type: "Décor",
    size: "M",
    alignment: "N/A",
    resistances: ["Dégâts physiques (tranchants, perçants, contondants)"],
    speed: {
      walk: "0 m",
    },
    abilities: {
      strength: 10,
      dexterity: -99,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    senses: {
      passivePerception: 0,
    },
    challengeRating: 0,
    traits: [
      {
        name: "Explosion",
        description:
          "Explose au 7ème ingrédient. Touche tout le monde avec un effet de petrification : 2x JdS CON 13 (Restrained + Petrified). Soigne Zalkoré de sa condition de méduse",
      },
      {
        name: "Jaune (Sève)",
        description:
          "Explosion tout le monde dans la pièce JdS CON 14 ou 2d6 dégats d’acide. Sauf le golem qui passe en mode Berserk (+2 toucher, +1d6 dégats) (La sève est très volatile (explosive))",
      },
      {
        name: "Bleu (Pétales)",
        description:
          "Tous les ennemis morts ou inconscients génèrent des feu follets (max 3). Les joueurs au sol reviennent à la conscience avec 1d10 PV. (Utilisé dans les rituels pour aider les âmes à passer dans l’outre-monde)",
      },
      {
        name: "Rouge (Sang)",
        description:
          "Tout sort lancé dans la pièce pendant le tour est relancé sur une cible aléatoire. ( est réputé imiter la magie, parfois de manière imprévisible)",
      },
      {
        name: "Vert (Feuillages)",
        description:
          "Soigne tout le monde dans la pièce sauf le golem 2d6+3. Les joueurs gagnent avantage à leur prochaine attaque unique. (Utilisé dans les potions et sorts de soins)",
      },
      {
        name: "Mauve (Poudre fée)",
        description:
          "Dissipe tous les effets magique et de status : buff, débuffs, poison, maladies, invisibilité, invocations, brise la concentration. (Les anciens druides l’utilisaient pour rompre les enchantements ou purifier les auras corrompues)",
      },
    ],
    actions: [
      {
        name: "Ramasser et jeter",
      },
    ],
    bonusActions: [
      {
        name: "Analyser ingrédient",
        description: "Arcane ou Nature DD 14",
      },
    ],
  },
  "zombie-triceratops": {
    name: "Tricératops Zombie",
    id: "_zombie-triceratops",
    type: "Undead",
    size: "Huge",
    alignment: "Unaligned",
    armorClass: "15",
    hitPoints: "68 (8d12 + 16)",
    speed: { walk: "6 m" },
    challengeRating: 3,
    abilities: {
      strength: 19,
      dexterity: 9,
      constitution: 15,
      intelligence: 2,
      wisdom: 6,
      charisma: 3,
    },
    immunities: ["poison"],
    senses: { darkvision: "18 m", passivePerception: 8 },
    traits: [
      {
        name: "Undead Fortitude",
        description:
          "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
      },
      {
        name: "Charge",
        description:
          "S'il se déplace d'au moins 4 cases en ligne droite avant d'attaquer, ajoute 2d4 dégâts",
      },
    ],
    actions: [
      {
        name: "Cornes",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "18 (4d6 (+2d4) + 4) dégâts perçants. JdS FOR 14 ou au sol.",
      },
    ],
  },
  treant: {
    name: "Treant",
    id: "_treant",
    type: "Plant",
    size: "Huge",
    alignment: "Chaotic Good",
    armorClass: "16",
    hitPoints: "138 (12d12 + 60)",
    challengeRating: 9,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 23,
      dexterity: 8,
      constitution: 21,
      intelligence: 12,
      wisdom: 16,
      charisma: 12,
    },
    savingThrows: {
      strength: "+6",
      dexterity: "-1",
      constitution: "+5",
      intelligence: "+1",
      wisdom: "+3",
      charisma: "+1",
    },
    vulnerabilities: ["fire"],
    resistances: ["bludgeoning", "piercing"],
    languages: ["common", "druidic", "elvish", "sylvan"],
    senses: {
      passivePerception: 13,
    },
    actions: [
      {
        name: "2x Racines",
        description: "2 cibles, JdS DEX/FOR 14. DD 14 s'échapper. Attaquer : 4 PV, CA 10",
      },
      {
        name: "Ecrasement",
        type: "Melee",
        modifier: "+10",
        reach: "1.5 m",
        hit: "18 (3d6 + 6) dégâts contondant. JdS FOR 14 ou au sol.",
      },
    ],
  },
  "treant-weak-spot": {
    name: "Weak spot",
    id: "_treant-weak-spot",
    type: "Plant",
    size: "Medium",
    alignment: "n/a",
    armorClass: "10",
    hitPoints: "25",
    challengeRating: 0,
    speed: {
      walk: "0 m",
    },
    abilities: {
      strength: 10,
      dexterity: -99,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    vulnerabilities: ["fire"],
    resistances: ["bludgeoning", "piercing"],
    senses: {
      passivePerception: 13,
    },
    actions: [],
  },
  kamadan: {
    name: "Kamadan",
    id: "_kamadan",
    fiveETools: { name: "Kamadan", source: "ToA" },
    type: "Monstrosity",
    size: "Large",
    alignment: "Unaligned",
    armorClass: "13",
    hitPoints: "67 (9d10 + 18)",
    speed: { walk: "9 m" },
    challengeRating: 4,
    abilities: {
      strength: 16,
      dexterity: 16,
      constitution: 14,
      intelligence: 3,
      wisdom: 14,
      charisma: 10,
    },
    skills: {
      perception: "+4",
      stealth: "+7",
    },
    senses: { passivePerception: 14 },
    traits: [
      {
        name: "Keen Smell",
        description: "The kamadan has advantage on Wisdom (Perception) checks that rely on smell.",
      },
      {
        name: "Pounce",
        description:
          "If the kamadan moves at least 6 m straight toward a creature and then hits it with a claw attack on the same turn, the target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is knocked prone, the kamadan can make two attacks—one with its bite and one with its snakes—as a bonus action.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description:
          "The kamadan makes two attacks: one with its bite or claw and one with its snakes.",
      },
      {
        name: "Bite",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "6 (1d6 + 3) piercing damage.",
      },
      {
        name: "Claw",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "6 (1d6 + 3) slashing damage.",
      },
      {
        name: "Snakes",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "6 (1d6 + 3) piercing damage, and the target must make a DC 12 Constitution saving throw, taking 21 (6d6) poison damage on a failed save, or half as much damage on a successful one.",
      },
      {
        name: "Sleep Breath (Recharge 4–6)",
        description:
          "The kamadan exhales sleep gas in a 9 m cone. Each creature in that area must succeed on a DC 12 Constitution saving throw or fall unconscious for 10 minutes. The effect ends if the creature takes damage or someone uses an action to wake it.",
      },
    ],
  },
  "king-of-feathers": {
    name: "Le roi des plumes",
    id: "_king-of-feathers",
    fiveETools: { name: "King of Feathers", source: "ToA" },
    type: "Monstrosity",
    size: "Huge",
    alignment: "Unaligned",
    armorClass: "13",
    hitPoints: "200 (19d12 + 52)",
    speed: { walk: "15 m" },
    challengeRating: 8,
    abilities: {
      strength: 25,
      dexterity: 10,
      constitution: 19,
      intelligence: 2,
      wisdom: 12,
      charisma: 9,
    },
    skills: { perception: "+4" },
    senses: { passivePerception: 14, trueSight: "18m" },
    traits: [
      {
        name: "Résistance légendaire (3 / jour)",
        description: "Si JdS raté, peut choisir de réussir.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description:
          "1x morsure, 1x queue, sur cibles différentes. Peut remplacer morsure par cri d'invocation",
      },
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+10",
        reach: "3 m",
        hit: "33 (4d12 + 7) dégâts perçants. Cible <=M = aggripé DD 17 + restrained. Le dino ne peut plus mordre.",
      },
      {
        name: "Queue",
        type: "Melee",
        modifier: "+10",
        reach: "3 m",
        hit: "20 (3d8 + 7) bludgeoning damage.",
      },
      {
        name: "Cri d'invocation (Recharge 5–6)",
        description: "Invoque un deinonychus qui joue a son propre tour d'initiative.",
      },
    ],
    bonusActions: [
      {
        name: "Saut éthéré",
        description:
          "Peut passer dans le plan éthéré et en ressortir durant le même tour, dans une distance de 10 cases.",
      },
    ],
  },
  "su-monster": {
    name: "Monstre de Su",
    id: "_su-monster",
    fiveETools: { name: "Su-monster", source: "ToA" },
    type: "Monstrosity",
    size: "Medium",
    alignment: "Chaotic Evil",
    armorClass: 12,
    hitPoints: "27 (5d8 + 5)",
    speed: {
      walk: "9 m",
      climb: "9 m",
    },
    challengeRating: 1,
    abilities: {
      strength: 14,
      dexterity: 15,
      constitution: 12,
      intelligence: 9,
      wisdom: 13,
      charisma: 9,
    },
    skills: {
      athletics: "+6",
      perception: "+3",
    },
    senses: {
      passivePerception: 13,
    },
    actions: [
      {
        name: "Multiattack",
        description: "The su-monster makes two attacks: one with its bite and one with its claws.",
      },
      {
        name: "Bite",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "4 (1d4 + 2) piercing damage.",
      },
      {
        name: "Claws",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "7 (2d4 + 2) slashing damage, or 12 (4d4 + 2) slashing damage if the su-monster is hanging by its tail and all four of its limbs are free.",
      },
      {
        name: "Psychic Crush (Recharge 5–6)",
        description:
          "The su-monster targets one creature it can see within 9 m of it. The target must succeed on a DC 11 Wisdom saving throw or take 17 (5d6) psychic damage and be stunned for 1 minute. The stunned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
      },
    ],
  },
  "la-mort": {
    name: "La mort",
    id: "_la-mort",
    type: "Undead",
    size: "Medium",
    alignment: "Chaotic Evil",
    armorClass: "12",
    hitPoints: "50",
    challengeRating: 1,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 13,
      dexterity: 15,
      constitution: 10,
      intelligence: 7,
      wisdom: 10,
      charisma: 6,
    },
    languages: ["common"],
    senses: {
      darkvision: "18 m",
      passivePerception: 10,
    },
    actions: [
      {
        name: "Foudre",
        type: "Distance",
        modifier: "+5",
        reach: "18 m",
        hit: "9 (2d12) dégâts de foudre. Attache un arc de foudre a la cible qui lui inflige 2d12 au début de son tour.",
      },
    ],
  },
  "le-temps": {
    name: "Le temps",
    id: "_le-temps",
    type: "Undead",
    size: "Medium",
    alignment: "Chaotic Evil",
    armorClass: "10",
    hitPoints: "1",
    challengeRating: 1,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 13,
      dexterity: 15,
      constitution: 10,
      intelligence: 7,
      wisdom: 10,
      charisma: 6,
    },
    languages: ["common"],
    senses: {
      darkvision: "18 m",
      passivePerception: 10,
    },
    actions: [],
  },
  "le-bon": {
    name: "Le bon",
    id: "_le-bon",
    type: "Undead",
    size: "Medium",
    alignment: "Chaotic Evil",
    armorClass: "12",
    hitPoints: "22 (5d8)",
    challengeRating: 1,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 13,
      dexterity: 15,
      constitution: 10,
      intelligence: 7,
      wisdom: 10,
      charisma: 6,
    },
    savingThrows: {
      strength: "+1",
      dexterity: "+2",
      intelligence: "-2",
      charisma: "-2",
    },
    immunities: ["poison", "charmed", "exhaustion", "poisoned"],
    languages: ["common"],
    senses: {
      darkvision: "18 m",
      passivePerception: 10,
    },
    actions: [
      {
        name: "Fou rire de Tasha",
        description: "JdS SAG 15 ou à terre + incapacité. Relancer JdS au début du tour.",
      },
      {
        name: "Multiattack",
        description: "The ghoul makes two Bite attacks.",
      },
      {
        name: "Bite",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "5 (1d6 + 2) Piercing damage plus 3 (1d6) Necrotic damage.",
      },
      {
        name: "Claw",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "4 (1d4 + 2) Slashing damage. If the target is a creature that isn't an Undead or elf, it is subjected to the following effect. Constitution Saving Throw: DC 10. Failure: The target has the Paralyzed condition until the end of its next turn.",
      },
    ],
  },
  "la-folie": {
    name: "La folie",
    id: "_la-folie",
    type: "Undead",
    size: "Medium",
    alignment: "Chaotic Evil",
    armorClass: "12",
    hitPoints: "100",
    challengeRating: 1,
    speed: {
      walk: "9 m",
    },
    abilities: {
      strength: 13,
      dexterity: 15,
      constitution: 10,
      intelligence: 7,
      wisdom: 10,
      charisma: 6,
    },
    languages: ["common"],
    senses: {
      darkvision: "18 m",
      passivePerception: 10,
    },
    actions: [
      {
        name: "Croc",
        description:
          "Tenter d'attraper la clé, JdS DEX 15 ou 5d8 dégats perçants + main arrachée. Une main squelettique pousse à la place.",
      },
    ],
  },
  "widow-zombie": {
    name: "Zombie (widow)",
    id: "_widow-zombie",
    type: "Undead",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: "8",
    hitPoints: "15 (2d8 + 6)",
    challengeRating: 0.25,
    speed: {
      walk: "6 m",
    },
    abilities: {
      strength: 13,
      dexterity: 6,
      constitution: 16,
      intelligence: 3,
      wisdom: 6,
      charisma: 5,
    },
    savingThrows: {
      strength: "+1",
      dexterity: "-2",
      constitution: "+3",
      intelligence: "-4",
      charisma: "-3",
    },
    immunities: ["poison", "exhaustion", "poisoned"],
    languages: ["understands common plus one other language but can't speak"],
    senses: {
      darkvision: "18 m",
      passivePerception: 8,
    },
    traits: [
      {
        name: "Undead Fortitude",
        description:
          "If damage reduces the zombie to 0 Hit Points, it must make a Constitution saving throw (DC 5 plus the damage taken) unless the damage is Radiant or from a Critical Hit. On a successful save, the zombie drops to 1 Hit Point instead.",
      },
    ],
    actions: [
      {
        name: "Agripper",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "5 (1d8 + 3) Bludgeoning damage. + Agrippé DD15, 3d6+5 au début de chaque tour du zombie.",
      },
    ],
  },
  froghemoth: {
    name: "Crapaudonte",
    id: "_froghemoth",
    fiveETools: { name: "Froghemoth", source: "VGM" },
    type: "Monstrosity",
    size: "Huge",
    alignment: "Unaligned",
    armorClass: "14",
    hitPoints: "204 (16d12 + 80)",
    speed: {
      walk: "9 m",
      swim: "9 m",
    },
    challengeRating: 10,
    abilities: {
      strength: 23,
      dexterity: 13,
      constitution: 20,
      intelligence: 2,
      wisdom: 12,
      charisma: 5,
    },
    savingThrows: {
      strength: "+6",
      dexterity: "+1",
      constitution: "+9",
      intelligence: "-4",
      wisdom: "+5",
      charisma: "-3",
    },
    skills: {
      perception: "+9",
      stealth: "+5",
    },
    resistances: ["fire", "lightning"],
    senses: {
      darkvision: "18 m",
      passivePerception: 19,
    },
    traits: [
      {
        name: "Vulnérabilité à la foudre",
        description:
          "Lors de dégats de foudre subits : moitié vitesse, -2 CA et JdS DEX, pas de réactions ou multiattack, action ou bonus action (pas les 2) au prochain tour.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "2x tentacules + 1 fois morsure ou langue.",
      },
      {
        name: "Tentacule x4",
        type: "Melee",
        modifier: "+10",
        reach: "6 m",
        hit: "19 (3d8 + 6) dégâts contondants, et la cible est aggripée (DD16) si <= TG. 1 cible par tentacule",
      },
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+10",
        reach: "1.5 m",
        hit: "22 (3d10 + 6) dégâts perçants, avalée si <=M => Aveuglé et restreint, abri total, 3d6 dégats d'acide au début du tour du Crapaudonte. 2 Créatures max. Si subit >=20 dégats depuis l'intérieur JdS CON 20 ou recracher toutes les cibles, au sol dans les 2 cases autours.",
      },
      {
        name: "Langue",
        description:
          "Cible <=M à 4 cases max. JdS FOR 18 ou attirée au CaC into attaque morsure en action bonus.",
      },
    ],
  },
  "clay-gladitator": {
    name: "Gladiateur d'argile",
    id: "_clay-gladitator",
    fiveETools: { name: "Clay Gladiator", source: "ToA" },
    type: "Articial",
    size: "Medium",
    challengeRating: 5,
    alignment: "Neutral",
    armorClass: "17",
    hitPoints: "112 (15d8 + 45)",
    immunities: ["poison", "charmed", "frightened"],
    speed: {
      walk: "9 m",
      climb: "9 m",
    },
    abilities: {
      strength: 18,
      dexterity: 15,
      constitution: 16,
      intelligence: 10,
      wisdom: 12,
      charisma: 15,
    },
    savingThrows: {
      wisdom: "+4",
      charisma: "+2",
      strength: "+7",
      dexterity: "+5",
      constitution: "+6",
    },
    skills: {
      athletics: "+10",
      performance: "+5",
    },
    languages: ["Aucune"],
    senses: {
      passivePerception: 11,
    },
    traits: [
      {
        name: "Escalade",
        description:
          "Peut grimper sur n'importe quelle surface rugueuse, y compris les murs et les plafonds, sans avoir besoin de faire un test d'athlétisme.",
      },
      {
        name: "Lance intégrée",
        description: "Ne peut pas être désarmé",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "3x lance OU 2x lance + 1 coup de bouclier",
      },
      {
        name: "Lance",
        type: "Melee",
        modifier: "+7",
        reach: "1.5 m",
        hit: "11 (2d6 + 4) Piercing damage.",
      },
      {
        name: "Coup de bouclier",
        description: "JdS FOR 15 ou 2d4 + 4 dégâts contondants. Si <= M état au sol.",
      },
    ],
    reactions: [
      {
        name: "Parade",
        description: "Attaqué au corps à corps, +3 au CA et peut faire rater.",
      },
    ],
  },
  vegepygmy: {
    name: "Végépygmé",
    id: "_vegepygmy",
    fiveETools: { name: "Vegepygmy", source: "VGM" },
    type: "Plant",
    size: "Small",
    alignment: "Neutral",
    armorClass: "13",
    hitPoints: "9 (2d6 + 2)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 0.25,
    abilities: {
      strength: 7,
      dexterity: 14,
      constitution: 13,
      intelligence: 6,
      wisdom: 11,
      charisma: 7,
    },
    savingThrows: {
      strength: "-2",
      dexterity: "+2",
      constitution: "+1",
      intelligence: "-2",
      wisdom: "+0",
      charisma: "-2",
    },
    skills: {
      perception: "+2",
      stealth: "+4",
    },
    resistances: ["lightning", "piercing"],
    senses: {
      darkvision: "18 m",
      passivePerception: 12,
    },
    languages: ["Vegepygmy"],
    traits: [
      {
        name: "Plant Camouflage",
        description:
          "The vegepygmy has advantage on Dexterity (Stealth) checks it makes in any terrain with ample obscuring plant life.",
      },
      {
        name: "Regeneration",
        description:
          "Regen 3 PV au début du tour. Stoppé par dégats Givre, feu ou nécrotique, ne fonctionne pas au prochain tour. Meurt seulement si pas de regen au début de son tour.",
      },
    ],
    actions: [
      {
        name: "Griffes",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "5 (1d6 + 2) slashing damage.",
      },
      {
        name: "Lance pierre",
        type: "Ranged",
        modifier: "+4",
        reach: "9/36 m",
        hit: "4 (1d4 + 2) bludgeoning damage.",
      },
    ],
  },
  "vegepygmy-chief": {
    name: "Chef végépygmé",
    id: "_vegepygmy-chief",
    fiveETools: { name: "Vegepygmy Chief", source: "VGM" },
    type: "Plant",
    size: "Small",
    alignment: "Neutral",
    armorClass: "14",
    hitPoints: "33 (6d6 + 12)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 2,
    abilities: {
      strength: 14,
      dexterity: 14,
      constitution: 14,
      intelligence: 7,
      wisdom: 12,
      charisma: 9,
    },
    savingThrows: {
      strength: "+2",
      dexterity: "+2",
      constitution: "+2",
      intelligence: "-2",
      wisdom: "+1",
      charisma: "-1",
    },
    skills: {
      perception: "+3",
      stealth: "+4",
    },
    resistances: ["lightning", "piercing"],
    senses: {
      darkvision: "18 m",
      passivePerception: 13,
    },
    languages: ["Vegepygmy"],
    traits: [
      {
        name: "Plant Camouflage",
        description:
          "The vegepygmy has advantage on Dexterity (Stealth) checks it makes in any terrain with ample obscuring plant life.",
      },
      {
        name: "Regeneration",
        description:
          "Regen 5 PV au début du tour. Stoppé par dégats Givre, feu ou nécrotique, ne fonctionne pas au prochain tour. Meurt seulement si pas de regen au début de son tour.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description: "2x giffes OU 2x lance.",
      },
      {
        name: "Griffes",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "5 (1d6 + 2) slashing –damage.",
      },
      {
        name: "Lance",
        type: "Melee or Ranged",
        modifier: "+4",
        reach: "1.5 m ou distance 6/18 m",
        hit: "5 (1d8 + 2) piercing damage",
      },
      {
        name: "Spores (1/jour)",
        description:
          "Nuage de 4.5m de rayon. JdS CON 12 ou empoisonné : 2d8 dégâts poison au début de chaque tour. Relancer JdS à la fin de chaque tour pour finir l'effet.",
      },
    ],
  },
  "vegepygmy-thorny": {
    name: "Végépygmé épineux",
    id: "_vegepygmy-thorny",
    fiveETools: { name: "Thorny", source: "VGM" },
    type: "Plant",
    size: "Medium",
    alignment: "Neutral",
    armorClass: "14",
    hitPoints: "27 (5d8 + 5)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 1,
    abilities: {
      strength: 13,
      dexterity: 12,
      constitution: 13,
      intelligence: 2,
      wisdom: 10,
      charisma: 6,
    },
    savingThrows: {
      strength: "+1",
      dexterity: "+1",
      constitution: "+1",
      intelligence: "-4",
      wisdom: "+0",
      charisma: "-2",
    },
    skills: {
      perception: "+4",
      stealth: "+3",
    },
    resistances: ["lightning", "piercing"],
    senses: {
      darkvision: "18 m",
      passivePerception: 14,
    },
    traits: [
      {
        name: "Plant Camouflage",
        description:
          "The thorny has advantage on Dexterity (Stealth) checks it makes in any terrain with ample obscuring plant life.",
      },
      {
        name: "Regeneration",
        description:
          "Regen 5 PV au début du tour. Stoppé par dégats Givre, feu ou nécrotique, ne fonctionne pas au prochain tour. Meurt seulement si pas de regen au début de son tour.",
      },
    ],
    actions: [
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+3",
        reach: "1.5 m",
        hit: "8 (2d6 + 1) piercing damage.",
      },
    ],
    reactions: [
      {
        name: "Corps épineux",
        description: "Inflige 1d6 dégâts aux créature en saisie",
      },
    ],
  },
  jaculi: {
    name: "Jaculi",
    id: "_jaculi",
    fiveETools: { name: "Jaculi", source: "ToA" },
    type: "Beast",
    size: "Large",
    alignment: "Unaligned",
    armorClass: "14",
    hitPoints: "30 (3d10)",
    speed: {
      walk: "9 m",
      climb: "6 m",
    },
    challengeRating: 0.5,
    abilities: {
      strength: 15,
      dexterity: 14,
      constitution: 11,
      intelligence: 2,
      wisdom: 8,
      charisma: 3,
    },
    skills: {
      athletics: "+4",
      perception: "+1",
      stealth: "+4",
    },
    senses: {
      blindSight: "9 m",
      passivePerception: 11,
    },
    traits: [
      {
        name: "Camouflage",
        description: "The jaculi has advantage on Dexterity (Stealth) checks made to hide.",
      },
      {
        name: "Keen Smell",
        description: "The jaculi has advantage on Wisdom (Perception) checks that rely on smell.",
      },
    ],
    actions: [
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "9 (2d6 + 2) piercing damage.",
      },
      {
        name: "Saut",
        description:
          "Saute 6c en ligne droite, fait une attaque morsure. Si le jaculi saute au moins 2c, l'attaque a l'avantage et inflige 2d6 dégâts supplémentaires.",
      },
    ],
  },
  "statue-archer": {
    name: "Archer statue",
    id: "_statue-archer",
    type: "Artificial",
    size: "Medium",
    armorClass: "17",
    hitPoints: "30 (6d10)",
    immunities: ["perçant", "contondant", "tranchant", "poison", "psi"],
    challengeRating: 1,
    senses: {
      trueSight: "18m",
    },
    actions: [
      {
        name: "Arc",
        type: "Distance",
        modifier: "+5",
        reach: "24/96 m",
        hit: "7 (1d8+1) piercing damage.",
      },
    ],
  },
  hadrosaurus: {
    name: "Hadrosaurus",
    id: "_hadrosaurus",
    fiveETools: { name: "Hadrosaurus", source: "VGM" },
    type: "Beast",
    size: "Large",
    alignment: "Unaligned",
    armorClass: "11",
    hitPoints: "19 (3d10 + 3)",
    speed: {
      walk: "12 m",
    },
    challengeRating: 0.25,
    abilities: {
      strength: 15,
      dexterity: 10,
      constitution: 13,
      intelligence: 2,
      wisdom: 10,
      charisma: 5,
    },
    savingThrows: {
      strength: "+2",
      dexterity: "+0",
      constitution: "+1",
      intelligence: "-4",
      wisdom: "+0",
      charisma: "-3",
    },
    skills: {
      perception: "+2",
    },
    senses: {
      passivePerception: 12,
    },
    actions: [
      {
        name: "Tail",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "7 (1d10 + 2) bludgeoning damage.",
      },
    ],
  },
  "grung-elite-warrior": {
    name: "Grung Eli.",
    id: "_grung-elite-warrior",
    fiveETools: { name: "Grung Elite Warrior", source: "VGM" },
    type: "Humanoid (Grung)",
    size: "Small",
    alignment: "Lawful Evil",
    armorClass: 13,
    hitPoints: "49 (9d6 + 18)",
    speed: {
      walk: "7.5 m",
      climb: "7.5 m",
    },
    challengeRating: 2,
    abilities: {
      strength: 7,
      dexterity: 16,
      constitution: 15,
      intelligence: 10,
      wisdom: 11,
      charisma: 12,
    },
    savingThrows: {
      strength: "-2",
      dexterity: "+5",
      constitution: "+2",
      intelligence: "+0",
      wisdom: "+0",
      charisma: "+1",
    },
    skills: {
      athletics: "+2",
      perception: "+2",
      stealth: "+5",
      survival: "+2",
    },
    immunities: ["poison", "poisoned"],
    senses: {
      passivePerception: 12,
    },
    languages: ["Grung"],
    traits: [
      {
        name: "Peau vénéneuse",
        description:
          "Toucher ou aggriper, JdS CON 12 ou empoisonné (selon couleur) pour 1 minute. Relancer JdS à la fin de chaque tour pour finir l'effet.",
      },
      {
        name: "Poison jaune",
        description: "Charmé et parle le Grung",
      },
      {
        name: "Poison orange",
        description: "Effrayé par ses alliés",
      },
      {
        name: "Poison rouge",
        description: "Utiliser son action pour manger la nourriture sur sois",
      },
      {
        name: "Poison vert",
        description:
          "Ne peut se déplacer qu'en grimpant ou en sautant sur place. Une créature volante est forcée à atterir.",
      },
      {
        name: "Poison mauve",
        description: "Se sent l'envie de se couvrir d'eau ou de vase. Ne peut qu'agir en ce sens.",
      },
      {
        name: "Poison bleu",
        description:
          "Doit crier ou fait un bruit fort au début et à la fin de son tour (peut jouer)",
      },
    ],
    actions: [
      {
        name: "Dague",
        type: "Melee or Ranged",
        modifier: "+5",
        reach: "1.5 m ou distance 6/18 m",
        hit: "5 (1d4 + 3) dégâts perçants, JdS CON 12 ou 2d4 poison.",
      },
      {
        name: "Arc court",
        type: "Ranged",
        modifier: "+5",
        reach: "24/96 m",
        hit: "6 (1d6 + 3) dégâts perçant, JdS CON 12 ou 2d4 poison.",
      },
      {
        name: "Cri envoutant (Recharge 6)",
        description: "JdS SAG 12 ou étourdit jusqu'à la fin du prochain tour du Grung",
      },
    ],
  },
  grung: {
    name: "Grung",
    id: "grung",
    type: "Humanoid (Grung)",
    size: "Small",
    alignment: "Lawful Evil",
    armorClass: 12,
    hitPoints: "11 (2d6 + 4)",
    speed: {
      walk: "7.5 m",
      climb: "7.5 m",
    },
    challengeRating: 0.25,
    abilities: {
      strength: 7,
      dexterity: 14,
      constitution: 15,
      intelligence: 10,
      wisdom: 11,
      charisma: 10,
    },
    savingThrows: {
      strength: "-2",
      dexterity: "+4",
      constitution: "+2",
      intelligence: "+0",
      wisdom: "+0",
      charisma: "+0",
    },
    skills: {
      athletics: "+2",
      perception: "+2",
      stealth: "+4",
      survival: "+2",
    },
    immunities: ["poison", "poisoned"],
    senses: {
      passivePerception: 12,
    },
    languages: ["Grung"],
    traits: [
      {
        name: "Peau vénéneuse",
        description:
          "Toucher ou aggriper, JdS CON 12 ou empoisonné (selon couleur) pour 1 minute. Relancer JdS à la fin de chaque tour pour finir l'effet.",
      },
      {
        name: "Poison jaune",
        description: "Charmé et parle le Grung",
      },
      {
        name: "Poison orange",
        description: "Effrayé par ses alliés",
      },
      {
        name: "Poison rouge",
        description: "Utiliser son action pour manger la nourriture sur sois",
      },
      {
        name: "Poison vert",
        description:
          "Ne peut se déplacer qu'en grimpant ou en sautant sur place. Une créature volante est forcée à atterir.",
      },
      {
        name: "Poison mauve",
        description: "Se sent l'envie de se couvrir d'eau ou de vase. Ne peut qu'agir en ce sens.",
      },
      {
        name: "Poison bleu",
        description:
          "Doit crier ou fait un bruit fort au début et à la fin de son tour (peut jouer)",
      },
    ],
    actions: [
      {
        name: "Dague",
        type: "Melee or Ranged",
        modifier: "+4",
        reach: "1.5 m ou portée 6/18 m",
        hit: "4 (1d4 + 2) dégâts perçants, JdS CON 12 ou 2d4 poison.",
      },
    ],
  },
  zorbo: {
    name: "Zorbo",
    id: "_zorbo",
    fiveETools: { name: "Zorbo", source: "ToA" },
    type: "Monstrosity",
    size: "Small",
    alignment: "Unaligned",
    armorClass: "10 (base) 17 (sanctuaire)",
    hitPoints: "27 (6d6 + 6)",
    speed: {
      walk: "9 m",
      climb: "9 m",
    },
    challengeRating: 0.5,
    abilities: {
      strength: 13,
      dexterity: 11,
      constitution: 13,
      intelligence: 3,
      wisdom: 12,
      charisma: 7,
    },
    savingThrows: {
      strength: "+1",
      dexterity: "+0",
      constitution: "+1",
      intelligence: "-4",
      wisdom: "+1",
      charisma: "-2",
    },
    skills: {
      athletics: "+3",
    },
    senses: {
      passivePerception: 11,
    },
    traits: [
      {
        name: "Résistance magique",
        description: "Avantage JdS contre sorts.",
      },
      {
        name: "Armure naturelle",
        description: "CA 15 bois ou os, CA 17 terre ou pierre, CA 19 métal. Sinon 10.",
      },
    ],
    actions: [
      {
        name: "Griffe destructrices",
        type: "Melee",
        modifier: "+3",
        reach: "1.5 m",
        hit: "8 (2d6 + 1) slashing damage.",
      },
    ],
  },
  "zorbo-acid": {
    name: "Zorbo (Acide)",
    id: "_zorbo-acid",
    type: "Monstrosity",
    size: "Small",
    alignment: "Unaligned",
    armorClass: "10 (base) 17 (sanctuaire)",
    hitPoints: "27 (6d6 + 6)",
    speed: {
      walk: "9 m",
      climb: "9 m",
    },
    challengeRating: 0.5,
    abilities: {
      strength: 13,
      dexterity: 11,
      constitution: 13,
      intelligence: 3,
      wisdom: 12,
      charisma: 7,
    },
    savingThrows: {
      strength: "+1",
      dexterity: "+0",
      constitution: "+1",
      intelligence: "-4",
      wisdom: "+1",
      charisma: "-2",
    },
    skills: {
      athletics: "+3",
    },
    senses: {
      passivePerception: 11,
    },
    traits: [
      {
        name: "Résistance magique",
        description: "Avantage JdS contre sorts.",
      },
      {
        name: "Armure naturelle",
        description: "CA 15 bois ou os, CA 17 terre ou pierre, CA 19 métal. Sinon 10.",
      },
    ],
    actions: [
      {
        name: "Griffe destructrices",
        type: "Melee",
        modifier: "+3",
        reach: "1.5 m",
        hit: "8 (2d6 + 1) slashing damage. JdS DEX 11 ou réduit de 1 la CA d'un objet d'armure portée (armure, bouclier, objet magique). Si l'objet atteint 0, il est détruit.",
      },
    ],
  },
  kuriboh: {
    name: "Kuriboh",
    id: "_kuriboh",
    type: "Bête",
    size: "Small",
    alignment: "Non aligné",
    armorClass: 13,
    hitPoints: "33",
    speed: {
      walk: "15 m",
      fly: "15 m",
    },
    challengeRating: 1,
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
  "yuan-ti-broodguard": {
    name: "Garde-couvée yuan-ti",
    id: "_yuan-ti-broodguard",
    fiveETools: { name: "Yuan-ti Broodguard", source: "VGM" },
    type: "Monstrosity",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: 14,
    hitPoints: "45 (7d8 + 14)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 2,
    abilities: {
      strength: 15,
      dexterity: 14,
      constitution: 14,
      intelligence: 6,
      wisdom: 11,
      charisma: 4,
    },
    savingThrows: {
      strength: "+4",
      dexterity: "+4",
      wisdom: "+2",
    },
    skills: {
      perception: "+2",
    },
    immunities: ["poison", "charmed", "paralyzed", "poisoned"],
    languages: ["Abyssal", "Common", "Draconic"],
    senses: {
      darkvision: "18 m",
      passivePerception: 12,
    },
    traits: [
      {
        name: "Téméraire",
        description:
          "Au début de son tour, peut gagner l'avantage à toutes ses attaques de mêlée du tour, mais les attaques contre lui ont l'avantage jusqu'au début de son prochain tour.",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "1x morsure + 2x griffes",
      },
      {
        name: "Morsure",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "6 (1d8 + 2) dégâts perçants.",
      },
      {
        name: "Griffes",
        type: "Melee",
        modifier: "+4",
        reach: "1.5 m",
        hit: "5 (1d6 + 2) dégâts tranchants.",
      },
    ],
  },
  "yuan-ti-pureblood": {
    name: "Sang-pur yuan-ti",
    id: "_yuan-ti-pureblood",
    fiveETools: { name: "Yuan-ti Pureblood", source: "MM" },
    type: "Humanoid (Yuan-ti)",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: 11,
    hitPoints: "40 (9d8)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 1,
    abilities: {
      strength: 11,
      dexterity: 12,
      constitution: 11,
      intelligence: 13,
      wisdom: 12,
      charisma: 14,
    },
    skills: {
      deception: "+6",
      perception: "+3",
      stealth: "+3",
    },
    immunities: ["poison", "poisoned"],
    languages: ["Abyssal", "Common", "Draconic"],
    senses: {
      darkvision: "18 m",
      passivePerception: 13,
    },
    traits: [
      {
        name: "Résistance magique",
        description: "Avantage aux JdS contre les sorts et effets magiques.",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "2x attaques de mêlée",
      },
      {
        name: "Cimeterre",
        type: "Melee",
        modifier: "+3",
        reach: "1.5 m",
        hit: "4 (1d6 + 1) dégâts tranchants.",
      },
      {
        name: "Arc court",
        type: "Ranged",
        modifier: "+3",
        reach: "24/96 m",
        hit: "4 (1d6 + 1) dégâts perçants + 7 (2d6) poison.",
      },
    ],
    spellStats: {
      attackMod: 4,
      spellDC: 12,
    },
    spells: [
      {
        id: "poison-spray",
        summary: "3/jour. 2 cases, JdS CON 12 ou 1d12 poison",
      },
    ],
  },
  "yuan-ti-nightmare-speaker": {
    name: "Diseuse de cauchemars yuan-ti",
    id: "_yuan-ti-nightmare-speaker",
    fiveETools: { name: "Yuan-ti Nightmare Speaker", source: "VGM" },
    type: "Monstrosity (Warlock)",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: 14,
    hitPoints: "71 (13d8 + 13)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 4,
    abilities: {
      strength: 16,
      dexterity: 14,
      constitution: 13,
      intelligence: 14,
      wisdom: 12,
      charisma: 16,
    },
    savingThrows: {
      wisdom: "+3",
      charisma: "+5",
    },
    skills: {
      deception: "+5",
      stealth: "+4",
    },
    immunities: ["poison", "poisoned"],
    languages: ["Abyssal", "Common", "Draconic"],
    senses: {
      darkvision: "36 m",
      passivePerception: 11,
    },
    traits: [
      {
        name: "Vision diabolique",
        description: "Les ténèbres magiques n'entravent pas sa vision dans le noir.",
      },
      {
        name: "Résistance magique",
        description: "Avantage aux JdS contre les sorts et effets magiques.",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "1x constriction + 1x cimeterre OU 2x crocs spectraux",
      },
      {
        name: "Constriction",
        type: "Melee",
        modifier: "+5",
        reach: "3 m",
        hit: "10 (2d6 + 3) dégâts contondants. Cible <= L agrippée (DD 14 pour se libérer) + entravée. 1 cible à la fois.",
      },
      {
        name: "Cimeterre (forme yuan-ti)",
        type: "Melee",
        modifier: "+5",
        reach: "1.5 m",
        hit: "6 (1d6 + 3) dégâts tranchants.",
      },
      {
        name: "Crocs spectraux",
        type: "Ranged",
        modifier: "+5",
        reach: "36 m",
        hit: "16 (3d8 + 3) dégâts nécrotiques.",
      },
      {
        name: "Invoquer un cauchemar (Recharge après un repos)",
        description:
          "Cible visible à 12 cases. JdS INT 13 ou 22 (4d10) psychiques + effrayée par une illusion de ses pires peurs (visible d'elle seule, 1 min, concentration). Relancer JdS à la fin de chaque tour : fin sur réussite, 11 (2d10) psychiques sur échec.",
      },
    ],
    bonusActions: [
      {
        name: "Changement de forme",
        description:
          "Se transforme en serpent M ou reprend sa vraie forme. Stats identiques, l'équipement n'est pas transformé.",
      },
    ],
    spellStats: {
      attackMod: 5,
      spellDC: 13,
    },
    spells: [
      {
        id: "darkness",
        summary: "2/jour. Sphère de ténèbres de 3 cases de rayon (10 min, concentration)",
      },
      {
        id: "fear",
        summary: "2/jour. Cône de 6 cases, JdS SAG 13 ou effrayé + fuite (1 min, concentration)",
      },
    ],
    behavior:
      "Cauchemar sur une cible isolée > Crocs spectraux à distance > Constriction + cimeterre en mêlée",
  },
  "ras-nsi": {
    name: "Ras Nsi",
    id: "_ras-nsi",
    fiveETools: { name: "Ras Nsi", source: "ToA" },
    type: "Monstrosity (Shapechanger, Yuan-ti)",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: 15,
    hitPoints: "107 (127 max, -1 par jour écoulé dans l'aventure)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 7,
    abilities: {
      strength: 17,
      dexterity: 16,
      constitution: 17,
      intelligence: 18,
      wisdom: 18,
      charisma: 21,
    },
    savingThrows: {
      constitution: "+6",
      wisdom: "+7",
    },
    skills: {
      deception: "+8",
      persuasion: "+8",
      religion: "+7",
      stealth: "+6",
    },
    immunities: ["poison", "poisoned"],
    languages: ["Abyssal", "Common", "Draconic"],
    senses: {
      darkvision: "18 m",
      passivePerception: 14,
    },
    traits: [
      {
        name: "Équipement spécial",
        description:
          "Porte des bracelets de défense, une épée longue langue-de-feu et une pierre de communication liée à celle du guide Salida.",
      },
      {
        name: "Métamorphe",
        description:
          "Action : se transforme en serpent M ou reprend sa forme yuan-ti. Stats identiques, l'équipement n'est pas transformé.",
      },
      {
        name: "Résistance magique",
        description: "Avantage aux JdS contre les sorts et effets magiques.",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "3x attaques de mêlée (constriction 1x max)",
      },
      {
        name: "Morsure (forme serpent)",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "5 (1d4 + 3) dégâts perçants + 7 (2d6) poison.",
      },
      {
        name: "Constriction",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "10 (2d6 + 3) dégâts contondants. Cible agrippée (DD 14 pour se libérer) + entravée. 1 cible à la fois.",
      },
      {
        name: "Épée langue-de-feu (forme yuan-ti)",
        type: "Melee",
        modifier: "+6",
        reach: "1.5 m",
        hit: "7 (1d8 + 3) tranchants, ou 8 (1d10 + 3) à deux mains, + 7 (2d6) feu.",
      },
    ],
    spellStats: {
      attackMod: 7,
      spellDC: 15,
      slots: {
        "1": 4,
        "2": 3,
        "3": 3,
        "4": 3,
        "5": 2,
        "6": 1,
      },
    },
    spells: [
      {
        id: "fire-bolt",
        summary: "Attaque +7, 2d10 feu",
      },
      {
        id: "fireball",
        summary: "Rayon 4 cases, JdS DEX 15 ou 8d6 feu (moitié si réussi)",
      },
      {
        id: "counterspell",
        summary: "Réaction. Annule un sort lancé à 12 cases",
      },
      {
        id: "shield",
        summary: "Réaction. +5 CA jusqu'au début de son prochain tour",
      },
      {
        id: "misty-step",
        summary: "Action bonus. Téléportation 6 cases",
      },
      {
        id: "hold-person",
        summary: "JdS SAG 15 ou paralysé. Relancer JdS fin de tour (1 min, concentration)",
      },
      {
        id: "blindness-deafness",
        summary: "JdS CON 15 ou aveuglé ou assourdi (1 min)",
      },
      {
        id: "blight",
        summary: "JdS CON 15 ou 8d8 nécrotiques (moitié si réussi)",
      },
      {
        id: "polymorph",
        summary: "JdS SAG 15 ou transformé en bête (1h, concentration)",
      },
      {
        id: "geas",
        summary:
          "Niv 5. JdS SAG 15 ou charmé : ordre imposé, 5d10 psychiques si désobéit (30 jours)",
      },
      {
        id: "animate-dead",
        summary: "Crée un squelette ou zombie depuis un cadavre",
      },
      {
        id: "create-undead",
        summary: "Crée jusqu'à 3 goules depuis des cadavres",
      },
      {
        id: "expeditious-retreat",
        summary: "Action bonus. Dash en action bonus (10 min, concentration)",
      },
      {
        id: "false-life",
        summary: "1d4 + 4 PV temporaires (1h)",
      },
      {
        id: "magic-missile",
        summary: "3 projectiles, 1d4 + 1 force chacun, touche automatiquement",
      },
      {
        id: "chill-touch",
        summary: "Attaque +7, 2d8 nécrotiques, pas de soins pour la cible (1 tour)",
      },
      {
        id: "poison-spray",
        summary: "2 cases, JdS CON 15 ou 2d12 poison",
      },
    ],
    behavior:
      "Contresort/Bouclier en réaction > Boule de feu groupée > Immobilisation > 3x épée langue-de-feu en mêlée. Fuit ou négocie si dominé.",
  },
  sekelok: {
    name: "Sekelok",
    id: "_sekelok",
    fiveETools: { name: "Sekelok", source: "ToA" },
    type: "Humanoid (Yuan-ti)",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: 18,
    hitPoints: "143 (22d8 + 44)",
    speed: {
      walk: "10.5 m",
    },
    challengeRating: 9,
    abilities: {
      strength: 20,
      dexterity: 15,
      constitution: 14,
      intelligence: 10,
      wisdom: 14,
      charisma: 12,
    },
    savingThrows: {
      strength: "+9",
      constitution: "+6",
    },
    skills: {
      athletics: "+9",
      intimidation: "+5",
      perception: "+6",
    },
    immunities: ["poison", "poisoned"],
    languages: ["Common", "Abyssal", "Draconic"],
    senses: {
      darkvision: "18 m",
      passivePerception: 16,
    },
    traits: [
      {
        name: "Indomptable (2/jour)",
        description: "Relance un JdS raté.",
      },
      {
        name: "Résistance magique",
        description: "Avantage aux JdS contre les sorts et effets magiques.",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "3x épée à deux mains OU 3x arc court",
      },
      {
        name: "Épée à deux mains",
        type: "Melee",
        modifier: "+9",
        reach: "1.5 m",
        hit: "12 (2d6 + 5) dégâts tranchants, + 7 (2d6) si Sekelok est au-dessus de 50% PV.",
      },
      {
        name: "Arc court",
        type: "Ranged",
        modifier: "+6",
        reach: "24/96 m",
        hit: "5 (1d6 + 2) dégâts perçants, + 7 (2d6) si Sekelok est au-dessus de 50% PV.",
      },
    ],
    bonusActions: [
      {
        name: "Second souffle (Recharge après un repos)",
        description: "Récupère 20 PV.",
      },
    ],
    spellStats: {
      attackMod: 5,
      spellDC: 13,
    },
    spells: [
      {
        id: "poison-spray",
        summary: "2 cases, JdS CON 13 ou 2d12 poison",
      },
    ],
  },
  "artus-cimber": {
    name: "Artus Cimber",
    id: "_artus-cimber",
    fiveETools: { name: "Artus Cimber", source: "ToA" },
    type: "Humanoid (Human)",
    size: "Medium",
    alignment: "Neutral Good",
    armorClass: 14,
    hitPoints: "82 (15d8 + 15)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 7,
    abilities: {
      strength: 10,
      dexterity: 15,
      constitution: 13,
      intelligence: 17,
      wisdom: 16,
      charisma: 18,
    },
    savingThrows: {
      dexterity: "+5",
      charisma: "+7",
    },
    skills: {
      deception: "+7",
      history: "+9",
      insight: "+6",
      survival: "+9",
    },
    immunities: ["cold (Ring of Winter)"],
    languages: ["Common", "Draconic", "Dwarvish", "Goblin"],
    senses: {
      passivePerception: 13,
    },
    traits: [
      {
        name: "Équipement spécial",
        description: "Anneau de l'hiver (12 charges) + Bookmark (dague +3)",
      },
    ],
    actions: [
      {
        name: "Attaques multiples",
        description: "3x Signet/arc long OU 1x sort",
      },
      {
        name: "Signet (dague +3)",
        type: "Melee",
        modifier: "+8",
        reach: "1.5 m",
        hit: "7 (1d4 + 5) dégâts perçants.",
      },
      {
        name: "Arc long",
        type: "Ranged",
        modifier: "+5",
        reach: "45/180 m",
        hit: "6 (1d8 + 2) dégâts perçants.",
      },
    ],
    spellStats: {
      attackMod: 9,
      spellDC: 17,
    },
    spells: [
      // {
      //   id: "bigby-s-hand",
      //   summary:
      //     "2 ch. La main est faite de glace, immunisée au froid, inflige des dégâts contondants au lieu de force (poing serré).",
      // },
      // {
      //   id: "cone-of-cold",
      //   summary: "2 ch. Cône de 18 m. JdS CON 17 : 8d8 froid (moitié si réussi).",
      // },
      // {
      //   id: "flesh-to-stone",
      //   summary: "3 ch.  Pétrification, mais de glace",
      // },
      // {
      //   id: "ice-storm",
      //   summary:
      //     "2 ch. Rayon de 6 m. JdS DEX 17 : 2d8 contondant + 4d6 froid (moitié si réussi). La zone devient un terrain difficile.",
      // },
      // {
      //   id: "otiluke-s-freezing-sphere",
      //   summary: "3 ch. Sphère de 12 m de rayon. JdS CON 17 : 10d6 froid (moitié si réussi).",
      // },
      {
        id: "sleet-storm",
        summary:
          "1 ch. Cylindre de 12 m de rayon : terrain difficile, zone fortement obscurcie, flammes exposées éteintes. Entrer ou y commencer tour : JdS DEX 17 ou au sol + déconcentré",
      },
      // {
      //   id: "spike-growth",
      //   summary:
      //     "1 ch. glace - 6m R, terrain difficile, 2d4 givre par case parcourus dans la zone.",
      // },
      {
        id: "wall-of-ice",
        summary:
          "2 ch. Conc. 10 min. 10 panneaux de 3 m ou dôme, 12CA, 30PV. Apparition : JdS DEX 17 ou 10d6 givre (moitié). Traverser la nappe du mur brisé : JdS DEX 17, 5d6 froid (moitié). ",
      },
    ],
  },
  "valindra-shadowmantle": {
    name: "Valindra Shadowmantle",
    id: "_valindra-shadowmantle",
    fiveETools: { name: "Valindra Shadowmantle", source: "ToA" },
    type: "Undead",
    size: "Medium",
    alignment: "Neutral Evil",
    armorClass: 17,
    hitPoints: "135 (18d8 + 54)",
    speed: {
      walk: "9 m",
    },
    challengeRating: 21,
    abilities: {
      strength: 11,
      dexterity: 16,
      constitution: 16,
      intelligence: 20,
      wisdom: 14,
      charisma: 16,
    },
    savingThrows: {
      constitution: "+10",
      intelligence: "+12",
      wisdom: "+9",
    },
    skills: {
      arcana: "+19",
      history: "+12",
      insight: "+9",
      perception: "+9",
    },
    resistances: ["cold", "lightning", "necrotic"],
    immunities: [
      "poison",
      "bludgeoning, piercing, and slashing from nonmagical attacks",
      "charmed",
      "exhaustion",
      "frightened",
      "paralyzed",
      "poisoned",
    ],
    languages: ["Common", "Abyssal", "Draconic", "Dwarvish", "Elvish", "Infernal"],
    senses: {
      trueSight: "36 m",
      passivePerception: 19,
    },
    traits: [
      {
        name: "Masque",
        description:
          "En action bonus, prend l'apparence d'une elfe vivante. Dure jusqu'à ce qu'elle l'annule (action bonus), utilise Regard terrifiant, tombe à 30 PV ou moins, ou subit Dissipation de la magie.",
      },
      {
        name: "Préparation",
        description:
          "Peut échanger un sort préparé contre un autre sort de magicien de même niveau.",
      },
      {
        name: "Résistance légendaire (3/jour)",
        description: "Sur un JdS raté, peut choisir de réussir à la place.",
      },
      {
        name: "Renaissance",
        description:
          "Si détruite, renaît dans un nouveau corps en 1d10 jours (PV au max), à 1 case de son phylactère.",
      },
      {
        name: "Résistance au renvoi",
        description: "Avantage aux JdS contre le renvoi des morts-vivants.",
      },
    ],
    actions: [
      {
        name: "Contact paralysant",
        type: "Melee",
        modifier: "+12",
        reach: "1.5 m",
        hit: "10 (3d6) dégâts de froid. JdS CON 18 ou paralysé 1 min (relance le JdS en fin de tour).",
      },
    ],
    legendaryActions: [
      {
        name: "Sort mineur (1)",
        description: "Valindra lance un sort mineur.",
      },
      {
        name: "Contact paralysant (2)",
        description: "Valindra utilise son Contact paralysant.",
      },
      {
        name: "Regard terrifiant (2)",
        description:
          "Une créature visible dans 2 cases : JdS SAG 18 ou effrayée 1 min (relance en fin de tour). En cas de réussite ou de fin d'effet, immunisée 24 h.",
      },
      {
        name: "Perturbation de la vie (3)",
        description:
          "Chaque créature non morte-vivante dans 4 cases : JdS CON 18, 21 (6d6) dégâts nécrotiques (moitié si réussi).",
      },
    ],
    legendaryActionsSlots: "3",
    spellStats: {
      attackMod: 12,
      spellDC: 20,
      slots: {
        "1": 4,
        "2": 3,
        "3": 3,
        "4": 3,
        "5": 3,
        "6": 1,
        "7": 1,
        "8": 1,
        "9": 1,
      },
    },
    spells: [
      {
        id: "ray-of-frost",
        summary: "Attaque +12, 1d8 froid, vitesse -2 cases",
      },
      {
        id: "magic-missile",
        summary: "3 projectiles, 1d4 + 1 force chacun, touche automatiquement",
      },
      {
        id: "shield",
        summary: "Réaction. +5 CA jusqu'au prochain tour, bloque Projectile magique",
      },
      {
        id: "thunderwave",
        summary: "Cube 3c, JdS CON 20 ou 2d8 tonnerre + repoussé (moitié)",
      },
      {
        id: "invisibility",
        summary: "Invisible jusqu'à attaque/sort (concentration, 1h)",
      },
      {
        id: "melf-s-acid-arrow",
        summary: "Attaque +12, 4d4 acide + 2d4 au tour suivant",
      },
      {
        id: "mirror-image",
        summary: "3 leurres, détournent les attaques",
      },
      {
        id: "animate-dead",
        summary: "Anime un squelette/zombie sous son contrôle",
      },
      {
        id: "counterspell",
        summary: "Réaction. Annule un sort adverse (niv ≤ 3 auto)",
      },
      {
        id: "dispel-magic",
        summary: "Dissipe les effets magiques (niv ≤ 3 auto)",
      },
      {
        id: "fireball",
        summary: "Sphère 4 cases, JdS DEX 20 ou 8d6 feu (moitié si réussi)",
      },
      {
        id: "blight",
        summary: "JdS CON 20 ou 8d8 nécrotiques (moitié si réussi)",
      },
      {
        id: "dimension-door",
        summary: "Téléportation jusqu'à 100 cases",
      },
      {
        id: "cloudkill",
        summary: "Nuage 4 cases, JdS CON 20 ou 5d8 poison (concentration, se déplace)",
      },
      {
        id: "scrying",
        summary: "Espionne une cible à distance (JdS SAG 20, concentration)",
      },
      {
        id: "disintegrate",
        summary: "JdS DEX 20 ou 10d6 + 40 force ; réduit en poussière si tué",
      },
      {
        id: "globe-of-invulnerability",
        summary: "Bloque les sorts de niv ≤ 5 dans 2 cases (concentration)",
      },
      {
        id: "finger-of-death",
        summary: "JdS CON 20 ou 7d8 + 30 nécrotiques (moitié si réussi) ; tué = zombie",
      },
      {
        id: "plane-shift",
        summary: "Voyage vers un autre plan (JdS CHA 20 pour cible récalcitrante)",
      },
      {
        id: "dominate-monster",
        summary: "JdS SAG 20 ou charmée et contrôlée (concentration, 1h)",
      },
      {
        id: "power-word-stun",
        summary: "Cible ≤ 150 PV étourdie (pas de JdS)",
      },
      {
        id: "power-word-kill",
        summary: "Tue instantanément une cible ≤ 100 PV (pas de JdS)",
      },
    ],
  },
};
