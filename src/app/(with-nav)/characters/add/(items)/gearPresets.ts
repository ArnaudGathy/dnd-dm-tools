/**
 * Adventuring gear from the 2024 Player's Handbook ("Adventuring Gear",
 * chap. 6), used to autofill an inventory entry. French names follow AideDD
 * (https://www.aidedd.org/regles-24/equipement/materiel-daventurier/);
 * descriptions are French translations of the PHB text with metric
 * distances. Table-based entries (munitions, focaliseurs, symboles sacrés,
 * parchemins de sort) are split into their concrete purchasable variants.
 * Weight has no InventoryItem field, so it is not part of the preset.
 */
export type GearPreset = {
  name: string;
  /** English 2024 name, matched by the quick-add search alongside the French name. */
  nameEn: string;
  /** Pre-formatted cost, e.g. "25 po" — maps to InventoryItem.value. */
  value: string;
  /** Bundle size when the item is sold in batches (flèches ×20…). Defaults to 1. */
  quantity?: number;
  description: string;
  /**
   * For packs (paquetages): the gear this preset unpacks into. Selecting the
   * preset adds these entries to the inventory instead of the pack itself.
   */
  contents?: { key: string; quantity?: number }[];
};

export const GEAR_PRESETS: Record<string, GearPreset> = {
  // Contenants
  backpack: {
    name: "Sac à dos",
    nameEn: "Backpack",
    value: "2 po",
    description: "Contient jusqu'à 15 kg dans 30 litres. Peut aussi servir de sacoche de selle.",
  },
  barrel: {
    name: "Tonneau",
    nameEn: "Barrel",
    value: "2 po",
    description: "Contient jusqu'à 150 litres de liquide ou 110 litres de denrées sèches.",
  },
  basket: {
    name: "Panier",
    nameEn: "Basket",
    value: "4 pa",
    description: "Contient jusqu'à 20 kg dans 60 litres.",
  },
  "bottle-glass": {
    name: "Bouteille en verre",
    nameEn: "Bottle, Glass",
    value: "2 po",
    description: "Contient jusqu'à 70 cl.",
  },
  bucket: {
    name: "Seau",
    nameEn: "Bucket",
    value: "5 pc",
    description: "Contient jusqu'à 15 litres.",
  },
  "case-crossbow-bolt": {
    name: "Étui pour carreaux d'arbalète",
    nameEn: "Case, Crossbow Bolt",
    value: "1 po",
    description: "Contient jusqu'à 20 carreaux d'arbalète.",
  },
  "case-map-scroll": {
    name: "Étui à cartes ou à parchemins",
    nameEn: "Case, Map or Scroll",
    value: "1 po",
    description: "Contient jusqu'à 10 feuilles de papier ou 5 feuilles de parchemin.",
  },
  chest: {
    name: "Coffre",
    nameEn: "Chest",
    value: "5 po",
    description: "Contient jusqu'à 340 litres.",
  },
  flask: {
    name: "Flasque",
    nameEn: "Flask",
    value: "2 pc",
    description: "Contient jusqu'à 50 cl.",
  },
  jug: {
    name: "Cruche",
    nameEn: "Jug",
    value: "2 pc",
    description: "Contient jusqu'à 4 litres.",
  },
  "pot-iron": {
    name: "Pot en fer",
    nameEn: "Pot, Iron",
    value: "2 po",
    description: "Contient jusqu'à 4 litres.",
  },
  pouch: {
    name: "Sacoche",
    nameEn: "Pouch",
    value: "5 pa",
    description: "Contient jusqu'à 3 kg dans 6 litres.",
  },
  quiver: {
    name: "Carquois",
    nameEn: "Quiver",
    value: "1 po",
    description: "Contient jusqu'à 20 flèches.",
  },
  sack: {
    name: "Sac",
    nameEn: "Sack",
    value: "1 pc",
    description: "Contient jusqu'à 15 kg dans 30 litres.",
  },
  vial: {
    name: "Fiole",
    nameEn: "Vial",
    value: "1 po",
    description: "Contient jusqu'à 12 cl.",
  },
  waterskin: {
    name: "Outre",
    nameEn: "Waterskin",
    value: "2 pa",
    description:
      "Contient jusqu'à 2 litres. Si vous ne buvez pas suffisamment d'eau, vous risquez la déshydratation.",
  },

  // Lumière & feu
  candle: {
    name: "Bougie",
    nameEn: "Candle",
    value: "1 pc",
    description:
      "Pendant 1 heure, une bougie allumée émet une lumière vive dans un rayon de 1,50 m et une lumière faible sur 1,50 m de plus.",
  },
  lamp: {
    name: "Lampe",
    nameEn: "Lamp",
    value: "5 pa",
    description:
      "Brûle de l'huile pour projeter une lumière vive dans un rayon de 4,50 m et une lumière faible sur 9 m de plus.",
  },
  "lantern-bullseye": {
    name: "Lanterne sourde",
    nameEn: "Lantern, Bullseye",
    value: "10 po",
    description:
      "Brûle de l'huile pour projeter une lumière vive dans un cône de 18 m et une lumière faible sur 18 m de plus.",
  },
  "lantern-hooded": {
    name: "Lanterne à capote",
    nameEn: "Lantern, Hooded",
    value: "5 po",
    description:
      "Brûle de l'huile pour projeter une lumière vive dans un rayon de 9 m et une lumière faible sur 9 m de plus. Par une action Bonus, vous pouvez rabattre la capote (la lumière est réduite à une lumière faible dans un rayon de 1,50 m) ou la relever.",
  },
  oil: {
    name: "Huile",
    nameEn: "Oil",
    value: "1 pa",
    description:
      "Lorsque vous entreprenez l'action Attaque, vous pouvez remplacer une de vos attaques par le lancer d'une flasque d'huile sur une créature ou un objet dans un rayon de 6 m. La cible doit réussir un jet de sauvegarde de Dextérité (DD 8 + votre modificateur de Dextérité + votre bonus de maîtrise) sous peine d'être couverte d'huile ; si elle subit des dégâts de feu avant que l'huile ne sèche (1 minute), elle subit 5 dégâts de feu supplémentaires. Par une action Utilisation, vous pouvez aussi verser la flasque au sol pour couvrir une zone de 1,50 m de côté dans un rayon de 1,50 m : enflammée, l'huile brûle 2 rounds et inflige 5 dégâts de feu à toute créature qui entre dans la zone ou y termine son tour (une fois par tour au maximum). Sert enfin de carburant : une flasque alimente une lampe ou une lanterne pendant 6 heures.",
  },
  tinderbox: {
    name: "Boîte à amadou",
    nameEn: "Tinderbox",
    value: "5 pa",
    description:
      "Petit contenant renfermant silex, briquet d'acier et amadou (généralement un chiffon sec imbibé d'huile légère). Allumer une bougie, une lampe, une lanterne ou une torche — ou tout autre combustible exposé — demande une action Bonus ; allumer tout autre feu demande 1 minute.",
  },
  torch: {
    name: "Torche",
    nameEn: "Torch",
    value: "1 pc",
    description:
      "Brûle pendant 1 heure, projetant une lumière vive dans un rayon de 6 m et une lumière faible sur 6 m de plus. Lorsque vous entreprenez l'action Attaque, vous pouvez attaquer avec la torche comme avec une arme de corps à corps courante : 1 dégât de feu en cas de coup au but.",
  },

  // Outils & exploration
  "ball-bearings": {
    name: "Billes",
    nameEn: "Ball Bearings",
    value: "1 po",
    description:
      "Par une action Utilisation, vous pouvez répandre les billes de leur sacoche : elles couvrent une zone plane de 3 m de côté dans un rayon de 3 m. Une créature qui entre dans la zone pour la première fois lors d'un tour doit réussir un jet de sauvegarde de Dextérité DD 10 sous peine de subir l'état À terre. Récupérer les billes prend 10 minutes.",
  },
  bell: {
    name: "Cloche",
    nameEn: "Bell",
    value: "1 po",
    description: "Agitée par une action Utilisation, la cloche émet un son audible jusqu'à 18 m.",
  },
  "block-and-tackle": {
    name: "Palan",
    nameEn: "Block and Tackle",
    value: "1 po",
    description:
      "Permet de hisser jusqu'à quatre fois le poids que vous pouvez normalement soulever.",
  },
  caltrops: {
    name: "Chausse-trappes",
    nameEn: "Caltrops",
    value: "1 po",
    description:
      "Par une action Utilisation, vous pouvez répandre les chausse-trappes de leur sac sur une zone de 1,50 m de côté dans un rayon de 1,50 m. Une créature qui entre dans la zone pour la première fois lors d'un tour doit réussir un jet de sauvegarde de Dextérité DD 15 sous peine de subir 1 dégât perforant et de voir sa Vitesse réduite à 0 jusqu'au début de son prochain tour. Récupérer les chausse-trappes prend 10 minutes.",
  },
  chain: {
    name: "Chaîne",
    nameEn: "Chain",
    value: "5 po",
    description:
      "Par une action Utilisation, vous pouvez enrouler la chaîne autour d'une créature récalcitrante dans un rayon de 1,50 m subissant l'état Agrippé, Neutralisé ou Entravé, si vous réussissez un test de Force (Athlétisme) DD 13. Si les jambes de la créature sont entravées, elle subit l'état Entravé jusqu'à ce qu'elle se libère. S'échapper de la chaîne demande de réussir un test de Dextérité (Acrobaties) DD 18 par une action ; la rompre demande un test de Force (Athlétisme) DD 20 par une action.",
  },
  "climbers-kit": {
    name: "Matériel d'escalade",
    nameEn: "Climber's Kit",
    value: "25 po",
    description:
      "Comprend des pointes de chaussures, des gants, des pitons et un harnais. Par une action Utilisation, vous pouvez vous ancrer : vous ne pouvez alors pas chuter à plus de 7,50 m du point d'ancrage, ni vous en éloigner de plus de 7,50 m sans défaire l'ancrage par une action Bonus.",
  },
  crowbar: {
    name: "Pied-de-biche",
    nameEn: "Crowbar",
    value: "2 po",
    description:
      "Vous donne l'avantage aux tests de Force pour lesquels son effet de levier peut être exploité.",
  },
  "grappling-hook": {
    name: "Grappin",
    nameEn: "Grappling Hook",
    value: "2 po",
    description:
      "Par une action Utilisation, vous pouvez lancer le grappin vers une rambarde, une corniche ou une autre prise dans un rayon de 15 m : il s'accroche si vous réussissez un test de Dextérité (Acrobaties) DD 13. Si vous y avez attaché une corde, vous pouvez ensuite y grimper.",
  },
  "hunting-trap": {
    name: "Piège à mâchoires",
    nameEn: "Hunting Trap",
    value: "5 po",
    description:
      "Par une action Utilisation, vous pouvez armer ce cercle d'acier denté, qui se referme quand une créature marche sur la plaque de pression centrale. Le piège est fixé par une lourde chaîne à un objet immobile. La créature qui marche sur la plaque doit réussir un jet de sauvegarde de Dextérité DD 13 sous peine de subir 1d4 dégâts perforants et de voir sa Vitesse réduite à 0 jusqu'au début de son prochain tour. Tant qu'elle ne s'est pas libérée, ses déplacements sont limités par la longueur de la chaîne (1 m environ). Une créature peut utiliser son action pour tenter un test de Force (Athlétisme) DD 13, se libérant elle-même ou une créature à sa portée en cas de réussite ; chaque échec inflige 1 dégât perforant à la créature piégée.",
  },
  ladder: {
    name: "Échelle",
    nameEn: "Ladder",
    value: "1 pa",
    description: "Haute de 3 m. Vous devez l'escalader pour monter ou descendre.",
  },
  lock: {
    name: "Cadenas",
    nameEn: "Lock",
    value: "10 po",
    description:
      "Livré avec une clé. Sans la clé, une créature peut le crocheter avec des outils de voleur en réussissant un test de Dextérité (Escamotage) DD 15.",
  },
  "magnifying-glass": {
    name: "Loupe",
    nameEn: "Magnifying Glass",
    value: "100 po",
    description:
      "Accorde l'avantage aux tests de caractéristique visant à estimer ou à examiner un objet très détaillé. Allumer un feu avec une loupe demande une lumière aussi vive que celle du soleil, de l'amadou et environ 5 minutes.",
  },
  manacles: {
    name: "Menottes",
    nameEn: "Manacles",
    value: "2 po",
    description:
      "Par une action Utilisation, vous pouvez entraver une créature récalcitrante de taille P ou M dans un rayon de 1,50 m subissant l'état Agrippé, Neutralisé ou Entravé, si vous réussissez un test de Dextérité (Escamotage) DD 13. Une créature menottée a le désavantage à ses jets d'attaque, et subit l'état Entravé si les menottes sont fixées à une chaîne ou à un crochet immobile. S'en échapper demande un test de Dextérité (Escamotage) DD 20 par une action ; les rompre, un test de Force (Athlétisme) DD 25 par une action. Chaque paire est livrée avec une clé ; sans elle, on peut crocheter la serrure avec des outils de voleur (test de Dextérité (Escamotage) DD 15).",
  },
  mirror: {
    name: "Miroir",
    nameEn: "Mirror",
    value: "5 po",
    description:
      "Miroir d'acier portatif, utile pour les soins de toilette, mais aussi pour regarder à un angle et renvoyer la lumière en guise de signal.",
  },
  net: {
    name: "Filet",
    nameEn: "Net",
    value: "1 po",
    description:
      "Lorsque vous entreprenez l'action Attaque, vous pouvez remplacer une de vos attaques par le lancer d'un filet sur une créature visible dans un rayon de 4,50 m. La cible doit réussir un jet de sauvegarde de Dextérité (DD 8 + votre modificateur de Dextérité + votre bonus de maîtrise) sous peine de subir l'état Entravé jusqu'à ce qu'elle s'échappe (réussite automatique si elle est de taille TG ou supérieure). Pour s'échapper, la cible ou une créature dans un rayon de 1,50 m doit utiliser une action pour réussir un test de Force (Athlétisme) DD 10. Détruire le filet (CA 10 ; 5 pv ; immunité aux dégâts contondants, de poison et psychiques) libère aussi la cible.",
  },
  pole: {
    name: "Perche",
    nameEn: "Pole",
    value: "5 pc",
    description:
      "Longue de 3 m, elle permet de toucher quelque chose jusqu'à 3 m de distance. Si vous devez effectuer un test de Force (Athlétisme) lors d'un saut en hauteur ou en longueur, vous pouvez sauter à la perche et obtenir l'avantage à ce test.",
  },
  "ram-portable": {
    name: "Bélier portable",
    nameEn: "Ram, Portable",
    value: "4 po",
    description:
      "Sert à enfoncer les portes : vous gagnez un bonus de +4 au test de Force. Un autre personnage peut vous aider à le manier, vous donnant l'avantage à ce test.",
  },
  rope: {
    name: "Corde",
    nameEn: "Rope",
    value: "1 po",
    description:
      "Par une action Utilisation, vous pouvez faire un nœud si vous réussissez un test de Dextérité (Escamotage) DD 10. La corde peut être rompue par un test de Force (Athlétisme) DD 20. Vous ne pouvez ligoter une créature récalcitrante que si elle subit l'état Agrippé, Neutralisé ou Entravé. Si ses jambes sont liées, elle subit l'état Entravé jusqu'à ce qu'elle s'échappe, ce qui demande de réussir un test de Dextérité (Acrobaties) DD 15 par une action.",
  },
  shovel: {
    name: "Pelle",
    nameEn: "Shovel",
    value: "2 po",
    description:
      "En 1 heure de travail, permet de creuser un trou de 1,50 m de côté dans la terre ou un matériau semblable.",
  },
  "signal-whistle": {
    name: "Sifflet",
    nameEn: "Signal Whistle",
    value: "5 pc",
    description:
      "Soufflé par une action Utilisation, le sifflet produit un son audible jusqu'à 180 m.",
  },
  "spikes-iron": {
    name: "Pointes en fer",
    nameEn: "Spikes, Iron",
    value: "1 po",
    quantity: 10,
    description:
      "Vendues par lots de dix. Par une action Utilisation, vous pouvez en planter une dans le bois, la terre ou un matériau semblable à l'aide d'un objet contondant (comme un marteau léger), afin de bloquer une porte ou d'y attacher une corde ou une chaîne.",
  },
  spyglass: {
    name: "Longue-vue",
    nameEn: "Spyglass",
    value: "1 000 po",
    description:
      "Les objets observés à travers la longue-vue sont grossis au double de leur taille.",
  },
  string: {
    name: "Ficelle",
    nameEn: "String",
    value: "1 pa",
    description: "Longue de 3 m. Vous pouvez y faire un nœud par une action Utilisation.",
  },

  // Repos & survie
  bedroll: {
    name: "Sac de couchage",
    nameEn: "Bedroll",
    value: "1 po",
    description:
      "Convient à une créature de taille P ou M. Dans un sac de couchage, vous réussissez automatiquement vos jets de sauvegarde contre le froid extrême.",
  },
  blanket: {
    name: "Couverture",
    nameEn: "Blanket",
    value: "5 pa",
    description:
      "Enveloppé dans une couverture, vous avez l'avantage aux jets de sauvegarde contre le froid extrême.",
  },
  rations: {
    name: "Rations",
    nameEn: "Rations",
    value: "5 pa",
    description:
      "Nourriture de voyage pour 1 jour : viande séchée, fruits secs, biscuits de mer et noix.",
  },
  tent: {
    name: "Tente",
    nameEn: "Tent",
    value: "2 po",
    description: "Abrite jusqu'à deux créatures de taille P ou M.",
  },

  // Vêtements
  "clothes-fine": {
    name: "Beaux habits",
    nameEn: "Clothes, Fine",
    value: "15 po",
    description:
      "Confectionnés dans des étoffes coûteuses et ornés de détails d'expert. Certains lieux et événements n'admettent que les personnes ainsi vêtues.",
  },
  "clothes-travelers": {
    name: "Tenue de voyage",
    nameEn: "Clothes, Traveler's",
    value: "2 po",
    description: "Vêtements résistants, conçus pour voyager dans des environnements variés.",
  },
  costume: {
    name: "Costume",
    nameEn: "Costume",
    value: "5 po",
    description:
      "Tant que vous portez ce costume, vous avez l'avantage aux tests de caractéristique effectués pour vous faire passer pour la personne ou le type de personne qu'il représente.",
  },
  robe: {
    name: "Robe",
    nameEn: "Robe",
    value: "1 po",
    description:
      "Revêt une signification professionnelle ou cérémonielle. Certains lieux et événements n'admettent que les personnes portant une robe arborant certaines couleurs ou certains symboles.",
  },

  // Écriture & savoir
  book: {
    name: "Livre",
    nameEn: "Book",
    value: "25 po",
    description:
      "Contient une œuvre de fiction ou de savoir. Si vous consultez un ouvrage documentaire fiable sur son sujet, vous gagnez un bonus de +5 aux tests d'Intelligence (Arcanes, Histoire, Nature ou Religion) portant sur ce sujet.",
  },
  ink: {
    name: "Encre",
    nameEn: "Ink",
    value: "10 po",
    description: "Flacon de 30 ml, de quoi écrire environ 500 pages.",
  },
  "ink-pen": {
    name: "Porte-plume",
    nameEn: "Ink Pen",
    value: "2 pc",
    description: "Sert à écrire ou à dessiner, à l'aide d'encre.",
  },
  map: {
    name: "Carte",
    nameEn: "Map",
    value: "1 po",
    description:
      "Si vous consultez une carte fiable, vous gagnez un bonus de +5 aux tests de Sagesse (Survie) effectués pour trouver votre chemin dans le lieu qu'elle représente.",
  },
  paper: {
    name: "Papier",
    nameEn: "Paper",
    value: "2 pa",
    description: "Une feuille peut contenir environ 250 mots manuscrits.",
  },
  parchment: {
    name: "Parchemin",
    nameEn: "Parchment",
    value: "1 pa",
    description: "Une feuille peut contenir environ 250 mots manuscrits.",
  },

  // Alchimie & soins
  acid: {
    name: "Acide",
    nameEn: "Acid",
    value: "25 po",
    description:
      "Lorsque vous entreprenez l'action Attaque, vous pouvez remplacer une de vos attaques par le lancer d'une fiole d'acide sur une créature ou un objet visible dans un rayon de 6 m. La cible doit réussir un jet de sauvegarde de Dextérité (DD 8 + votre modificateur de Dextérité + votre bonus de maîtrise) sous peine de subir 2d6 dégâts d'acide.",
  },
  "alchemists-fire": {
    name: "Feu grégeois",
    nameEn: "Alchemist's Fire",
    value: "50 po",
    description:
      "Lorsque vous entreprenez l'action Attaque, vous pouvez remplacer une de vos attaques par le lancer d'une flasque de feu grégeois sur une créature ou un objet visible dans un rayon de 6 m. La cible doit réussir un jet de sauvegarde de Dextérité (DD 8 + votre modificateur de Dextérité + votre bonus de maîtrise) sous peine de subir 1d4 dégâts de feu et de prendre feu.",
  },
  antitoxin: {
    name: "Antidote",
    nameEn: "Antitoxin",
    value: "50 po",
    description:
      "Par une action Bonus, vous pouvez boire une fiole d'antidote pour obtenir l'avantage aux jets de sauvegarde visant à éviter l'état Empoisonné ou à y mettre fin, et ce pendant 1 heure.",
  },
  "healers-kit": {
    name: "Trousse de soins",
    nameEn: "Healer's Kit",
    value: "5 po",
    description:
      "Dix utilisations. Par une action Utilisation, vous pouvez en dépenser une pour stabiliser une créature Inconsciente à 0 point de vie, sans avoir à effectuer de test de Sagesse (Médecine).",
  },
  "holy-water": {
    name: "Eau bénite",
    nameEn: "Holy Water",
    value: "25 po",
    description:
      "Lorsque vous entreprenez l'action Attaque, vous pouvez remplacer une de vos attaques par le lancer d'une flasque d'eau bénite sur une créature visible dans un rayon de 6 m. La cible doit réussir un jet de sauvegarde de Dextérité (DD 8 + votre modificateur de Dextérité + votre bonus de maîtrise) sous peine de subir 2d8 dégâts radiants si c'est un fiélon ou un mort-vivant.",
  },
  perfume: {
    name: "Parfum",
    nameEn: "Perfume",
    value: "5 po",
    description:
      "Fiole de 12 cl. Pendant 1 heure après vous être parfumé, vous avez l'avantage aux tests de Charisme (Persuasion) effectués pour influencer un humanoïde Indifférent dans un rayon de 1,50 m.",
  },
  "poison-basic": {
    name: "Poison standard",
    nameEn: "Poison, Basic",
    value: "100 po",
    description:
      "Par une action Bonus, vous pouvez enduire de poison une arme ou jusqu'à trois munitions. Une créature qui subit des dégâts perforants ou tranchants de l'arme ou des munitions empoisonnées subit 1d4 dégâts de poison supplémentaires. Une fois appliqué, le poison reste efficace 1 minute ou jusqu'à ce qu'il inflige ses dégâts.",
  },
  "potion-of-healing": {
    name: "Potion de guérison",
    nameEn: "Potion of Healing",
    value: "50 po",
    description:
      "Objet magique. Par une action Bonus, vous pouvez la boire ou l'administrer à une créature dans un rayon de 1,50 m. La créature qui boit le liquide rouge magique de cette fiole récupère 2d4 + 2 points de vie.",
  },
  "spell-scroll-cantrip": {
    name: "Parchemin de sort (sort mineur)",
    nameEn: "Spell Scroll (Cantrip)",
    value: "30 po",
    description:
      "Objet magique portant les mots d'un sort mineur, déterminé par le créateur du parchemin. Si le sort figure sur la liste de sorts de votre classe, vous pouvez lire le parchemin et lancer le sort avec son temps d'incantation normal, sans fournir de composantes matérielles. Si le sort demande un jet de sauvegarde ou un jet d'attaque, le DD est de 13 et le bonus d'attaque de +5. Le parchemin se désintègre une fois l'incantation achevée.",
  },
  "spell-scroll-level-1": {
    name: "Parchemin de sort (1er niveau)",
    nameEn: "Spell Scroll (Level 1)",
    value: "50 po",
    description:
      "Objet magique portant les mots d'un sort de niveau 1, déterminé par le créateur du parchemin. Si le sort figure sur la liste de sorts de votre classe, vous pouvez lire le parchemin et lancer le sort avec son temps d'incantation normal, sans fournir de composantes matérielles. Si le sort demande un jet de sauvegarde ou un jet d'attaque, le DD est de 13 et le bonus d'attaque de +5. Le parchemin se désintègre une fois l'incantation achevée.",
  },

  // Focaliseurs & symboles
  "arcane-focus-crystal": {
    name: "Focaliseur arcanique (cristal)",
    nameEn: "Arcane Focus (Crystal)",
    value: "10 po",
    description:
      "Orné de joyaux ou gravé pour canaliser la magie profane. Un ensorceleur, un occultiste ou un magicien peut l'utiliser comme focaliseur d'incantation.",
  },
  "arcane-focus-orb": {
    name: "Focaliseur arcanique (orbe)",
    nameEn: "Arcane Focus (Orb)",
    value: "20 po",
    description:
      "Orné de joyaux ou gravé pour canaliser la magie profane. Un ensorceleur, un occultiste ou un magicien peut l'utiliser comme focaliseur d'incantation.",
  },
  "arcane-focus-rod": {
    name: "Focaliseur arcanique (sceptre)",
    nameEn: "Arcane Focus (Rod)",
    value: "10 po",
    description:
      "Orné de joyaux ou gravé pour canaliser la magie profane. Un ensorceleur, un occultiste ou un magicien peut l'utiliser comme focaliseur d'incantation.",
  },
  "arcane-focus-staff": {
    name: "Focaliseur arcanique (bâton)",
    nameEn: "Arcane Focus (Staff)",
    value: "5 po",
    description:
      "Orné de joyaux ou gravé pour canaliser la magie profane ; peut aussi servir de bâton de combat. Un ensorceleur, un occultiste ou un magicien peut l'utiliser comme focaliseur d'incantation.",
  },
  "arcane-focus-wand": {
    name: "Focaliseur arcanique (baguette)",
    nameEn: "Arcane Focus (Wand)",
    value: "10 po",
    description:
      "Orné de joyaux ou gravé pour canaliser la magie profane. Un ensorceleur, un occultiste ou un magicien peut l'utiliser comme focaliseur d'incantation.",
  },
  "druidic-focus-mistletoe": {
    name: "Focaliseur druidique (brin de gui)",
    nameEn: "Druidic Focus (Sprig of Mistletoe)",
    value: "1 po",
    description:
      "Sculpté, orné de rubans ou peint pour canaliser la magie primordiale. Un druide ou un rôdeur peut l'utiliser comme focaliseur d'incantation.",
  },
  "druidic-focus-staff": {
    name: "Focaliseur druidique (bâton en bois)",
    nameEn: "Druidic Focus (Wooden Staff)",
    value: "5 po",
    description:
      "Sculpté, orné de rubans ou peint pour canaliser la magie primordiale ; peut aussi servir de bâton de combat. Un druide ou un rôdeur peut l'utiliser comme focaliseur d'incantation.",
  },
  "druidic-focus-yew-wand": {
    name: "Focaliseur druidique (baguette en if)",
    nameEn: "Druidic Focus (Yew Wand)",
    value: "10 po",
    description:
      "Sculpté, orné de rubans ou peint pour canaliser la magie primordiale. Un druide ou un rôdeur peut l'utiliser comme focaliseur d'incantation.",
  },
  "holy-symbol-amulet": {
    name: "Symbole sacré (amulette)",
    nameEn: "Holy Symbol (Amulet)",
    value: "5 po",
    description:
      "Orné de joyaux ou peint pour canaliser la magie divine. Un clerc ou un paladin peut l'utiliser comme focaliseur d'incantation. L'amulette se porte sur soi ou se tient en main.",
  },
  "holy-symbol-emblem": {
    name: "Symbole sacré (emblème)",
    nameEn: "Holy Symbol (Emblem)",
    value: "5 po",
    description:
      "Orné de joyaux ou peint pour canaliser la magie divine. Un clerc ou un paladin peut l'utiliser comme focaliseur d'incantation. L'emblème s'arbore sur un tissu (tabard, bannière) ou sur un bouclier.",
  },
  "holy-symbol-reliquary": {
    name: "Symbole sacré (reliquaire)",
    nameEn: "Holy Symbol (Reliquary)",
    value: "5 po",
    description:
      "Orné de joyaux ou peint pour canaliser la magie divine. Un clerc ou un paladin peut l'utiliser comme focaliseur d'incantation. Le reliquaire se tient en main.",
  },

  // Munitions
  arrows: {
    name: "Flèches",
    nameEn: "Arrows",
    value: "1 po",
    quantity: 20,
    description:
      "Munitions pour les armes dotées de la propriété Munitions (arcs). Vendues par 20 ; se rangent dans un carquois (vendu séparément).",
  },
  bolts: {
    name: "Carreaux d'arbalète",
    nameEn: "Bolts",
    value: "1 po",
    quantity: 20,
    description:
      "Munitions pour les armes dotées de la propriété Munitions (arbalètes). Vendus par 20 ; se rangent dans un étui pour carreaux (vendu séparément).",
  },
  "firearm-bullets": {
    name: "Balles d'arme à feu",
    nameEn: "Bullets, Firearm",
    value: "3 po",
    quantity: 10,
    description:
      "Munitions pour les armes à feu dotées de la propriété Munitions. Vendues par 10 ; se rangent dans une sacoche (vendue séparément).",
  },
  "sling-bullets": {
    name: "Billes de fronde",
    nameEn: "Bullets, Sling",
    value: "4 pc",
    quantity: 20,
    description:
      "Munitions pour les frondes. Vendues par 20 ; se rangent dans une sacoche (vendue séparément).",
  },
  needles: {
    name: "Aiguilles de sarbacane",
    nameEn: "Needles",
    value: "1 po",
    quantity: 50,
    description:
      "Munitions pour les sarbacanes. Vendues par 50 ; se rangent dans une sacoche (vendue séparément).",
  },

  // Paquetages
  "burglars-pack": {
    name: "Paquetage de cambrioleur",
    nameEn: "Burglar's Pack",
    value: "16 po",
    description:
      "Contient : un sac à dos, des billes, une cloche, 10 bougies, un pied-de-biche, une lanterne à capote, 7 flasques d'huile, 5 jours de rations, une corde, une boîte à amadou et une outre.",
    contents: [
      { key: "backpack" },
      { key: "ball-bearings" },
      { key: "bell" },
      { key: "candle", quantity: 10 },
      { key: "crowbar" },
      { key: "lantern-hooded" },
      { key: "oil", quantity: 7 },
      { key: "rations", quantity: 5 },
      { key: "rope" },
      { key: "tinderbox" },
      { key: "waterskin" },
    ],
  },
  "diplomats-pack": {
    name: "Paquetage de diplomate",
    nameEn: "Diplomat's Pack",
    value: "39 po",
    description:
      "Contient : un coffre, de beaux habits, de l'encre, 5 porte-plumes, une lampe, 2 étuis à cartes ou à parchemins, 4 flasques d'huile, 5 feuilles de papier, 5 feuilles de parchemin, du parfum et une boîte à amadou.",
    contents: [
      { key: "chest" },
      { key: "clothes-fine" },
      { key: "ink" },
      { key: "ink-pen", quantity: 5 },
      { key: "lamp" },
      { key: "case-map-scroll", quantity: 2 },
      { key: "oil", quantity: 4 },
      { key: "paper", quantity: 5 },
      { key: "parchment", quantity: 5 },
      { key: "perfume" },
      { key: "tinderbox" },
    ],
  },
  "dungeoneers-pack": {
    name: "Paquetage d'exploration souterraine",
    nameEn: "Dungeoneer's Pack",
    value: "12 po",
    description:
      "Contient : un sac à dos, des chausse-trappes, un pied-de-biche, 2 flasques d'huile, 10 jours de rations, une corde, une boîte à amadou, 10 torches et une outre.",
    contents: [
      { key: "backpack" },
      { key: "caltrops" },
      { key: "crowbar" },
      { key: "oil", quantity: 2 },
      { key: "rations", quantity: 10 },
      { key: "rope" },
      { key: "tinderbox" },
      { key: "torch", quantity: 10 },
      { key: "waterskin" },
    ],
  },
  "entertainers-pack": {
    name: "Paquetage d'artiste",
    nameEn: "Entertainer's Pack",
    value: "40 po",
    description:
      "Contient : un sac à dos, un sac de couchage, une cloche, une lanterne sourde, 3 costumes, un miroir, 8 flasques d'huile, 9 jours de rations, une boîte à amadou et une outre.",
    contents: [
      { key: "backpack" },
      { key: "bedroll" },
      { key: "bell" },
      { key: "lantern-bullseye" },
      { key: "costume", quantity: 3 },
      { key: "mirror" },
      { key: "oil", quantity: 8 },
      { key: "rations", quantity: 9 },
      { key: "tinderbox" },
      { key: "waterskin" },
    ],
  },
  "explorers-pack": {
    name: "Paquetage d'explorateur",
    nameEn: "Explorer's Pack",
    value: "10 po",
    description:
      "Contient : un sac à dos, un sac de couchage, 2 flasques d'huile, 10 jours de rations, une corde, une boîte à amadou, 10 torches et une outre.",
    contents: [
      { key: "backpack" },
      { key: "bedroll" },
      { key: "oil", quantity: 2 },
      { key: "rations", quantity: 10 },
      { key: "rope" },
      { key: "tinderbox" },
      { key: "torch", quantity: 10 },
      { key: "waterskin" },
    ],
  },
  "priests-pack": {
    name: "Paquetage d'ecclésiastique",
    nameEn: "Priest's Pack",
    value: "33 po",
    description:
      "Contient : un sac à dos, une couverture, de l'eau bénite, une lampe, 7 jours de rations, une robe et une boîte à amadou.",
    contents: [
      { key: "backpack" },
      { key: "blanket" },
      { key: "holy-water" },
      { key: "lamp" },
      { key: "rations", quantity: 7 },
      { key: "robe" },
      { key: "tinderbox" },
    ],
  },
  "scholars-pack": {
    name: "Paquetage d'érudit",
    nameEn: "Scholar's Pack",
    value: "40 po",
    description:
      "Contient : un sac à dos, un livre, de l'encre, un porte-plume, une lampe, 10 flasques d'huile, 10 feuilles de parchemin et une boîte à amadou.",
    contents: [
      { key: "backpack" },
      { key: "book" },
      { key: "ink" },
      { key: "ink-pen" },
      { key: "lamp" },
      { key: "oil", quantity: 10 },
      { key: "parchment", quantity: 10 },
      { key: "tinderbox" },
    ],
  },

  // Magie & composantes
  "component-pouch": {
    name: "Sacoche à composantes",
    nameEn: "Component Pouch",
    value: "25 po",
    description:
      "Étanche et compartimentée, elle contient toutes les composantes matérielles gratuites de vos sorts.",
  },
};

