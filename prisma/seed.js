const {
  PrismaClient,
  CampaignId,
  PartyId,
  Classes,
  CampaignStatus,
  CharacterStatus,
} = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create Parties
  const parties = await Promise.all([
    prisma.party.create({ data: { name: PartyId.MIFA } }),
    prisma.party.create({ data: { name: PartyId.PAINTERS } }),
  ]);

  // Create Campaigns linked to parties
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: CampaignId.PHANDELVER,
        partyId: parties[1].id,
      },
    }),
    prisma.campaign.create({
      data: {
        name: CampaignId.DRAGONS,
        partyId: parties[0].id,
        status: CampaignStatus.FINISHED,
      },
    }),
    prisma.campaign.create({
      data: {
        name: CampaignId.TOMB,
        partyId: parties[0].id,
      },
    }),
  ]);

  // Create Characters linked directly to campaigns
  await Promise.all([
    prisma.character.create({
      data: {
        name: "Alfredo Pinus",
        className: Classes.PALADIN,
        owner: "arnaud.gathy@gmail.com",
        spells: ["invisibility", "mage-hand"],
        campaignId: campaigns[2].id, // TOMB
      },
    }),
    prisma.character.create({
      data: {
        name: "Pepnac",
        className: Classes.ROGUE,
        owner: "arnaud.gathy@gmail.com",
        spells: ["fireball", "shield"],
        campaignId: campaigns[1].id, // DRAGONS
        status: CharacterStatus.DEAD,
      },
    }),
    prisma.character.create({
      data: {
        name: "Erevan",
        className: Classes.ROGUE,
        owner: "player2@example.com",
        spells: ["fireball", "shield"],
        campaignId: campaigns[1].id, // DRAGONS
        status: CharacterStatus.RETIRED,
      },
    }),
    prisma.character.create({
      data: {
        name: "Eleni",
        className: Classes.DRUID,
        owner: "player3@example.com",
        spells: ["fire-bolt", "guidance", "grease"],
        campaignId: campaigns[0].id, // PHANDELVER
      },
    }),
  ]);
}

main()
  .then(() => {
    console.log("✅ Seeding complete");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
