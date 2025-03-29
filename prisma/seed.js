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

      age: 120,
      weight: 70,
      height: 175,
      eyeColor: "Green",
      hair: "Silver",
      skin: "Fair",
      physicalTraits: ["Tall", "Graceful"],

      alignment: "CHAOTIC_GOOD",
      personalityTraits: ["Curious", "Quick-witted"],
      ideals: ["Knowledge is power"],
      bonds: ["Protect the college of lore"],
      flaws: ["Overconfident"],

      allies: ["Neverwinter gards"],
      lore: ["Knows ancient elven songs"],
      notes: ["Test character for seeding"],

      proficiencies: ["Lute", "Arcana", "Elfic", "Alchemy tools"],
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
        isProficient: true,
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
      name: "Plate armor",
      type: "HEAVY",
      AC: 18,
      extraEffects: [],
      strengthRequirement: 15,
      stealthDisadvantage: true,
    },
  });

  // Add Weapon with damage
  const weapon = await prisma.weapon.create({
    data: {
      characterId: character.id,
      name: "Rapier",
      type: "MELEE",
      isProficient: true,
      abilityModifier: "DEXTERITY",
      attackBonus: 1,
      reach: 5,
      extraEffects: [],
      damages: {
        create: [
          {
            damageType: "PIERCING",
            dice: "D8",
            flatBonus: 0,
          },
          {
            damageType: "FIRE",
            dice: "D4",
            flatBonus: 0,
          },
          {
            damageType: "FLAT",
            flatBonus: 1,
          },
        ],
      },
    },
  });

  // Add Inventory
  await prisma.inventoryItem.create({
    data: {
      characterId: character.id,
      name: "Potion of Healing",
      description: "Restores 2d4+2 HP",
      quantity: 2,
      value: "50 gp",
    },
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
