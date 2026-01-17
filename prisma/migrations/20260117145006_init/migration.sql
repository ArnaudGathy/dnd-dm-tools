-- CreateEnum
CREATE TYPE "ArmorType" AS ENUM ('LIGHT', 'MEDIUM', 'HEAVY', 'SHIELD');

-- CreateEnum
CREATE TYPE "CampaignId" AS ENUM ('DRAGONS', 'PHANDELVER', 'TOMB', 'NETHERDEEP');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ABANDONED', 'ACTIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "Classes" AS ENUM ('ARTIFICER', 'BARBARIAN', 'BARD', 'CLERIC', 'DRUID', 'FIGHTER', 'MONK', 'PALADIN', 'RANGER', 'ROGUE', 'SORCERER', 'WARLOCK', 'WIZARD');

-- CreateEnum
CREATE TYPE "Subclasses" AS ENUM ('ALCHEMIST', 'ARMORER', 'ARTILLERIST', 'BATTLE_SMITH', 'PATH_OF_THE_BERSERKER', 'PATH_OF_THE_WILD_HEART', 'PATH_OF_THE_ZEALOT', 'PATH_OF_THE_WORLD_TREE', 'COLLEGE_OF_DANCE', 'COLLEGE_OF_LORE', 'COLLEGE_OF_VALOR', 'COLLEGE_OF_GLAMOUR', 'LIFE_DOMAIN', 'LIGHT_DOMAIN', 'WAR_DOMAIN', 'TRICKERY_DOMAIN', 'CIRCLE_OF_THE_LAND', 'CIRCLE_OF_THE_MOON', 'CIRCLE_OF_THE_SEA', 'CIRCLE_OF_THE_STARS', 'BATTLE_MASTER', 'CHAMPION', 'ELDRITCH_KNIGHT', 'PSI_WARRIOR', 'WAY_OF_THE_OPEN_HAND', 'WAY_OF_SHADOW', 'WAY_OF_THE_ELEMENTS', 'WAY_OF_MERCY', 'OATH_OF_DEVOTION', 'OATH_OF_GLORY', 'OATH_OF_THE_ANCIENTS', 'OATH_OF_VENGEANCE', 'HUNTER', 'BEAST_MASTER', 'GLOOM_STALKER', 'FEY_WANDERER', 'THIEF', 'ASSASSIN', 'ARCANE_TRICKSTER', 'SOULKNIFE', 'DRACONIC', 'WILD_MAGIC', 'ABERRANT', 'CLOCKWORK', 'THE_ARCHFEY', 'THE_FIEND', 'THE_GREAT_OLD_ONE', 'THE_CELESTIAL', 'SCHOOL_OF_EVOCATION', 'SCHOOL_OF_ABJURATION', 'SCHOOL_OF_ILLUSION', 'SCHOOL_OF_DIVINATION');

-- CreateEnum
CREATE TYPE "Races" AS ENUM ('AASIMAR', 'DRAGONBORN', 'DWARF', 'ELF', 'GNOME', 'GOLIATH', 'HALFLING', 'HUMAN', 'ORC', 'TABAXI', 'TIEFLING');

-- CreateEnum
CREATE TYPE "Backgrounds" AS ENUM ('ACOLYTE', 'ANTHROPOLOGIST', 'ARCHEOLOGIST', 'ARTISAN', 'CHARLATAN', 'CRIMINAL', 'ENTERTAINER', 'FARMER', 'GUARD', 'GUIDE', 'HERMIT', 'MERCHANT', 'NOBLE', 'SAGE', 'SAILOR', 'SCRIBE', 'SOLDIER', 'WAYFARER');

-- CreateEnum
CREATE TYPE "CharacterStatus" AS ENUM ('BACKUP', 'ACTIVE', 'DEAD', 'RETIRED');

-- CreateEnum
CREATE TYPE "Alignment" AS ENUM ('LAWFUL_GOOD', 'NEUTRAL_GOOD', 'CHAOTIC_GOOD', 'LAWFUL_NEUTRAL', 'NEUTRAL', 'CHAOTIC_NEUTRAL', 'LAWFUL_EVIL', 'NEUTRAL_EVIL', 'CHAOTIC_EVIL');

