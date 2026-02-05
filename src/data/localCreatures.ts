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
    senses: { passivePerception: 14 },
    traits: [
      {
        name: "Detect Invisibility",
        description:
          "The King of Feathers can see invisible creatures and objects as if they were visible.",
      },
      {
        name: "Legendary Resistance (3/Day)",
        description:
          "If the King of Feathers fails a saving throw, it can choose to succeed instead.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        description:
          "The King of Feathers makes two attacks: one with its bite and one with its tail. It can’t make both attacks against the same target.",
      },
      {
        name: "Bite",
        type: "Melee",
        modifier: "+10",
        reach: "3 m",
        hit: "33 (4d12 + 7) piercing damage. If the target is Medium or smaller, it is grappled (escape DC 17). Until the grapple ends, the target is restrained, and the tyrannosaurus can’t bite another target.",
      },
      {
        name: "Tail",
        type: "Melee",
        modifier: "+10",
        reach: "3 m",
        hit: "20 (3d8 + 7) bludgeoning damage.",
      },
      {
        name: "Summon Swarm (Recharge 5–6)",
        description:
          "The King of Feathers exhales a swarm of insects (wasps) that forms in a space within 6 m of it. The swarm acts as its ally and takes its turn immediately after it. The swarm disperses after 1 minute. The King of Feathers cannot use this action while it is grappling a creature with its jaws.",
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
};
