const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs/promises");

async function main() {
  const characters = JSON.parse(
    await fs.readFile("./prisma/characters.json", "utf-8"),
  );

  for (const entry of characters) {
    let party = await prisma.party.findFirst({
      where: { name: entry.party },
    });
    if (!party) {
      party = await prisma.party.create({
        data: { name: entry.party },
      });
    }

    const campaign = await prisma.campaign.upsert({
      where: { name_partyId: { name: entry.campaign, partyId: party.id } },
      update: {},
      create: {
        name: entry.campaign,
        status: "ACTIVE",
        partyId: party.id,
      },
    });

    let existingCharacter = await prisma.character.findFirst({
      where: { name: entry.name },
    });

    if (!existingCharacter) {
      const character = await prisma.character.create({
        data: {
          owner: entry.owner,
          campaignId: campaign.id,
          name: entry.name,
          className: entry.className,
          subclassName: entry.subclassName,
          race: entry.race,
          background: entry.background,
          level: entry.level,
          inspiration: entry.inspiration,
          maximumHP: entry.maximumHP,
          currentHP: entry.currentHP,
          strength: entry.strength,
          dexterity: entry.dexterity,
          constitution: entry.constitution,
          intelligence: entry.intelligence,
          wisdom: entry.wisdom,
          charisma: entry.charisma,
          initiativeBonus: entry.initiativeBonus,
          ACBonus: entry.ACBonus,
          magicAttackBonus: entry.magicAttackBonus,
          magicDCBonus: entry.magicDCBonus,
          movementSpeedBonus: entry.movementSpeedBonus,
          age: entry.age,
          weight: entry.weight,
          height: entry.height,
          eyeColor: entry.eyeColor,
          hair: entry.hair,
          skin: entry.skin,
          physicalTraits: entry.physicalTraits,
          imageUrl: `${entry.name.toLowerCase()}.png`,
          alignment: entry.alignment,
          personalityTraits: entry.personalityTraits,
          ideals: entry.ideals,
          bonds: entry.bonds,
          flaws: entry.flaws,
          lore: entry.lore,
          allies: entry.allies,
          notes: entry.notes,
          proficiencies: entry.proficiencies,
          creatures: entry.creatures || [],
        },
      });

      // Saving Throws
      for (const st of entry.savingThrows || []) {
        await prisma.savingThrow.create({
          data: { ...st, characterId: character.id },
        });
      }

      // Skills
      for (const skill of entry.skills || []) {
        await prisma.skill.create({
          data: { ...skill, characterId: character.id },
        });
      }

      // Capacities
      for (const cap of entry.capacities || []) {
        await prisma.capacity.create({
          data: { ...cap, characterId: character.id },
        });
      }

      // Armors
      for (const armor of entry.armors || []) {
        await prisma.armor.create({
          data: { ...armor, characterId: character.id },
        });
      }

      // Weapons and damages
      for (const weapon of entry.weapons || []) {
        const { damages, ...weaponData } = weapon;
        const createdWeapon = await prisma.weapon.create({
          data: {
            ...weaponData,
            characterId: character.id,
          },
        });

        for (const damage of damages || []) {
          await prisma.weaponDamage.create({
            data: {
              ...damage,
              weaponId: createdWeapon.id,
            },
          });
        }
      }

      // Inventory
      for (const item of entry.inventory || []) {
        await prisma.inventoryItem.create({
          data: { ...item, characterId: character.id },
        });
      }

      // Wealth
      for (const coin of entry.wealth || []) {
        await prisma.money.create({
          data: { ...coin, characterId: character.id },
        });
      }

      // Spells
      for (const spell of entry.spells || []) {
        await prisma.spellsOnCharacters.create({
          data: {
            characterId: character.id,
            spellId: spell,
          },
        });
      }
      console.log(`✅ Created character: ${character.name}`);
    } else {
      console.log(`⚠ Skipped existing character: ${existingCharacter.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding characters:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
