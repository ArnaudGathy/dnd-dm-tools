import { Encounter } from "@/types/types";

export const encounters: Encounter[] = [
  {
    name: "Quartier des entrepôts - Ankylo",
    id: 61,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Port Nyanzaru",
      mapMarker: "P1",
    },
    ennemies: {
      "1": [
        {
          id: "ankylosaurus",
          color: "orange",
        },
      ],
    },
    informations: [
      "Ajouter Rokah au combat.",
      "Rokah endort la créature avec sa sarbacane quand ça tourne au vinaigre",
    ],
    youtubeId: "fqW--C1hxl8",
  },
  {
    name: "Cave - Gorge de Malar",
    id: 62,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Port Nyanzaru",
      mapMarker: "P2",
    },
    ennemies: {
      "1": [
        {
          id: "zombie",
          color: "#aad09a",
        },
        {
          id: "zombie",
          color: "#57abbb",
        },
        {
          id: "zombie",
          color: "#d3bf69",
        },
      ],
    },
    youtubeId: "2GX9lVHfnxs",
  },
  {
    name: "Taverne - Bandits",
    id: 63,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Port Nyanzaru",
      mapMarker: "P3",
    },
    ennemies: {
      "1": [
        {
          id: "bandit",
          color: "#f10000",
        },
        {
          id: "bandit",
          color: "#1c8811",
        },
        {
          id: "bandit",
          color: "#1383c5",
        },
        {
          id: "bandit",
          color: "#fd7400",
        },
      ],
    },
    youtubeId: "NYtPB459e6Y",
  },
  {
    name: "Plage - pirates",
    id: 65,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Fort Beluarian",
      mapMarker: "FB1",
    },
    ennemies: {
      "1": [
        {
          id: "bandit",
          variant: "cimeterre",
          color: "#CA9F63",
        },
        {
          id: "bandit",
          variant: "cimeterre",
          color: "#6F8451",
        },
        {
          id: "bandit",
          variant: "cimeterre",
          color: "#49535F",
        },
        {
          id: "bandit",
          variant: "pistolet",
          color: "#CA9F63",
        },
        {
          id: "bandit",
          variant: "pistolet",
          color: "#6F8451",
        },
        {
          id: "bandit",
          variant: "pistolet",
          color: "#49535F",
        },
      ],
    },
    informations: ["Lorsque plus que 2 en vie, prennent la fuite vers le bateau."],
    loots: [
      "Carte (physique a donner)",
      "7po 15pa",
      "plume de ptéranodon (décorative)",
      "une caisse de poudre noire de 30kg",
    ],
    youtubeId: "2GX9lVHfnxs",
  },
  {
    name: "Goules & zombies",
    id: 66,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Fort Beluarian",
      mapMarker: "FB2",
    },
    ennemies: {
      "1": [
        {
          id: "zombie",
          color: "#aad09a",
        },
        {
          id: "zombie",
          color: "#57abbb",
        },
        {
          id: "zombie",
          color: "#d3bf69",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#1fa483",
        },
        {
          id: "ghoul",
          variant: "femme",
          color: "#8dd549",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#A0A667",
        },
      ],
    },
    informations: ["Voir comportement sur Notion."],
    loots: [
      "20 po par tête de goule",
      "10 po par tête de zombie",
      "1 amulette mécanique",
      "1 joueur roll 1d100 dans la table de loots",
    ],
    youtubeId: "w54512C_A2k",
  },
  {
    name: "Guenaudes marines",
    id: 64,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC1",
    },
    ennemies: {
      "1": [
        {
          id: "sea-hag",
          color: "#817D98",
        },
        {
          id: "sea-hag",
          color: "#788892",
        },
        {
          id: "sea-hag",
          color: "#96766D",
        },
      ],
    },
    informations: [
      "Déguisement DD13. Baihu OK",
      "Utilise vile apparence dès que qqun est à portée",
    ],
    loots: [
      "Fiole de Venin de serpent (JdS CON 11 (moitié) ou 3d6 dmg)",
      "Un étrange masque en bois peint, serti de 9 gemmes (10po chacune)",
      "Une carte indiquant Mbala (pointer sur la carte des joueurs.",
      "Elle est annotée avec les textes suivants :",
      "La vieille ne dort jamais",
      "Ce qui pourrit en haut nourrit ce qui rampe en bas",
    ],
    youtubeId: "8Q7cioftmKs",
  },
  {
    name: "Goules & zombies",
    id: 67,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC2",
    },
    ennemies: {
      "1": [
        {
          id: "zombie",
          color: "#aad09a",
        },
        {
          id: "zombie",
          color: "#57abbb",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#1fa483",
        },
        {
          id: "ghoul",
          variant: "homme",
          color: "#A0A667",
        },
      ],
    },
    youtubeId: "5iMeaTItPhE",
  },
  {
    name: "Ptérosaurien dans la glace",
    id: 68,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC3",
    },
    ennemies: {
      "1": ["_pterafolk", "_pterafolk", "_pterafolk"],
    },
    informations: [
      "Artus Cimber pop au 2eme ou 3eme tour et lance glacification sur un ptérosaurien qui se fracasse en 1000 morceaux au sol.",
    ],
    youtubeId: "5iMeaTItPhE",
  },
  {
    name: "Totem de guerre Batiri",
    id: 69,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC4",
    },
    ennemies: {
      "1": [
        {
          id: "_batiri-battle-stack",
          color: "#aad09a",
        },
        {
          id: "_batiri-battle-stack",
          color: "#d08403",
        },
      ],
    },
    youtubeId: "06QeWIOvHHI",
  },
  {
    name: "Troupe de chasse Batari",
    id: 70,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Camp Vertu",
      mapMarker: "CV1",
    },
    ennemies: {
      "1": [
        {
          id: "_deinonychus",
          color: "#30850e",
        },
        {
          id: "_deinonychus",
          color: "#d52c06",
        },
        {
          id: "goblin-warrior",
          color: "#a88204",
        },
        {
          id: "goblin-warrior",
          color: "#025e13",
        },
        {
          id: "axe-beak",
          color: "#09255e",
        },
        {
          id: "axe-beak",
          color: "#efb500",
        },
      ],
    },
    youtubeId: "jFGq3nwApvA",
  },
  {
    name: "Lianes assassines",
    id: 71,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC5",
    },
    ennemies: {
      "1": [
        {
          id: "_assassin-vine",
          color: "#699846",
        },
        {
          id: "_assassin-vine",
          color: "#5E4737",
        },
        {
          id: "swarm-of-bats",
          color: "#C64C38",
        },
        {
          id: "swarm-of-bats",
          color: "#7D9D85",
        },
        {
          id: "swarm-of-bats",
          color: "#3D444A",
        },
        {
          id: "swarm-of-insects",
          color: "#4D8E31",
        },
        {
          id: "swarm-of-insects",
          color: "#6B5032",
        },
        {
          id: "swarm-of-insects",
          color: "#40204A",
        },
      ],
    },
    youtubeId: "morqY2DkGuk",
  },
  {
    name: "Village de Yellyark",
    id: 72,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Yellyark",
      mapMarker: "Y1",
    },
    ennemies: {
      "1": [
        {
          id: "swarm-of-insects",
          color: "#4D8E31",
        },
        {
          id: "swarm-of-insects",
          variant: "1",
          color: "#6B5032",
        },
        {
          id: "swarm-of-insects",
          color: "#40204A",
        },
        {
          id: "swarm-of-insects",
          color: "#8D9190",
        },
        {
          id: "swarm-of-insects",
          color: "#496B5D",
        },
        {
          id: "swarm-of-insects",
          variant: "2",
          color: "#6B5032",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#ff0000",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#463636",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#7a00ff",
        },
        {
          id: "goblin-warrior",
          variant: "Epee",
          color: "#296c0b",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#ff0000",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#463636",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#7a00ff",
        },
        {
          id: "goblin-warrior",
          variant: "Arc",
          color: "#296c0b",
        },
        { id: "goblin-boss", color: "#6B5032" },
      ],
    },
    youtubeId: "jFGq3nwApvA",
  },
  {
    name: "Attrape-homme",
    id: 73,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Nangaloré",
      mapMarker: "NG1",
    },
    ennemies: {
      "1": [
        {
          id: "_mantrap",
          color: "#BB564E",
        },
        {
          id: "_yellow-musk-creeper",
          color: "#F4ED37",
        },
        {
          id: "_yellow-musk-zombie",
          color: "#566142",
        },
        {
          id: "_yellow-musk-zombie",
          variant: "fleur",
          color: "#566142",
        },
        {
          id: "_yellow-musk-zombie",
          color: "#B89250",
        },
        {
          id: "_yellow-musk-zombie",
          variant: "fleur",
          color: "#B89250",
        },
        {
          id: "_yellow-musk-zombie",
          color: "#BC5D8C",
        },
        {
          id: "_yellow-musk-zombie",
          variant: "fleur",
          color: "#BC5D8C",
        },
      ],
    },
    informations: ["3 zombies pop au 1er tour", "3 zombies au 2eme tour"],
  },
  {
    name: "Zalkoré",
    id: 74,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Nangaloré",
      mapMarker: "NG2",
    },
    ennemies: {
      "1": [
        {
          id: "_zalkore",
          color: "#85BE43",
        },
        {
          id: "_eblis",
          color: "#B66F40",
        },
        {
          id: "_eblis",
          color: "#31384D",
        },
        {
          id: "_eblis",
          color: "#5F9EBF",
        },
        {
          id: "_meme-poupou",
          color: "#AF512B",
        },
        {
          id: "_flesh-golem",
          color: "#814F3D",
          inactive: true,
        },
        {
          id: "will-o--wisp",
          color: "#76D8DB",
          inactive: true,
        },
        {
          id: "will-o--wisp",
          color: "#CC61C2",
          inactive: true,
        },
        {
          id: "will-o--wisp",
          color: "#E3BA50",
          inactive: true,
        },
        {
          id: "_chaudron",
          inactive: true,
        },
      ],
    },
    youtubeId: "Ud7e2Qvm5Mg",
  },
  {
    name: "Treant",
    id: 75,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC6",
    },
    ennemies: {
      "1": [
        {
          id: "_treant",
          color: "#E6D645",
        },
        {
          id: "_treant-weak-spot",
          variant: "3",
          color: "#fff300",
        },
        {
          id: "_treant-weak-spot",
          variant: "2",
          color: "#0015ff",
        },
        {
          id: "_treant-weak-spot",
          variant: "1",
          color: "#fd0000",
        },
        {
          id: "_zombie-triceratops",
          color: "#A8943F",
        },
        {
          id: "_zombie-triceratops",
          color: "#905954",
        },
        {
          id: "zombie",
          color: "#5fd1e4",
        },
        {
          id: "zombie",
          color: "#b1ed66",
        },
        {
          id: "zombie",
          color: "#fdef52",
        },
      ],
    },
    youtubeId: "n8bmE76sETo",
  },
  {
    name: "Le roi des plumes",
    id: 76,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O13",
    },
    ennemies: {
      "1": [
        {
          id: "_king-of-feathers",
          color: "#93dc1e",
        },
        {
          id: "_deinonychus",
          color: "#30850e",
          inactive: true,
        },
        {
          id: "_deinonychus",
          color: "#d52c06",
          inactive: true,
        },
        {
          id: "_deinonychus",
          color: "#30616C",
          inactive: true,
        },
        {
          id: "_deinonychus",
          color: "#B2457B",
          inactive: true,
        },
      ],
    },
    youtubeId: "Yx-QqEc2Feg",
  },
  {
    name: "Grotte monstres de Su",
    id: 77,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC7",
    },
    ennemies: {
      "1": [
        "_su-monster",
        "_su-monster",
        "_su-monster",
        "_su-monster",
        "_su-monster",
        "_su-monster",
        "_su-monster",
        "_su-monster",
        "_su-monster",
        "_su-monster",
      ],
    },
  },
  {
    name: "Epreuve de la Veuve",
    id: 78,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC8",
    },
    ennemies: {
      "1": [
        { id: "_widow-zombie", variant: "1" },
        { id: "_widow-zombie", variant: "2", inactive: true },
        { id: "_widow-zombie", variant: "3", inactive: true },
        { id: "_widow-zombie", variant: "4", inactive: true },
        { id: "_widow-zombie", variant: "5", inactive: true },
        { id: "_widow-zombie", variant: "6", inactive: true },
      ],
    },
  },
  {
    name: "Epreuve de Peggy Mortecloche",
    id: 79,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Jungle du Chult",
      mapMarker: "JC9",
    },
    ennemies: {
      "1": [
        { id: "_la-mort", variant: "1" },
        { id: "_le-temps", variant: "2", inactive: true },
        { id: "_le-bon", variant: "3", inactive: true },
        { id: "_la-folie", variant: "4", inactive: true },
      ],
    },
  },
  {
    name: "Gargouilles (falaises)",
    id: 80,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O1",
    },
    ennemies: {
      "1": ["gargoyle"],
    },
  },
  {
    name: "Aléatoire : Stirges",
    id: 81,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O97",
    },
    ennemies: {
      "1": [
        {
          id: "stirge",
          variant: "1",
          color: "#bd3333",
        },
        {
          id: "stirge",
          variant: "1",
          color: "#0b1e4f",
        },
        {
          id: "stirge",
          variant: "1",
          color: "#055f93",
        },
        {
          id: "stirge",
          variant: "1",
          color: "#db81f1",
        },
        {
          id: "stirge",
          variant: "2",
          color: "#bd3333",
        },
        {
          id: "stirge",
          variant: "2",
          color: "#0b1e4f",
        },
        {
          id: "stirge",
          variant: "2",
          color: "#055f93",
        },
        {
          id: "stirge",
          variant: "2",
          color: "#db81f1",
        },
        {
          id: "swarm-of-bats",
          color: "#C64C38",
        },
        {
          id: "swarm-of-bats",
          color: "#7D9D85",
        },
        {
          id: "swarm-of-bats",
          color: "#3D444A",
        },
      ],
    },
    loots: ["Roll table"],
    youtubeId: "n8bmE76sETo",
  },
  {
    name: "Aléatoire : Assassin vines",
    id: 82,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O98",
    },
    ennemies: {
      "1": [
        {
          id: "_assassin-vine",
          color: "#699846",
        },
        {
          id: "_assassin-vine",
          color: "#5E4737",
        },
        {
          id: "_yellow-musk-creeper",
          color: "#F4ED37",
        },
      ],
    },
    loots: ["Roll table"],
    youtubeId: "l6pwrEnOUSA",
  },
  {
    name: "Aléatoire : Gargouilles",
    id: 83,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O99",
    },
    ennemies: {
      "1": [
        { id: "gargoyle", color: "#D7AB38" },
        { id: "gargoyle", color: "#6F5236" },
        { id: "gargoyle", color: "#DDEEF9" },
        { id: "gargoyle", color: "#555554" },
        { id: "gargoyle", color: "#65aaca" },
      ],
    },
    informations: ["Arrête le combat après 2 morts ou 50%"],
    loots: ["Roll table"],
    youtubeId: "GMXiYs-wi3A",
  },
  {
    name: "Sanctuaire de Kubazan",
    id: 84,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O3",
    },
    ennemies: {
      "1": [{ id: "_froghemoth", color: "#85A553" }],
    },
    informations: ["Est dans le livre de Volo", "Grosse vulnérabilité à la foudre"],
    youtubeId: "UFJiNIyrTXo",
  },
  {
    name: "Sanctuaire de Shagambi",
    id: 85,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O4",
    },
    ennemies: {
      "1": [
        { id: "_kamadan", color: "#FAF46D" },
        { id: "_kamadan", color: "#B96924" },
      ],
    },
    youtubeId: "hJnG5tAVbH8",
  },
  {
    name: "Sanctuaire de Shagambi",
    id: 86,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O4D",
    },
    ennemies: {
      "1": [
        { id: "_clay-gladitator", color: "#B69C53" },
        { id: "_clay-gladitator", color: "#6C89A1" },
        { id: "_clay-gladitator", color: "#5A8045" },
        { id: "_clay-gladitator", color: "#8E3A34" },
      ],
    },
    youtubeId: "hJnG5tAVbH8",
  },
  {
    name: "Sacrifice du feu (vegépygmés)",
    id: 87,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O5",
    },
    ennemies: {
      "1": [
        { id: "_vegepygmy", variant: "1" },
        { id: "_vegepygmy", variant: "2" },
        { id: "_vegepygmy", variant: "3" },
        { id: "_vegepygmy", variant: "4" },
        { id: "_vegepygmy", variant: "5" },
        { id: "_vegepygmy", variant: "6" },
        { id: "_vegepygmy", variant: "7" },
        { id: "_vegepygmy", variant: "8" },
        { id: "_vegepygmy-chief" },
        { id: "_vegepygmy-thorny" },
      ],
    },
    loots: ["Roll table"],
    youtubeId: "QnX4rkyygOg",
  },
  {
    name: "Sanctuaire de Moa",
    id: 88,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O6A",
    },
    ennemies: {
      "1": [
        { id: "_jaculi", color: "#5D495C" },
        { id: "_jaculi", color: "#62779A" },
        { id: "_jaculi", color: "#B99D60" },
        { id: "_jaculi", color: "#995245" },
        { id: "_jaculi", color: "#8F905A" },
      ],
    },
    youtubeId: "8Q7cioftmKs",
  },
  {
    name: "Sanctuaire de Moa",
    id: 89,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O6C",
    },
    ennemies: {
      "1": [{ id: "_statue-archer", variant: "x12", shouldHideInInitiativeTracker: true }],
    },
    environmentTurnInitiative: "20",
  },
  {
    name: "Avertissement d'Acererak",
    id: 90,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Tombe des neufs dieux",
      mapMarker: "T1",
    },
    ennemies: {
      "1": [{ id: "nalfeshnee", color: "#479BAD" }],
    },
    youtubeId: "L9dhkINF5Vk",
  },
  {
    name: "Sanctuaire de Nangnang",
    id: 91,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O18",
    },
    ennemies: {
      "1": [
        { id: "_grung-elite-warrior", variant: "jaune" },
        { id: "_grung-elite-warrior", variant: "orange 1" },
        { id: "_grung-elite-warrior", variant: "orange 2" },
        { id: "_grung-elite-warrior", variant: "orange 3" },
        { id: "_grung-elite-warrior", variant: "orange 4" },
        { id: "_grung-elite-warrior", variant: "rouge, toit" },
        { id: "_grung", variant: "vert, toit 1" },
        { id: "_grung", variant: "vert, toit 2" },
        { id: "_grung", variant: "vert, toit 3" },
        { id: "_grung", variant: "vert, toit 4" },
        { id: "_grung", variant: "vert, toit 5" },
        { id: "_grung", variant: "vert, toit 6" },
        { id: "_grung", variant: "vert, toit 7" },
        { id: "_grung", variant: "vert 1" },
        { id: "_grung", variant: "vert 2" },
        { id: "_grung", variant: "vert 2" },
        { id: "_grung", variant: "vert 2" },
        "_hadrosaurus",
      ],
    },
    youtubeId: "2GX9lVHfnxs",
  },
  {
    name: "Arbre déraciné",
    id: 92,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O7",
    },
    ennemies: {
      "1": ["assassin"],
    },
    informations: [
      "1ere attaque : gros dégats",
      "Se cache après chaque attaque (jet Discrétion DD 15, résultat = DD perception à réussir)",
      "Se rend a 50% PV",
    ],
    youtubeId: "eVJSMUViEWw",
  },
  {
    name: "Sanctuaire de Unkh",
    id: 93,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O8",
    },
    ennemies: {
      "1": [
        {
          id: "ghast",
          color: "#d3bf69",
        },
        {
          id: "ghast",
          variant: "homme",
          color: "#1fa483",
        },
        {
          id: "ghast",
          variant: "femme",
          color: "#8dd549",
        },
        {
          id: "ghast",
          variant: "homme",
          color: "#A0A667",
        },
      ],
    },
    youtubeId: "n9KsWzdxi4Y",
  },
  {
    name: "Sanctuaire de Wongo",
    id: 94,
    scenario: "La tombe de l'annihilation",
    location: {
      name: "Omu",
      mapMarker: "O12",
    },
    ennemies: {
      "1": [
        {
          id: "steam-mephit",
          color: "#D467D6",
          variant: "1",
        },
        {
          id: "steam-mephit",
          color: "#D467D6",
          variant: "2",
        },
        {
          id: "steam-mephit",
          color: "#273039",
          variant: "1",
        },
        {
          id: "steam-mephit",
          color: "#273039",
          variant: "2",
        },
        {
          id: "steam-mephit",
          color: "#D4E1D8",
          variant: "1",
        },
        {
          id: "steam-mephit",
          color: "#D4E1D8",
          variant: "2",
        },
      ],
    },
    youtubeId: "LV1ONUee-Fg",
  },
];
