const {
  PrismaClient,
  CampaignId,
  PartyId,
  CampaignStatus,
  CharacterStatus,
} = require("@prisma/client");
const spellList = require("../src/data/spellList.json");
const partiesJson = require("../src/data/parties.json");

const prisma = new PrismaClient();

async function main() {
  const parties = await Promise.all([
    prisma.party.create({ data: { name: PartyId.MIFA } }),
    prisma.party.create({ data: { name: PartyId.PAINTERS } }),
  ]);

  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: CampaignId.PHANDELVER,
        partyId: parties[1].id, // Painters
      },
    }),
    prisma.campaign.create({
      data: {
        name: CampaignId.DRAGONS,
        partyId: parties[0].id, // Mifa
        status: CampaignStatus.FINISHED,
      },
    }),
    prisma.campaign.create({
      data: {
        name: CampaignId.TOMB,
        partyId: parties[0].id, // Mifa
      },
    }),
  ]);

  await Promise.all(
    spellList.map((spell) => prisma.spell.create({ data: spell })),
  );

  const characters = await Promise.all(
    partiesJson
      .flatMap((party, partyIndex) => {
        const campaign = partyIndex === 0 ? campaigns[1] : campaigns[0];

        return party.characters.flatMap((character) =>
          prisma.character.create({
            data: {
              name: character.name,
              className: character.gameClass,
              owner: character.owner,
              campaignId: campaign.id,
              status:
                character.name === "Pepnac"
                  ? CharacterStatus.DEAD
                  : campaign.name === CampaignId.DRAGONS
                    ? CharacterStatus.RETIRED
                    : CharacterStatus.ACTIVE,
            },
          }),
        );
      })
      .flat(),
  );
  await Promise.all(
    characters.map((character) => {
      const characterJson = partiesJson
        .find((party) =>
          party.characters.find((c) => c.name === character.name),
        )
        .characters.find((c) => c.name === character.name);

      if (characterJson?.spells) {
        return characterJson.spells.map(async (spell) => {
          return prisma.spellsOnCharacters.create({
            data: {
              characterId: character.id,
              spellId: spell,
            },
          });
        });
      }
    }),
  );
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
