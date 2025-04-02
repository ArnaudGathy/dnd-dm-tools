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
      className: "BARD",
      subclassName: "COLLEGE_OF_LORE",
      race: "ELF",
      background: "SAGE",
      level: 5,
      inspiration: 1,
      maximumHP: 38,
      currentHP: 35,

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
      physicalTraits: ["gigachad", "gracieux", "élégant"],

      alignment: "CHAOTIC_GOOD",
      personalityTraits: [
        "Je suis poussé par une soif de voyage qui m'entraîne.",
        "Je sais apprécier une bonne insulte, même quand j'en suis la cible.",
      ],
      ideals: [
        "Nature. Le monde naturel est bien plus important que les constructions de la civilisation.",
        "Mon instrument représente mon bien le plus précieux et me rappelle quelqu'un que j'ai aimé.",
      ],
      bonds: [
        "Je suis le dernier de ma tribu et il me revient de veiller.",
        "Mon instrument représente mon bien le plus précieux.",
      ],
      flaws: [
        "Je réponds à presque tous les défis par la violence.",
        "J'ai un faible pour les jolis minois",
      ],

      allies: [
        "Garde de neverwinter - aide de la garde en cas de besoin. Ami avec le commandant et les autres membres de la garde.",
      ],
      lore: [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci assumenda atque consequuntur cum dolore, eligendi, enim esse impedit ipsa maxime nam numquam praesentium quaerat quidem quisquam, ratione rem reprehenderit ullam? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda autem cumque, dignissimos dolorem eum, expedita facere illo, illum ipsum laboriosam libero minus natus pariatur placeat quam quis sequi tempora vero.",
      ],
      notes: ["Test character for seeding", "second test entry"],

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
    },
  });

  // Add Weapon with damage
  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Club",
      type: "MELEE",
      isProficient: true,
      abilityModifier: "STRENGTH",
      reach: 5,
      extraEffects: [],
      damages: {
        create: [
          {
            type: "BLUDGEONING",
            dice: "D4",
            numberOfDices: 2,
          },
          {
            type: "LIGHTNING",
            dice: "D4",
            numberOfDices: 2,
            flatBonus: 3,
          },
        ],
      },
    },
  });

  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Necro weapon",
      type: "MELEE",
      isProficient: true,
      abilityModifier: "STRENGTH",
      reach: 5,
      extraEffects: [],
      damages: {
        create: [
          {
            type: "POISON",
            dice: "D4",
          },
          {
            type: "NECROTIC",
            dice: "D4",
          },
        ],
      },
    },
  });

  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Psychic weapon",
      type: "MELEE",
      isProficient: true,
      abilityModifier: "STRENGTH",
      reach: 5,
      extraEffects: [],
      damages: {
        create: [
          {
            type: "PSYCHIC",
            dice: "D8",
          },
          {
            type: "RADIANT",
            dice: "D12",
          },
        ],
      },
    },
  });

  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Fouet de feu de Tzkal Zuk",
      type: "MELEE",
      isProficient: true,
      abilityModifier: "DEXTERITY",
      attackBonus: 1,
      reach: 10,
      extraEffects: ["Peut attirer la cible"],
      damages: {
        create: [
          {
            type: "FORCE",
            dice: "D6",
            flatBonus: 1,
          },
          {
            type: "FIRE",
            dice: "D4",
          },
        ],
      },
    },
  });

  await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Shortbow",
      type: "RANGED",
      isProficient: true,
      abilityModifier: "DEXTERITY",
      damages: {
        create: [
          {
            type: "PIERCING",
            dice: "D6",
          },
          {
            type: "ACID",
            dice: "D12",
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
      name: "Dagger",
      type: "THROWN",
      reach: 5,
      isProficient: false,
      abilityModifier: "DEXTERITY",
      damages: {
        create: [
          {
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