/** Presets grouped by theme, for the browse mode of the quick-add search. */
export const GEAR_PRESET_GROUPS: { label: string; keys: string[] }[] = [
  {
    label: "Paquetages",
    keys: [
      "burglars-pack",
      "diplomats-pack",
      "dungeoneers-pack",
      "entertainers-pack",
      "explorers-pack",
      "priests-pack",
      "scholars-pack",
    ],
  },
  {
    label: "Lumière & feu",
    keys: ["candle", "lamp", "lantern-bullseye", "lantern-hooded", "oil", "tinderbox", "torch"],
  },
  {
    label: "Outils & exploration",
    keys: [
      "ball-bearings",
      "bell",
      "block-and-tackle",
      "caltrops",
      "chain",
      "climbers-kit",
      "crowbar",
      "grappling-hook",
      "hunting-trap",
      "ladder",
      "lock",
      "magnifying-glass",
      "manacles",
      "mirror",
      "net",
      "pole",
      "ram-portable",
      "rope",
      "shovel",
      "signal-whistle",
      "spikes-iron",
      "spyglass",
      "string",
    ],
  },
  {
    label: "Repos & survie",
    keys: ["bedroll", "blanket", "rations", "tent", "waterskin"],
  },
  {
    label: "Alchimie & soins",
    keys: [
      "acid",
      "alchemists-fire",
      "antitoxin",
      "healers-kit",
      "holy-water",
      "perfume",
      "poison-basic",
      "potion-of-healing",
    ],
  },
  {
    label: "Magie",
    keys: [
      "arcane-focus-crystal",
      "arcane-focus-orb",
      "arcane-focus-rod",
      "arcane-focus-staff",
      "arcane-focus-wand",
      "druidic-focus-mistletoe",
      "druidic-focus-staff",
      "druidic-focus-yew-wand",
      "holy-symbol-amulet",
      "holy-symbol-emblem",
      "holy-symbol-reliquary",
      "component-pouch",
      "spell-scroll-cantrip",
      "spell-scroll-level-1",
    ],
  },
  {
    label: "Munitions",
    keys: ["arrows", "bolts", "firearm-bullets", "sling-bullets", "needles"],
  },
  {
    label: "Contenants",
    keys: [
      "backpack",
      "barrel",
      "basket",
      "bottle-glass",
      "bucket",
      "case-crossbow-bolt",
      "case-map-scroll",
      "chest",
      "flask",
      "jug",
      "pot-iron",
      "pouch",
      "quiver",
      "sack",
      "vial",
    ],
  },
  {
    label: "Vêtements",
    keys: ["clothes-fine", "clothes-travelers", "costume", "robe"],
  },
  {
    label: "Écriture & savoir",
    keys: ["book", "ink", "ink-pen", "map", "paper", "parchment"],
  },
];