-- CreateEnum
CREATE TYPE "MagicItemRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ARTIFACT');

-- CreateEnum
CREATE TYPE "MagicItemDice" AS ENUM ('D4', 'D6', 'D8', 'D10', 'D12', 'D20');

-- CreateEnum
CREATE TYPE "MoneyType" AS ENUM ('GOLD', 'SILVER', 'COPPER');

-- CreateEnum
CREATE TYPE "PartyId" AS ENUM ('MIFA', 'PAINTERS', 'ANTHONY');

-- CreateEnum
CREATE TYPE "Abilities" AS ENUM ('STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'WISDOM', 'CHARISMA');

-- CreateEnum
CREATE TYPE "Skills" AS ENUM ('ACROBATICS', 'ANIMAL_HANDLING', 'ARCANA', 'ATHLETICS', 'DECEPTION', 'HISTORY', 'INSIGHT', 'INTIMIDATION', 'INVESTIGATION', 'MEDICINE', 'NATURE', 'PERCEPTION', 'PERFORMANCE', 'PERSUASION', 'RELIGION', 'SLEIGHT_OF_HAND', 'STEALTH', 'SURVIVAL');

-- CreateEnum
CREATE TYPE "WeaponDamageType" AS ENUM ('BLUDGEONING', 'SLASHING', 'PIERCING', 'ACID', 'COLD', 'FIRE', 'FORCE', 'LIGHTNING', 'NECROTIC', 'POISON', 'PSYCHIC', 'RADIANT');

-- CreateEnum
CREATE TYPE "WeaponDamageDices" AS ENUM ('D4', 'D6', 'D8', 'D10', 'D12');

-- CreateEnum
CREATE TYPE "WeaponType" AS ENUM ('RANGED', 'MELEE', 'THROWN');

-- CreateEnum
CREATE TYPE "AmmunitionType" AS ENUM ('BOLT', 'ARROW', 'FIREARM_BULLET', 'SLING_BULLET', 'NEEDLES');

-- CreateTable
CREATE TABLE "Armor" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ArmorType" NOT NULL,
    "isProficient" BOOLEAN NOT NULL DEFAULT true,
    "AC" INTEGER NOT NULL,
    "extraEffects" TEXT,
    "strengthRequirement" INTEGER,
    "stealthDisadvantage" BOOLEAN NOT NULL DEFAULT false,
    "isEquipped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Armor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" "CampaignId" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',
    "partyId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL DEFAULT 'arno.firefox@gmail.com',

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capacity" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Capacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "CharacterStatus" NOT NULL DEFAULT 'ACTIVE',
    "owner" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "className" "Classes" NOT NULL,
    "subclassName" "Subclasses",
    "race" "Races" NOT NULL,
    "background" "Backgrounds" NOT NULL,
    "inspiration" INTEGER NOT NULL DEFAULT 0,
    "maximumHP" INTEGER NOT NULL,
    "currentHP" INTEGER NOT NULL,
    "currentTempHP" INTEGER NOT NULL DEFAULT 0,
    "HPModifier" INTEGER NOT NULL DEFAULT 0,
    "strength" INTEGER NOT NULL,
    "dexterity" INTEGER NOT NULL,
    "constitution" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "wisdom" INTEGER NOT NULL,
    "charisma" INTEGER NOT NULL,
    "proficiencies" VARCHAR(255)[],
    "initiativeBonus" INTEGER NOT NULL DEFAULT 0,
    "ACBonus" INTEGER NOT NULL DEFAULT 0,
    "magicAttackBonus" INTEGER NOT NULL DEFAULT 0,
    "magicDCBonus" INTEGER NOT NULL DEFAULT 0,
    "movementSpeedBonus" INTEGER NOT NULL DEFAULT 0,
    "age" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "eyeColor" TEXT NOT NULL,
    "hair" TEXT NOT NULL,
    "skin" TEXT NOT NULL,
    "physicalTraits" TEXT,
    "imageUrl" TEXT,
    "alignment" "Alignment" NOT NULL,
    "personalityTraits" TEXT NOT NULL,
    "ideals" TEXT NOT NULL,
    "bonds" TEXT NOT NULL,
    "flaws" TEXT NOT NULL,
    "lore" TEXT,
    "allies" TEXT,
    "notes" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "value" TEXT,
    "isAttuned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicItem" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "charges" INTEGER NOT NULL,
    "dice" "MagicItemDice" NOT NULL,
    "rarity" "MagicItemRarity" NOT NULL,
    "isAttuned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MagicItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Money" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "type" "MoneyType" NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Money_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" SERIAL NOT NULL,
    "name" "PartyId" NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingThrow" (
    "id" SERIAL NOT NULL,
    "ability" "Abilities" NOT NULL,
    "characterId" INTEGER NOT NULL,
    "isProficient" BOOLEAN NOT NULL DEFAULT false,
    "modifier" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SavingThrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "skill" "Skills" NOT NULL,
    "characterId" INTEGER NOT NULL,
    "isProficient" BOOLEAN NOT NULL DEFAULT false,
    "isExpert" BOOLEAN NOT NULL DEFAULT false,
    "modifier" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spell" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "isRitual" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Spell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpellsOnCharacters" (
    "characterId" INTEGER NOT NULL,
    "spellId" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isPrepared" BOOLEAN NOT NULL DEFAULT false,
    "isAlwaysPrepared" BOOLEAN NOT NULL DEFAULT false,
    "hasLongRestCast" BOOLEAN NOT NULL DEFAULT false,
    "canBeSwappedOnLongRest" BOOLEAN NOT NULL DEFAULT false,
    "canBeSwappedOnLevelUp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SpellsOnCharacters_pkey" PRIMARY KEY ("spellId","characterId")
);

-- CreateTable
CREATE TABLE "Creature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "challengeRating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Creature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreaturesOnCharacters" (
    "characterId" INTEGER NOT NULL,
    "creatureId" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CreaturesOnCharacters_pkey" PRIMARY KEY ("creatureId","characterId")
);

