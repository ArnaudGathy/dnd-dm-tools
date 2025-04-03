const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create Party
  const party = await prisma.party.create({
    data: {
      name: "MIFA",
    },
  });

  // Create Campaign
  const campaign = await prisma.campaign.create({
    data: {
      name: "DRAGONS",
      status: "ACTIVE",
      party: { connect: { id: party.id } },
    },
  });

  // Create Character
  const character = await prisma.character.create({
    data: {
      creatures: [20, 47],
      owner: "arnaud.gathy@gmail.com",
      campaignId: campaign.id,
      name: "Alfredo Pinus",
      className: "PALADIN",
      subclassName: "OATH_OF_DEVOTION",
      race: "ELF",
      background: "SAGE",
      level: 5,
      inspiration: 1,
      maximumHP: 38,
      currentHP: 38,

      strength: 8,
      dexterity: 12,
      constitution: 10,
      intelligence: 14,
      wisdom: 15,
      charisma: 16,

      initiativeBonus: 2,
      ACBonus: 1,
      magicAttackBonus: 2,
      magicDCBonus: 1,
      movementSpeedBonus: 0,

      age: 35,
      weight: 90,
      height: 185,
      eyeColor: "bruns",
      hair: "bruns",
      skin: "blanche",
      physicalTraits: "gigachad, gracieux, élégant",

      alignment: "CHAOTIC_GOOD",
      personalityTraits:
        "Je suis poussé par une soif de voyage qui m'entraîne. Je sais apprécier une bonne insulte, même quand j'en suis la cible.",
      ideals:
        "Nature. Le monde naturel est bien plus important que les constructions de la civilisation.",
      bonds:
        "Je suis le dernier de ma tribu et il me revient de veiller. Mon instrument représente mon bien le plus précieux.",
      flaws:
        "Je réponds à presque tous les défis par la violence. J'ai un faible pour les jolis minois",
      allies:
        "Garde de neverwinter - aide de la garde en cas de besoin. Ami avec le commandant et les autres membres de la garde.",
      lore: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci assumenda atque consequuntur cum dolore, eligendi, enim esse impedit ipsa maxime nam numquam praesentium quaerat quidem quisquam, ratione rem reprehenderit ullam? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda autem cumque, dignissimos dolorem eum, expedita facere illo, illum ipsum laboriosam libero minus natus pariatur placeat quam quis sequi tempora vero.",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci assumenda atque consequuntur cum dolore, eligendi, enim esse impedit ipsa maxime nam numquam praesentium quaerat quidem quisquam, ratione rem reprehenderit ullam?",

      proficiencies: [
        "Lute",
        "Perfume",
        "Language",
        "Gnomish",
        "Elven",
        "Dwarven",
        "Draconic",
        "2h bows",
        "2h weapons",
        "Martial weapons",
      ],
      imageUrl: "alfredo.png",
    },
  });

  // Add Saving Throws
  await prisma.savingThrow.createMany({
    data: [
      {
        characterId: character.id,
        ability: "DEXTERITY",
        isProficient: true,
        modifier: 0,
      },
      {
        characterId: character.id,
        ability: "CHARISMA",
        isProficient: true,
        modifier: 1,
      },
    ],
  });

  // Add Skills
  await prisma.skill.createMany({
    data: [
      {
        characterId: character.id,
        skill: "PERFORMANCE",
        isProficient: true,
        modifier: 1,
      },
      {
        characterId: character.id,
        skill: "ARCANA",
        isExpert: true,
        modifier: 0,
      },
    ],
  });

  // Add Capacities
  await prisma.capacity.createMany({
    data: [
      {
        characterId: character.id,
        name: "Bardic Inspiration",
        description: "Bonus dice for allies",
      },
      {
        characterId: character.id,
        name: "Jack of All Trades",
        description:
          "Add half proficiency bonus to ability checks not already including it.",
      },
      {
        characterId: character.id,
        name: "Song of Rest",
        description: "Grants extra healing to allies during a short rest.",
      },
      {
        characterId: character.id,
        name: "Cutting Words",
        description: "Use Bardic Inspiration to subtract from an enemy's roll.",
      },
      {
        characterId: character.id,
        name: "Fey Ancestry",
        description:
          "Advantage on saving throws against being charmed, and magic can’t put you to sleep.",
      },
      {
        characterId: character.id,
        name: "Darkvision",
        description: "See in darkness up to 60 feet as if it were dim light.",
      },
      {
        characterId: character.id,
        name: "Magical Secrets",
        description:
          "Learn spells from any class, ignoring usual restrictions.",
      },
      {
        characterId: character.id,
        name: "Elven Accuracy",
        description:
          "Reroll one die when you have advantage on a DEX, INT, WIS, or CHA attack.",
      },
      {
        characterId: character.id,
        name: "Inspiring Leader",
        description:
          "Give temporary hit points to allies after a motivating speech.",
      },
      {
        characterId: character.id,
        name: "Arcane Recovery",
        description: "Regain expended spell slots during a short rest.",
      },
      {
        characterId: character.id,
        name: "Unarmored Defense",
        description: "When not wearing armor, AC equals 10 + DEX + CHA.",
      },
      {
        characterId: character.id,
        name: "Evasion",
        description:
          "Take no damage on a successful DEX save, half on a failed one.",
      },
      {
        characterId: character.id,
        name: "Lucky",
        description:
          "Reroll an attack roll, ability check, or saving throw 3 times per long rest.",
      },
      {
        characterId: character.id,
        name: "Dwarven Resilience",
        description:
          "Advantage on saving throws against poison and resistance to poison damage.",
      },
      {
        characterId: character.id,
        name: "Sneak Attack",
        description:
          "Deal extra damage when you have advantage or an ally is nearby.",
      },
      {
        characterId: character.id,
        name: "Rage",
        description:
          "Enter a berserker state to deal more melee damage and resist physical harm.",
      },
      {
        characterId: character.id,
        name: "Divine Smite",
        description:
          "Spend a spell slot to deal radiant damage on a melee hit.",
      },
      {
        characterId: character.id,
        name: "Second Wind",
        description: "Regain 1d10 + fighter level HP as a bonus action.",
      },
      {
        characterId: character.id,
        name: "Great Weapon Master",
        description: "Make a heavy weapon attack at -5 to hit, +10 to damage.",
      },
      {
        characterId: character.id,
        name: "Alert",
        description:
          "You can’t be surprised while conscious. +5 to initiative.",
      },
    ],
  });

  // Add Armor
  await prisma.armor.create({
    data: {
      characterId: character.id,
      name: "Cloth armor",
      type: "LIGHT",
      isProficient: true,
      AC: 11,
      extraEffects: [],
      stealthDisadvantage: true,
    },
  });

  await prisma.armor.create({
    data: {
      characterId: character.id,
      name: "Mail armor",
      type: "MEDIUM",
      isProficient: true,
      AC: 14,
      extraEffects: [],
      isEquipped: true,
    },
  });

  await prisma.armor.create({
    data: {
      characterId: character.id,
      name: "Plate armor",
      type: "HEAVY",
      AC: 18,
      extraEffects: ["Aura de lumière"],
      strengthRequirement: 15,
      stealthDisadvantage: true,
    },
  });

  await prisma.armor.create({
    data: {
      characterId: character.id,
      name: "Bouclier",
      type: "SHIELD",
      AC: 2,
      extraEffects: [],
      isEquipped: true,
    },
  });

  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Dagger",
      type: "THROWN",
      reach: 5,
      isProficient: true,
      abilityModifier: "DEXTERITY",
      damages: {
        create: [
          {
            isBaseDamage: true,
            type: "SLASHING",
            dice: "D4",
          },
          {
            type: "COLD",
            dice: "D10",
          },
        ],
      },
      range: 20,
      longRange: 60,
    },
  });

  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Shortbow",
      type: "RANGED",
      isProficient: false,
      abilityModifier: "DEXTERITY",
      damages: {
        create: [
          {
            type: "PIERCING",
            dice: "D6",
            isBaseDamage: true,
          },
        ],
      },
      range: 80,
      longRange: 320,
      ammunitionType: "ARROW",
      ammunitionCount: 20,
    },
  });

  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Rapière de feu",
      type: "MELEE",
      reach: 5,
      isProficient: true,
      abilityModifier: "DEXTERITY",
      damages: {
        create: [
          {
            type: "PIERCING",
            dice: "D6",
            isBaseDamage: true,
          },
          {
            type: "FIRE",
            dice: "D4",
            flatBonus: 2,
          },
        ],
      },
    },
  });

  // Add Inventory
  await prisma.inventoryItem.createMany({
    data: [
      {
        characterId: character.id,
        name: "Potion of Healing",
        description: "Restores 2d4+2 HP",
        quantity: 2,
        value: "50 po",
      },
      {
        characterId: character.id,
        name: "Rope, Hemp (50 feet)",
        description: "A strong hempen rope, useful for climbing or tying.",
        quantity: 3,
        value: "1 po",
      },
      {
        characterId: character.id,
        name: "Thieves' Tools",
        description: "A small pouch with lockpicks, files, and hooks.",
        quantity: 11,
        value: "25 po",
      },
      {
        characterId: character.id,
        name: "Rations (1 day)",
        description: "Dried meat, hardtack, and nuts for one day of travel.",
        quantity: 5,
        value: "500 po",
      },
      {
        characterId: character.id,
        name: "Waterskin",
        description: "Leather pouch to carry water.",
        quantity: 1,
        value: "2 pa",
      },
      {
        characterId: character.id,
        name: "Torch",
        description: "Provides bright light in a 20-foot radius for 1 hour.",
        quantity: 3,
        value: "3 pc",
      },
      {
        characterId: character.id,
        name: "Bag of Sand",
        description:
          "Useful for testing pressure plates or throwing into the air.",
        quantity: 1,
        value: "1 po",
      },
      {
        characterId: character.id,
        name: "Silver Ring",
        description: "A plain silver band with a small crest.",
        quantity: 1,
        value: "5 pa",
      },
      {
        characterId: character.id,
        name: "Scroll of Identify",
        description: "Allows casting of the Identify spell once.",
        quantity: 1,
        value: "100 po",
      },
      {
        characterId: character.id,
        name: "Whetstone",
        description: "Used to sharpen blades.",
        quantity: 1,
        value: "1 pc",
      },
      {
        characterId: character.id,
        name: "Explorer’s Pack",
        description: "Includes backpack, bedroll, mess kit, and more.",
        quantity: 1,
        value: "10 po",
      },
    ],
  });

  // Add Money
  await prisma.money.createMany({
    data: [
      { characterId: character.id, type: "GOLD", quantity: 100 },
      { characterId: character.id, type: "SILVER", quantity: 50 },
      { characterId: character.id, type: "COPPER", quantity: 200 },
    ],
  });

  // Add Spell
  const spell = await prisma.spell.create({
    data: {
      id: "vicious-mockery",
      name: "Vicious Mockery",
      level: 0,
      isRitual: false,
    },
  });

  await prisma.spellsOnCharacters.create({
    data: {
      characterId: character.id,
      spellId: spell.id,
      isFavorite: true,
    },
  });
}

main()
  .then(async () => {
    console.log("✅ Seeding complete");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