-- CreateTable
CREATE TABLE "WeaponDamage" (
    "id" SERIAL NOT NULL,
    "weaponId" INTEGER NOT NULL,
    "isBaseDamage" BOOLEAN NOT NULL DEFAULT false,
    "dice" "WeaponDamageDices" NOT NULL,
    "numberOfDices" INTEGER NOT NULL DEFAULT 1,
    "flatBonus" INTEGER,
    "type" "WeaponDamageType" NOT NULL,

    CONSTRAINT "WeaponDamage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" SERIAL NOT NULL,
    "characterId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WeaponType" NOT NULL,
    "isProficient" BOOLEAN NOT NULL DEFAULT true,
    "abilityModifier" "Abilities" NOT NULL,
    "attackBonus" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER,
    "range" INTEGER,
    "longRange" INTEGER,
    "ammunitionType" "AmmunitionType",
    "ammunitionCount" INTEGER,
    "extraEffects" TEXT,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_partyId_key" ON "Campaign"("name", "partyId");

-- CreateIndex
CREATE UNIQUE INDEX "Money_characterId_type_key" ON "Money"("characterId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "SavingThrow_characterId_ability_key" ON "SavingThrow"("characterId", "ability");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_characterId_skill_key" ON "Skill"("characterId", "skill");

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Capacity" ADD CONSTRAINT "Capacity_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MagicItem" ADD CONSTRAINT "MagicItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Money" ADD CONSTRAINT "Money_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingThrow" ADD CONSTRAINT "SavingThrow_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpellsOnCharacters" ADD CONSTRAINT "SpellsOnCharacters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpellsOnCharacters" ADD CONSTRAINT "SpellsOnCharacters_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreaturesOnCharacters" ADD CONSTRAINT "CreaturesOnCharacters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreaturesOnCharacters" ADD CONSTRAINT "CreaturesOnCharacters_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Creature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponDamage" ADD CONSTRAINT "WeaponDamage_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
